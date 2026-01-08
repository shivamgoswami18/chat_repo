import i18n from "../../i18n/i18n";

const normalizeFieldName = (fieldName: string, transform?: "lowercase") => {
  if (!fieldName) {
    return "value";
  }

  const trimmed = fieldName.trim();
  if (transform === "lowercase") {
    return trimmed.toLowerCase();
  }
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};

export const validationMessages = {
  required: (fieldName: string) =>
    i18n.t("validation.required", {
      field: normalizeFieldName(fieldName),
      defaultValue: "This field is required.",
    }),
  format: (fieldName: string) =>
    i18n.t("validation.format", {
      field: normalizeFieldName(fieldName, "lowercase"),
      defaultValue: "This field is invalid.",
    }),
  dateValidation: (fieldName: string) =>
    `Please enter a valid ${fieldName?.toLowerCase()}.`,
  dateAfter: (fieldName: string, compareFieldName: string) =>
    `${fieldName} must be after ${compareFieldName.toLowerCase()}.`,
  maxLength: (fieldName: string, length: number) =>
    `${fieldName} must be exactly ${length} digits.`,
  maxFileSize: (sizeMB: number) => `File size must be less than ${sizeMB}MB.`,
  atLeastOneSelected: (fieldName: string) =>
    `At least one ${fieldName} must be selected.`,
  passwordLength: (fieldName: string, minLength: string) =>
    `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase()
    } must be at least ${minLength} characters long.`,
  contactLength: (fieldName: string, minLength: string) =>
    `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase()
    } should be ${minLength} digit.`,
  passwordComplexity: (fieldName: string) =>
    `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase()
    } must include uppercase, lowercase, number and special character.`,
  passwordsMatch: (fieldName: string, confirmFieldName: string) =>
    `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase()
    } and ${confirmFieldName.toLowerCase()} should be same.`,
  phoneNumber: (fieldName: string) =>
    `Invalid ${fieldName.toLowerCase()} format.`,
  notSameAsField: (fieldName: string, comparedField: string) =>
    `${fieldName} should be different from ${comparedField}.`,
  maxChar: (fieldName: string, maxLength: string) =>
    `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase()
    } should be ${maxLength} Characters.`,
  minLength: (fieldName: string, minLength: string) =>
    `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase()
    } should be minimum ${minLength} digits.`,
  positiveNumber: (fieldName: string) =>
    `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase()
    } should be positive.`,
  url: (field: string) => `${field} should be a valid URL.`,
  greaterThan: (fieldName: string, comparedField: string) =>
    `${comparedField} should be greater than or equal to ${fieldName}.`,
  greaterTime: (fieldName: string, comparedField: string) =>
    `${comparedField} should be greater than ${fieldName}.`,
  lessThan: (fieldName: string, comparedField: string) =>
    `${comparedField} should be less than or equal to ${fieldName}.`,
  otpFormat: (fieldName: string) => `${fieldName} must be 6 digits.`,
  minDuration: (min: number, fieldName: string) =>
    `${fieldName} must be at least ${min} minutes.`,
};

export const fileLimitErrorMessage =
  "File size is too large! (more than 1 mb).";
export const fileTypePDFErrorMessage = "Only PDF is allowed.";
export const fileTypePDFJPGPNGErrorMessage =
  "Only PDF, JPEG and PMG are allowed.";
export const fileTypeImagerrorMessage = "Only image is allowed.";

export const inputPlaceHolder = (fieldName: string) =>
  i18n.t("validation.placeholder", {
    field: normalizeFieldName(fieldName, "lowercase"),
    defaultValue: normalizeFieldName(fieldName, "lowercase"),
  });

export const selectPlaceHolder = (fieldName: string) =>
  i18n.t("validation.selectPlaceholder", {
    field: normalizeFieldName(fieldName, "lowercase"),
    defaultValue: normalizeFieldName(fieldName, "lowercase"),
  });

export const onlyDigits = (event: React.KeyboardEvent<HTMLInputElement>) => {
  const key = event.key;
  if (!/^\d$/.test(key) && key !== "Backspace" && key !== "Tab") {
    event.preventDefault();
  }
};

export function formatFileSize(sizeInBytes: number): string {
  if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(3)} KB`;
  } else {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(3)} MB`;
  }
}

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,6}(?![^.\s])/;
export const phoneRegex = /^[1-9][0-9]{9}$/;
export const onlySingleDigitRegex = /^[0-9]?$/;
export const nonDigitsRegex = /\D/g;
export const trailingSlashRegex = /\/$/;
export const translationParamRegex = /\{\{(\w+)\}\}/g;
export const removeAbout = /^about /i;

export const isDynamicMatch = (pattern: string, pathname: string): boolean => {
  const regexPattern = pattern.replace(/:[^/]+/g, "([^/]+)");
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(pathname);
};
export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/;

export const formatDateTime = (isoDate: string) => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(isoDate));
};

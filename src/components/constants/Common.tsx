import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";
import { RiSearchLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { getTranslationSync } from "@/i18n/i18n";
import { removeAbout } from "./Validation";
import { formatDistanceToNow } from "date-fns";
import { sortValuesConstants } from "./Projects";
import { BackendResp } from "../../types/backendResponse";

const t = (key: string, params?: Record<string, string>) => {
  return getTranslationSync(key, params);
};

export const checkStatusCodeSuccess = (data: number) => {
  if (
    data === StatusCodes.OK ||
    data === StatusCodes.ACCEPTED ||
    data === StatusCodes.CREATED
  ) {
    return true;
  } else {
    return false;
  }
};

export const notFound = {
  dataNotFound: "Sorry! No Result Found",
  nullData: "--",
  notAvailable: "NA",
  somethingWrong: "Something went wrong.",
  thereIsNoDataFound: "No data found, Please try again!",
  trySearchingWithAnotherKeyword: "Try searching with another keyword!",
};

export const commonLabels = {
  confirm: "Confirm",
  submit: "Submit",
  update: "Update",
  cancel: "Cancel",
  view: "View",
  new: "New",
  edit: "Edit",
  delete: "Delete",
  remove: "Remove",
  status: "Status",
  yes: "Yes",
  no: "No",
  close: "Close",
  search: "Search",
  action: "Actions",
  enter: "Enter",
  itemsPerPage: "Items per page",
  showing: "Showing",
  of: "of",
  results: "Results",
  to: "to",
  loading: "Loading...",
  select: "Select",
  deleteConfirmation: "Do you want to delete the record?",
  na: "NA",
  true: "true",
  false: "false",
  saveNext: "Save & Next",
  areYouSureYouWantTo: "Are you sure you want to",
  success: "Success",
  chooseImage: "Choose Image",
  token: "token",
  all: "All",
  role: "role",
  businessRole: "business",
  customerRole: "customer",
  dollar: "$",
  purchased: "purchased",
  pending: "Pending",
  ascendingValue: "asc",
  descendingValue: "desc",
  published: "Published",
  assigned: "Assigned",
  completed: "Completed",
  publishedValue: "published",
  assignedValue: "assigned",
  completedValue: "completed",
  acceptedValue: "accepted",
  id: "id",
};

export const allowedTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/gif",
  "video/mp4",
];

export const getMaxUploadFileSizeBytes = (sizeInMB: number) =>
  sizeInMB * 1024 * 1024;

export const getFileSizeMessage = (sizeInMB: number) =>
  `File size must be less than ${sizeInMB}MB.`;

export const allowedUploadFileTypes = ".pdf,.jpg,.jpeg,.png,.gif,.mp4";

export const getItem = (key: string) => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem(key);
  }
  return null;
};
export const setItem = (key: string, value: string) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(key, value);
  }
};
export const clearSessionStorage = () => {
  sessionStorage.clear();
};
export const removeItem = (key: string) => {
  sessionStorage.removeItem(key);
};

export const errorHandler = (err: unknown) => {
  if (!err) {
    toast.error(t("commonConstants.errorOccurred"));
    return;
  }

  const axiosError = err as AxiosError<{ message?: string | string[] }>;
  const message = axiosError.response?.data?.message;

  if (Array.isArray(message)) {
    message.forEach((msg: string) => toast.error(msg));
  } else {
    toast.error(
      message ?? axiosError.message ?? t("commonConstants.errorOccurred")
    );
  }
};

export const extractErrorMessage = (error: unknown): string => {
  if (!error) return t("commonConstants.errorOccurred");
  const err = error as AxiosError<{ message?: string | string[] }>;
  const message = err.response?.data?.message || err.message;
  if (Array.isArray(message)) return message.join(", ");
  if (typeof message === "string" && message.trim()) return message;
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return t("commonConstants.errorOccurred");
};

export const tooltipContainer = (text: string, maxLength: number) => {
  return (
    <div
      className={
        text?.length > maxLength ? `text-dark tooltip-container` : `text-dark`
      }
    >
      <span className="tooltip-text tooltip-text-style">{text}</span>
      <div className="d-flex align-items-end text-truncate text-wrap">
        {text?.length > maxLength ? (
          <span>{text?.substring(0, maxLength)}...</span>
        ) : (
          text
        )}
      </div>
    </div>
  );
};

export const noResultFound = () => {
  return (
    <div className="py-4 text-center">
      <div>
        <span className="fs-1 text-success">
          <RiSearchLine />
        </span>
      </div>
      <div className="mt-4">
        <h5>{notFound.dataNotFound}</h5>
        <p className="text-muted">{notFound.thereIsNoDataFound}</p>
      </div>
    </div>
  );
};

export const defaultProfileImage =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
export const defaultProfileImageAlt = "Image";

export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>
) => {
  e.currentTarget.src = defaultProfileImage;
};

export const handleProfileImageChange = async (params: {
  imageUrl: string | null;
  file: File | null;
  setProfileImagePath: (value: string | null) => void;
  setProfileImagePreview: (value: string | null) => void;
  upload: (file: File) => Promise<string | null>;
  baseImageURL: string;
}) => {
  const {
    imageUrl,
    file,
    setProfileImagePath,
    setProfileImagePreview,
    upload,
    baseImageURL,
  } = params;

  if (!imageUrl || !file) {
    setProfileImagePath(null);
    setProfileImagePreview(null);
    return;
  }

  setProfileImagePreview(imageUrl);

  try {
    const uploadedPath = await upload(file);

    if (uploadedPath) {
      setProfileImagePath(uploadedPath);
      setProfileImagePreview(baseImageURL + uploadedPath);
    } else {
      setProfileImagePath(null);
      setProfileImagePreview(null);
      toast.error(t("commonConstants.errorOccurred"));
    }
  } catch (err) {
    setProfileImagePath(null);
    setProfileImagePreview(null);
    errorHandler(err);
  }
};

export const normalizeString = (str: string): string => {
  return str.trim().toLowerCase();
};

export const formatDistanceToNowClean = (
  date: Date | string,
  options?: { addSuffix?: boolean }
) => {
  if (!date) return "";
  const dateObj = new Date(date);
  if (Number.isNaN(dateObj.getTime())) return "";
  return formatDistanceToNow(dateObj, options).replace(removeAbout, "");
};

export const getSortValue = (sort: string) => {
  return sort === sortValuesConstants.newest
    ? commonLabels.descendingValue
    : commonLabels.ascendingValue;
};

export const finalApiMessage = (
  res: BackendResp | undefined | null
): string => {
  if (!res) {
    return "";
  }

  if (res.messageKey) {
    return t(`messageKey.${res.messageKey}`);
  }

  return res.message ?? "";
};

export const formatTimestamp = (dateString?: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) return t("dashboardHeaderPageConstants.justNow");
    if (diffInMinutes < 60)
      return `${diffInMinutes} ${t("dashboardHeaderPageConstants.minutesAgo")}`;
    if (diffInHours < 24)
      return `${diffInHours} ${t("dashboardHeaderPageConstants.hoursAgo")}`;
    if (diffInDays < 7)
      return `${diffInDays} ${t("dashboardHeaderPageConstants.daysAgo")}`;
    return date.toLocaleDateString();
  };

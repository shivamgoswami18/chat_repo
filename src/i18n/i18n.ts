import no from "./no.json";
import en from "./en.json";
import { translationParamRegex } from "../components/constants/Validation";

type LanguageCode = "no" | "en";

const LANGUAGE_STORAGE_KEY = "app_language";

const availableTranslations: Record<LanguageCode, typeof no> = {
  no,
  en,
};

let currentLanguage: LanguageCode = "no";
let translations: typeof no = no;

function initLanguageFromSessionStorage() {
  if (typeof window === "undefined") {
    return;
  }

  const stored = window.sessionStorage.getItem(
    LANGUAGE_STORAGE_KEY
  ) as LanguageCode | null;

  if (stored && stored in availableTranslations) {
    currentLanguage = stored;
    translations = availableTranslations[stored];
  } else {
    window.sessionStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
  }
}

initLanguageFromSessionStorage();

export function setLanguage(lang: LanguageCode) {
  if (!(lang in availableTranslations)) {
    return;
  }

  currentLanguage = lang;
  translations = availableTranslations[lang];

  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }
}

export function getTranslationSync(
  key: string,
  params?: Record<string, string>
): string {
  const keys = key.split(".");
  const value = keys.reduce<unknown>((obj, key) => {
    if (obj && typeof obj === "object" && key in obj && !Array.isArray(obj)) {
      return (obj as Record<string, unknown>)[key];
    }
    return undefined;
  }, translations);

  if (typeof value !== "string") {
    return key;
  }

  if (params) {
    return value.replace(translationParamRegex, (match, paramKey) => {
      return params[paramKey] || match;
    });
  }

  return value;
}

interface I18nOptions {
  defaultValue?: string;
  [key: string]: string | undefined;
}

const i18n = {
  t: (key: string, options?: I18nOptions): string => {
    const { defaultValue, ...params } = options || {};

    const cleanParams: Record<string, string> = {};
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined) {
          cleanParams[key] = params[key] as string;
        }
      });
    }

    const translated = getTranslationSync(
      key,
      Object.keys(cleanParams).length > 0 ? cleanParams : undefined
    );

    if (translated === key && defaultValue) {
      if (Object.keys(cleanParams).length > 0) {
        return defaultValue.replace(
          translationParamRegex,
          (match, paramKey) => {
            return cleanParams[paramKey] || match;
          }
        );
      }
      return defaultValue;
    }

    return translated;
  },
};

export default i18n;

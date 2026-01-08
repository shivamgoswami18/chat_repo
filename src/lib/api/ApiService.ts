import axios from "axios";
import type {
  AxiosError,
  AxiosResponse,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { removeItem } from "@/components/constants/Common";
import { StatusCodes } from "http-status-codes";
import { getDefaultPublicRoute } from "@/lib/config/routesConfig";

export const BaseURL = process.env.NEXT_PUBLIC_BASEURL || "";
export const BaseImageURL = process.env.NEXT_PUBLIC_BASE_IMAGE_URL || "";

const handleUnauthorizedError = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error?.response?.status === StatusCodes.UNAUTHORIZED) {
        removeItem("token");
        if (typeof window !== "undefined") {
          window.location.href = getDefaultPublicRoute();
        }
      }
      return Promise.reject(new Error(error?.message));
    }
  );
};

export const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const Bearer = "Bearer";
  const instance = axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (config && config.headers) {
        if (typeof window !== "undefined") {
          const authToken = sessionStorage.getItem("token");
          if (authToken) {
            config.headers["Authorization"] = `${Bearer} ${authToken}`;
          }
        }
      }
      return config;
    }
  );
  handleUnauthorizedError(instance);
  return instance;
};

export const createNonAuthAxiosInstance = (
  baseURL: string,
  contentType: string = "application/json"
): AxiosInstance => {
  return axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": contentType,
    },
  });
};

export const createAuthAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (config && config.headers) {
        if (typeof window !== "undefined") {
          const authToken = sessionStorage.getItem("token");
          if (authToken) {
            config.headers["Authorization"] = `Bearer ${authToken}`;
          }
        }
      }
      return config;
    }
  );
  handleUnauthorizedError(instance);
  return instance;
};

export const authData = createAxiosInstance(BaseURL);
export const nonAuthData = createNonAuthAxiosInstance(BaseURL);
export const multipartData = createNonAuthAxiosInstance(
  BaseURL,
  "multipart/form-data"
);
export const multipartDataWithToken = createAuthAxiosInstance(BaseURL);

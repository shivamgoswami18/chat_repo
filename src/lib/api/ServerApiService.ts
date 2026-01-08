import { BackendResp } from "@/types/backendResponse";
import { BaseURL } from "./ApiService";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
  message?: string;
}

export interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: {
    tags?: string[];
  };
}

export async function serverApiCall<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = "GET",
    body,
    headers = {},
    cache = "no-store",
    next,
  } = options;

  const url = `${BaseURL}${endpoint}`;

  try {
    const config: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      cache,
      ...(next && { next }),
    };

    if (body && method !== "GET") {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP error! status: ${response.status}`,
        status: response.status,
      };
    }

    const responseData: BackendResp<T> = await response.json();

    if (
      responseData.statusCode >= 200 &&
      responseData.statusCode < 300
    ) {
      return {
        success: true,
        data: responseData.data,
        status: responseData.statusCode,
        message: responseData.message,
      };
    }

    return {
      success: false,
      error: responseData.message || "Request failed",
      status: responseData.statusCode,
      message: responseData.message,
    };
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function get<T>(
  endpoint: string,
  options?: Omit<FetchOptions, "method" | "body">
): Promise<ApiResponse<T>> {
  return serverApiCall<T>(endpoint, { ...options, method: "GET" });
}

export async function post<T>(
  endpoint: string,
  body?: Record<string, unknown>,
  options?: Omit<FetchOptions, "method">
): Promise<ApiResponse<T>> {
  return serverApiCall<T>(endpoint, { ...options, body, method: "POST" });
}

export async function put<T>(
  endpoint: string,
  body?: Record<string, unknown>,
  options?: Omit<FetchOptions, "method">
): Promise<ApiResponse<T>> {
  return serverApiCall<T>(endpoint, { ...options, body, method: "PUT" });
}

export async function patch<T>(
  endpoint: string,
  body?: Record<string, unknown>,
  options?: Omit<FetchOptions, "method">
): Promise<ApiResponse<T>> {
  return serverApiCall<T>(endpoint, { ...options, body, method: "PATCH" });
}

export async function del<T>(
  endpoint: string,
  options?: Omit<FetchOptions, "method" | "body">
): Promise<ApiResponse<T>> {
  return serverApiCall<T>(endpoint, { ...options, method: "DELETE" });
}
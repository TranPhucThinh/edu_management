import type { InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

import { getRefreshTokenCookieExpiry } from "@/lib/auth-cookies";
import {
  getApiMessage,
  getErrorMessage,
  getLocaleForRedirect,
  type FieldError,
} from "../api-messages";
import { apiClient, authClient } from "./axios-client";

/** Hàng đợi Refresh Token: chỉ 1 lần gọi /auth/refresh khi nhiều request cùng 401 */
let refreshPromise: Promise<string> | null = null;

const RETRY_KEY = "_retry";

async function refreshAccessToken(): Promise<string> {
  const refreshToken = Cookies.get("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  const rs = await authClient.post<{
    accessToken: string;
    refreshToken?: string;
  }>("/auth/refresh", { refreshToken });

  const newAccessToken = rs.data.accessToken;
  const newRefreshToken = rs.data.refreshToken;

  const decoded = jwtDecode<{ exp: number }>(newAccessToken);
  const expiresDate = new Date(decoded.exp * 1000);

  Cookies.set("accessToken", newAccessToken, {
    expires: expiresDate,
    path: "/",
  });
  if (newRefreshToken) {
    Cookies.set("refreshToken", newRefreshToken, {
      expires: getRefreshTokenCookieExpiry(newRefreshToken),
      path: "/",
    });
  }

  return newAccessToken;
}

function handleForceLogout(): void {
  toast.error(getApiMessage("sessionExpired"));
  Cookies.remove("accessToken", { path: "/" });
  Cookies.remove("refreshToken", { path: "/" });
  Cookies.remove("fullName", { path: "/" });
  Cookies.remove("teacherId", { path: "/" });
  if (typeof window !== "undefined") {
    window.location.href = `/${getLocaleForRedirect()}/login`;
  }
}

function isAuthUrl(url: string | undefined): boolean {
  if (typeof url !== "string") return false;
  return url.includes("/auth/login") || url.includes("/auth/refresh");
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = Cookies.get("accessToken");
  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      [key: string]: unknown;
    };

    if (!error.response) {
      toast.error(getApiMessage("networkError"));
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const errorCode: string | undefined = data?.errorCode;
    const rawMessage = data?.message;
    const fieldErrors: FieldError[] | undefined = Array.isArray(data?.errors)
      ? (data.errors as FieldError[])
      : undefined;
    const message = getErrorMessage(
      errorCode,
      typeof rawMessage === "string" ? rawMessage : undefined,
    );
    const url = originalRequest?.url;

    // 401 → thử refresh (queue), retry 1 lần; không refresh cho login/refresh
    if (status === 401) {
      if (originalRequest[RETRY_KEY]) {
        handleForceLogout();
        return Promise.reject(error);
      }
      if (isAuthUrl(url)) {
        handleForceLogout();
        return Promise.reject(error);
      }

      const hasRefresh = !!Cookies.get("refreshToken");
      if (!hasRefresh) {
        handleForceLogout();
        return Promise.reject(error);
      }

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }
        const newToken = await refreshPromise;
        originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
        originalRequest[RETRY_KEY] = true;
        return apiClient.request(originalRequest);
      } catch {
        handleForceLogout();
        return Promise.reject(error);
      }
    }

    //  Các mã lỗi khác: toast (trừ 400 validation để form tự xử lý)
    const isLoginRequest =
      typeof url === "string" && url.includes("/auth/login");
    switch (status) {
      case 400:
        // Suppress toast for field-level validation errors — let forms handle them
        if (!isLoginRequest && !fieldErrors) {
          toast.warning(message);
        }
        break;
      case 403:
        toast.error(errorCode ? message : getApiMessage("noPermission"));
        break;
      case 404:
        toast.error(errorCode ? message : getApiMessage("notFound"));
        break;
      case 409:
        toast.error(message);
        break;
      case 500:
      case 502:
      case 503:
        toast.error(getApiMessage("serverError"));
        break;
      default:
        toast.error(getApiMessage("unknownError", { message }));
        break;
    }

    return Promise.reject(error);
  },
);

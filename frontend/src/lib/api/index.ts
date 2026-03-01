import "./interceptors";
import { apiClient } from "./axios-client";

/** API client có token + queue refresh 401, dùng cho toàn bộ app */
export const api = apiClient;

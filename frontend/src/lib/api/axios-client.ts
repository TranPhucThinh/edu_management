import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Instance gọi API có đính kèm Token (dùng cho toàn bộ App)
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Instance KHÔNG đính kèm Token (Chỉ dùng để gọi API Login & Refresh)
// Giúp tránh lỗi vòng lặp vô tận (Circular Dependency)
export const authClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { env } from "../env.config";
import { authStorage } from "../storage/auth-storage";

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3500",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = typeof window !== "undefined" ? authStorage.getToken() : null;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    }

    const message = error.response?.data?.message || "Something went wrong";
    return Promise.reject({ ...error, message });
  },
);

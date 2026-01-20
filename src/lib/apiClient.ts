import axios, { type AxiosError } from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5120";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export function isApiError(
  error: unknown,
): error is AxiosError<{ message?: string }> {
  return axios.isAxiosError(error);
}

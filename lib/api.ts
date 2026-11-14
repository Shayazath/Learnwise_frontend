import axios, { type AxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:8000",
  withCredentials: true,
  timeout: 30000,
});

export async function apiRequest<T>(
  path: string,
  options: AxiosRequestConfig = {},
): Promise<T> {
  const { data } = await api.request<T>({
    url: path,
    ...options,
  });

  return data;
}
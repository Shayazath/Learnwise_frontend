import axios, { type AxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: "/api",
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
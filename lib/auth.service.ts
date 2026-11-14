
import { api } from "@/lib/api";

import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "@/types";

export const registerUser = async (
  payload: RegisterRequest,
): Promise<AuthResponse> => {
  const { data } = await api.post("/api/auth/register", payload);
  return data;
};

export const loginUser = async (
  payload: LoginRequest,
): Promise<AuthResponse> => {
  const { data } = await api.post("/api/auth/login", payload);
  return data;
};

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await api.get("/api/auth/me");
  return data;
};

export const logoutUser = async (): Promise<{ message: string }> => {
  const { data } = await api.post("/api/auth/logout");
  return data;
};

export type ProfileUpdatePayload = {
  full_name: string;
  email: string;
};

export type ChangePasswordPayload = {
  current_password: string;
  new_password: string;
};

export const updateUserProfile = async (
  payload: ProfileUpdatePayload,
): Promise<User> => {
  const { data } = await api.put("/api/auth/profile", payload);
  return data;
};

export const changeUserPassword = async (
  payload: ChangePasswordPayload,
): Promise<{ message: string }> => {
  const { data } = await api.put(
    "/api/auth/change-password",
    payload,
  );
  return data;
};

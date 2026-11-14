
import { api } from "@/lib/api";

import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RegistrationResponse,
  ResendOTPResponse,
  User,
  VerifyEmailPayload,
  VerifyEmailResponse,
} from "@/types";



export const registerUser = async (
  payload: RegisterRequest,
): Promise<RegistrationResponse> => {
  const { data } = await api.post(
    "/auth/register",
    payload,
  );
  return data;
};

export const verifyEmail = async (
  payload: VerifyEmailPayload,
): Promise<VerifyEmailResponse> => {
  const { data } = await api.post(
    "/auth/verify-email",
    payload,
  );
  return data;
};

export const resendOTP = async (
  email: string,
): Promise<ResendOTPResponse> => {
  const { data } = await api.post(
    "/auth/resend-otp",
    { email },
  );
  return data;
};

export const loginUser = async (
  payload: LoginRequest,
): Promise<AuthResponse> => {
  const { data } = await api.post(
    "/auth/login",
    payload,
  );
  return data;
};

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await api.get("/auth/me");
  return data;
};

export const logoutUser = async (): Promise<{ message: string }> => {
  const { data } = await api.post("/auth/logout");
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
  const { data } = await api.put(
    "/auth/profile",
    payload,
  );
  return data;
};

export const changeUserPassword = async (
  payload: ChangePasswordPayload,
): Promise<{ message: string }> => {
  const { data } = await api.put(
    "/auth/change-password",
    payload,
  );
  return data;
};

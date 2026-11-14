
export type ViewName =
  | "tutor"
  | "library"
  | "quiz"
  | "profile"
  | "settings";

export type ThemeName = "light" | "dark";

export type User = {
  id: string;
  full_name: string;
  email: string;
};

export type AuthResponse = {
  access_token?: string;
  token_type?: string;
  user: User;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  full_name: string;
  email: string;
  password: string;
};

export type DocumentItem = {
  id: string;
  filename: string;
  chunk_count: number;
};

export type SourceItem = {
  filename: string;
  chunk: number;
  score: number;
  excerpt: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  sources?: SourceItem[];
};

export type QuizResponse = {
  quiz: string;
  sources: string[];
};
export type RegistrationResponse = {
  message: string;
  email: string;
  expires_in: number;
};

export type VerifyEmailPayload = {
  email: string;
  otp: string;
};

export type VerifyEmailResponse = {
  message: string;
  user: User;
};

export type ResendOTPResponse = {
  message: string;
  email: string;
  expires_in: number;
};
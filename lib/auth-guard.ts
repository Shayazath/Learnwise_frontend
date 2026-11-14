import { api } from "@/lib/api";

export async function isAuthenticated(): Promise<boolean> {
  try {
    await api.get("/auth/me");
    return true;
  } catch {
    return false;
  }
}
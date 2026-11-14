
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {api} from "@/lib/api";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("reset_email");
    const savedToken = sessionStorage.getItem("reset_token");

    if (!savedEmail || !savedToken) {
      router.replace("/forgot-password");
      return;
    }

    setEmail(savedEmail);
    setResetToken(savedToken);
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-password", {
        email,
        reset_token: resetToken,
        new_password: password,
      });

      sessionStorage.removeItem("reset_email");
      sessionStorage.removeItem("reset_token");

      router.replace("/login?passwordReset=success");
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        "Unable to reset password. Please start again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090812] px-5 py-12 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
        <Link href="/login" className="text-2xl font-black">
          LearnYah<span className="text-violet-400">.</span>
        </Link>

        <div className="mt-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-3xl text-violet-300">
          🔐
        </div>

        <p className="mt-7 text-xs font-bold tracking-[0.2em] text-violet-300">
          ALMOST THERE
        </p>

        <h1 className="mt-3 text-3xl font-black">
          Create a new password.
        </h1>

        <p className="mt-4 text-sm leading-7 text-white/50">
          Choose a strong password that you haven't used before.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-white/70">
              New password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={128}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm outline-none transition focus:border-violet-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">
              Confirm password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={128}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm outline-none transition focus:border-violet-400"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-white/50">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="accent-violet-500"
            />
            Show passwords
          </label>

          {error && (
            <p role="alert" className="text-sm text-rose-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !resetToken}
            className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-4 text-sm font-bold transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Updating password..." : "Reset password →"}
          </button>
        </form>
      </div>
    </main>
  );
}

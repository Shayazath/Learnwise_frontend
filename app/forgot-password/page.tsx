
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", {
        email: email.trim(),
      });

      sessionStorage.setItem("reset_email", email.trim());

      router.push("/verify-reset-otp");
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090812] px-5 py-12 text-white">
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative w-full max-w-md">
        <Link href="/login" className="text-2xl font-black">
          LearnYah<span className="text-violet-400">.</span>
        </Link>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl backdrop-blur-xl sm:p-9">
          <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-3xl text-violet-300">
            ↗
          </div>

          <p className="text-xs font-bold tracking-[0.2em] text-violet-300">
            ACCOUNT RECOVERY
          </p>

          <h1 className="mt-3 text-3xl font-black">
            Forgot your password?
          </h1>

          <p className="mt-4 text-sm leading-7 text-white/50">
            It happens. Enter your registered email address and we'll send
            you a verification code to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm text-white/70">
                Email address
              </label>

              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm outline-none transition placeholder:text-white/25 focus:border-violet-400"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-rose-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-4 text-sm font-bold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Sending code..." : "Send verification code →"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-white/45">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-semibold text-violet-300 hover:text-white"
            >
              Back to login
            </Link>
          </p>
        </div>

        <p className="mt-7 text-center text-xs text-white/25">
          LearnYah · Your curiosity has no limits.
        </p>
      </div>
    </main>
  );
}

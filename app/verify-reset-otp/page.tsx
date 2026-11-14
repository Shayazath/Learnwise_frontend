
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {api} from "@/lib/api";

export default function VerifyResetOTPPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("reset_email");

    if (!savedEmail) {
      router.replace("/forgot-password");
      return;
    }

    setEmail(savedEmail);
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/verify-reset-otp",
        { email, otp }
      );

      sessionStorage.setItem(
        "reset_token",
        response.data.reset_token
      );

      router.push("/reset-password");
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        "Unable to verify the code."
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
          ✉
        </div>

        <p className="mt-7 text-xs font-bold tracking-[0.2em] text-violet-300">
          EMAIL VERIFICATION
        </p>

        <h1 className="mt-3 text-3xl font-black">
          Check your inbox.
        </h1>

        <p className="mt-4 text-sm leading-7 text-white/50">
          Enter the six-digit verification code sent to{" "}
          <span className="font-semibold text-white/80">{email || "your email"}</span>.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            required
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="000000"
            className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-5 text-center text-3xl font-bold tracking-[0.6em] outline-none transition focus:border-violet-400"
          />

          {error && (
            <p role="alert" className="text-sm text-rose-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || otp.length !== 6 || !email}
            className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-4 text-sm font-bold transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify code →"}
          </button>
        </form>

        <div className="mt-7 text-center text-sm text-white/45">
          <Link href="/forgot-password" className="text-violet-300 hover:text-white">
            ← Change email address
          </Link>
        </div>
      </div>
    </main>
  );
}

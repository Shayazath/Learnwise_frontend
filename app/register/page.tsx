"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

import { useAuth } from "@/app/providers/AuthProvider";
import { resendOTP } from "@/lib/auth.service";
import AuthLayout from "@/app/components/landing/AuthLayout";
import { isAuthenticated } from "@/lib/auth-guard";

type ApiError = {
  detail?: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const { register, verifyRegistrationEmail } = useAuth();

  const [step, setStep] = useState<"register" | "verify">("register");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let active = true;

    const checkAuth = async () => {
      const authenticated = await isAuthenticated();

      if (!active) return;

      if (authenticated) {
        router.replace("/dashboard");
      } else {
        setCheckingAuth(false);
      }
    };

    checkAuth();

    return () => {
      active = false;
    };
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090812]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
      </div>
    );
  }

  useEffect(() => {
    if (step !== "verify" || cooldown <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCooldown((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [step, cooldown]);

  const getErrorMessage = (err: unknown, fallback: string) => {
    const axiosError = err as AxiosError<ApiError>;

    return axiosError.response?.data?.detail || fallback;
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
      });

      setEmail(response.email);
      setStep("verify");
      setCooldown(60);
      setOtp("");

      setSuccess("Verification code sent to your email address.");
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to create your account. Please try again.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid six-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      await verifyRegistrationEmail(email, otp);

      router.replace("/dashboard");
    } catch (err) {
      setError(
        getErrorMessage(err, "Unable to verify your email. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await resendOTP(email);

      setCooldown(60);
      setOtp("");
      setSuccess(response.message);
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Unable to resend OTP. Please try again.",
      );

      setError(message);

      // If the backend returns a resend cooldown, use its
      // remaining-seconds message for the frontend countdown.
      const match = message.match(/wait\s+(\d+)\s+seconds/i);

      if (match) {
        setCooldown(Number(match[1]));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = () => {
    setStep("register");
    setOtp("");
    setError("");
    setSuccess("");
    setCooldown(0);
  };

  return (
    <AuthLayout
      heading={
        step === "register"
          ? "Start learning differently."
          : "Verify your email."
      }
      description={
        step === "register"
          ? "Create your account and make knowledge yours."
          : "One quick step before your LearnYah journey begins."
      }
    >
      {step === "register" ? (
        <>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Full name
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Confirm password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
                autoComplete="new-password"
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-violet-500/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Sending verification code..."
                : "Create your account →"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-violet-300 hover:text-violet-200"
            >
              Sign in
            </Link>
          </p>
        </>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-violet-300"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-white">
              Check your inbox
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              We've sent a six-digit verification code to
            </p>

            <p className="mt-1 break-all font-medium text-violet-300">
              {email}
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label
                htmlFor="otp"
                className="mb-3 block text-center text-sm font-medium text-slate-300"
              >
                Enter your verification code
              </label>

              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                maxLength={6}
                required
                autoFocus
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-4 text-center font-mono text-3xl font-bold tracking-[0.5em] text-white outline-none placeholder:text-slate-600 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300"
              >
                {error}
              </p>
            )}

            {success && (
              <p
                role="status"
                className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-300"
              >
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-violet-500/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify email and continue →"}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-slate-400">Didn't receive the code?</p>

            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading || cooldown > 0}
              className="mt-2 text-sm font-semibold text-violet-300 transition hover:text-violet-200 disabled:cursor-not-allowed disabled:text-slate-500"
            >
              {cooldown > 0
                ? `Resend code in ${cooldown}s`
                : "Resend verification code"}
            </button>
          </div>

          <button
            type="button"
            onClick={handleChangeEmail}
            disabled={loading}
            className="w-full text-center text-sm text-slate-400 transition hover:text-white disabled:opacity-50"
          >
            ← Change email address
          </button>

          <p className="text-center text-xs leading-5 text-slate-500">
            Your verification code expires in 5 minutes. Check your spam folder
            if you can't find the email.
          </p>
        </div>
      )}
    </AuthLayout>
  );
}

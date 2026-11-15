
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { isAuthenticated } from "@/lib/auth-guard";
import { useAuth } from "@/app/providers/AuthProvider";

import AuthLayout from "@/app/components/landing/AuthLayout";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({
        email,
        password,
        rememberMe,
      });

      router.replace("/dashboard");
    } catch (err) {
      const axiosError = err as AxiosError<{ detail?: string }>;

      setError(
        axiosError.response?.data?.detail ||
          "Unable to log in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <AuthLayout
      heading="Welcome back."
      description="Your next breakthrough starts with a question."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
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
            className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">
              Password
            </label>

            <Link
              href="/forgot-password"
              className="text-sm font-medium text-violet-300 transition hover:text-violet-200"
            >
              Forgot password?
            </Link>
          </div>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
          />

          {/* Remember me */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <label
              htmlFor="remember-me"
              className="group flex cursor-pointer select-none items-center gap-2.5"
            >
              <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-md border border-white/20 bg-white/[0.04] transition-all checked:border-violet-500 checked:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:ring-offset-2 focus:ring-offset-[#090812]"
                />

                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  className="pointer-events-none relative z-10 h-3.5 w-3.5 scale-75 text-white opacity-0 transition-all peer-checked:scale-100 peer-checked:opacity-100"
                >
                  <path
                    d="M4.5 10.5L8 14L15.5 6.5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <span className="text-sm font-medium text-slate-300 transition-colors group-hover:text-white">
                Remember me
              </span>
            </label>

            <span className="text-right text-[11px] text-slate-500 transition-colors">
              {rememberMe ? "30-day access" : "Standard session"}
            </span>
          </div>
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
          className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-violet-500/40 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in to LearnYah →"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-slate-500">NEW TO LearnYah?</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <p className="text-center text-sm text-slate-400">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-violet-300 hover:text-violet-200"
        >
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}

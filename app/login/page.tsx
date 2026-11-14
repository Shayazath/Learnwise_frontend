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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
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


"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  Save,
  X,
  LoaderCircle,
  Pencil,
} from "lucide-react";

import { useAuth } from "@/app/providers/AuthProvider";
import { updateUserProfile } from "@/lib/auth.service";
import { AxiosError } from "axios";

export function ProfileView() {
  const { user, updateUser } = useAuth();

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setFullName(user?.full_name ?? "");
    setEmail(user?.email ?? "");
  }, [user]);

  const initials = (user?.full_name ?? "LearnWise User")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const cancelEditing = () => {
    setFullName(user?.full_name ?? "");
    setEmail(user?.email ?? "");
    setEditing(false);
    setError("");
    setStatus("");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (saving) return;

    setError("");
    setStatus("");

    try {
      setSaving(true);

      const updatedUser = await updateUserProfile({
        full_name: fullName.trim(),
        email: email.trim(),
      });

      updateUser(updatedUser);
      setEditing(false);
      setStatus("Your profile has been updated successfully.");
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ detail?: string }>;

      setError(
        axiosError.response?.data?.detail ||
          "Unable to log in. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-8 px-4 py-6 sm:px-8 lg:px-10">
      <div className="page-heading">
        <p className="text-sm font-medium text-violet-400">
          ACCOUNT
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
          My Profile
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Manage your personal information and account identity.
        </p>
      </div>

      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 text-2xl font-bold text-white shadow-xl shadow-violet-500/20">
              {initials || "L"}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-xl font-semibold text-white">
                {user?.full_name ?? "LearnWise User"}
              </h2>
              <p className="mt-1 truncate text-sm text-white/50">
                {user?.email}
              </p>
              <span className="mt-3 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                Active account
              </span>
            </div>

            {!editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(true);
                  setStatus("");
                  setError("");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
              >
                <Pencil size={15} />
                Edit profile
              </button>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
          <div className="mb-7">
            <h2 className="text-lg font-semibold text-white">
              Personal information
            </h2>
            <p className="mt-1 text-sm text-white/45">
              Your basic account details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/75">
                Full name
              </label>

              <div className="relative">
                <UserRound
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
                />
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={100}
                  disabled={!editing || saving}
                  value={fullName}
                  onChange={(event) =>
                    setFullName(event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/60 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/75">
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
                />
                <input
                  type="email"
                  required
                  disabled={!editing || saving}
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/60 disabled:cursor-not-allowed disabled:opacity-60"
                />
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

            {status && (
              <p
                role="status"
                className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-300"
              >
                {status}
              </p>
            )}

            {editing && (
              <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 pt-5">
                <button
                  type="button"
                  disabled={saving}
                  onClick={cancelEditing}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/[0.06] disabled:opacity-50"
                >
                  <X size={15} />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <LoaderCircle
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={16} />
                  )}
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

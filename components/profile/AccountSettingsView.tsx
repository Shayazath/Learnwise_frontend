"use client";

import { FormEvent, useState } from "react";
import {
  LockKeyhole,
  Eye,
  EyeOff,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";

import { changeUserPassword } from "@/lib/auth.service";
import { AxiosError } from "axios";

export function AccountSettingsView() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (saving) return;

    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError("Your new password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError(
        "Your new password must be different from your current password.",
      );
      return;
    }

    try {
      setSaving(true);

      const result = await changeUserPassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      console.log(result, "result");

      setSuccess(result.message || "Password changed successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
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

  const passwordField = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    visible: boolean,
    toggleVisibility: () => void,
    placeholder: string,
  ) => (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/75">
        {label}
      </label>

      <div className="relative">
        <LockKeyhole
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
        />

        <input
          type={visible ? "text" : "password"}
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/60"
        />

        <button
          type="button"
          onClick={toggleVisibility}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white"
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );

  return (
    <section className="space-y-8 px-4 py-6 sm:px-8 lg:px-10">
      <div className="page-heading">
        <p className="text-sm font-medium text-violet-400">ACCOUNT</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
          Account Settings
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Manage your security and account preferences.
        </p>
      </div>

      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
          <div className="mb-7 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
              <ShieldCheck size={23} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Password and security
              </h2>
              <p className="mt-1 text-sm text-white/45">
                Update your password to keep your account secure.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {passwordField(
              "Current password",
              currentPassword,
              setCurrentPassword,
              showCurrent,
              () => setShowCurrent((value) => !value),
              "Enter your current password",
            )}

            <div className="border-t border-white/10 pt-6">
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-white">
                  Create a new password
                </h3>
                <p className="mt-1 text-xs text-white/40">
                  Use at least 8 characters.
                </p>
              </div>

              <div className="space-y-5">
                {passwordField(
                  "New password",
                  newPassword,
                  setNewPassword,
                  showNew,
                  () => setShowNew((value) => !value),
                  "Enter a new password",
                )}

                {passwordField(
                  "Confirm new password",
                  confirmPassword,
                  setConfirmPassword,
                  showConfirm,
                  () => setShowConfirm((value) => !value),
                  "Re-enter your new password",
                )}
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

            {success && (
              <p
                role="status"
                className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-300"
              >
                {success}
              </p>
            )}

            <div className="flex justify-end border-t border-white/10 pt-5">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <LockKeyhole size={16} />
                )}
                {saving ? "Updating..." : "Update password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

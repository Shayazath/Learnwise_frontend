"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookMarked,
  Library,
  MessageSquarePlus,
  Plus,
  Sparkles,
  UserRound,
  Settings,
  LogOut,
  ChevronUp,
  LoaderCircle,
} from "lucide-react";

import type { DocumentItem, ViewName } from "@/types";
import { useAuth } from "@/app/providers/AuthProvider";

type Props = {
  view: ViewName;
  documents: DocumentItem[];
  mobileOpen: boolean;
  onNavigate: (view: ViewName) => void;
  onNewChat: () => void;
};

export function Sidebar({
  view,
  documents,
  mobileOpen,
  onNavigate,
  onNewChat,
}: Props) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const fullName = user?.full_name || "LearnYah User";
  const email = user?.email || "";

  const initials = fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    setLogoutError("");

    try {
      await logout();
      router.replace("/login");
    } catch {
      setLogoutError("Unable to sign out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
      {/* Brand */}
      <a
        className="brand"
        href="/dashboard"
        onClick={(event) => {
          event.preventDefault();
          onNavigate("tutor");
        }}
      >
        <span className="brand-icon">L</span>
        <span className="brand-name">LearnYah</span>
      </a>

      {/* New conversation */}
      <button className="new-chat" onClick={onNewChat}>
        <MessageSquarePlus size={16} />
        New conversation
      </button>

      {/* Workspace navigation */}
      <p className="nav-label">WORKSPACE</p>

      <nav className="nav-list" aria-label="Main navigation">
        <button
          className={`nav-item ${view === "tutor" ? "active" : ""}`}
          onClick={() => onNavigate("tutor")}
        >
          <Sparkles size={17} />
          AI Tutor
        </button>

        <button
          className={`nav-item ${view === "library" ? "active" : ""}`}
          onClick={() => onNavigate("library")}
        >
          <Library size={17} />
          My Library
          <span className="nav-count">{documents.length}</span>
        </button>

        <button
          className={`nav-item ${view === "quiz" ? "active" : ""}`}
          onClick={() => onNavigate("quiz")}
        >
          <BookMarked size={17} />
          Practice Quiz
        </button>
      </nav>

      <div className="sidebar-divider" />

      {/* Documents */}
      <div className="library-heading">
        <span className="nav-label">YOUR MATERIALS</span>

        <button
          title="Upload a document"
          aria-label="Open document library to upload"
          onClick={() => onNavigate("library")}
        >
          <Plus size={16} />
        </button>
      </div>

      <ul className="sidebar-docs">
        {documents.length ? (
          documents.map((doc) => (
            <li key={doc.id} title={doc.filename}>
              {doc.filename}
            </li>
          ))
        ) : (
          <li className="empty-docs">
            Your learning materials will appear here.
          </li>
        )}
      </ul>

      {/* Sidebar bottom */}
      <div className="sidebar-bottom">
        <div className="local-status">
          <span className="status-dot" />

          <span>
            <strong>Learning workspace</strong>
            <small>Your personal AI study space</small>
          </span>
        </div>

        {/* Account menu */}
        <div className="relative mt-3">
          {profileOpen && (
            <div className="profile-dropdown absolute bottom-full left-0 z-50 mb-3 w-full overflow-hidden rounded-2xl border p-2 shadow-2xl">
              <div className="border-b border-white/10 px-3 py-3">
                <p className="profile-name truncate text-sm font-semibold">
                  {fullName}
                </p>
                <p className="profile-email mt-1 truncate text-xs">{email}</p>
              </div>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  onNavigate("profile");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-white/75 transition hover:bg-white/[0.07] hover:text-white"
              >
                <UserRound size={16} />
                My Profile
              </button>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  onNavigate("settings");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-white/75 transition hover:bg-white/[0.07] hover:text-white"
              >
                <Settings size={16} />
                Account Settings
              </button>

              <div className="my-1 border-t border-white/10" />

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-red-300 transition hover:bg-red-400/10 disabled:opacity-50"
              >
                {loggingOut ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <LogOut size={16} />
                )}

                {loggingOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
          )}

          {logoutError && (
            <p
              role="alert"
              className="mb-2 rounded-lg bg-red-500/10 p-2 text-xs text-red-400"
            >
              {logoutError}
            </p>
          )}

          <button
            type="button"
            onClick={() => setProfileOpen((current) => !current)}
            aria-expanded={profileOpen}
            aria-label="Open account menu"
            className="flex w-full items-center gap-3 rounded-xl border border-transparent p-2 text-left transition hover:border-white/10 hover:bg-white/[0.05]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-blue-500 text-sm font-bold text-white shadow-lg shadow-violet-500/20">
              {initials || "L"}
            </div>

            <span className="min-w-0 flex-1">
              <strong className="profile-name block truncate text-xs">
                {fullName}
              </strong>
              <small className="profile-email mt-1 block truncate text-[10px]">
                {email || "Personal workspace"}
              </small>
            </span>

            <ChevronUp
              size={16}
              className={`shrink-0 text-white/50 transition-transform ${
                profileOpen ? "" : "rotate-180"
              }`}
            />
          </button>
        </div>
      </div>
    </aside>
  );
}

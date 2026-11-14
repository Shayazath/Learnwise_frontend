"use client";

import { HelpCircle, Menu, Moon, Sun } from "lucide-react";
import type { ThemeName, ViewName } from "@/types";

type Props = {
  view: ViewName;
  theme: ThemeName;
  onToggleTheme: () => void;
  onToggleMobileMenu: () => void;
};

export function AppHeader({
  view, theme, onToggleTheme, onToggleMobileMenu,
}: Props) {
  const title =
  view === "tutor"
    ? "AI Tutor"
    : view === "library"
      ? "My Library"
      : view === "quiz"
        ? "Practice Quiz"
        : view === "profile"
          ? "My Profile"
          : "Account Settings";

  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={onToggleMobileMenu} aria-label="Toggle navigation">
        <Menu size={17} />
      </button>
      <div className="breadcrumb">
        Workspace <span>/</span> <strong>{title}</strong>
      </div>
      <div className="topbar-right">
        <span className="local-badge"><span className="status-dot" /> Local-first AI</span>
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          <span>{theme === "light" ? "Dark" : "Light"}</span>
        </button>
        <button className="help-button" title="Help"><HelpCircle size={14} /></button>
      </div>
    </header>
  );
}

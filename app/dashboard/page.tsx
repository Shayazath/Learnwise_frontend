"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";

import { AppHeader } from "@/components/layout/AppHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { TutorView } from "@/components/tutor/TutorView";
import { LibraryView } from "@/components/library/LibraryView";
import { QuizView } from "@/components/quiz/QuizView";
import { DashboardLoader } from "@/components/layout/DashboardLoader";

import { useLearnWise } from "@/hooks/useLearnWise";
import { useAuth } from "@/app/providers/AuthProvider";
import { ProfileView } from "@/components/profile/ProfileView";
import { AccountSettingsView } from "@/components/profile/AccountSettingsView";
import type { ViewName } from "@/types";
export default function HomePage() {
  // ------------------------------------
  // Refs and state
  // ------------------------------------

  const appRef = useRef<HTMLDivElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const previousMessageCount = useRef(0);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [minimumLoadingComplete, setMinimumLoadingComplete] = useState(false);

  const router = useRouter();

  const { loading, isAuthenticated } = useAuth();
  const learnWise = useLearnWise();

  // ------------------------------------
  // Authentication protection
  // ------------------------------------

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  // ------------------------------------
  // Minimum 3-second loading screen
  // ------------------------------------

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMinimumLoadingComplete(true);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, []);

  // Lock background scrolling while mobile sidebar is open
  useEffect(() => {
    if (!mobileOpen) return;

    const isMobile = window.matchMedia("(max-width: 720px)").matches;

    if (!isMobile) return;

    const html = document.documentElement;
    const body = document.body;

    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousOverscroll = body.style.overscrollBehavior;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";

    // Close sidebar using Escape
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.overscrollBehavior = previousOverscroll;

      window.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen]);

  // ------------------------------------
  // Dashboard entrance animation
  // Runs after the loader disappears
  // ------------------------------------

  useLayoutEffect(() => {
    if (
      loading ||
      !isAuthenticated ||
      !minimumLoadingComplete ||
      !appRef.current
    ) {
      return;
    }

    const context = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      const timeline = gsap.timeline();

      timeline.fromTo(
        ".sidebar",
        {
          x: -35,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.75,
          ease: "power3.out",
        },
      );

      timeline.fromTo(
        ".main-area",
        {
          y: 25,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: "power3.out",
        },
        "-=0.45",
      );

      timeline.fromTo(
        ".page-heading, .suggestion-card, .chat-card, .quiz-builder, .quiz-output, .upload-panel, .document-card",
        {
          y: 20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.08,
          ease: "power2.out",
        },
        "-=0.3",
      );

      timeline.fromTo(
        ".app-footer",
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        "-=0.2",
      );
    }, appRef);

    return () => context.revert();
  }, [loading, isAuthenticated, minimumLoadingComplete]);

  // ------------------------------------
  // Dashboard content animations
  // Re-run when changing dashboard views
  // ------------------------------------

  useLayoutEffect(() => {
    if (
      loading ||
      !isAuthenticated ||
      !minimumLoadingComplete ||
      !appRef.current
    ) {
      return;
    }

    const context = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      const timeline = gsap.timeline({
        defaults: {
          ease: "power2.out",
        },
      });

      // Page heading
      timeline.fromTo(
        ".page-heading",
        {
          y: 18,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
        },
        0.55,
      );

      // Suggestion cards
      timeline.fromTo(
        ".suggestion-card",
        {
          y: 22,
          opacity: 0,
          scale: 0.98,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.55,
          stagger: 0.09,
        },
        "-=0.3",
      );

      // Chat, quiz, upload and document cards
      timeline.fromTo(
        ".chat-card, .quiz-builder, .quiz-output, .upload-panel, .document-card",
        {
          y: 20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.07,
        },
        "-=0.3",
      );

      // Footer
      timeline.fromTo(
        ".app-footer",
        {
          opacity: 0,
          y: 8,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
        },
        "-=0.2",
      );
    }, appRef);

    return () => context.revert();
  }, [loading, isAuthenticated, minimumLoadingComplete, learnWise.view]);

  // ------------------------------------
  // Automatically scroll to new messages
  // ------------------------------------

  useEffect(() => {
    if (learnWise.messages.length > previousMessageCount.current) {
      requestAnimationFrame(() => {
        messageEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      });
    }

    previousMessageCount.current = learnWise.messages.length;
  }, [learnWise.messages]);

  // ------------------------------------
  // Animate latest chat message
  // ------------------------------------

  useEffect(() => {
    if (
      !appRef.current ||
      !minimumLoadingComplete ||
      learnWise.messages.length === 0
    ) {
      return;
    }

    const lastMessage = appRef.current.querySelector(
      ".message-item:last-of-type",
    );

    if (!lastMessage) return;

    gsap.fromTo(
      lastMessage,
      {
        y: 14,
        opacity: 0,
        scale: 0.985,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.32,
        ease: "power2.out",
      },
    );
  }, [learnWise.messages.length, minimumLoadingComplete]);

  // ------------------------------------
  // Navigation handlers
  // ------------------------------------

  const navigate = (nextView: ViewName) => {
    learnWise.navigate(nextView);
    setMobileOpen(false);
  };

  const startNewChat = () => {
    learnWise.startNewChat();
    setMobileOpen(false);
  };

  // ------------------------------------
  // Authentication and loading guard
  // Keep this AFTER all hooks
  // ------------------------------------

  if (loading || !minimumLoadingComplete || !isAuthenticated) {
    return <DashboardLoader />;
  }

  // ------------------------------------
  // Dashboard UI
  // ------------------------------------

  return (
    <div
      ref={appRef}
      className={`app-shell ${
        learnWise.view === "tutor" && learnWise.messages.length > 0
          ? "chat-fullscreen-mode"
          : ""
      }`}
    >
      {/* Mobile sidebar backdrop */}
      {mobileOpen && (
        <button
          type="button"
          className="mobile-sidebar-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        view={learnWise.view}
        documents={learnWise.documents}
        mobileOpen={mobileOpen}
        onNavigate={navigate}
        onNewChat={startNewChat}
      />

      <main className="main-area">
        <AppHeader
          view={learnWise.view}
          theme={learnWise.theme}
          onToggleTheme={learnWise.toggleTheme}
          onToggleMobileMenu={() => setMobileOpen((current) => !current)}
        />

        {/* AI Tutor */}
        {learnWise.view === "tutor" && (
          <TutorView
            messages={learnWise.messages}
            message={learnWise.message}
            useDocs={learnWise.useDocs}
            busy={learnWise.busy}
            textareaRef={learnWise.textareaRef}
            messageEndRef={messageEndRef}
            onMessageChange={learnWise.setMessage}
            onUseDocsChange={learnWise.setUseDocs}
            onUsePrompt={learnWise.usePrompt}
            onSendMessage={learnWise.sendMessage}
            onStartNewChat={startNewChat}
            onOpenQuiz={() => navigate("quiz")}
          />
        )}

        {/* Document Library */}
        {learnWise.view === "library" && (
          <LibraryView
            documents={learnWise.documents}
            selectedFile={learnWise.selectedFile}
            uploading={learnWise.uploading}
            uploadStatus={learnWise.uploadStatus}
            deletingDocumentId={learnWise.deletingDocumentId}
            onSelectFile={learnWise.setSelectedFile}
            onUpload={learnWise.uploadDocument}
            onRefresh={learnWise.refreshDocuments}
            onDelete={learnWise.deleteDocument}
          />
        )}

        {/* Practice Quiz */}
        {learnWise.view === "quiz" && (
          <QuizView
            topic={learnWise.topic}
            questionCount={learnWise.questionCount}
            useDocs={learnWise.quizUseDocs}
            busy={learnWise.quizBusy}
            result={learnWise.quizResult}
            onTopicChange={learnWise.setTopic}
            onQuestionCountChange={learnWise.setQuestionCount}
            onUseDocsChange={learnWise.setQuizUseDocs}
            onGenerate={learnWise.generateQuiz}
          />
        )}

        {/* My Profile */}
        {learnWise.view === "profile" && <ProfileView />}

        {/* Account Settings */}
        {learnWise.view === "settings" && <AccountSettingsView />}

        {/* Footer */}
        <footer className="app-footer">
          <span>
            LearnYah <b>v0.3 · Next.js</b>
          </span>

          <span>
            Built for curious minds <span className="footer-heart">♥</span>
          </span>
        </footer>
      </main>
    </div>
  );
}

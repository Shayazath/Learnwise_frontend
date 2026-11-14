
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Sparkles } from "lucide-react";

export function DashboardLoader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const ringOneRef = useRef<HTMLDivElement>(null);
  const ringTwoRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const context = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set(".loader-content, .loader-orb", {
          opacity: 1,
          scale: 1,
        });
        return;
      }

      const timeline = gsap.timeline();

      timeline.fromTo(
        ".loader-content",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        },
      );

      timeline.fromTo(
        ".loader-orb",
        { opacity: 0, scale: 0.4, rotate: -35 },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 1,
          ease: "back.out(1.7)",
        },
        "-=0.5",
      );

      gsap.to(orbRef.current, {
        y: -12,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(ringOneRef.current, {
        rotate: 360,
        duration: 12,
        repeat: -1,
        ease: "none",
      });

      gsap.to(ringTwoRef.current, {
        rotate: -360,
        duration: 18,
        repeat: -1,
        ease: "none",
      });

      gsap.to(".loader-particle", {
        y: -18,
        opacity: 0.25,
        duration: 1.8,
        stagger: {
          each: 0.25,
          repeat: -1,
          yoyo: true,
        },
        ease: "sine.inOut",
      });

      gsap.fromTo(
        progressRef.current,
        { scaleX: 0 },
        {
          scaleX: 0.85,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          transformOrigin: "left center",
          ease: "power1.inOut",
        },
      );
    }, containerRef);

    return () => context.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-hidden bg-[#100d1b] text-white"
    >
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,91,255,0.08),transparent_65%)]" />

        {Array.from({ length: 18 }).map((_, index) => (
          <span
            key={index}
            className="loader-particle absolute h-1 w-1 rounded-full bg-violet-300"
            style={{
              left: `${10 + ((index * 37) % 80)}%`,
              top: `${12 + ((index * 23) % 76)}%`,
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      <div
        ref={contentRef}
        className="loader-content relative z-10 flex w-full max-w-md flex-col items-center px-6 text-center"
      >
        {/* Logo */}
        <div className="mb-12 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d7ff63] text-xl font-black text-[#171421] shadow-[0_0_30px_rgba(215,255,99,0.2)]">
            L
          </div>

          <span className="text-xl font-extrabold tracking-tight">
            LearnYah
          </span>
        </div>

        {/* Animated orb */}
        <div className="loader-orb relative mb-12 flex h-48 w-48 items-center justify-center">
          <div className="absolute h-36 w-36 rounded-full bg-violet-600/30 blur-3xl" />

          <div
            ref={ringOneRef}
            className="absolute h-44 w-24 rounded-[50%] border border-violet-400/60"
          />

          <div
            ref={ringTwoRef}
            className="absolute h-40 w-40 rounded-full border border-dashed border-lime-300/40"
          />

          <div
            ref={orbRef}
            className="relative flex h-28 w-28 items-center justify-center rounded-full border border-violet-300/50 bg-gradient-to-br from-violet-300 via-violet-600 to-indigo-950 shadow-[inset_-15px_-15px_30px_rgba(0,0,0,0.4),0_0_55px_rgba(124,91,255,0.5)]"
          >
            <div className="absolute left-6 top-5 h-4 w-4 rounded-full bg-white/80 blur-[2px]" />
            <Sparkles size={30} className="text-white/90" />
          </div>

          <span className="absolute right-2 top-6 h-3 w-3 rotate-45 bg-[#d7ff63]" />
          <span className="absolute bottom-7 left-1 h-2 w-2 rounded-full bg-violet-300" />
        </div>

        {/* Loading content */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-violet-400">
            Your learning space
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Think. Learn. <span className="text-violet-400">Grow.</span>
          </h1>

          <p className="text-sm font-medium text-slate-400">
            Preparing your personal learning experience
          </p>
        </div>

        {/* Progress */}
        <div className="mt-10 w-56">
          <div className="h-1 overflow-hidden rounded-full bg-white/10">
            <div
              ref={progressRef}
              className="h-full w-full rounded-full bg-gradient-to-r from-violet-500 to-lime-300"
            />
          </div>

          <p className="mt-3 text-[10px] font-semibold tracking-[0.2em] text-slate-500">
            LOADING YOUR WORKSPACE
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center text-xs font-medium text-slate-600">
        Made for curious minds
      </div>
    </div>
  );
}

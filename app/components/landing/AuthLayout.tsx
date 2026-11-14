
"use client";

import { ReactNode, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import Scene3D from "./Scene3D";

type Props = {
  children: ReactNode;
  heading: string;
  description: string;
};

export default function AuthLayout({
  children,
  heading,
  description,
}: Props) {
  const pageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        ".auth-brand, .auth-form-panel",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        },
      );
    }, pageRef);

    return () => context.revert();
  }, []);

  return (
    <main
      ref={pageRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080817] px-4 py-12 text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_20%,rgba(85,60,210,0.24),transparent_45%),radial-gradient(ellipse_at_85%_80%,rgba(25,105,220,0.16),transparent_45%)]" />

      <Scene3D />

      <div className="absolute inset-0 bg-gradient-to-b from-[#080817]/20 via-transparent to-[#080817]/70" />

      <div className="relative z-10 w-full max-w-[480px]">
        <div className="auth-brand mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-2xl font-bold tracking-tight"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/30">
              <span className="text-xl">✦</span>
            </span>
            LearnYah
          </Link>

          <p className="mt-6 text-3xl font-semibold tracking-tight">
            {heading}
          </p>

          <p className="mt-2 text-sm text-slate-400">
            {description}
          </p>
        </div>

        <section className="auth-form-panel rounded-3xl border border-white/10 bg-white/[0.07] p-7 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-9">
          {children}
        </section>

        <p className="mt-7 text-center text-xs text-slate-500">
          LearnYah · Learn something extraordinary.
        </p>
      </div>
    </main>
  );
}

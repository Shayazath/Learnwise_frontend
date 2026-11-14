
"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Scene3D from "@/app/components/landing/Scene3D";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    number: "01",
    icon: "✦",
    title: "AI Personal Tutor",
    description:
      "Ask questions naturally and get contextual explanations that help you understand difficult concepts.",
  },
  {
    number: "02",
    icon: "◈",
    title: "Your Knowledge Library",
    description:
      "Upload your learning materials and build a personal knowledge base that your AI tutor can understand.",
  },
  {
    number: "03",
    icon: "⌘",
    title: "Smart Quiz Generation",
    description:
      "Turn your learning materials into interactive quizzes and test what you really understand.",
  },
];

export default function HomePage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      intro
        .fromTo(
          ".hero-eyebrow",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
        )
        .fromTo(
          ".hero-title",
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.3",
        )
        .fromTo(
          ".hero-description, .hero-actions",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.65, stagger: 0.15 },
          "-=0.4",
        );

      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 45 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-section",
            start: "top 75%",
          },
        },
      );

      gsap.fromTo(
        ".steps-section",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: ".steps-section",
            start: "top 80%",
          },
        },
      );

      gsap.fromTo(
        ".final-cta",
        { opacity: 0, scale: 0.96 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: ".final-cta",
            start: "top 85%",
          },
        },
      );
    }, pageRef);

    return () => context.revert();
  }, []);

  return (
    <main
      ref={pageRef}
      className="min-h-screen overflow-hidden bg-[#080817] text-white"
    >
      {/* Navigation */}
      <header className="relative z-30 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3 text-xl font-bold">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/30">
            ✦
          </span>
          LearnWise
        </Link>

        <nav className="hidden items-center gap-9 text-sm text-slate-400 md:flex">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#how-it-works" className="transition hover:text-white">
            How it works
          </a>
          <a href="#about" className="transition hover:text-white">
            About
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-full px-5 py-2.5 text-sm text-slate-300 transition hover:text-white sm:block"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#111126] transition hover:bg-violet-100"
          >
            Get started <span className="ml-1">↗</span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto flex min-h-[680px] max-w-7xl items-center px-6 py-20 lg:px-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[10%] top-[20%] h-72 w-72 rounded-full bg-violet-600/15 blur-[110px]" />
          <div className="absolute bottom-[5%] right-[10%] h-72 w-72 rounded-full bg-blue-500/15 blur-[110px]" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="hero-eyebrow mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.08] px-4 py-2 text-xs font-medium tracking-wide text-violet-200">
            <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_12px_#a78bfa]" />
            YOUR PERSONAL AI LEARNING SPACE
          </div>

          <h1 className="hero-title text-5xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            Learn beyond
            <br />
            <span className="bg-gradient-to-r from-violet-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
              what you know.
            </span>
          </h1>

          <p className="hero-description mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
            Meet your personal AI learning companion. Explore your
            documents, understand complex ideas and turn knowledge
            into something you truly remember.
          </p>

          <div className="hero-actions mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/register"
              className="group rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-7 py-4 text-sm font-semibold shadow-xl shadow-violet-600/20 transition duration-300 hover:-translate-y-1 hover:shadow-violet-500/40"
            >
              Start learning for free
              <span className="ml-3 transition group-hover:translate-x-1">→</span>
            </Link>

            <a
              href="#features"
              className="rounded-full border border-white/15 px-7 py-4 text-sm font-medium text-slate-300 transition hover:border-violet-300/50 hover:bg-white/5"
            >
              Explore features
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-slate-500">
            <span>✦ AI-powered learning</span>
            <span>◈ Your own knowledge base</span>
            <span>⌘ Learn at your pace</span>
          </div>
        </div>

        {/* 3D visual */}
        <div className="pointer-events-none absolute inset-y-0 right-[-15%] hidden w-[70%] lg:block">
          <Scene3D />
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="features-section relative mx-auto max-w-7xl px-6 py-28 lg:px-10"
      >
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
            Everything in one place
          </p>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            A smarter way to
            <span className="text-slate-500"> learn and grow.</span>
          </h2>
          <p className="mt-5 leading-7 text-slate-400">
            Less searching. More understanding. Everything you need
            to make your learning journey more effective.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.number}
              className="feature-card group rounded-3xl border border-white/[0.09] bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-8 transition duration-300 hover:-translate-y-2 hover:border-violet-400/30"
            >
              <div className="mb-10 flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-400/10 text-2xl text-violet-300">
                  {feature.icon}
                </span>
                <span className="text-sm text-slate-600">
                  {feature.number}
                </span>
              </div>

              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                {feature.description}
              </p>

              <div className="mt-8 text-sm text-violet-300 transition group-hover:translate-x-1">
                Discover more →
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="steps-section mx-auto max-w-7xl px-6 py-24 lg:px-10"
      >
        <div className="rounded-[32px] border border-white/[0.08] bg-gradient-to-br from-violet-500/[0.12] via-white/[0.025] to-blue-500/[0.08] p-8 sm:p-14">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
            Your journey starts here
          </p>

          <h2 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            From information to
            <span className="text-violet-300"> understanding.</span>
          </h2>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              ["01", "Bring your material", "Upload notes, PDFs and learning documents."],
              ["02", "Explore with AI", "Ask questions and get answers grounded in your material."],
              ["03", "Test your knowledge", "Generate quizzes and strengthen what you've learned."],
            ].map(([number, title, description]) => (
              <div key={number}>
                <span className="text-sm font-semibold text-violet-300">
                  {number}
                </span>
                <h3 className="mt-4 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="about"
        className="final-cta mx-auto max-w-7xl px-6 py-28 text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
          Make knowledge yours
        </p>
        <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
          Your next learning journey starts here.
        </h2>
        <p className="mx-auto mt-6 max-w-xl leading-7 text-slate-400">
          Create your account and discover a more personal way to learn.
        </p>

        <Link
          href="/register"
          className="mt-9 inline-flex rounded-full bg-white px-8 py-4 text-sm font-semibold text-[#111126] transition hover:-translate-y-1 hover:bg-violet-100"
        >
          Get started with LearnWise →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
          <span className="font-semibold text-slate-300">✦ LearnWise</span>
          <span>Learn something extraordinary.</span>
          <span>Built for curious minds.</span>
        </div>
      </footer>
    </main>
  );
}

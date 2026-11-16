
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StudyUniverse from "@/components/StudyUniverse";
import * as THREE from "three";
import { api } from "@/lib/api";
gsap.registerPlugin(ScrollTrigger);

function NeuralUniverse() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Neural sphere
    const sphereGeometry = new THREE.IcosahedronGeometry(2, 3);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x7957ff,
      wireframe: true,
      transparent: true,
      opacity: 0.48,
    });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // Inner glowing sphere
    const innerGeometry = new THREE.IcosahedronGeometry(1.35, 2);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x3424a8,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });

    const innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerSphere);

    // Orbital rings
    const rings: THREE.Mesh[] = [];

    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.TorusGeometry(
        2.65 + i * 0.12,
        0.008,
        8,
        180
      );

      const material = new THREE.MeshBasicMaterial({
        color: i === 1 ? 0x32d9ff : 0x9067ff,
        transparent: true,
        opacity: 0.65 - i * 0.12,
      });

      const ring = new THREE.Mesh(geometry, material);
      ring.rotation.x = Math.PI / 2 + i * 0.45;
      ring.rotation.y = i * 0.6;

      scene.add(ring);
      rings.push(ring);
    }

    // Particle field
    const particleCount = 1600;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xa99aff,
      size: 0.018,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(
      particleGeometry,
      particleMaterial
    );

    scene.add(particles);

    // GSAP animation
    const animation = gsap.timeline({ repeat: -1, yoyo: true });

    animation.to(sphere.rotation, {
      y: Math.PI * 2,
      x: Math.PI * 0.35,
      duration: 18,
      ease: "none",
    });

    const innerAnimation = gsap.to(innerSphere.rotation, {
      y: -Math.PI * 2,
      x: Math.PI,
      duration: 24,
      repeat: -1,
      ease: "none",
    });

    const ringAnimations = rings.map((ring, i) =>
      gsap.to(ring.rotation, {
        z: Math.PI * 2,
        duration: 16 + i * 5,
        repeat: -1,
        ease: "none",
      })
    );

    const particleAnimation = gsap.to(particles.rotation, {
      y: Math.PI * 2,
      duration: 100,
      repeat: -1,
      ease: "none",
    });

    let frameId = 0;

    const render = () => {
      frameId = requestAnimationFrame(render);
      renderer.render(scene, camera);
    };

    render();

    // Responsive sizing
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;

      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(
        container.clientWidth,
        container.clientHeight
      );
    });

    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();

      animation.kill();
      innerAnimation.kill();
      ringAnimations.forEach((item) => item.kill());
      particleAnimation.kill();

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose();

          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];

          materials.forEach((material) => material.dispose());
        }
      });

      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
const features = [
  {
    number: "01",
    icon: "✦",
    title: "Chat with your documents",
    description:
      "Upload your study materials and ask questions. LearnYah finds relevant information from your documents and gives you contextual answers.",
    tag: "AI DOCUMENT CHAT",
  },
  {
    number: "02",
    icon: "◈",
    title: "Understand complex topics",
    description:
      "Turn difficult concepts into simple, understandable explanations. Learn at your own pace without feeling overwhelmed.",
    tag: "SMART EXPLANATIONS",
  },
  {
    number: "03",
    icon: "✧",
    title: "Create your own quizzes",
    description:
      "Test what you've learned with AI-generated questions based on your learning material. Find gaps and strengthen your knowledge.",
    tag: "ACTIVE RECALL",
  },
  {
    number: "04",
    icon: "◎",
    title: "Learn from your own material",
    description:
      "Keep your learning resources organized in one place and revisit them whenever you need to revise.",
    tag: "PERSONAL LIBRARY",
  },
  {
    number: "05",
    icon: "⌘",
    title: "Get contextual answers",
    description:
      "Instead of generic responses, get answers grounded in the material you provide, helping you focus on what you're studying.",
    tag: "RETRIEVAL AUGMENTED GENERATION",
  },
  {
    number: "06",
    icon: "↗",
    title: "Study on your schedule",
    description:
      "No fixed classroom, no fixed timetable. Learn whenever inspiration strikes and make progress at your own pace.",
    tag: "YOUR OWN PACE",
  },
];

const steps = [
  {
    number: "01",
    title: "Bring your knowledge",
    description:
      "Upload your notes, PDFs, and learning documents to create your personal study space.",
    symbol: "↑",
  },
  {
    number: "02",
    title: "Ask anything",
    description:
      "Ask questions in natural language and explore topics that matter to you.",
    symbol: "✳",
  },
  {
    number: "03",
    title: "Understand deeply",
    description:
      "Get contextual explanations that help you connect ideas and understand concepts.",
    symbol: "◉",
  },
  {
    number: "04",
    title: "Test yourself",
    description:
      "Practice with quizzes and use what you've learned to build stronger knowledge.",
    symbol: "↗",
  },
];

const faqs = [
  {
    question: "What is LearnYah?",
    answer:
      "LearnYah is an AI-powered learning assistant that helps you understand your study materials, ask questions about your documents, and practice what you learn.",
  },
  {
    question: "How does document-based AI chat work?",
    answer:
      "LearnYah processes your uploaded documents, converts their content into searchable representations, and retrieves relevant information when you ask a question. The AI uses that context to generate an answer.",
  },
  {
    question: "Can I upload my own study materials?",
    answer:
      "Yes. You can upload supported study documents and use them as the foundation for your learning conversations.",
  },
  {
    question: "Does LearnYah replace traditional studying?",
    answer:
      "No. LearnYah is designed to support your learning. It helps you explore, understand, revise, and test your knowledge while you remain in control of your learning journey.",
  },
  {
    question: "Can I use LearnYah at my own pace?",
    answer:
      "Absolutely. You can study whenever you want, ask follow-up questions, and revisit your learning materials whenever you need them.",
  },
];

export default function LandingPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => {
  api.get("/health").catch((error) => {
    console.error("Database health check failed:", error);
  });
}, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const intro = gsap.timeline();

      intro
        .from(".hero-label", {
          opacity: 0,
          y: 20,
          duration: 0.7,
        })
        .from(
          ".hero-title",
          {
            opacity: 0,
            y: 45,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .from(
          ".hero-description, .hero-actions",
          {
            opacity: 0,
            y: 25,
            duration: 0.8,
            stagger: 0.15,
          },
          "-=0.5"
        )
        .from(
          ".hero-visual",
          {
            opacity: 0,
            scale: 0.85,
            duration: 1.2,
            ease: "power3.out",
          },
          "-=0.8"
        );

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 45,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true,
          },
        });
      });

      gsap.to(".ambient-orb", {
        y: -35,
        x: 20,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={pageRef}
      className="min-h-screen overflow-hidden bg-[#090812] text-white selection:bg-violet-400 selection:text-black"
    >
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="ambient-orb absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-violet-700/15 blur-[130px]" />
        <div className="absolute -right-40 top-[35%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[150px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-fuchsia-600/10 blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />
      </div>

      {/* Navbar */}
      <header className="relative z-20 border-b border-white/[0.08]">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-xl shadow-lg shadow-violet-500/30">
            ✦
          </div>
          <span className="text-xl font-bold tracking-tight">
            Learn<span className="text-violet-400">Yah</span>
          </span>
        </Link>

          <div className="hidden items-center gap-9 text-sm text-white/65 md:flex">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-white">
              How it works
            </a>
            <a href="#why-learnyah" className="transition hover:text-white">
              Why LearnYah
            </a>
            <a href="#faq" className="transition hover:text-white">
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-white/75 transition hover:text-white sm:block"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#100d1d] transition hover:bg-violet-200 hover:shadow-[0_0_25px_rgba(167,139,250,.25)]"
            >
              Get started <span className="ml-1">↗</span>
            </Link>
          </div>
        </nav>
      </header>


      <section className="relative flex min-h-[760px] items-center justify-center px-6 py-24">
        <div className="hero-glow pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/20 blur-[150px]" />

        <div className="absolute inset-0 opacity-80">
          <NeuralUniverse />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="hero-label mb-8 inline-flex items-center gap-3 rounded-full border border-violet-400/20 bg-black/40 px-5 py-2.5 text-xs font-medium tracking-widest text-violet-300 backdrop-blur-xl">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            THE FUTURE OF PERSONAL LEARNING
          </div>

          <h1 className="hero-title text-5xl font-black leading-[1.1] tracking-tight sm:text-7xl lg:text-8xl">
            <span className="block">Think deeper.</span>
            <span className="block bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Learn smarter.
            </span>
          </h1>

          <p className="hero-description mx-auto mt-8 max-w-2xl text-base leading-8 text-gray-300 sm:text-lg">
            Your knowledge deserves more than bookmarks and scattered notes.
            Meet your personal AI learning assistant. Upload, understand,
            explore and master anything.
          </p>

          <div className="hero-actions mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="group flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-9 py-4 font-semibold shadow-xl shadow-violet-600/30 transition duration-300 hover:-translate-y-1 hover:shadow-violet-500/50 sm:w-auto"
            >
              Start learning
              <span className="transition group-hover:translate-x-1">→</span>
            </Link>

            <Link
              href="/login"
              className="w-full rounded-full border border-white/15 bg-white/[0.05] px-9 py-4 text-center font-medium text-white backdrop-blur-lg transition hover:border-violet-400/50 hover:bg-white/10 sm:w-auto"
            >
              Explore your workspace
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-7 text-xs text-gray-400">
            <span>✦ Document-powered AI</span>
            <span>✦ Intelligent conversations</span>
            <span>✦ Interactive quizzes</span>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-[10px] tracking-[0.3em] text-gray-500">
          SCROLL TO EXPLORE
          <div className="mx-auto mt-3 h-9 w-px bg-gradient-to-b from-violet-400 to-transparent" />
        </div>
      </section>

      {/* Intro strip */}
      <section className="relative z-10 border-y border-white/[0.08] bg-white/[0.025]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3 lg:px-10">
          {[
            ["LEARN", "Explore concepts beyond the textbook."],
            ["UNDERSTAND", "Get explanations grounded in your material."],
            ["GROW", "Build knowledge through consistent practice."],
          ].map(([heading, text]) => (
            <div key={heading} className="flex gap-4">
              <span className="text-2xl text-violet-300">✳</span>
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-violet-300">
                  {heading}
                </p>
                <p className="mt-2 text-sm text-white/55">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 py-28 lg:px-10">
        <div className="reveal max-w-3xl">
          <p className="text-xs font-bold tracking-[0.25em] text-violet-300">
            A BETTER WAY TO LEARN
          </p>
          <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
            Everything you need to
            <span className="gradient-text"> learnYah smarter.</span>
          </h2>
          <p className="mt-6 max-w-2xl leading-8 text-white/50">
            Your learning materials shouldn't just sit in folders. LearnYah
            helps turn them into an interactive learning experience where you
            can ask, explore, understand, and practice.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.number}
              className="reveal group relative overflow-hidden rounded-3xl border border-white/[0.09] bg-white/[0.035] p-7 transition duration-500 hover:-translate-y-2 hover:border-violet-400/40 hover:bg-violet-400/[0.06]"
            >
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl transition group-hover:bg-violet-500/25" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="text-4xl text-violet-300">{feature.icon}</span>
                  <span className="text-xs text-white/25">{feature.number}</span>
                </div>
                <p className="mt-9 text-[10px] font-bold tracking-[0.17em] text-violet-300">
                  {feature.tag}
                </p>
                <h3 className="mt-3 text-xl font-bold">{feature.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/50">
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Product preview */}
      <section className="relative z-10 overflow-hidden border-y border-white/[0.08] bg-[#100e1b] py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:px-10">
          <div className="reveal">
            <p className="text-xs font-bold tracking-[0.25em] text-cyan-300">
              MORE THAN A CHATBOT
            </p>
            <h2 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">
              Your documents.
              <br />
              Your questions.
              <br />
              <span className="gradient-text">Your understanding.</span>
            </h2>
            <p className="mt-7 max-w-lg leading-8 text-white/50">
              Imagine having a study partner who can explore your learning
              materials with you. Ask questions, follow your curiosity, and
              dig deeper into the topics you want to understand.
            </p>
            <ul className="mt-8 space-y-4 text-sm text-white/65">
              <li> <span className="mr-3 text-emerald-300">✓</span> Ask questions about your uploaded documents</li>
              <li> <span className="mr-3 text-emerald-300">✓</span> Explore answers with relevant context</li>
              <li> <span className="mr-3 text-emerald-300">✓</span> Ask follow-up questions naturally</li>
              <li> <span className="mr-3 text-emerald-300">✓</span> Revisit your learning conversations</li>
            </ul>
            <Link
              href="/register"
              className="mt-10 inline-flex rounded-full bg-white px-7 py-4 text-sm font-bold text-black transition hover:bg-violet-200"
            >
              Try your AI study space ↗
            </Link>
          </div>

          <div className="reveal relative">
            <div className="absolute inset-0 rounded-full bg-violet-500/15 blur-[100px]" />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#171424] shadow-2xl">
              <div className="flex items-center gap-2 border-b border-white/10 px-6 py-5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs text-white/40">LearnYah AI Tutor</span>
              </div>

              <div className="space-y-7 p-6 sm:p-8">
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-violet-500/20 px-5 py-4 text-sm leading-7 text-violet-100">
                    Can you explain how retrieval augmented generation works?
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-lg">
                    ✦
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-violet-300">LearnYah AI</p>
                    <p className="mt-3 text-sm leading-7 text-white/70">
                      Absolutely! Think of RAG as an AI assistant that first
                      searches your own knowledge library before answering.
                    </p>
                    <div className="mt-4 rounded-xl border border-violet-400/20 bg-violet-400/[0.06] p-4">
                      <p className="text-xs font-bold text-violet-200">HOW IT WORKS</p>
                      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                        {["Retrieve", "Augment", "Generate"].map((item, i) => (
                          <div key={item} className="rounded-xl bg-white/[0.06] p-3">
                            <p className="text-lg text-cyan-300">{["01", "02", "03"][i]}</p>
                            <p className="mt-2 text-white/70">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="mt-4 text-xs text-white/35">
                      Ask a follow-up to explore this topic further.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-4 text-sm text-white/35">
                  Ask anything about your study material...
                  <span className="float-right text-violet-300">↗</span>
                </div>
                <p className="text-center text-[10px] text-white/25">
                  Illustrative product preview. Not a live chat session.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative z-10 mx-auto max-w-7xl px-6 py-28 lg:px-10">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold tracking-[0.25em] text-violet-300">
            YOUR LEARNING JOURNEY
          </p>
          <h2 className="mt-5 text-4xl font-black sm:text-5xl">
            Four steps. <span className="gradient-text">Infinite curiosity.</span>
          </h2>
          <p className="mt-5 leading-8 text-white/50">
            A simple way to transform your study routine into an interactive
            experience.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <button
              key={step.number}
              onClick={() => setActiveStep(index)}
              className={`reveal rounded-3xl border p-7 text-left transition duration-300 ${
                activeStep === index
                  ? "border-violet-400/50 bg-violet-400/[0.09]"
                  : "border-white/10 bg-white/[0.025] hover:border-white/25"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest text-white/35">
                  STEP {step.number}
                </span>
                <span className="text-3xl text-violet-300">{step.symbol}</span>
              </div>
              <h3 className="mt-12 text-xl font-bold">{step.title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/50">
                {step.description}
              </p>
              <div className="mt-7 h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-300 transition-all duration-500 ${
                    activeStep === index ? "w-full" : "w-0"
                  }`}
                />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Why LearnYah */}
      <section id="why-learnyah" className="relative z-10 border-y border-white/[0.08] bg-white/[0.02] py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-10">
          <div className="reveal">
            <p className="text-xs font-bold tracking-[0.25em] text-fuchsia-300">
              LEARNING, REIMAGINED
            </p>
            <h2 className="mt-5 text-4xl font-black leading-tight sm:text-6xl">
              Don't just collect information.
              <span className="gradient-text"> Connect the dots.</span>
            </h2>
            <p className="mt-7 max-w-xl leading-8 text-white/50">
              Reading something once doesn't always mean understanding it.
              LearnYah gives you a space to interact with information, ask
              questions, revisit difficult concepts, and turn passive reading
              into active learning.
            </p>
          </div>

          <div className="reveal grid grid-cols-2 gap-4">
            {[
              ["Ask", "Questions without hesitation.", "✳"],
              ["Explore", "Ideas beyond the page.", "◈"],
              ["Practice", "Test your understanding.", "⌁"],
              ["Improve", "Keep building your knowledge.", "↗"],
            ].map(([title, desc, icon]) => (
              <div
                key={title}
                className="rounded-3xl border border-white/10 bg-[#141120] p-6 transition hover:border-violet-400/40"
              >
                <span className="text-3xl text-violet-300">{icon}</span>
                <h3 className="mt-8 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/45">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning philosophy */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-28 lg:px-10">
        <div className="reveal overflow-hidden rounded-[2rem] border border-violet-400/20 bg-gradient-to-br from-[#24143f] via-[#171329] to-[#10252b] p-8 sm:p-14">
          <p className="text-xs font-bold tracking-[0.25em] text-cyan-200">
            THE LEARNYAH MINDSET
          </p>
          <h2 className="mt-7 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            The goal isn't to know everything.
            <span className="text-violet-300"> It's to never stop exploring.</span>
          </h2>
          <p className="mt-7 max-w-2xl text-base leading-8 text-white/60">
            Every question is a starting point. Every concept you understand
            opens another door. Build a learning habit that grows with you.
          </p>
          <Link
            href="/register"
            className="mt-9 inline-flex rounded-full bg-white px-7 py-4 text-sm font-bold text-black transition hover:-translate-y-1 hover:bg-cyan-100"
          >
            Begin exploring <span className="ml-2">↗</span>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative z-10 mx-auto max-w-4xl px-6 py-24">
        <div className="reveal text-center">
          <p className="text-xs font-bold tracking-[0.25em] text-violet-300">
            GOOD QUESTIONS
          </p>
          <h2 className="mt-5 text-4xl font-black sm:text-5xl">
            Curious? <span className="gradient-text">We've got answers.</span>
          </h2>
        </div>

        <div className="mt-14 space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="reveal overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]"
            >
              <button
                onClick={() =>
                  setActiveFaq(activeFaq === index ? null : index)
                }
                className="flex w-full items-center justify-between gap-5 px-6 py-6 text-left"
              >
                <span className="font-semibold">{faq.question}</span>
                <span className="text-xl text-violet-300">
                  {activeFaq === index ? "−" : "+"}
                </span>
              </button>
              {activeFaq === index && (
                <div className="px-6 pb-6 text-sm leading-7 text-white/50">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-6 pb-24 pt-10">
        <div className="reveal relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-violet-300/20 bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 px-7 py-20 text-center sm:px-16">
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-fuchsia-300/20 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-cyan-300/20 blur-[100px]" />

          <div className="relative">
            <p className="text-xs font-bold tracking-[0.25em] text-violet-100">
              YOUR NEXT CHAPTER STARTS NOW
            </p>
            <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
              Make curiosity your superpower.
            </h2>
            <p className="mx-auto mt-6 max-w-xl leading-8 text-white/75">
              Bring your questions, your notes, and your ideas. Let's make
              learning something you look forward to.
            </p>
            <Link
              href="/register"
              className="mt-10 inline-flex rounded-full bg-white px-9 py-4 text-sm font-black text-violet-900 shadow-xl transition hover:-translate-y-1 hover:bg-cyan-100"
            >
              Get started with LearnYah →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 py-10 sm:flex-row sm:items-center lg:px-10">
          <div>
            <Link href="/" className="text-2xl font-black">
              LearnYah<span className="text-violet-400">.</span>
            </Link>
            <p className="mt-2 text-sm text-white/40">
              A little curiosity can take you a long way.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-white/45">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#how-it-works" className="hover:text-white">How it works</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
            <Link href="/login" className="hover:text-white">Login</Link>
            <Link href="/register" className="hover:text-white">Register</Link>
          </div>
        </div>
        <div className="border-t border-white/[0.06] px-6 py-5 text-center text-xs text-white/30">
          © {new Date().getFullYear()} LearnYah. Made for curious minds.
        </div>
      </footer>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        .gradient-text {
          background: linear-gradient(
            100deg,
            #c4b5fd 0%,
            #e879f9 45%,
            #67e8f9 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        ::selection {
          background: #a78bfa;
          color: #090812;
        }
      `}</style>
    </main>
  );
}

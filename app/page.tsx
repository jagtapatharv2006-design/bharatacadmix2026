"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const { User, handleSignInWithGoogle } = useAuth();
  const router = useRouter();

  const handleStart = async () => {
    if (User) {
      router.push("/simulations");
    } else {
      await handleSignInWithGoogle();
      router.push("/simulations");
    }
  };

  const levels = [
    {
      num: 1,
      title: "The Cave Mystery",
      concept: "Wave-Particle Duality",
      desc: "Scatter particles to reveal a hidden quantum bear — discover how observation shapes reality.",
      icon: "search",
      color: "#00d4ff",
    },
    {
      num: 2,
      title: "Wave Packet Formation",
      concept: "Superposition",
      desc: "Add harmonics to localize the bear — watch how overlapping waves create a particle.",
      icon: "waves",
      color: "#00ff9d",
    },
    {
      num: 3,
      title: "Resonance Chamber",
      concept: "Quantized Energy",
      desc: "Trap the bear in a quantum box and witness how only specific energies are allowed.",
      icon: "science",
      color: "#00d4ff",
    },
    {
      num: 4,
      title: "The Uncertainty Trade-off",
      concept: "Heisenberg Uncertainty",
      desc: "Balance position and momentum — the more you know one, the less you know the other.",
      icon: "balance",
      color: "#c084fc",
    },
    {
      num: 5,
      title: "The Forbidden Barrier",
      concept: "Quantum Tunneling",
      desc: "Ghost the bear through solid walls — thinner barriers and higher energy improve your odds.",
      icon: "flash_on",
      color: "#ff6b35",
    },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* ═══════════ HERO ═══════════ */}
      <section className="min-h-[90vh] w-full flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Animated background grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,251,251,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,251,251,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Glow orb */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(0,251,251,0.4) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 text-center max-w-4xl">
          <span className="text-primary-fixed text-sm font-bold tracking-[0.4em] uppercase mb-6 block opacity-70">
            <h1>QUANTUM SAFARI</h1>
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-primary leading-[0.95] mb-8 tracking-tighter">
            Learn Quantum.<br />
            <span style={{ color: "#00fbfb" }}>Play Quantum.</span>
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant/80 font-light max-w-2xl mx-auto mb-4 leading-relaxed">
            5 interactive levels. Real physics. One brave bear.
          </p>
          <p className="text-sm text-on-surface-variant/50 font-light max-w-xl mx-auto mb-12 leading-relaxed italic">
            Explore wave-particle duality, superposition, uncertainty, tunneling, and more — through hands-on simulations powered by p5.js, guided by MR.ψ, your AI quantum companion.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleStart}
              className="bg-primary-fixed text-on-primary-fixed px-14 py-5 text-lg font-bold tracking-[0.25em] uppercase hover:opacity-90 active:scale-95 transition-all rounded-lg shadow-[0_0_40px_-10px_rgba(0,251,251,0.35)]"
            >
              Start Playing
            </button>
            <a
              href="#levels"
              className="px-10 py-5 text-lg font-bold tracking-widest uppercase text-primary-fixed/70 border border-primary-fixed/20 rounded-lg hover:border-primary-fixed/50 hover:text-primary-fixed transition-all"
            >
              View Levels
            </a>
          </div>

          {/* Quick stats */}
          <div className="flex justify-center gap-12 mt-16 flex-wrap">
            {[
              { value: "5", label: "Levels" },
              { value: "7", label: "Concepts" },
              { value: "∞", label: "Possibilities" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black text-primary-fixed font-mono">{s.value}</div>
                <div className="text-xs text-on-surface-variant/50 tracking-[0.2em] uppercase mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ WHAT IS QUANTUM SAFARI ═══════════ */}
      <section className="w-full bg-surface-container-low py-28 px-6 flex flex-col items-center">
        <div className="max-w-4xl w-full text-center mb-16">
          <span className="text-primary-fixed text-sm font-bold tracking-[0.3em] uppercase mb-4 block">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            More Than a Simulation
          </h2>
          <p className="text-on-surface-variant/70 text-base max-w-2xl mx-auto leading-relaxed">
            Unlike static simulations, Quantum Safari turns physics into playable puzzles.{" "}
            Each level has objectives, interactive controls, concept panels, and an AI guide — making quantum mechanics intuitive and fun.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 w-full max-w-5xl">
          <div className="bg-surface-container p-10 flex flex-col items-start gap-5 hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-primary-fixed text-4xl">sports_esports</span>
            <h3 className="text-xl font-bold text-primary">Play</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Each concept is a game level with objectives, scoring, and visual rewards — not a static diagram.
            </p>
          </div>
          <div className="bg-surface-container p-10 flex flex-col items-start gap-5 hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-primary-fixed text-4xl">school</span>
            <h3 className="text-xl font-bold text-primary">Learn</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Concept, Formula, and Hint panels are built into every level. Plus an interactive Notes mindmap for deeper study.
            </p>
          </div>
          <div className="bg-surface-container p-10 flex flex-col items-start gap-5 hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-primary-fixed text-4xl">smart_toy</span>
            <h3 className="text-xl font-bold text-primary">Ask MR.ψ</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Your AI quantum guide answers questions in real-time, adapts to each level, and works offline with built-in knowledge.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ THE 5 LEVELS ═══════════ */}
      <section id="levels" className="w-full py-28 px-6 flex flex-col items-center scroll-mt-20">
        <div className="max-w-4xl w-full text-center mb-16">
          <span className="text-primary-fixed text-sm font-bold tracking-[0.3em] uppercase mb-4 block">
            The Journey
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">5 Levels. 5 Quantum Laws.</h2>
          <p className="text-on-surface-variant/70 text-base max-w-xl mx-auto">
            Each level introduces a fundamental quantum concept. Complete them all to master the quantum world.
          </p>
        </div>

        <div className="w-full max-w-5xl space-y-4">
          {levels.map((level) => (
            <div
              key={level.num}
              className="glass-panel rounded-xl border border-outline-variant/10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 hover:border-primary-fixed/30 transition-all group"
            >
              {/* Level number */}
              <div
                className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center text-xl font-black font-mono"
                style={{
                  background: `${level.color}15`,
                  border: `1px solid ${level.color}30`,
                  color: level.color,
                }}
              >
                {level.num}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-primary truncate">{level.title}</h3>
                  <span
                    className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full shrink-0"
                    style={{
                      background: `${level.color}12`,
                      color: level.color,
                      border: `1px solid ${level.color}25`,
                    }}
                  >
                    {level.concept}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant/60 leading-relaxed">{level.desc}</p>
              </div>

              {/* Icon */}
              <span
                className="material-symbols-outlined text-3xl opacity-30 group-hover:opacity-70 transition-opacity shrink-0"
                style={{ color: level.color }}
              >
                {level.icon}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ PHYSICS CONCEPTS GRID ═══════════ */}
      <section className="w-full bg-surface-container-low py-28 px-6 flex flex-col items-center">
        <div className="max-w-4xl w-full text-center mb-16">
          <span className="text-primary-fixed text-sm font-bold tracking-[0.3em] uppercase mb-4 block">
            What You&apos;ll Learn
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Real Quantum Physics</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl w-full">
          {[
            { formula: "λ = h/p", name: "De Broglie Wavelength", desc: "Every particle is a wave" },
            { formula: "Δx·Δp ≥ ℏ/2", name: "Uncertainty Principle", desc: "Nature's precision limit" },
            { formula: "T ≈ e⁻²ᵏᴸ", name: "Tunneling Coefficient", desc: "Passing through the impossible" },
            { formula: "Eₙ = n²π²ℏ²/2mL²", name: "Energy Quantization", desc: "Only staircase, no ramp" },
          ].map((c) => (
            <div
              key={c.name}
              className="glass-panel rounded-xl border border-outline-variant/10 p-6 text-center hover:border-primary-fixed/20 transition-all"
            >
              <div className="text-primary-fixed font-mono text-lg font-bold mb-3">{c.formula}</div>
              <div className="text-sm font-bold text-primary mb-1">{c.name}</div>
              <div className="text-xs text-on-surface-variant/50">{c.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ MR.ψ CHATBOT SECTION ═══════════ */}
      <section className="w-full py-28 px-6 flex justify-center">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-primary-fixed text-sm font-bold tracking-[0.3em] uppercase mb-4 block">
              AI-Powered Guide
            </span>
            <h2 className="text-4xl font-bold text-primary mb-6">
              Meet MR.ψ
            </h2>
            <p className="text-lg text-on-surface-variant/70 mb-8 font-light leading-relaxed">
              Your personal quantum physics tutor, powered by Gemini AI. Ask questions, get hints, explore formulas — all within each level. When offline, a built-in knowledge base keeps you learning.
            </p>
            <ul className="space-y-4">
              {[
                "Level-aware — knows exactly which concept you're studying",
                "Explains complex physics with analogies and real-world examples",
                "Offline fallback with 50+ curated answers per level",
                "Stays scientifically accurate — no oversimplification",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-primary/80">
                  <span className="w-1.5 h-1.5 bg-primary-fixed rounded-full mt-2 shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Mock chat window */}
          <div className="glass-panel rounded-xl border border-outline-variant/10 overflow-hidden shadow-2xl">
            <div
              className="px-4 py-3 flex items-center gap-2"
              style={{
                background: "linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(176,96,255,0.06) 100%)",
                borderBottom: "1px solid rgba(0,212,255,0.15)",
              }}
            >
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff" }}
              >
                ψ
              </span>
              <span className="text-white text-sm font-bold font-mono">MR.ψ</span>
              <span className="text-xs text-on-surface-variant/40 font-mono ml-auto">LVL 5</span>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <div className="flex justify-start">
                <div className="max-w-[85%] px-3 py-2 rounded-xl bg-surface-container-high text-on-surface-variant/80">
                  Hey! 🐻 In Level 5 we&apos;re exploring quantum tunneling. The bear can ghost through barriers!
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[85%] px-3 py-2 rounded-xl" style={{ background: "rgba(0,212,255,0.12)", color: "#c0e8ff" }}>
                  How does tunneling probability work?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[85%] px-3 py-2 rounded-xl bg-surface-container-high text-on-surface-variant/80">
                  Great question! T ≈ e⁻²ᵏᴸ — thinner barriers and higher energy make it exponentially more likely. ⚛️
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="w-full py-32 px-6 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0,251,251,0.3) 0%, transparent 60%)",
          }}
        />
        <div className="relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-primary mb-6 tracking-tighter">
            Ready to explore?
          </h2>
          <p className="text-on-surface-variant/60 text-lg mb-12 max-w-lg mx-auto font-light">
            Five levels of quantum physics await. Sign in with Google and begin your journey into the cave.
          </p>
          <button
            onClick={handleStart}
            className="bg-primary-fixed text-on-primary-fixed px-16 py-6 text-xl font-black tracking-[0.3em] uppercase rounded-lg shadow-[0_0_50px_-10px_rgba(0,251,251,0.35)] hover:shadow-[0_0_70px_-10px_rgba(0,251,251,0.5)] transition-all active:scale-95"
          >
            Enter the Cave
          </button>
          {User && (
            <p className="mt-6 text-sm text-on-surface-variant/40">
              Signed in as {User.displayName || User.email} —{" "}
              <Link href="/simulations" className="text-primary-fixed/70 hover:text-primary-fixed transition-colors underline">
                go to simulations →
              </Link>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
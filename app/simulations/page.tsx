"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Simulations() {
  const { User, isloading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isloading && !User) {
      router.push("/");
    }
  }, [User, isloading, router]);

  if (isloading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-primary-fixed text-xl animate-pulse tracking-[0.3em] uppercase">
          Initializing Interface...
        </div>
      </div>
    );
  }

  if (!User) return null;

  const levels = [
    {
      id: 1,
      icon: "search",
      tag: "Lvl 1",
      title: "The Cave Mystery",
      description: "Detect the shape of a hidden quantum bear using particle scattering and understand wave-particle duality.",
      physics: "Wave-Particle Duality",
      color: "#00d4ff",
    },
    {
      id: 2,
      icon: "waves",
      tag: "Lvl 2",
      title: "Wave Packet Formation",
      description: "Build a wave packet by adding harmonics and observe particle localization through superposition.",
      physics: "Superposition of Waves",
      color: "#00ff9d",
    },
    {
      id: 3,
      icon: "science",
      tag: "Lvl 3",
      title: "Resonance Chamber",
      description: "Observe standing waves and quantized energy levels inside an infinite potential well.",
      physics: "Particle in a Box",
      color: "#00d4ff",
    },
    {
      id: 4,
      icon: "balance",
      tag: "Lvl 4",
      title: "Heisenberg Uncertainty",
      description: "Balance the uncertainty budget — explore the precision trade-off between position and momentum.",
      physics: "Uncertainty Principle",
      color: "#c084fc",
    },
    {
      id: 5,
      icon: "flash_on",
      tag: "Lvl 5",
      title: "The Forbidden Barrier",
      description: "Ghost through solid potential walls. Thinner barriers and higher energy increase tunneling probability.",
      physics: "Quantum Tunneling",
      color: "#ff6b35",
    },
  ];

  return (
    <div className="flex flex-col items-center px-6 py-12">
      <div className="w-full max-w-5xl">
        <header className="mb-12 border-b border-surface-container-high pb-6">
          <span className="text-primary-fixed text-sm font-bold tracking-[0.3em] uppercase mb-2 block">
            Access Granted: {User.displayName || User.email}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tight">
            Choose your Experiment
          </h1>
          <p className="text-on-surface-variant mt-4 max-w-2xl text-lg font-light leading-relaxed">
            Select a quantum scenario to observe or manipulate. Each level explores a different fundamental law of quantum physics. Telemetry data will be recorded directly to your operator profile.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level) => (
            <Link key={level.id} href={`/simulations/level${level.id}`} className="block w-full">
              <div className="glass-panel p-8 rounded-xl border border-outline-variant/20 hover:border-primary-fixed/50 transition-all hover:-translate-y-1 cursor-pointer group h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <span
                    className="material-symbols-outlined text-3xl group-hover:drop-shadow-[0_0_8px_rgba(0,251,251,0.5)] transition-all"
                    style={{ color: level.color }}
                  >
                    {level.icon}
                  </span>
                  <span className="text-xs uppercase text-on-surface-variant tracking-widest">{level.tag}</span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">{level.title}</h3>
                <p className="text-sm text-on-surface-variant mb-2 leading-relaxed flex-grow">
                  {level.description}
                </p>
                <p className="text-xs font-mono mb-4" style={{ color: level.color, opacity: 0.7 }}>
                  ⟨ {level.physics} ⟩
                </p>
                <div className="mt-auto">
                  <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                    <div className="h-full w-[100%]" style={{ backgroundColor: level.color }}></div>
                  </div>
                  <span className="text-xs text-on-surface-variant mt-2 block text-right font-mono">100% Unlocked</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

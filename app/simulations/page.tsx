"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Simulations() {
  const { User, isloading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isloading && !User) {
      router.push("/");
    }
  }, [User, isloading, router]);

  // Enhanced Sci-Fi Loading State
  if (isloading) {
    return (
      <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center font-mono text-[#00d4ff]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="w-16 h-16 border-t-2 border-r-2 border-[#00d4ff] rounded-full mb-6 shadow-[0_0_15px_rgba(0,212,255,0.5)]"
        />
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="tracking-[0.3em] uppercase text-sm font-bold"
        >
          Initializing Interface...
        </motion.div>
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

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } },
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col items-center px-4 sm:px-6 py-24 relative overflow-hidden selection:bg-[#00d4ff]/30">
      
      {/* ═══════════ BACKGROUND EFFECTS ═══════════ */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Animated Grid */}
        <motion.div
          animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Ambient Glow */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#00d4ff]/10 to-transparent blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="w-full max-w-6xl relative z-10">
        
        {/* ═══════════ HEADER ═══════════ */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 border-b border-white/10 pb-8 flex flex-col items-center md:items-start text-center md:text-left"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 bg-[#00ff9d] rounded-full animate-pulse shadow-[0_0_10px_#00ff9d]" />
            <span className="text-[#00ff9d] text-sm font-bold tracking-[0.3em] uppercase opacity-90 font-mono">
              Access Granted: {User.displayName || User.email}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
            Choose your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#c084fc]">Experiment</span>
          </h1>
          
          <p className="text-gray-400 max-w-3xl text-lg font-light leading-relaxed">
            Select a quantum scenario to observe or manipulate. Each level explores a fundamental law of physics. Telemetry data will be recorded directly to your operator profile.
          </p>
        </motion.header>

        {/* ═══════════ GRID ═══════════ */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {levels.map((level) => (
            <motion.div key={level.id} variants={itemVariants} className="h-full">
              <Link href={`/simulations/level${level.id}`} className="block h-full outline-none">
                <motion.div 
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-[#0a0a0f]/80 backdrop-blur-xl p-8 rounded-2xl border border-white/5 hover:border-white/20 transition-all cursor-pointer group h-full flex flex-col relative overflow-hidden"
                  style={{ boxShadow: `0 0 0 rgba(0,0,0,0)` }}
                  onHoverStart={(e) => { e.target.style.boxShadow = `0 10px 40px -10px ${level.color}40`; }}
                  onHoverEnd={(e) => { e.target.style.boxShadow = `0 0 0 rgba(0,0,0,0)`; }}
                >
                  {/* Subtle Background Glow on Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle at top right, ${level.color}, transparent 70%)` }}
                  />

                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-[#111116] border border-white/10 flex items-center justify-center shadow-lg group-hover:border-white/30 transition-colors">
                      <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform" style={{ color: level.color }}>
                        {level.icon}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/10 bg-white/5 text-gray-400 group-hover:text-white transition-colors">
                      {level.tag}
                    </span>
                  </div>
                  
                  <div className="relative z-10 flex-grow flex flex-col">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                      {level.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-6 leading-relaxed flex-grow group-hover:text-gray-300 transition-colors">
                      {level.description}
                    </p>
                    
                    <div className="mt-auto">
                      <p className="text-xs font-mono mb-4 flex items-center gap-2" style={{ color: level.color, opacity: 0.8 }}>
                        <span className="opacity-50">⟨</span> {level.physics} <span className="opacity-50">⟩</span>
                      </p>
                      
                      {/* Sci-Fi Progress Bar */}
                      <div className="w-full bg-[#111116] border border-white/5 h-1.5 rounded-full overflow-hidden relative">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full relative" 
                          style={{ backgroundColor: level.color }}
                        >
                          <div className="absolute inset-0 w-full h-full bg-white/20 animate-pulse" />
                        </motion.div>
                      </div>
                      <span className="text-[10px] text-gray-500 mt-2 block text-right font-mono tracking-widest uppercase group-hover:text-gray-400 transition-colors">
                        100% Unlocked
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
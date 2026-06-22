"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function LeaderboardPage() {
  const { User, isloading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isloading && !User) {
      router.push("/");
    }
  }, [User, isloading, router]);

  // Enhanced Loading State
  if (isloading || !User) {
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
          Loading telemetry...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] w-full relative flex flex-col items-center pt-24 pb-12 overflow-hidden selection:bg-[#00d4ff]/30 text-white">
      
      {/* ═══════════ BACKGROUND EFFECTS ═══════════ */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        {/* Animated grid */}
        <motion.div
          animate={{ backgroundPosition: ["0px 0px", "0px 40px"] }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Ambient glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00d4ff]/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-6xl mx-auto px-6 w-full relative z-10"
      >
        {/* ═══════════ HEADER ═══════════ */}
        <header className="mb-16 text-center flex flex-col items-center">
          <span className="text-[#00ff9d] text-sm font-bold tracking-[0.4em] uppercase mb-4 flex items-center gap-2 opacity-80">
            <span className="w-2 h-2 bg-[#00ff9d] rounded-full animate-pulse" />
            Live Server Data
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white drop-shadow-xl">
            GLOBAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#c084fc]">RANKINGS</span>
          </h1>
          <p className="text-gray-400 max-w-2xl text-lg font-light leading-relaxed">
            Track operator telemetry, quantum puzzle efficiency, and simulation completion times across the network.
          </p>
        </header>

        {/* ═══════════ OFFLINE PLACEHOLDER ═══════════ */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden group"
        >
          {/* Scanning line animation */}
          <motion.div 
            animate={{ top: ["-10%", "110%"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#c084fc]/50 to-transparent z-20 shadow-[0_0_10px_#c084fc]"
          />

          <div className="bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 p-12 md:p-20 flex flex-col items-center justify-center min-h-[400px] relative z-10 shadow-2xl">
            {/* Hexagonal Lock Icon Container */}
            <div className="relative mb-8 flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                className="absolute inset-0 border border-white/5 rounded-full w-32 h-32 -m-8"
              />
              <div className="w-16 h-16 rounded-2xl bg-[#111116] border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                <span className="material-symbols-outlined text-[#c084fc] text-3xl opacity-80">
                  lock
                </span>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">System Locked</h3>
            <p className="text-[#c084fc] text-sm font-bold tracking-[0.3em] uppercase mb-6 opacity-80 bg-[#c084fc]/10 px-4 py-1.5 rounded-full border border-[#c084fc]/20">
              Rankings Temporarily Offline
            </p>
            <p className="text-gray-500 text-center max-w-md font-mono text-sm leading-relaxed">
              [ ERR_CONNECTION_REFUSED ]<br/>
              The telemetry database is currently undergoing quantum decoherence calibration. Please check back later.
            </p>

            {/* Simulated terminal lines */}
            <div className="absolute bottom-6 left-6 flex flex-col gap-1 opacity-20">
              <div className="w-24 h-1 bg-[#00d4ff] rounded-full" />
              <div className="w-16 h-1 bg-[#00d4ff] rounded-full" />
            </div>
            <div className="absolute top-6 right-6 font-mono text-[10px] text-gray-600 tracking-widest uppercase">
              NODE // 084.22
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Profile() {
  const { User, isloading, handleLogout } = useAuth();
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
          Accessing Operator Data...
        </motion.div>
      </div>
    );
  }

  if (!User) return null;

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } },
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col items-center px-4 sm:px-6 py-24 relative overflow-hidden selection:bg-[#00d4ff]/30">
      
      {/* ═══════════ BACKGROUND EFFECTS ═══════════ */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-[#00d4ff]/10 via-[#c084fc]/5 to-transparent blur-[150px] rounded-full pointer-events-none" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="bg-[#0a0a0f]/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,212,255,0.05)] mt-8">
          
          {/* ═══════════ PROFILE HEADER ═══════════ */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 pb-10 border-b border-white/10 relative">
            
            {/* Avatar with animated rings */}
            <div className="relative group cursor-default">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                className="absolute -inset-2 rounded-full border border-dashed border-[#00d4ff]/30 group-hover:border-[#00d4ff]/60 transition-colors"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                className="absolute -inset-4 rounded-full border border-[#c084fc]/20"
              />
              <div className="relative w-28 h-28 rounded-full border-2 border-[#00d4ff] overflow-hidden shadow-[0_0_30px_rgba(0,212,255,0.3)] bg-[#111]">
                <img
                  src={User.photoURL || `https://ui-avatars.com/api/?name=${User.displayName || 'Operator'}&background=00fbfb&color=002020`}
                  alt="Profile Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <span className="w-2 h-2 bg-[#00ff9d] rounded-full animate-pulse shadow-[0_0_10px_#00ff9d]" />
                <span className="text-[#00ff9d] text-xs font-bold tracking-[0.3em] uppercase font-mono">System Connected</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                {User.displayName || "Operator"}
              </h1>
              <span className="text-gray-400 font-mono tracking-widest text-sm uppercase bg-white/5 px-4 py-1.5 rounded-full border border-white/10 inline-block">
                {User.email}
              </span>
            </div>
          </div>

          {/* ═══════════ STATS GRID ═══════════ */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12"
          >
            {[
              { label: "Status", value: "Active Observer", color: "#00d4ff" },
              { label: "Clearance Level", value: "Class C", color: "#c084fc" },
              { label: "Experiments Completed", value: "14", color: "#00ff9d", isMono: true },
              { label: "Anomalies Found", value: "2", color: "#ff6b35", isMono: true },
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.05)" }}
                className="bg-[#111116] p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all group relative overflow-hidden"
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{ background: `radial-gradient(circle at top right, ${stat.color}, transparent 70%)` }}
                />
                <span className="block text-xs uppercase text-gray-500 tracking-[0.2em] mb-2 font-mono relative z-10">
                  {stat.label}
                </span>
                <span 
                  className={`text-2xl font-bold relative z-10 ${stat.isMono ? 'font-mono' : ''}`}
                  style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}40` }}
                >
                  {stat.value}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* ═══════════ ACTIONS ═══════════ */}
          <div className="flex justify-end pt-6 border-t border-white/10 relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-10 py-4 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all rounded-full font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Disconnect
            </motion.button>
          </div>
          
        </div>
      </motion.div>
    </div>
  );
}
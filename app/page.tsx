"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

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
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop",
    },
    {
      num: 2,
      title: "Wave Packet Formation",
      concept: "Superposition",
      desc: "Add harmonics to localize the bear — watch how overlapping waves create a particle.",
      icon: "waves",
      color: "#00ff9d",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
    },
    {
      num: 3,
      title: "Resonance Chamber",
      concept: "Quantized Energy",
      desc: "Trap the bear in a quantum box and witness how only specific energies are allowed.",
      icon: "science",
      color: "#00d4ff",
      image: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800&auto=format&fit=crop",
    },
    {
      num: 4,
      title: "The Uncertainty Trade-off",
      concept: "Heisenberg Uncertainty",
      desc: "Balance position and momentum — the more you know one, the less you know the other.",
      icon: "balance",
      color: "#c084fc",
      image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop",
    },
    {
      num: 5,
      title: "The Forbidden Barrier",
      concept: "Quantum Tunneling",
      desc: "Ghost the bear through solid walls — thinner barriers and higher energy improve your odds.",
      icon: "flash_on",
      color: "#ff6b35",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    },
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className="flex flex-col items-center bg-[#050505] min-h-screen text-white selection:bg-[#00d4ff]/30">
      
      {/* ═══════════ HERO ═══════════ */}
      <section className="min-h-[90vh] w-full flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Unsplash Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-10 mix-blend-screen"
            alt="Quantum Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505]"></div>
        </div>

        {/* Animated background grid */}
        <motion.div
          animate={{ backgroundPosition: ["0px 0px", "60px 60px"] }}
          transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
          className="absolute inset-0 opacity-[0.04] z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,251,251,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,251,251,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Slowly Rotating Glow orb */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20 blur-[120px] pointer-events-none z-0"
          style={{ background: "radial-gradient(circle, rgba(0,251,251,0.5) 0%, rgba(192,132,252,0.2) 40%, transparent 70%)" }}
        />

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center max-w-4xl"
        >
          <span className="text-[#00d4ff] flex items-center justify-center gap-3 text-sm font-bold tracking-[0.4em] uppercase mb-6 opacity-80">
            {/* Remix-style abstract logo SVG */}
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 animate-pulse">
               <path d="M12 2L22 7V17L12 22L2 17V7L12 2ZM12 4.3L4 8.3V15.7L12 19.7L20 15.7V8.3L12 4.3ZM12 10.5C12.8284 10.5 13.5 11.1716 13.5 12C13.5 12.8284 12.8284 13.5 12 13.5C11.1716 13.5 10.5 12.8284 10.5 12C10.5 11.1716 11.1716 10.5 12 10.5Z" />
            </svg>
            <h1>QUANTUM SAFARI</h1>
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] mb-8 tracking-tighter drop-shadow-2xl">
            Learn Quantum.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#00ff9d]">Play Quantum.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-light max-w-2xl mx-auto mb-4 leading-relaxed">
            5 interactive levels. Real physics. One brave bear.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-10">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 30px rgba(0, 212, 255, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="bg-[#00d4ff] text-black px-12 py-4 text-lg font-black tracking-[0.2em] uppercase transition-all rounded-full"
            >
              Start Playing
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 212, 255, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              href="#levels"
              className="px-10 py-4 text-lg font-bold tracking-widest uppercase text-[#00d4ff] border border-[#00d4ff]/30 rounded-full transition-all backdrop-blur-sm"
            >
              View Levels
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* ═══════════ WHAT IS QUANTUM SAFARI ═══════════ */}
      <section className="w-full bg-[#0a0a0a] py-28 px-6 flex flex-col items-center relative">
        <div className="max-w-4xl w-full text-center mb-16">
          <span className="text-[#00d4ff] text-sm font-bold tracking-[0.3em] uppercase mb-4 block">
            How It Works
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            More Than a Simulation
          </h2>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl perspective-1000"
        >
          {/* Feature Cards with 3D Rotation Effect */}
          {[
            { icon: "sports_esports", title: "Play", desc: "Each concept is a game level with objectives, scoring, and visual rewards." },
            { icon: "school", title: "Learn", desc: "Concept, Formula, and Hint panels are built into every level with interactive Notes." },
            { icon: "smart_toy", title: "Ask MR.ψ", desc: "Your AI guide answers questions in real-time and adapts to each level." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ rotateY: 10, rotateX: -10, scale: 1.02, zIndex: 10 }}
              className="bg-white/5 border border-white/10 p-10 rounded-2xl flex flex-col items-start gap-5 backdrop-blur-md shadow-xl transition-all duration-300"
              style={{ transformStyle: "preserve-3d" }}
            >
              <span className="material-symbols-outlined text-[#00d4ff] text-5xl" style={{ transform: "translateZ(30px)" }}>{feature.icon}</span>
              <h3 className="text-2xl font-bold text-white" style={{ transform: "translateZ(20px)" }}>{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed" style={{ transform: "translateZ(10px)" }}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════ THE 5 LEVELS ═══════════ */}
      <section id="levels" className="w-full py-28 px-6 flex flex-col items-center scroll-mt-20">
        <div className="max-w-4xl w-full text-center mb-16">
          <span className="text-[#c084fc] text-sm font-bold tracking-[0.3em] uppercase mb-4 block">
            The Journey
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">5 Levels. 5 Quantum Laws.</h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="w-full max-w-5xl space-y-6"
        >
          {levels.map((level) => (
            <motion.div
              key={level.num}
              variants={itemVariants}
              whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.05)" }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 backdrop-blur-sm transition-all"
            >
              {/* Animated Background Image on Hover */}
              <div 
                className="absolute inset-0 z-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-cover bg-center"
                style={{ backgroundImage: `url(${level.image})` }}
              />

              <div className="relative z-10 w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center text-2xl font-black font-mono shadow-lg"
                style={{ background: `linear-gradient(135deg, ${level.color}20, transparent)`, border: `1px solid ${level.color}50`, color: level.color }}
              >
                {level.num}
              </div>

              <div className="relative z-10 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-white">{level.title}</h3>
                  <span className="text-[11px] font-mono tracking-wider px-3 py-1 rounded-full shrink-0 uppercase"
                    style={{ background: `${level.color}15`, color: level.color, border: `1px solid ${level.color}30` }}
                  >
                    {level.concept}
                  </span>
                </div>
                <p className="text-base text-gray-400 leading-relaxed max-w-3xl">{level.desc}</p>
              </div>

              <motion.span 
                whileHover={{ rotate: 15, scale: 1.2 }}
                className="relative z-10 material-symbols-outlined text-4xl opacity-50 group-hover:opacity-100 transition-all shrink-0 cursor-pointer"
                style={{ color: level.color }}
              >
                {level.icon}
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════ MR.ψ CHATBOT SECTION ═══════════ */}
      <section className="w-full py-28 px-6 flex justify-center bg-gradient-to-b from-[#050505] to-[#0a0a1a] border-t border-white/5">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[#00ff9d] text-sm font-bold tracking-[0.3em] uppercase mb-4 block">
              AI-Powered Guide
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Meet MR.ψ
            </h2>
            <p className="text-lg text-gray-300 mb-8 font-light leading-relaxed">
              Your personal quantum physics tutor, powered by Gemini AI. Ask questions, get hints, explore formulas — all within each level.
            </p>
            <ul className="space-y-4">
              {[
                "Level-aware — knows exactly which concept you're studying",
                "Explains complex physics with analogies",
                "Offline fallback with 50+ curated answers",
              ].map((item, idx) => (
                <motion.li 
                  key={idx} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 text-gray-200"
                >
                  <div className="w-8 h-8 rounded-full bg-[#00ff9d]/10 flex items-center justify-center shrink-0 border border-[#00ff9d]/30">
                    <span className="material-symbols-outlined text-[#00ff9d] text-sm">check</span>
                  </div>
                  <span className="text-base">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Floating Chat Window Animation */}
          <motion.div 
            animate={{ y: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,212,255,0.1)] relative"
          >
            {/* Glass reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
            
            <div className="px-5 py-4 flex items-center gap-3 bg-gradient-to-r from-[#00d4ff]/10 to-[#c084fc]/10 border-b border-white/10">
              <span className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold bg-[#00d4ff]/20 border border-[#00d4ff]/50 text-[#00d4ff]">
                ψ
              </span>
              <div>
                <div className="text-white text-sm font-bold font-mono tracking-wider">MR.ψ</div>
                <div className="text-xs text-[#00ff9d] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse"></span> Online
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4 text-sm font-medium">
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex justify-start">
                <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-sm bg-[#222] text-gray-200 shadow-md">
                  Hey! 🐻 In Level 5 we&apos;re exploring quantum tunneling. The bear can ghost through barriers!
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex justify-end">
                <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tr-sm bg-gradient-to-r from-[#00d4ff]/20 to-[#00d4ff]/10 text-[#c0e8ff] border border-[#00d4ff]/20 shadow-md">
                  How does tunneling probability work?
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }} className="flex justify-start">
                <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-sm bg-[#222] text-gray-200 shadow-md">
                  Great question! T ≈ e⁻²ᵏᴸ — thinner barriers and higher energy make it exponentially more likely. ⚛️
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="w-full py-32 px-6 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[50vh]">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(0,251,251,0.4) 0%, transparent 60%)" }}
        />
        
        <div className="relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
            Ready to explore?
          </h2>
          <p className="text-gray-400 text-xl mb-12 max-w-lg mx-auto font-light">
            Sign in with Google and begin your journey into the cave.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 40px rgba(0, 212, 255, 0.6)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="bg-white text-black px-16 py-6 text-xl font-black tracking-[0.3em] uppercase rounded-full transition-all"
          >
            Enter the Cave
          </motion.button>
          
          {User && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-sm text-gray-500 font-mono">
              Signed in as <span className="text-white">{User.displayName || User.email}</span>
              <br/>
              <Link href="/simulations" className="text-[#00d4ff] hover:text-white transition-colors mt-2 inline-block border-b border-[#00d4ff]/30">
                Bypass to simulations →
              </Link>
            </motion.p>
          )}
        </div>
      </section>
    </div>
  );
} 

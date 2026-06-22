"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import LoginButton from "./loginbutton";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add a subtle shadow/blur enhancement when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/simulations", label: "Simulations" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans ${
          scrolled
            ? "bg-[#050508]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3"
            : "bg-[#050508]/40 backdrop-blur-md border-b border-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-8 w-full">
          
          {/* ═══════════ LOGO ═══════════ */}
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
            <motion.div 
              whileHover={{ rotate: 90 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#00d4ff]/40 flex items-center justify-center bg-[#00d4ff]/10 shadow-[0_0_15px_rgba(0,212,255,0.2)] group-hover:shadow-[0_0_25px_rgba(0,212,255,0.5)] transition-all"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 sm:w-5 sm:h-5 text-[#00d4ff]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V3m0 18c-3.314 0-6-2.686-6-6V9m6 12c3.314 0 6-2.686 6-6V9M6 9h12" />
              </svg>
            </motion.div>
            <div className="text-sm sm:text-lg font-black tracking-[0.25em] text-white uppercase group-hover:text-[#00d4ff] transition-colors">
              QUANTUM <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#c084fc] hidden sm:inline-block">SAFARI</span>
            </div>
          </Link>

          {/* ═══════════ DESKTOP NAVIGATION ═══════════ */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative py-2 px-1 group flex flex-col items-center"
                >
                  <span
                    className={`text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-300 ${
                      isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                    }`}
                  >
                    {link.label}
                  </span>
                  
                  {/* Sliding glowing indicator */}
                  {isActive ? (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00d4ff] rounded-full shadow-[0_0_10px_#00d4ff]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  ) : (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-white/30 rounded-full transition-all duration-300 group-hover:w-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ═══════════ ACTIONS (SETTINGS, LOGIN, MOBILE TOGGLE) ═══════════ */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            <Link
              href="/settings"
              className="relative p-2 text-gray-400 hover:text-[#00d4ff] transition-all hidden md:flex items-center justify-center group"
            >
              <span className="material-symbols-outlined text-xl group-hover:rotate-90 transition-transform duration-500">
                settings
              </span>
              {pathname === "/settings" && (
                <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00d4ff] rounded-full shadow-[0_0_10px_#00d4ff]" />
              )}
            </Link>

            <div className="scale-90 sm:scale-100">
              <LoginButton />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-white p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#00d4ff]/50 transition-all flex items-center justify-center"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-xl">
                {mobileOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
        
        {/* Decorative scanning line at the bottom of the header */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </header>

      {/* ═══════════ MOBILE SLIDE-DOWN MENU ═══════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#050508]/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            
            <motion.div
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="fixed top-0 left-0 right-0 z-40 pt-[80px] pb-6 bg-[#0a0a0f]/95 backdrop-blur-2xl border-b border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] md:hidden flex flex-col"
            >
              <div className="flex flex-col px-6">
                {[...navLinks, { href: "/settings", label: "Settings" }].map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      key={link.href}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between py-4 border-b border-white/5 uppercase text-xs tracking-[0.2em] font-bold ${
                          isActive 
                            ? "text-[#00d4ff]" 
                            : "text-gray-400 hover:text-white"
                        } transition-colors`}
                      >
                        {link.label}
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] shadow-[0_0_8px_#00d4ff] animate-pulse" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
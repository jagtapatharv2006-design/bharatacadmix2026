"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LoginButton from "./loginbutton";

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getLinkClass = (path: string) => {
    return pathname === path
      ? "text-[#00fbfb] border-b-2 border-[#00fbfb] pb-1 font-bold"
      : "text-[#ffffff] hover:text-[#00fbfb] transition-colors";
  };

  const getMobileLinkClass = (path: string) => {
    return pathname === path
      ? "text-[#00fbfb] font-bold"
      : "text-[#ffffff] hover:text-[#00fbfb] transition-colors";
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/simulations", label: "Simulations" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/profile", label: "Profile" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <>
      <nav className="bg-[#131313] dark:bg-[#0e0e0e] font-['Inter'] antialiased text-sm tracking-widest flex justify-between items-center w-full px-4 sm:px-8 py-4 max-w-none fixed top-0 z-50 border-b border-[#1f1f1f]">
        <div className="flex items-center gap-4 sm:gap-8">
          <div className="text-lg sm:text-xl font-black tracking-widest text-[#00fbfb] uppercase">
            QUANTUM SAFARI
          </div>
          <div className="hidden md:flex gap-8 uppercase">
            <Link href="/" className={getLinkClass("/")}>
              Home
            </Link>
            <Link href="/simulations" className={getLinkClass("/simulations")}>
              Simulations
            </Link>
            <Link href="/leaderboard" className={getLinkClass("/leaderboard")}>
              Leaderboard
            </Link>
            <Link href="/profile" className={getLinkClass("/profile")}>
              Profile
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/settings"
            className="p-2 text-[#b9cac9] hover:text-[#00fbfb] transition-all hidden md:block"
          >
            <span className="material-symbols-outlined">settings</span>
          </Link>
          <div>
            <LoginButton />
          </div>
          <button
            className="md:hidden text-[#ffffff] p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile slide-down menu */}
      <div
        className={`fixed top-[60px] left-0 right-0 z-40 md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          mobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{
          background: "rgba(14, 14, 14, 0.98)",
          borderBottom: mobileOpen ? "1px solid #1f1f1f" : "none",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex flex-col py-4 px-6 gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${getMobileLinkClass(link.href)} uppercase text-sm tracking-widest py-3 border-b border-[#1f1f1f] last:border-b-0`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
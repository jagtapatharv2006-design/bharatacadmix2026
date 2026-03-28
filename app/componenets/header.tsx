"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LoginButton from "./loginbutton";

export default function Header() {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    return pathname === path
      ? "text-[#00fbfb] border-b-2 border-[#00fbfb] pb-1 font-bold"
      : "text-[#ffffff] hover:text-[#00fbfb] transition-colors";
  };

  return (
    <nav className="bg-[#131313] dark:bg-[#0e0e0e] font-['Inter'] antialiased text-sm tracking-widest flex justify-between items-center w-full px-8 py-4 max-w-none fixed top-0 z-50 border-b border-[#1f1f1f]">
      <div className="flex items-center gap-8">
        <div className="text-xl font-black tracking-widest text-[#00fbfb] uppercase">QUANTUM SAFARI</div>
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
      <div className="flex items-center gap-6">
         <Link href="/settings" className="p-2 text-[#b9cac9] hover:text-[#00fbfb] transition-all hidden md:block">
            <span className="material-symbols-outlined">settings</span>
         </Link>
         <div><LoginButton /></div>
         <div className="md:hidden text-[#ffffff]">
           <span className="material-symbols-outlined">menu</span>
         </div>
      </div>
    </nav>
  );
}
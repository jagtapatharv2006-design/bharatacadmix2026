"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LeaderboardPage() {
  const { User, isloading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isloading && !User) {
      router.push("/");
    }
  }, [User, isloading, router]);

  if (isloading || !User) {
    return <div className="min-h-[60vh] flex items-center justify-center font-mono">Loading telemetry...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-8 w-full pt-10">
      <header className="mb-20">
        <h1 className="text-6xl font-black tracking-tighter mb-4 text-primary">LEADERBOARD</h1>
        <p className="text-on-surface-variant max-w-2xl text-lg">
          Global Operator Rankings.
        </p>
      </header>
      <div className="bg-surface-container border border-outline-variant/15 p-8 flex flex-col items-center justify-center h-64 grayscale opacity-60">
        <span className="material-symbols-outlined text-outline text-4xl mb-6">lock</span>
        <p className="text-on-surface-variant text-sm font-bold tracking-widest uppercase">Rankings Temporarily Offline</p>
      </div>
    </div>
  );
}

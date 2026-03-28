"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Profile() {
  const { User, isloading, handleLogout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isloading && !User) {
      router.push("/");
    }
  }, [User, isloading, router]);

  if (isloading) return null;
  if (!User) return null;

  return (
    <div className="flex flex-col items-center px-6 py-12">
      <div className="w-full max-w-4xl glass-panel p-10 rounded-2xl border border-outline-variant/10 shadow-2xl mt-8">
        <div className="flex items-center gap-8 mb-12 pb-10 border-b border-surface-container-highest">
          <img
            src={User.photoURL || `https://ui-avatars.com/api/?name=${User.displayName || 'Operator'}&background=00fbfb&color=002020`}
            alt="Profile Avatar"
            className="w-24 h-24 rounded-full border-2 border-primary-fixed object-cover shadow-[0_0_20px_rgba(0,251,251,0.2)]"
          />
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              {User.displayName || "Operator"}
            </h1>
            <span className="text-on-surface-variant font-mono tracking-widest text-sm uppercase">
              {User.email}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-surface-container-low p-6 rounded-lg border border-transparent hover:border-outline-variant/30 transition-colors">
            <span className="block text-xs uppercase text-on-surface-variant tracking-widest mb-1">Status</span>
            <span className="text-xl font-bold text-primary-fixed drop-shadow-[0_0_8px_rgba(0,251,251,0.3)]">Active Observer</span>
          </div>
          <div className="bg-surface-container-low p-6 rounded-lg border border-transparent hover:border-outline-variant/30 transition-colors">
            <span className="block text-xs uppercase text-on-surface-variant tracking-widest mb-1">Clearance Level</span>
            <span className="text-xl font-bold text-primary">Class C</span>
          </div>
          <div className="bg-surface-container-low p-6 rounded-lg border border-transparent hover:border-outline-variant/30 transition-colors">
            <span className="block text-xs uppercase text-on-surface-variant tracking-widest mb-1">Experiments Completed</span>
            <span className="text-xl font-bold text-primary font-mono">14</span>
          </div>
          <div className="bg-surface-container-low p-6 rounded-lg border border-transparent hover:border-outline-variant/30 transition-colors">
            <span className="block text-xs uppercase text-on-surface-variant tracking-widest mb-1">Anomalies Found</span>
            <span className="text-xl font-bold text-primary font-mono">2</span>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={handleLogout}
            className="px-8 py-3 bg-red-900/40 text-red-200 border border-red-900/50 hover:bg-red-900/60 hover:text-white transition-all rounded-md font-bold uppercase tracking-widest text-xs"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

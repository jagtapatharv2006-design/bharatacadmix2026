"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Settings() {
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
      <div className="w-full max-w-4xl">
        <header className="mb-12 border-b border-surface-container-high pb-6">
          <h1 className="text-4xl font-black text-primary tracking-tight mb-2">
            System Configuration
          </h1>
          <p className="text-on-surface-variant mt-2 text-sm uppercase tracking-widest font-mono">
            Authenticated as: <span className="text-primary-fixed ml-2 drop-shadow-[0_0_8px_rgba(0,251,251,0.3)]">{User.email}</span>
          </p>
        </header>

        <div className="space-y-6">
          <div className="glass-panel p-8 rounded-xl border border-outline-variant/10">
            <h2 className="text-xl font-bold text-primary mb-6">Telemetry Preferences</h2>
            <div className="space-y-5">
              <label className="flex items-center gap-4 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 accent-primary-fixed bg-surface-container-highest border-outline-variant rounded" defaultChecked />
                <span className="text-on-surface-variant group-hover:text-primary transition-colors text-sm font-light">Enable raw data feed overlaid on visualizations</span>
              </label>
              <label className="flex items-center gap-4 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 accent-primary-fixed bg-surface-container-highest border-outline-variant rounded" defaultChecked />
                <span className="text-on-surface-variant group-hover:text-primary transition-colors text-sm font-light">Use localized spacetime coordinates</span>
              </label>
              <label className="flex items-center gap-4 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 accent-primary-fixed bg-surface-container-highest border-outline-variant rounded" />
                <span className="text-on-surface-variant group-hover:text-primary transition-colors text-sm font-light">Auto-transmit anomaly reports back to HQ</span>
              </label>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-xl border border-outline-variant/10">
            <h2 className="text-xl font-bold text-primary mb-6">UI Feedback</h2>
            <div className="space-y-4">
               <div>
                  <span className="block text-sm text-on-surface-variant mb-4">Haptic Intensity (if supported)</span>
                  <input type="range" min="0" max="100" defaultValue="50" className="w-full max-w-sm" />
               </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-xl border border-red-900/30 bg-red-950/20 mt-12">
            <h2 className="text-xl font-bold text-error mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">warning</span> Destructive Actions
            </h2>
            <p className="text-sm text-on-surface-variant mb-6">
              These actions will permanently alter your operator status and cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
               <button
                  onClick={handleLogout}
                  className="px-8 py-3 bg-red-900/40 text-red-200 border border-red-900/50 hover:bg-red-900/60 hover:text-white transition-all rounded-md font-bold uppercase tracking-widest text-xs text-center"
               >
                  Log Out Local Device
               </button>
               <button className="px-8 py-3 bg-transparent text-error border border-error/30 hover:bg-error/10 transition-all rounded-md font-bold uppercase tracking-widest text-xs opacity-50 cursor-not-allowed text-center">
                  Erase Profile Data
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

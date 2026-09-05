"use client";

import { useEffect, useState } from "react";
import { useOsStore } from "@/store/os-store";

export function BootScreen() {
  const markBooted = useOsStore((s) => s.markBooted);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 1700;
    const id = window.setInterval(() => {
      const next = Math.min(100, Math.round(((Date.now() - start) / duration) * 100));
      setProgress(next);
      if (next >= 100) {
        window.clearInterval(id);
        window.setTimeout(() => markBooted(), 280);
      }
    }, 40);
    return () => window.clearInterval(id);
  }, [markBooted]);

  const filled = Math.round(progress / 5);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-black text-zinc-100">
      <p className="text-xs tracking-[0.5em] text-red-500">MAD OS</p>
      <p className="mt-8 text-sm text-zinc-400">Starting system...</p>
      <p className="mt-6 font-mono text-xs text-zinc-300" aria-live="polite">
        {"█".repeat(filled)}
        {"░".repeat(20 - filled)} {progress}%
      </p>
      {progress >= 100 ? <p className="mt-6 text-sm text-zinc-200">Welcome.</p> : null}
    </div>
  );
}

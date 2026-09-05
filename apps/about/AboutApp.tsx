"use client";

import { OS_VERSION } from "@/types/os";

export function AboutApp() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
      <p className="text-xs tracking-[0.35em] text-red-500">MAD OS</p>
      <h2 className="mt-2 text-2xl font-semibold text-white">Version {OS_VERSION}</h2>
      <p className="mt-4 max-w-sm text-sm text-zinc-400">
        A local operating system simulation. No servers, no accounts, no real money. Everything you see stays on this
        device.
      </p>
      <p className="mt-6 text-xs text-zinc-500">Built for the browser. Designed to feel like a machine.</p>
    </div>
  );
}

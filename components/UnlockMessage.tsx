"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

const MESSAGE_DURATION_MS = 3500;

export function UnlockMessage() {
  const pendingUnlockMessage = useStore((s) => s.pendingUnlockMessage);
  const clearUnlockMessage = useStore((s) => s.clearUnlockMessage);

  useEffect(() => {
    if (!pendingUnlockMessage) return;
    const t = setTimeout(clearUnlockMessage, MESSAGE_DURATION_MS);
    return () => clearTimeout(t);
  }, [pendingUnlockMessage, clearUnlockMessage]);

  if (!pendingUnlockMessage) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center pointer-events-none"
      aria-live="polite"
    >
      <p className="rounded-xl border border-zinc-600 bg-zinc-900 px-8 py-4 text-xl font-semibold text-white shadow-xl animate-[fade-in_0.3s_ease-out]">
        Nuevo juego desbloqueado
      </p>
    </div>
  );
}

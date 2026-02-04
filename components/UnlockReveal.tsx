"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

const TOTAL_MS = 700;

export function UnlockReveal() {
  const router = useRouter();
  const pendingUnlockReveal = useStore((s) => s.pendingUnlockReveal);
  const setUnlockRevealDone = useStore((s) => s.setUnlockRevealDone);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!pendingUnlockReveal || doneRef.current) return;
    doneRef.current = true;
    const t = setTimeout(() => {
      setUnlockRevealDone();
      router.push("/");
      doneRef.current = false;
    }, TOTAL_MS);
    return () => clearTimeout(t);
  }, [pendingUnlockReveal, setUnlockRevealDone, router]);

  if (!pendingUnlockReveal) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none"
      aria-hidden
    >
      <div className="absolute inset-0 bg-zinc-950 animate-unlock-reveal" />
    </div>
  );
}

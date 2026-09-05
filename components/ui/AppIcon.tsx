"use client";

import { AppGlyph, glyphForApp } from "@/components/ui/AppGlyph";
import type { IconPack } from "@/types/os";

interface AppIconProps {
  name: string;
  label: string;
  onOpen: () => void;
  pack?: IconPack;
  size?: "sm" | "md";
}

export function AppIcon({ name, label, onOpen, pack = "standard", size = "md" }: AppIconProps) {
  const box = size === "sm" ? "h-8 w-8" : "h-12 w-12";
  const glyph = size === "sm" ? "h-4 w-4" : "h-6 w-6";
  const packClass =
    pack === "neon"
      ? "shadow-[0_0_12px_rgba(220,38,38,0.45)] text-red-400"
      : pack === "glyph"
        ? "bg-transparent border-white/20"
        : "bg-zinc-900/80";

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onOpen();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      aria-label={label}
      className="group flex w-[84px] flex-col items-center gap-1 rounded-md p-1 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
    >
      <span
        className={`flex ${box} items-center justify-center rounded-xl border border-white/10 text-zinc-100 ${packClass} transition-transform group-hover:scale-[1.04] group-active:scale-95`}
      >
        <AppGlyph name={glyphForApp(name)} className={glyph} />
      </span>
      <span className="line-clamp-2 text-[11px] leading-tight text-zinc-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        {label}
      </span>
    </button>
  );
}

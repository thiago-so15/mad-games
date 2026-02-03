"use client";

import type { GameMode } from "@/lib/games/snake/types";

const MODES: { mode: GameMode; label: string; desc: string }[] = [
  { mode: "classic", label: "Clásico", desc: "Velocidad progresiva, bordes que atraviesas" },
  { mode: "timeAttack", label: "Contra reloj", desc: "60 segundos para sumar el máximo" },
  { mode: "hardcore", label: "Hardcore", desc: "Alta velocidad, bordes mortales" },
];

interface StartScreenProps {
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onPlay: () => void;
}

export function StartScreen({ selectedMode, onSelectMode, onPlay }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center gap-8 animate-[fade-in_0.3s_ease-out]">
      <h2 className="text-2xl font-bold text-white">Snake</h2>
      <p className="text-zinc-400">Elegí el modo y jugá.</p>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        {MODES.map(({ mode, label, desc }) => (
          <button
            key={mode}
            type="button"
            onClick={() => onSelectMode(mode)}
            className={`rounded-xl border p-4 text-left transition ${
              selectedMode === mode
                ? "border-amber-500 bg-amber-500/10 text-white"
                : "border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:border-zinc-600"
            }`}
          >
            <span className="font-semibold">{label}</span>
            <p className="mt-1 text-sm opacity-80">{desc}</p>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onPlay}
        className="rounded-lg bg-amber-500 px-8 py-3 font-semibold text-zinc-900 shadow-lg transition hover:bg-amber-400 active:scale-[0.98]"
      >
        Jugar
      </button>

      <p className="text-xs text-zinc-500">Flechas o WASD · P o Espacio para pausar</p>
    </div>
  );
}

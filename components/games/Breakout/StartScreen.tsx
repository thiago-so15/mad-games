"use client";

import type { GameMode } from "@/lib/games/breakout/types";

const MODES: { mode: GameMode; label: string; desc: string }[] = [
  { mode: "campaign", label: "Campaign", desc: "Niveles con progresión y score acumulado" },
  { mode: "endless", label: "Endless", desc: "Niveles infinitos, dificultad creciente" },
  { mode: "challenge", label: "Challenge", desc: "Objetivo: romper todo sin perder vidas" },
];

interface StartScreenProps {
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onPlay: () => void;
}

export function StartScreen({ selectedMode, onSelectMode, onPlay }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center gap-8 animate-[fade-in_0.3s_ease-out]">
      <h2 className="text-2xl font-bold text-white">Breakout v2</h2>
      <p className="text-zinc-400">Rompebloques con power-ups y niveles.</p>

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

      <p className="text-xs text-zinc-500">← → o mouse · P o Espacio: pausa</p>
    </div>
  );
}

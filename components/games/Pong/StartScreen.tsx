"use client";

import type { GameMode, AiDifficulty } from "@/lib/games/pong/types";

const MODES: { mode: GameMode; label: string; desc: string }[] = [
  { mode: "classic", label: "Classic v2", desc: "Pong con power-ups y dificultad progresiva" },
  { mode: "vsAi", label: "Solo vs AI", desc: "Jugá contra la computadora" },
  { mode: "local2p", label: "Dos jugadores", desc: "Mismo teclado: W/S vs ↑/↓" },
  { mode: "survival", label: "Survival", desc: "Una vida. Sobreviví el mayor tiempo posible." },
];

const DIFFICULTIES: { value: AiDifficulty; label: string }[] = [
  { value: "easy", label: "Fácil" },
  { value: "normal", label: "Normal" },
  { value: "hard", label: "Difícil" },
];

interface StartScreenProps {
  selectedMode: GameMode;
  selectedDifficulty: AiDifficulty;
  onSelectMode: (mode: GameMode) => void;
  onSelectDifficulty: (d: AiDifficulty) => void;
  onPlay: () => void;
}

export function StartScreen({
  selectedMode,
  selectedDifficulty,
  onSelectMode,
  onSelectDifficulty,
  onPlay,
}: StartScreenProps) {
  return (
    <div className="flex flex-col items-center gap-8 animate-[fade-in_0.3s_ease-out]">
      <h2 className="text-2xl font-bold text-white">Ping Pong v2</h2>
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

      {selectedMode === "vsAi" && (
        <div className="w-full max-w-sm">
          <p className="mb-2 text-sm text-zinc-400">Dificultad</p>
          <div className="flex gap-2">
            {DIFFICULTIES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => onSelectDifficulty(value)}
                className={`flex-1 rounded-lg border py-2 text-sm font-medium transition ${
                  selectedDifficulty === value
                    ? "border-amber-500 bg-amber-500/20 text-white"
                    : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onPlay}
        className="rounded-lg bg-amber-500 px-8 py-3 font-semibold text-zinc-900 shadow-lg transition hover:bg-amber-400 active:scale-[0.98]"
      >
        Jugar
      </button>

      <p className="text-xs text-zinc-500">
        P1: W / S — P2: ↑ / ↓ — P o Espacio: pausa
      </p>
    </div>
  );
}

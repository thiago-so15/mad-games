"use client";

import { BUTTON_COUNT } from "@/lib/games/memory-glitch/constants";
import type { MemoryGlitchGameState } from "@/lib/games/memory-glitch/types";

const COLORS = ["#ef4444", "#22c55e", "#3b82f6", "#eab308"];

interface GameScreenProps {
  state: MemoryGlitchGameState;
  onPause: () => void;
  onInput: (index: number) => void;
}

export function GameScreen({ state, onPause, onInput }: GameScreenProps) {
  const showPattern = state.phase === "show";
  const canInput = state.phase === "input";

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full max-w-[400px] items-center justify-between">
        <span className="text-zinc-400">
          Ronda: <strong className="text-white">{state.round + 1}</strong>
        </span>
        <button type="button" onClick={onPause} className="rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700">
          Pausa
        </button>
      </div>

      <p className="text-sm text-zinc-500">
        {showPattern ? "Memorizá..." : canInput ? "Repetí el patrón" : state.phase === "correct" ? "¡Bien!" : state.phase === "wrong" ? "Error" : ""}
      </p>

      <div className="flex gap-3">
        {Array.from({ length: BUTTON_COUNT }, (_, i) => (
          <button
            key={i}
            type="button"
            disabled={!canInput}
            onClick={() => onInput(i)}
            className={`h-16 w-16 rounded-xl border-2 text-xl font-bold transition ${
              canInput
                ? "border-zinc-500 bg-zinc-800 hover:scale-105 active:scale-95"
                : "border-zinc-700 bg-zinc-900 opacity-70 cursor-default"
            }`}
            style={{ backgroundColor: canInput ? COLORS[i] + "40" : undefined }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {showPattern && (
        <div className="flex gap-2">
          {state.pattern.map((idx, i) => (
            <div
              key={i}
              className="h-12 w-12 rounded-lg opacity-90"
              style={{ backgroundColor: COLORS[idx] }}
            />
          ))}
        </div>
      )}

      {canInput && state.input.length > 0 && (
        <div className="flex gap-2">
          {state.input.map((idx, i) => (
            <div
              key={i}
              className="h-10 w-10 rounded-lg border-2 border-white"
              style={{ backgroundColor: COLORS[idx] }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

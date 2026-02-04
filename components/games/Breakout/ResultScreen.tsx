"use client";

import Link from "next/link";
import type { GameMode } from "@/lib/games/breakout/types";

const MODE_LABELS: Record<GameMode, string> = {
  campaign: "Campaign",
  endless: "Endless",
  challenge: "Challenge",
};

interface ResultScreenProps {
  phase: "levelComplete" | "gameOver";
  score: number;
  level: number;
  mode: GameMode;
  bestScore: number;
  onContinue: () => void;
  onRetry: () => void;
}

export function ResultScreen({
  phase,
  score,
  level,
  mode,
  bestScore,
  onContinue,
  onRetry,
}: ResultScreenProps) {
  const isLevelComplete = phase === "levelComplete";

  return (
    <div className="flex flex-col items-center gap-6 animate-[fade-in_0.3s_ease-out]">
      <h2 className="text-2xl font-bold text-white">
        {isLevelComplete ? "Nivel completado" : "Game Over"}
      </h2>
      <p className="text-zinc-400">{MODE_LABELS[mode]}</p>

      <div className="rounded-xl border border-zinc-700 bg-zinc-900/80 px-8 py-6 text-center">
        <p className="text-zinc-400">Score</p>
        <p className="text-3xl font-bold text-white">{score}</p>
        <p className="mt-2 text-sm text-zinc-500">
          Nivel alcanzado: <strong className="text-zinc-300">{level + 1}</strong>
        </p>
        {bestScore > 0 && (
          <p className="mt-1 text-sm text-zinc-500">
            Mejor en este modo: <strong className="text-zinc-300">{bestScore}</strong>
          </p>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {isLevelComplete && (
          <button
            type="button"
            onClick={onContinue}
            className="rounded-lg bg-amber-500 px-6 py-2.5 font-semibold text-zinc-900 transition hover:bg-amber-400 active:scale-[0.98]"
          >
            Siguiente nivel
          </button>
        )}
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border border-zinc-600 bg-zinc-800 px-6 py-2.5 font-medium text-zinc-300 transition hover:bg-zinc-700"
        >
          Reintentar
        </button>
        <Link
          href="/games"
          className="rounded-lg border border-zinc-600 px-6 py-2.5 font-medium text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-800"
        >
          Volver al catálogo
        </Link>
      </div>
    </div>
  );
}

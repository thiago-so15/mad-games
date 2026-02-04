"use client";

import Link from "next/link";
import type { GameMode } from "@/lib/games/pong/types";

const MODE_LABELS: Record<GameMode, string> = {
  classic: "Classic v2",
  vsAi: "Solo vs AI",
  local2p: "Dos jugadores",
  survival: "Survival",
};

function formatTime(ms: number): string {
  const sec = Math.floor(ms / 1000);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}:${s.toString().padStart(2, "0")}` : `${s}s`;
}

interface ResultScreenProps {
  winner: "left" | "right";
  scoreLeft: number;
  scoreRight: number;
  mode: GameMode;
  isPlayerLeft: boolean;
  /** Survival: tiempo sobrevivido (ms) */
  survivalTimeMs?: number;
  /** Survival: mejor tiempo local (ms) */
  bestSurvivalTimeMs?: number;
  onRetry: () => void;
}

export function ResultScreen({
  winner,
  scoreLeft,
  scoreRight,
  mode,
  isPlayerLeft,
  survivalTimeMs,
  bestSurvivalTimeMs,
  onRetry,
}: ResultScreenProps) {
  const playerWon = winner === "left" ? isPlayerLeft : !isPlayerLeft;
  const title =
    mode === "local2p"
      ? winner === "left"
        ? "Gana jugador 1"
        : "Gana jugador 2"
      : mode === "survival"
        ? "Game Over"
        : playerWon
          ? "Victoria"
          : "Derrota";

  return (
    <div className="flex flex-col items-center gap-6 animate-[fade-in_0.3s_ease-out]">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <p className="text-zinc-400">{MODE_LABELS[mode]}</p>

      <div className="rounded-xl border border-zinc-700 bg-zinc-900/80 px-8 py-6 text-center">
        {mode === "survival" && survivalTimeMs !== undefined ? (
          <>
            <p className="text-zinc-400">Tiempo sobrevivido</p>
            <p className="text-3xl font-bold text-white">{formatTime(survivalTimeMs)}</p>
            {bestSurvivalTimeMs !== undefined && bestSurvivalTimeMs > 0 && (
              <p className="mt-2 text-sm text-zinc-500">
                Mejor marca: <strong className="text-zinc-300">{formatTime(bestSurvivalTimeMs)}</strong>
              </p>
            )}
          </>
        ) : (
          <p className="text-4xl font-bold tabular-nums text-white">
            {scoreLeft} — {scoreRight}
          </p>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-amber-500 px-6 py-2.5 font-semibold text-zinc-900 transition hover:bg-amber-400 active:scale-[0.98]"
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

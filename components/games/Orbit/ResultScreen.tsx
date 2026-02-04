"use client";

import Link from "next/link";

interface ResultScreenProps {
  score: number;
  bestScore: number;
  onRetry: () => void;
}

export function ResultScreen({ score, bestScore, onRetry }: ResultScreenProps) {
  const isNewRecord = score >= bestScore && bestScore > 0;

  return (
    <div className="flex flex-col items-center gap-6 animate-[fade-in_0.3s_ease-out]">
      <h2 className="text-2xl font-bold text-white">Game Over</h2>
      <p className="text-zinc-400">Obstáculos esquivados</p>

      <div className="rounded-xl border border-zinc-700 bg-zinc-900/80 px-8 py-6 text-center">
        <p className="text-3xl font-bold text-white">{score}</p>
        {bestScore > 0 && (
          <p className="mt-2 text-sm text-zinc-500">
            Mejor: <strong className="text-zinc-300">{bestScore}</strong>
          </p>
        )}
        {isNewRecord && score > 0 && (
          <p className="mt-1 text-sm font-medium text-amber-400">¡Nuevo récord!</p>
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

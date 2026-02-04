"use client";

import Link from "next/link";

interface ResultScreenProps {
  survivalTimeMs: number;
  bestTimeMs: number;
  onRetry: () => void;
}

export function ResultScreen({
  survivalTimeMs,
  bestTimeMs,
  onRetry,
}: ResultScreenProps) {
  const seconds = Math.floor(survivalTimeMs / 1000);
  const bestSeconds = Math.floor(bestTimeMs / 1000);
  const isNewRecord = survivalTimeMs >= bestTimeMs && bestTimeMs > 0;

  return (
    <div className="flex flex-col items-center gap-6 animate-[fade-in_0.3s_ease-out]">
      <h2 className="text-xl font-semibold text-zinc-300">Límite</h2>

      <div className="rounded-xl border border-zinc-700 bg-zinc-900/80 px-8 py-6 text-center">
        <p className="text-3xl font-bold text-zinc-100">{seconds}</p>
        <p className="mt-2 text-sm text-zinc-500">segundos</p>
        {bestTimeMs > 0 && (
          <p className="mt-1 text-sm text-zinc-500">
            Mejor: <strong className="text-zinc-400">{bestSeconds}</strong> s
          </p>
        )}
        {isNewRecord && survivalTimeMs > 0 && (
          <p className="mt-2 text-sm text-zinc-400">Nuevo récord</p>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border border-zinc-600 bg-zinc-800 px-6 py-2.5 font-medium text-zinc-200 transition hover:bg-zinc-700 active:scale-[0.98]"
        >
          Reintentar
        </button>
        <Link
          href="/games"
          className="rounded-lg border border-zinc-600 px-6 py-2.5 text-sm font-medium text-zinc-400 transition hover:border-zinc-500 hover:bg-zinc-800"
        >
          Catálogo
        </Link>
      </div>
    </div>
  );
}

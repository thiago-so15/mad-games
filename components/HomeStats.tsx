"use client";

import { useStore, getXpToNextLevel } from "@/lib/store";

export function HomeStats() {
  const totalXp = useStore((s) => s.progression.totalXp);
  const snakeStats = useStore((s) => s.snakeStats);
  const pongStats = useStore((s) => s.pongStats);
  const breakoutStats = useStore((s) => s.breakoutStats);
  const dodgeStats = useStore((s) => s.dodgeStats);
  const reactorStats = useStore((s) => s.reactorStats);

  const totalGames =
    snakeStats.gamesPlayed +
    pongStats.gamesPlayed +
    breakoutStats.gamesPlayed +
    (dodgeStats?.gamesPlayed ?? 0) +
    (reactorStats?.gamesPlayed ?? 0);
  const totalTimeMs =
    snakeStats.totalTimeMs +
    (pongStats.totalTimeMs ?? 0) +
    breakoutStats.totalTimeMs +
    (dodgeStats?.totalTimeMs ?? 0) +
    (reactorStats?.totalTimeMs ?? 0);

  const { level, xpInLevel, xpNeeded } = getXpToNextLevel(totalXp);
  const progressPct = xpNeeded > 0 ? Math.min(100, (xpInLevel / xpNeeded) * 100) : 100;

  return (
    <div className="mt-10 w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Nivel {level}
          </p>
          <div className="mt-1 h-2 w-40 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
        <div className="text-right text-sm text-zinc-600 dark:text-zinc-400">
          <p>{totalGames} partidas</p>
          <p>{formatTime(totalTimeMs)} jugados</p>
        </div>
      </div>
    </div>
  );
}

function formatTime(ms: number): string {
  if (ms < 60000) return "< 1 min";
  const min = Math.floor(ms / 60000);
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

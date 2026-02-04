"use client";

import { useStore } from "@/lib/store";
import {
  getTodayDateKey,
  getDailyChallenge,
  getDailyProgress,
  DAILY_CHALLENGE_XP,
  DAILY_CHALLENGE_COINS,
} from "@/lib/daily-challenges";

export function DailyChallengeCard() {
  const dailyChallenge = useStore((s) => s.dailyChallenge);
  const reactorStats = useStore((s) => s.reactorStats);

  const dateKey = getTodayDateKey();
  const challenge = getDailyChallenge(dateKey);
  const daily = dailyChallenge ?? {
    completedDailyDates: [],
    dailyGamesPlayedCount: 0,
    dailyGamesPlayedDate: "",
    dailyBeatRecordDate: null,
  };
  const progress = getDailyProgress(
    daily,
    dateKey,
    challenge,
    { reactorBestPulses: reactorStats?.bestPulsesSurvived }
  );
  const completedToday = daily.completedDailyDates.includes(dateKey);

  return (
    <div className="mt-6 w-full max-w-md rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 shadow-sm dark:border-amber-400/20 dark:bg-amber-400/5">
      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
        <span className="text-xl">{challenge.icon}</span>
        <span className="text-sm font-semibold uppercase tracking-wide">
          Reto del día
        </span>
      </div>
      <h3 className="mt-2 text-lg font-bold text-zinc-900 dark:text-white">
        {challenge.title}
      </h3>
      <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">
        {challenge.description}
      </p>
      {completedToday ? (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-500/20 px-3 py-2 text-sm font-medium text-amber-700 dark:text-amber-300">
          <span>✓ Completado</span>
          <span className="text-zinc-500 dark:text-zinc-400">
            +{DAILY_CHALLENGE_XP} XP · +{DAILY_CHALLENGE_COINS} monedas
          </span>
        </div>
      ) : (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>
              {progress.current} / {progress.target}
            </span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-300"
              style={{
                width: `${Math.min(100, (progress.current / progress.target) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

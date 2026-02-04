"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { GAMES_CATALOG } from "@/lib/games";
import { useStore } from "@/lib/store";

function getPersonalStatsLabel(
  slug: string,
  snakeStats: { gamesPlayed: number; bestScoreByMode: Record<string, number> },
  pongStats: { gamesPlayed: number; bestStreak: number; bestSurvivalTimeMs: number },
  breakoutStats: { gamesPlayed: number; maxLevelReached: number; bestScoreByMode: Record<string, number> }
): string | null {
  if (slug === "snake") {
    const best = Math.max(0, ...Object.values(snakeStats.bestScoreByMode));
    return best ? `Mejor: ${best} pts` : null;
  }
  if (slug === "pong") {
    if (pongStats.bestSurvivalTimeMs)
      return `Racha: ${pongStats.bestStreak} · Survival: ${Math.floor(pongStats.bestSurvivalTimeMs / 1000)}s`;
    return pongStats.gamesPlayed ? `${pongStats.gamesPlayed} partidas` : null;
  }
  if (slug === "breakout") {
    const best = Math.max(0, ...Object.values(breakoutStats.bestScoreByMode));
    if (breakoutStats.maxLevelReached) return `Nivel ${breakoutStats.maxLevelReached} · ${best} pts`;
    return best ? `Mejor: ${best} pts` : null;
  }
  return null;
}

const CATEGORIES = ["todos", "arcade", "clásico", "habilidad"] as const;
const DIFFICULTIES = ["todas", 1, 2, 3] as const;

export function CatalogGrid() {
  const [categoryFilter, setCategoryFilter] = useState<string>("todos");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("todas");

  const snakeStats = useStore((s) => s.snakeStats);
  const pongStats = useStore((s) => s.pongStats);
  const breakoutStats = useStore((s) => s.breakoutStats);

  const filtered = useMemo(() => {
    return GAMES_CATALOG.filter((g) => {
      if (categoryFilter !== "todos" && g.category !== categoryFilter) return false;
      if (difficultyFilter !== "todas" && g.difficulty !== Number(difficultyFilter)) return false;
      return true;
    });
  }, [categoryFilter, difficultyFilter]);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4">
        <div>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Tipo</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="ml-2 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Dificultad</span>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="ml-2 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>{d === "todas" ? "Todas" : "★".repeat(Number(d))}</option>
            ))}
          </select>
        </div>
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((game) => {
          const label = getPersonalStatsLabel(game.slug, snakeStats, pongStats, breakoutStats);
          return (
            <li key={game.slug}>
              <Link
                href={game.available ? `/games/${game.slug}` : "#"}
                className={`block rounded-xl border p-6 transition ${
                  game.available
                    ? "border-zinc-200 bg-white hover:border-amber-400 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:border-amber-500/50 dark:hover:bg-zinc-800/50"
                    : "cursor-not-allowed border-zinc-200 bg-zinc-100 opacity-70 dark:border-zinc-800 dark:bg-zinc-900/30"
                }`}
              >
                <span className="text-4xl" role="img" aria-hidden>
                  {game.icon ?? "🎮"}
                </span>
                <h2 className="mt-3 text-xl font-semibold text-zinc-900 dark:text-white">
                  {game.name}
                </h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {game.description}
                </p>
                {label && (
                  <p className="mt-3 text-xs font-medium text-amber-600 dark:text-amber-400">
                    {label}
                  </p>
                )}
                {game.available ? (
                  <span className="mt-4 inline-block text-sm font-medium text-amber-600 dark:text-amber-400">
                    Jugar →
                  </span>
                ) : (
                  <span className="mt-4 inline-block text-sm text-zinc-400">
                    Próximamente
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

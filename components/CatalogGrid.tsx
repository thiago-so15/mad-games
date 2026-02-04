"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { GAMES_CATALOG } from "@/lib/games";
import { useStore } from "@/lib/store";

function getPersonalStatsLabel(
  slug: string,
  snakeStats: { gamesPlayed: number; bestScoreByMode: Record<string, number> },
  pongStats: { gamesPlayed: number; bestStreak: number; bestSurvivalTimeMs: number },
  breakoutStats: { gamesPlayed: number; maxLevelReached: number; bestScoreByMode: Record<string, number> },
  dodgeStats: { gamesPlayed: number; bestSurvivalTimeMs: number } | undefined,
  reactorStats: { gamesPlayed: number; bestPulsesSurvived: number; bestCombo: number } | undefined,
  orbitStats: { gamesPlayed: number; bestScore: number } | undefined,
  pulseDashStats: { gamesPlayed: number; bestDistance: number } | undefined,
  memoryGlitchStats: { gamesPlayed: number; bestRounds: number } | undefined,
  coreDefenseStats: { gamesPlayed: number; bestStreak: number } | undefined,
  shiftStats: { gamesPlayed: number; bestSurvivalTimeMs: number } | undefined,
  overloadStats: { gamesPlayed: number; bestScore: number; bestCombo: number } | undefined,
  polarStats: { gamesPlayed: number; bestScore: number; bestCombo: number } | undefined
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
  if (slug === "dodge" && dodgeStats?.gamesPlayed) {
    return dodgeStats.bestSurvivalTimeMs
      ? `Mejor: ${Math.floor(dodgeStats.bestSurvivalTimeMs / 1000)}s`
      : `${dodgeStats.gamesPlayed} partidas`;
  }
  if (slug === "reactor" && reactorStats?.gamesPlayed) {
    return reactorStats.bestPulsesSurvived
      ? `Mejor: ${reactorStats.bestPulsesSurvived} pulsos · Racha: ${reactorStats.bestCombo}`
      : `${reactorStats.gamesPlayed} partidas`;
  }
  if (slug === "orbit" && orbitStats?.gamesPlayed) {
    return orbitStats.bestScore ? `Mejor: ${orbitStats.bestScore}` : `${orbitStats.gamesPlayed} partidas`;
  }
  if (slug === "pulse-dash" && pulseDashStats?.gamesPlayed) {
    return pulseDashStats.bestDistance ? `Mejor: ${Math.floor(pulseDashStats.bestDistance)}` : `${pulseDashStats.gamesPlayed} partidas`;
  }
  if (slug === "memory-glitch" && memoryGlitchStats?.gamesPlayed) {
    return memoryGlitchStats.bestRounds ? `Mejor: ${memoryGlitchStats.bestRounds} rondas` : `${memoryGlitchStats.gamesPlayed} partidas`;
  }
  if (slug === "core-defense" && coreDefenseStats?.gamesPlayed) {
    return coreDefenseStats.bestStreak ? `Mejor racha: ${coreDefenseStats.bestStreak}` : `${coreDefenseStats.gamesPlayed} partidas`;
  }
  if (slug === "shift" && shiftStats?.gamesPlayed) {
    return shiftStats.bestSurvivalTimeMs ? `Mejor: ${Math.floor(shiftStats.bestSurvivalTimeMs / 1000)}s` : `${shiftStats.gamesPlayed} partidas`;
  }
  if (slug === "overload" && overloadStats?.gamesPlayed) {
    return overloadStats.bestScore ? `Mejor: ${overloadStats.bestScore} pts · Racha: ${overloadStats.bestCombo}` : `${overloadStats.gamesPlayed} partidas`;
  }
  if (slug === "polar" && polarStats?.gamesPlayed) {
    return polarStats.bestScore ? `Mejor: ${polarStats.bestScore} · Racha: ${polarStats.bestCombo}` : `${polarStats.gamesPlayed} partidas`;
  }
  return null;
}

function getGamesPlayed(slug: string, store: ReturnType<typeof useStore.getState>): number {
  if (slug === "snake") return store.snakeStats.gamesPlayed;
  if (slug === "pong") return store.pongStats.gamesPlayed;
  if (slug === "breakout") return store.breakoutStats.gamesPlayed;
  if (slug === "dodge") return store.dodgeStats?.gamesPlayed ?? 0;
  if (slug === "reactor") return store.reactorStats?.gamesPlayed ?? 0;
  if (slug === "orbit") return store.orbitStats?.gamesPlayed ?? 0;
  if (slug === "pulse-dash") return store.pulseDashStats?.gamesPlayed ?? 0;
  if (slug === "memory-glitch") return store.memoryGlitchStats?.gamesPlayed ?? 0;
  if (slug === "core-defense") return store.coreDefenseStats?.gamesPlayed ?? 0;
  if (slug === "shift") return store.shiftStats?.gamesPlayed ?? 0;
  if (slug === "overload") return store.overloadStats?.gamesPlayed ?? 0;
  if (slug === "polar") return store.polarStats?.gamesPlayed ?? 0;
  return 0;
}

/** True si el juego tiene al menos un récord personal (mejor score o tiempo) */
function hasPersonalRecord(
  slug: string,
  snakeStats: { bestScoreByMode: Record<string, number> },
  pongStats: { bestStreak: number; bestSurvivalTimeMs: number },
  breakoutStats: { bestScoreByMode: Record<string, number>; maxLevelReached: number },
  dodgeStats: { bestSurvivalTimeMs: number } | undefined,
  reactorStats: { bestPulsesSurvived: number } | undefined,
  orbitStats: { bestScore: number } | undefined,
  pulseDashStats: { bestDistance: number } | undefined,
  memoryGlitchStats: { bestRounds: number } | undefined,
  coreDefenseStats: { bestStreak: number } | undefined,
  shiftStats: { bestSurvivalTimeMs: number } | undefined,
  overloadStats: { bestScore: number } | undefined,
  polarStats: { bestScore: number } | undefined
): boolean {
  if (slug === "snake") return Math.max(0, ...Object.values(snakeStats.bestScoreByMode)) > 0;
  if (slug === "pong") return pongStats.bestStreak > 0 || pongStats.bestSurvivalTimeMs > 0;
  if (slug === "breakout") return Math.max(0, ...Object.values(breakoutStats.bestScoreByMode)) > 0 || breakoutStats.maxLevelReached > 0;
  if (slug === "dodge") return (dodgeStats?.bestSurvivalTimeMs ?? 0) > 0;
  if (slug === "reactor") return (reactorStats?.bestPulsesSurvived ?? 0) > 0;
  if (slug === "orbit") return (orbitStats?.bestScore ?? 0) > 0;
  if (slug === "pulse-dash") return (pulseDashStats?.bestDistance ?? 0) > 0;
  if (slug === "memory-glitch") return (memoryGlitchStats?.bestRounds ?? 0) > 0;
  if (slug === "core-defense") return (coreDefenseStats?.bestStreak ?? 0) > 0;
  if (slug === "shift") return (shiftStats?.bestSurvivalTimeMs ?? 0) > 0;
  if (slug === "overload") return (overloadStats?.bestScore ?? 0) > 0;
  if (slug === "polar") return (polarStats?.bestScore ?? 0) > 0;
  return false;
}

const CATEGORIES = ["todos", "arcade", "clásico", "habilidad"] as const;
const DIFFICULTIES = ["todas", 1, 2, 3] as const;

export function CatalogGrid() {
  const [categoryFilter, setCategoryFilter] = useState<string>("todos");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("todas");

  const snakeStats = useStore((s) => s.snakeStats);
  const pongStats = useStore((s) => s.pongStats);
  const breakoutStats = useStore((s) => s.breakoutStats);
  const dodgeStats = useStore((s) => s.dodgeStats);
  const reactorStats = useStore((s) => s.reactorStats);
  const orbitStats = useStore((s) => s.orbitStats);
  const pulseDashStats = useStore((s) => s.pulseDashStats);
  const memoryGlitchStats = useStore((s) => s.memoryGlitchStats);
  const coreDefenseStats = useStore((s) => s.coreDefenseStats);
  const shiftStats = useStore((s) => s.shiftStats);
  const overloadStats = useStore((s) => s.overloadStats);
  const polarStats = useStore((s) => s.polarStats);
  const favoriteGameSlugs = useStore((s) => s.profile.favoriteGameSlugs);
  const lastPlayedSlug = useStore((s) => s.profile.lastPlayedGameSlug);
  const favorites = favoriteGameSlugs ?? [];
  const lastPlayed = lastPlayedSlug ?? null;
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const getState = useStore.getState;

  const filtered = useMemo(() => {
    const list = GAMES_CATALOG.filter((g) => {
      if (categoryFilter !== "todos" && g.category !== categoryFilter) return false;
      if (difficultyFilter !== "todas" && g.difficulty !== Number(difficultyFilter)) return false;
      return true;
    });
    const favSet = new Set(favorites);
    return [...list].sort((a, b) => {
      const aFav = favSet.has(a.slug) ? 1 : 0;
      const bFav = favSet.has(b.slug) ? 1 : 0;
      if (aFav !== bFav) return bFav - aFav;
      if (lastPlayed === a.slug) return -1;
      if (lastPlayed === b.slug) return 1;
      return 0;
    });
  }, [categoryFilter, difficultyFilter, favorites, lastPlayed]);

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
          const label = getPersonalStatsLabel(
            game.slug,
            snakeStats,
            pongStats,
            breakoutStats,
            dodgeStats,
            reactorStats,
            orbitStats,
            pulseDashStats,
            memoryGlitchStats,
            coreDefenseStats,
            shiftStats,
            overloadStats,
            polarStats
          );
          const isFavorite = favorites.includes(game.slug);
          const isLastPlayed = lastPlayed === game.slug;
          const gamesPlayed = getGamesPlayed(game.slug, getState());
          const isNew = gamesPlayed === 0;
          const hasRecord = hasPersonalRecord(
            game.slug,
            snakeStats,
            pongStats,
            breakoutStats,
            dodgeStats,
            reactorStats,
            orbitStats,
            pulseDashStats,
            memoryGlitchStats,
            coreDefenseStats,
            shiftStats,
            overloadStats,
            polarStats
          );

          return (
            <li key={game.slug} className="relative animate-[fade-in_0.3s_ease-out]">
              <Link
                href={game.available ? `/games/${game.slug}` : "#"}
                className={`block rounded-xl border p-6 transition-arcade hover-lift ${
                  game.available
                    ? "border-zinc-200 bg-white hover:border-red-400 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:border-red-500/50 dark:hover:bg-zinc-800/50"
                    : "cursor-not-allowed border-zinc-200 bg-zinc-100 opacity-70 dark:border-zinc-800 dark:bg-zinc-900/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-4xl" role="img" aria-hidden>
                    {game.icon ?? "🎮"}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(game.slug);
                    }}
                    className="rounded p-1.5 text-lg transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                    aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                  >
                    <span className={isFavorite ? "text-red-500 dark:text-red-400" : "text-zinc-400 dark:text-zinc-500"}>
                      {isFavorite ? "★" : "☆"}
                    </span>
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {isLastPlayed && (
                    <span className="rounded bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">
                      Última sesión
                    </span>
                  )}
                  {isNew && game.available && (
                    <span className="rounded bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                      Nuevo
                    </span>
                  )}
                  {hasRecord && !isNew && (
                    <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                      Récord
                    </span>
                  )}
                </div>
                <h2 className="mt-3 text-xl font-semibold text-zinc-900 dark:text-white">
                  {game.name}
                </h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {game.description}
                </p>
                {label && (
                  <p className="mt-3 text-xs font-medium text-red-600 dark:text-red-400">
                    {label}
                  </p>
                )}
                {game.available ? (
                  <span className="mt-4 inline-block text-sm font-medium text-red-600 dark:text-red-400">
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

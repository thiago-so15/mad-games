/**
 * Logros locales MAD GAMES v3.
 * Condiciones puras sobre el estado del store; sin backend.
 */

import type { AchievementDef } from "./types";
import type { SnakeStats, PongStats, BreakoutStats, DodgeStats, ReactorStats, OrbitStats, PulseDashStats, MemoryGlitchStats, CoreDefenseStats, ShiftStats, OverloadStats, PolarStats, VoidStats } from "./types";

/** Estado mínimo necesario para evaluar logros (evita dependencia circular con store) */
export interface StoreStateForAchievements {
  profile: { nickname: string; avatar: string };
  progression: { totalXp: number };
  snakeStats: SnakeStats;
  pongStats: PongStats;
  breakoutStats: BreakoutStats;
  dodgeStats: DodgeStats;
  reactorStats: ReactorStats;
  orbitStats?: OrbitStats;
  pulseDashStats?: PulseDashStats;
  memoryGlitchStats?: MemoryGlitchStats;
  coreDefenseStats?: CoreDefenseStats;
  shiftStats?: ShiftStats;
  overloadStats?: OverloadStats;
  polarStats?: PolarStats;
  voidStats?: VoidStats;
  sessionConsecutivePlays?: { count: number; gameSlug: string | null };
  /** Compras en la tienda (para logros de “compraste tu primer…”) */
  inventory?: { purchasedItemIds?: string[] };
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "first_play", icon: "🎮", name: "Primera partida", description: "Completaste tu primera partida", gameSlug: null, rarity: "common" },
  { id: "games_10", icon: "🎯", name: "En marcha", description: "Llegaste a 10 partidas jugadas", gameSlug: null, rarity: "rare" },
  { id: "games_50", icon: "🎲", name: "Rodando", description: "Llegaste a 50 partidas jugadas", gameSlug: null, rarity: "rare" },
  { id: "games_100", icon: "🔥", name: "Centenario", description: "Llegaste a 100 partidas jugadas", gameSlug: null, rarity: "legendary" },
  { id: "records_5", icon: "🏆", name: "Récords personales", description: "Superaste 5 récords personales en total", gameSlug: null, rarity: "legendary" },
  { id: "level_5", icon: "⬆️", name: "Nivel 5", description: "Alcanzaste el nivel 5 global", gameSlug: null, rarity: "rare" },
  { id: "level_10", icon: "🌟", name: "Nivel 10", description: "Alcanzaste el nivel 10 global", gameSlug: null, rarity: "legendary" },
  { id: "shop_first", icon: "🛒", name: "Primera compra", description: "Compraste tu primer ítem en la tienda", gameSlug: null, rarity: "common" },
  { id: "shop_5", icon: "🪙", name: "Coleccionista", description: "Compraste 5 ítems en la tienda", gameSlug: null, rarity: "rare" },
  { id: "shop_10", icon: "💎", name: "Cliente fiel", description: "Compraste 10 ítems en la tienda", gameSlug: null, rarity: "legendary" },
];

/** Cuenta total de récords personales superados (estimado por juegos con bestScore/bestTime) */
function countPersonalRecords(state: StoreStateForAchievements): number {
  let count = 0;
  const snakeBest = Object.values(state.snakeStats.bestScoreByMode).filter(Boolean).length;
  if (state.snakeStats.gamesPlayed > 0) count += snakeBest;
  if (state.pongStats.gamesPlayed > 0 && (state.pongStats.bestStreak > 0 || state.pongStats.bestSurvivalTimeMs > 0)) count += 1;
  const breakoutBest = Object.values(state.breakoutStats.bestScoreByMode).filter(Boolean).length;
  if (state.breakoutStats.gamesPlayed > 0) count += breakoutBest;
  if (state.dodgeStats.gamesPlayed > 0 && state.dodgeStats.bestSurvivalTimeMs > 0) count += 1;
  if (state.reactorStats.gamesPlayed > 0 && state.reactorStats.bestPulsesSurvived > 0) count += 1;
  if ((state.orbitStats?.gamesPlayed ?? 0) > 0 && (state.orbitStats?.bestScore ?? 0) > 0) count += 1;
  if ((state.pulseDashStats?.gamesPlayed ?? 0) > 0 && (state.pulseDashStats?.bestDistance ?? 0) > 0) count += 1;
  if ((state.memoryGlitchStats?.gamesPlayed ?? 0) > 0 && (state.memoryGlitchStats?.bestRounds ?? 0) > 0) count += 1;
  if ((state.coreDefenseStats?.gamesPlayed ?? 0) > 0 && (state.coreDefenseStats?.bestStreak ?? 0) > 0) count += 1;
  if ((state.shiftStats?.gamesPlayed ?? 0) > 0 && (state.shiftStats?.bestSurvivalTimeMs ?? 0) > 0) count += 1;
  if ((state.overloadStats?.gamesPlayed ?? 0) > 0 && (state.overloadStats?.bestScore ?? 0) > 0) count += 1;
  if ((state.polarStats?.gamesPlayed ?? 0) > 0 && (state.polarStats?.bestScore ?? 0) > 0) count += 1;
  if ((state.voidStats?.gamesPlayed ?? 0) > 0 && (state.voidStats?.bestSurvivalTimeMs ?? 0) > 0) count += 1;
  return count;
}

function getLevel(totalXp: number): number {
  if (totalXp <= 0) return 1;
  return Math.floor(Math.sqrt(totalXp / 100)) + 1;
}

/** Devuelve los IDs de logros que deberían estar desbloqueados según el estado actual */
export function getUnlockedAchievementIds(state: StoreStateForAchievements): string[] {
  const unlocked = new Set<string>();
  const totalGames =
    state.snakeStats.gamesPlayed +
    state.pongStats.gamesPlayed +
    state.breakoutStats.gamesPlayed +
    (state.dodgeStats?.gamesPlayed ?? 0) +
    (state.reactorStats?.gamesPlayed ?? 0) +
    (state.orbitStats?.gamesPlayed ?? 0) +
    (state.pulseDashStats?.gamesPlayed ?? 0) +
    (state.memoryGlitchStats?.gamesPlayed ?? 0) +
    (state.coreDefenseStats?.gamesPlayed ?? 0) +
    (state.shiftStats?.gamesPlayed ?? 0) +
    (state.overloadStats?.gamesPlayed ?? 0) +
    (state.polarStats?.gamesPlayed ?? 0) +
    (state.voidStats?.gamesPlayed ?? 0);
  const level = getLevel(state.progression.totalXp);
  const records = countPersonalRecords(state);
  const purchases = state.inventory?.purchasedItemIds?.length ?? 0;

  if (totalGames >= 1) unlocked.add("first_play");
  if (totalGames >= 10) unlocked.add("games_10");
  if (totalGames >= 50) unlocked.add("games_50");
  if (totalGames >= 100) unlocked.add("games_100");
  if (records >= 5) unlocked.add("records_5");
  if (level >= 5) unlocked.add("level_5");
  if (level >= 10) unlocked.add("level_10");
  if (purchases >= 1) unlocked.add("shop_first");
  if (purchases >= 5) unlocked.add("shop_5");
  if (purchases >= 10) unlocked.add("shop_10");

  return Array.from(unlocked);
}

const KNOWN_ACHIEVEMENT_IDS = new Set(ACHIEVEMENTS.map((a) => a.id));

/** Quita IDs de logros viejos que ya no existen (p. ej. “primera partida en X”). */
export function pruneUnknownAchievementIds(ids: string[]): string[] {
  return ids.filter((id) => KNOWN_ACHIEVEMENT_IDS.has(id));
}

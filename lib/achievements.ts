/**
 * Logros locales MAD GAMES v3.
 * Condiciones puras sobre el estado del store; sin backend.
 */

import type { AchievementDef } from "./types";
import type { SnakeStats, PongStats, BreakoutStats, DodgeStats, ReactorStats, OrbitStats, PulseDashStats, MemoryGlitchStats, CoreDefenseStats, ShiftStats, OverloadStats, PolarStats } from "./types";

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
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "first_game_over", icon: "💀", name: "Primer Game Over", description: "Perdiste tu primera partida", gameSlug: null, rarity: "common" },
  { id: "games_10", icon: "🎯", name: "En marcha", description: "10 partidas jugadas", gameSlug: null, rarity: "rare" },
  { id: "games_100", icon: "🔥", name: "Centenario", description: "100 partidas jugadas", gameSlug: null, rarity: "legendary" },
  { id: "records_5", icon: "🏆", name: "Récords personales", description: "Superaste 5 récords personales (en total)", gameSlug: null, rarity: "legendary" },
  { id: "level_5", icon: "⬆️", name: "Nivel 5", description: "Alcanzaste el nivel 5 global", gameSlug: null, rarity: "rare" },
  { id: "level_10", icon: "🌟", name: "Nivel 10", description: "Alcanzaste el nivel 10 global", gameSlug: null, rarity: "legendary" },
  { id: "snake_first", icon: "🐍", name: "Primera serpiente", description: "Jugaste tu primera partida de Snake", gameSlug: "snake", rarity: "common" },
  { id: "pong_first", icon: "🏓", name: "Primer saque", description: "Jugaste tu primera partida de Pong", gameSlug: "pong", rarity: "common" },
  { id: "breakout_first", icon: "🧱", name: "Primer bloque", description: "Jugaste tu primera partida de Breakout", gameSlug: "breakout", rarity: "common" },
  { id: "dodge_first", icon: "🕹️", name: "Primer esquive", description: "Jugaste tu primera partida de Dodge Madness", gameSlug: "dodge", rarity: "common" },
  { id: "reactor_first", icon: "⚡", name: "Primer pulso", description: "Jugaste tu primera partida de Reactor Break", gameSlug: "reactor", rarity: "common" },
  { id: "orbit_first", icon: "🕹️", name: "Primera órbita", description: "Jugaste tu primera partida de Orbit", gameSlug: "orbit", rarity: "common" },
  { id: "pulse_dash_first", icon: "⚡", name: "Primer dash", description: "Jugaste tu primera partida de Pulse Dash", gameSlug: "pulse-dash", rarity: "common" },
  { id: "memory_glitch_first", icon: "🧠", name: "Primer glitch", description: "Jugaste tu primera partida de Memory Glitch", gameSlug: "memory-glitch", rarity: "common" },
  { id: "core_defense_first", icon: "💣", name: "Primera defensa", description: "Jugaste tu primera partida de Core Defense", gameSlug: "core-defense", rarity: "common" },
  { id: "shift_first", icon: "🌀", name: "Primer shift", description: "Jugaste tu primera partida de Shift", gameSlug: "shift", rarity: "common" },
  { id: "overload_first", icon: "🔥", name: "Primera sobrecarga", description: "Jugaste tu primera partida de Overload", gameSlug: "overload", rarity: "common" },
  { id: "polar_first", icon: "🧲", name: "Primera polaridad", description: "Jugaste tu primera partida de Polar", gameSlug: "polar", rarity: "common" },
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
    (state.polarStats?.gamesPlayed ?? 0);
  const level = getLevel(state.progression.totalXp);
  const records = countPersonalRecords(state);

  if (totalGames >= 1) unlocked.add("first_game_over");
  if (totalGames >= 10) unlocked.add("games_10");
  if (totalGames >= 100) unlocked.add("games_100");
  if (records >= 5) unlocked.add("records_5");
  if (level >= 5) unlocked.add("level_5");
  if (level >= 10) unlocked.add("level_10");
  if (state.snakeStats.gamesPlayed >= 1) unlocked.add("snake_first");
  if (state.pongStats.gamesPlayed >= 1) unlocked.add("pong_first");
  if (state.breakoutStats.gamesPlayed >= 1) unlocked.add("breakout_first");
  if ((state.dodgeStats?.gamesPlayed ?? 0) >= 1) unlocked.add("dodge_first");
  if ((state.reactorStats?.gamesPlayed ?? 0) >= 1) unlocked.add("reactor_first");
  if ((state.orbitStats?.gamesPlayed ?? 0) >= 1) unlocked.add("orbit_first");
  if ((state.pulseDashStats?.gamesPlayed ?? 0) >= 1) unlocked.add("pulse_dash_first");
  if ((state.memoryGlitchStats?.gamesPlayed ?? 0) >= 1) unlocked.add("memory_glitch_first");
  if ((state.coreDefenseStats?.gamesPlayed ?? 0) >= 1) unlocked.add("core_defense_first");
  if ((state.shiftStats?.gamesPlayed ?? 0) >= 1) unlocked.add("shift_first");
  if ((state.overloadStats?.gamesPlayed ?? 0) >= 1) unlocked.add("overload_first");
  if ((state.polarStats?.gamesPlayed ?? 0) >= 1) unlocked.add("polar_first");

  return Array.from(unlocked);
}

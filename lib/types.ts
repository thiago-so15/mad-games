/**
 * Tipos globales de la plataforma.
 * Pensados para evolucionar a backend/DB sin reescribir.
 */

export interface UserProfile {
  nickname: string;
  avatar: string; // emoji o URL de imagen local
  updatedAt: number;
}

export interface GameScore {
  gameSlug: string;
  score: number;
  playedAt: number;
  /** Datos extra por juego (ej. nivel, tiempo) */
  extra?: Record<string, number | string>;
}

export interface GameHistoryEntry {
  gameSlug: string;
  playedAt: number;
  score: number;
  extra?: Record<string, number | string>;
}

export interface GameMeta {
  slug: string;
  name: string;
  description: string;
  icon?: string;
  available: boolean;
  /** Para filtros en catálogo */
  category?: "arcade" | "clásico" | "habilidad";
  /** Dificultad percibida 1-3 */
  difficulty?: 1 | 2 | 3;
}

/** Tema de la plataforma */
export type Theme = "light" | "dark";

/** Configuración global (sonido, tema, velocidad, etc.) */
export interface GameSettings {
  soundEnabled: boolean;
  theme: Theme;
  /** Esquema de controles (para mostrar en ayuda) */
  controlScheme: "keyboard" | "keyboard-mouse";
  snakeSpeedMultiplier: number;
  pongSpeedMultiplier: number;
  breakoutSpeedMultiplier: number;
  dodgeSpeedMultiplier: number;
  reactorSpeedMultiplier: number;
}

/** Progresión global: XP y nivel (calculado) */
export interface Progression {
  totalXp: number;
}

/** Estadísticas por juego (mejor score por modo, partidas, tiempo) */
export interface SnakeStats {
  bestScoreByMode: Partial<Record<"classic" | "timeAttack" | "hardcore", number>>;
  gamesPlayed: number;
  totalTimeMs: number;
}

/** Estadísticas Pong (partidas, victorias, derrotas, racha, survival, tiempo total) */
export interface PongStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  currentStreak: number;
  bestStreak: number;
  bestSurvivalTimeMs: number;
  totalTimeMs: number;
}

/** Estadísticas Breakout (mejor score por modo, nivel máximo, partidas, tiempo) */
export interface BreakoutStats {
  bestScoreByMode: Partial<Record<"campaign" | "endless" | "challenge", number>>;
  maxLevelReached: number;
  gamesPlayed: number;
  totalTimeMs: number;
}

/** Estadísticas Dodge Madness (mejor tiempo de supervivencia, partidas, tiempo total) */
export interface DodgeStats {
  bestSurvivalTimeMs: number;
  gamesPlayed: number;
  totalTimeMs: number;
}

/** Estadísticas Reactor Break (mejor pulsos, mejor racha, partidas, tiempo total) */
export interface ReactorStats {
  bestPulsesSurvived: number;
  bestCombo: number;
  gamesPlayed: number;
  totalTimeMs: number;
}

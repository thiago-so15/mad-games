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
  /** Emoji o path a imagen para la card */
  icon?: string;
  /** Si el juego está implementado */
  available: boolean;
}

/** Configuración global (sonido, velocidad base, etc.) */
export interface GameSettings {
  soundEnabled: boolean;
  /** Multiplicador de velocidad en Snake (1 = normal, >1 = más lento) */
  snakeSpeedMultiplier: number;
}

/** Estadísticas por juego (mejor score por modo, partidas, tiempo) */
export interface SnakeStats {
  bestScoreByMode: Partial<Record<"classic" | "timeAttack" | "hardcore", number>>;
  gamesPlayed: number;
  totalTimeMs: number;
}

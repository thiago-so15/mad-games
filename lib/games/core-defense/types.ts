/**
 * Tipos para Core Defense. Defender núcleo central de oleadas.
 */

/** Efecto visual de un impacto en el escudo */
export interface CoreDefenseImpact {
  angle: number;
  distance: number;
  createdAt: number;
}

export interface CoreDefenseGameState {
  /** Ángulo del escudo (rad) */
  shieldAngle: number;
  /** Ancho del escudo en rad (ej. PI/4 = 90°) */
  shieldWidth: number;
  /** Racha actual de bloqueos */
  streak: number;
  /** Proyectiles entrantes */
  projectiles: { id: string; angle: number; distance: number; speed: number }[];
  /** Impactos recientes en el escudo (para feedback visual) */
  impacts: CoreDefenseImpact[];
  gameStartTime: number;
  /** Último momento en que se generó un proyectil (ms) */
  lastSpawnAt: number;
  phase: "playing" | "gameOver";
  paused: boolean;
  difficultyLevel: number;
}

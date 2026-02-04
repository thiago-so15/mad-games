/**
 * Tipos para Core Defense. Defender núcleo central de oleadas.
 */

export interface CoreDefenseGameState {
  /** Ángulo del escudo (rad) */
  shieldAngle: number;
  /** Ancho del escudo en rad (ej. PI/4 = 90°) */
  shieldWidth: number;
  /** Racha actual de bloqueos */
  streak: number;
  /** Proyectiles entrantes */
  projectiles: { id: string; angle: number; distance: number; speed: number }[];
  gameStartTime: number;
  phase: "playing" | "gameOver";
  paused: boolean;
  difficultyLevel: number;
}

/**
 * Tipos para Shift. Mundo alterna estados; cambiar de fase a tiempo.
 */

export interface ShiftObstacle {
  id: string;
  y: number;
  phase: 0 | 1;
  height: number;
  speed: number;
}

export interface ShiftGameState {
  /** Fase actual del jugador (0 o 1) */
  playerPhase: 0 | 1;
  /** Posición Y del jugador (fija abajo) */
  playerY: number;
  obstacles: ShiftObstacle[];
  gameStartTime: number;
  survivalTimeMs: number;
  phase: "playing" | "gameOver";
  paused: boolean;
  difficultyLevel: number;
}

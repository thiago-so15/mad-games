/**
 * VOID. Una regla: el punto toca un límite → game over.
 */

export interface VoidGameState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  gameStartTime: number;
  lastUpdateAt: number;
  phase: "playing" | "gameOver";
  paused: boolean;
  /** Tiempo sobrevivido en ms (score) */
  survivalTimeMs: number;
}

/**
 * Tipos PHASE. Una regla: fase correcta en el impacto = sigue; incorrecta = game over.
 */

export type PhaseKind = 0 | 1; // A = 0, B = 1

export interface PhaseObstacle {
  id: string;
  x: number;
  phase: PhaseKind;
  speed: number;
  width: number;
  height: number;
}

export interface PhaseGameState {
  /** Fase actual del jugador (0 = A, 1 = B) */
  playerPhase: PhaseKind;
  obstaculos: PhaseObstacle[];
  score: number;
  perfectCombo: number;
  bestCombo: number;
  gameStartTime: number;
  lastSpawnAt: number;
  lastUpdateAt: number;
  phase: "playing" | "gameOver";
  paused: boolean;
  difficultyLevel: number;
  /** Flash breve: "success" | "fail" | null */
  feedback: "success" | "fail" | null;
  feedbackUntil: number;
}

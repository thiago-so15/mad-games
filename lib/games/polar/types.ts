/**
 * Tipos POLAR. Una regla: polaridad correcta en el impacto = sigue; incorrecta = game over.
 */

export type PolarityKind = 0 | 1; // 0 = positivo (+), 1 = negativo (−)

export interface PolarObstacle {
  id: string;
  x: number;
  polarity: PolarityKind;
  speed: number;
  width: number;
  height: number;
}

export interface PolarGameState {
  /** Polaridad actual del jugador (0 = +, 1 = −) */
  playerPolarity: PolarityKind;
  obstaculos: PolarObstacle[];
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

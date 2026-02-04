/**
 * Tipos OVERLOAD. Una regla: energía al 100% = game over.
 */

export interface OverloadGameState {
  /** Energía actual (0..100). 100 = explosión. */
  energy: number;
  /** Velocidad de carga actual (% por segundo) */
  chargeSpeed: number;
  /** Inicio de zona segura (%) */
  safeZoneStart: number;
  /** Fin de zona segura (%) */
  safeZoneEnd: number;
  /** Nivel de dificultad (afecta velocidad y tamaño de zona) */
  difficultyLevel: number;
  /** Puntos: +1 por liberación exitosa, bonus por racha */
  score: number;
  /** Racha de liberaciones perfectas consecutivas (para bonus) */
  perfectCombo: number;
  /** Mejor racha de la partida */
  bestCombo: number;
  /** Timestamp del último frame (para dt) */
  lastUpdateAt: number;
  phase: "playing" | "gameOver";
  paused: boolean;
  gameStartTime: number;
  /** Flash breve: "success" | "penalty" | null */
  feedback: "success" | "penalty" | null;
  feedbackUntil: number;
}

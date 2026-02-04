/**
 * Tipos para Reactor Break. Lógica desacoplada de la UI.
 */

/** Estado del pulso: próximo, activo (ventana de hit), pasado */
export type PulsePhase = "idle" | "warning" | "active" | "passed";

export interface ReactorGameState {
  /** Escudo activo (jugador debe tenerlo ON cuando el pulso sea "active") */
  shieldOn: boolean;
  /** Fase actual del pulso */
  pulsePhase: PulsePhase;
  /** Timestamp en que el pulso pasó a "active" (para ventana de hit) */
  pulseActiveAt: number;
  /** Timestamp próximo pulso (o inicio de warning) */
  nextPulseAt: number;
  /** Pulsos superados en esta partida */
  pulsesSurvived: number;
  /** Mejor racha de pulsos en esta partida */
  bestCombo: number;
  /** Racha actual */
  currentCombo: number;
  phase: "playing" | "gameOver";
  gameOverReason: "miss" | null;
  gameStartTime: number;
  paused: boolean;
  /** Nivel de dificultad (afecta velocidad y ritmo) */
  difficultyLevel: number;
  /** Falso pulso visual (no cuenta como hit si fallas) */
  isFakePulse: boolean;
}

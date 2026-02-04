/**
 * Tipos Reactor Break. Regla única: escudo ACTIVO en el instante del pulso = éxito.
 */

/** Fases del ciclo: carga → señal previa → pulso (evaluación) → resultado */
export type PulsePhase = "charge" | "warning" | "pulse" | "passed";

export interface ReactorGameState {
  /** Escudo activo: true = mantiene presionado, false = soltado. Evaluado solo en el pulso. */
  shieldOn: boolean;
  pulsePhase: PulsePhase;
  /** Inicio del ciclo actual (fase de carga) */
  cycleStartAt: number;
  /** Fin del breve estado "passed" antes del siguiente ciclo */
  passedUntil: number;
  /** Hasta este timestamp el escudo no puede activarse (enfriamiento tras un éxito). */
  shieldCooldownUntil: number;
  pulsesSurvived: number;
  bestCombo: number;
  currentCombo: number;
  phase: "playing" | "gameOver";
  gameOverReason: "miss" | null;
  gameStartTime: number;
  paused: boolean;
  difficultyLevel: number;
}

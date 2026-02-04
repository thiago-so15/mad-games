/**
 * Tipos para Memory Glitch. Memoria rápida bajo presión.
 */

export interface MemoryGlitchGameState {
  /** Secuencia a repetir (índices 0..3 = 4 botones) */
  pattern: number[];
  /** Lo que el jugador ha ingresado hasta ahora */
  input: number[];
  /** Ronda actual (0-based) */
  round: number;
  /** Fase: mostrando patrón, esperando input, correcto/error */
  phase: "show" | "input" | "correct" | "wrong";
  /** Timestamp hasta cuando se muestra el patrón / tiempo restante para input */
  phaseEndAt: number;
  gameStartTime: number;
  /** Tiempo base para ver patrón (ms); disminuye por ronda */
  showDurationMs: number;
  /** Tiempo para responder (ms) */
  inputDurationMs: number;
  /** true si la ronda fue perfecta (sin errores) */
  perfectRound: boolean;
  gameOver: boolean;
  paused: boolean;
}

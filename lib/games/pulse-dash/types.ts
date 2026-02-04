/**
 * Tipos para Pulse Dash. Corredor que avanza; dash entre zonas seguras.
 */

export interface PulseDashGameState {
  /** Posición X (distancia recorrida) */
  distance: number;
  /** Índice de carril 0, 1, 2 */
  lane: number;
  /** Cooldown restante del dash (ms) */
  dashCooldownMs: number;
  /** Zona actual peligrosa? (alterna en el tiempo) */
  zoneDanger: boolean;
  /** Carril seguro cuando zoneDanger es true (rota 0, 1, 2) */
  safeLane: number;
  gameStartTime: number;
  phase: "playing" | "gameOver";
  paused: boolean;
  difficultyLevel: number;
}

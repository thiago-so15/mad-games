/**
 * Constantes POLAR. Polaridad +/−; impacto en línea fija; un botón alterna polaridad.
 */

export const CANVAS_WIDTH = 400;
export const CANVAS_HEIGHT = 200;

/** Línea de impacto (px desde la izquierda). Ahí se evalúa la polaridad del jugador. */
export const IMPACT_LINE_X = 72;

/** Velocidad base de obstáculos (px por segundo) */
export const OBSTACLE_SPEED_BASE = 90;
export const OBSTACLE_SPEED_PER_LEVEL = 15;

/** Intervalo entre spawns (ms). Disminuye con dificultad. */
export const SPAWN_INTERVAL_BASE_MS = 1400;
export const SPAWN_INTERVAL_MIN_MS = 550;

/** Cada N impactos correctos sube la dificultad */
export const DIFFICULTY_EVERY_SUCCESS = 4;

/** Ancho visual del obstáculo (px) */
export const OBSTACLE_WIDTH = 28;
export const OBSTACLE_HEIGHT = 44;

/** Duración del flash de éxito/error (ms) */
export const FEEDBACK_FLASH_MS = 200;

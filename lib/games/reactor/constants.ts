/**
 * Constantes Reactor Break.
 */

export const REACTOR_RADIUS = 50;
export const CANVAS_SIZE = 320;
/** Duración de la ventana "active" en ms: jugador debe tener escudo ON en este intervalo */
export const PULSE_ACTIVE_MS = 180;
/** Tiempo de "warning" antes del pulso (visual) */
export const PULSE_WARNING_MS = 400;
/** Intervalo base entre pulsos (ms); disminuye con dificultad */
export const PULSE_INTERVAL_BASE_MS = 1600;
export const PULSE_INTERVAL_MIN_MS = 550;
/** Cada cuántos pulsos sube la dificultad */
export const DIFFICULTY_EVERY_PULSES = 5;
/** Probabilidad de falso pulso visual (solo visual, no pierde si falla) */
export const FAKE_PULSE_CHANCE = 0.12;

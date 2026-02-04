/**
 * Constantes Reactor Break. Sin pulsos falsos. Dificultad = menos tiempo de carga y menor intervalo.
 */

export const REACTOR_RADIUS = 50;
export const CANVAS_SIZE = 320;

/** Duración fase de carga (reactor se ilumina). Disminuye con dificultad. */
export const CHARGE_MS_BASE = 1200;
export const CHARGE_MS_MIN = 500;
/** Duración señal previa (flash, pulso inminente). */
export const WARNING_MS = 350;
/** Tiempo en "passed" antes del siguiente ciclo. */
export const PASSED_MS = 180;
/** Tras un éxito, el escudo se desactiva y no puede volver a activarse hasta pasado este tiempo (ms). Obliga a soltar y volver a pulsar a tiempo. */
export const SHIELD_COOLDOWN_MS = 500;
/** Cada cuántos pulsos sube la dificultad. */
export const DIFFICULTY_EVERY_PULSES = 4;
/** Reducción de carga por nivel de dificultad (ms). */
export const CHARGE_REDUCTION_PER_LEVEL = 80;

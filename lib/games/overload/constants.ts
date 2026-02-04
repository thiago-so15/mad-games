/**
 * Constantes OVERLOAD. Barra de energía, zona segura, liberación.
 */

export const CANVAS_WIDTH = 400;
export const CANVAS_HEIGHT = 200;

/** Energía máxima = game over */
export const ENERGY_MAX = 100;

/** Velocidad base de carga (% por segundo) */
export const CHARGE_SPEED_BASE = 18;
/** Velocidad mínima (tras penalizaciones no la bajamos de esto) */
export const CHARGE_SPEED_MIN = 12;
/** Incremento de velocidad por nivel de dificultad */
export const CHARGE_SPEED_PER_LEVEL = 3;

/** Zona segura: [start, end] en % de la barra. Liberar dentro = éxito. */
export const SAFE_ZONE_START_BASE = 55;
export const SAFE_ZONE_END_BASE = 90;
/** Cada nivel reduce el ancho de la zona (por nivel: start +X, end -X) */
export const SAFE_ZONE_SHRINK_PER_LEVEL = 4;

/** Al liberar en zona: drenaje total (energía a 0) */
export const SUCCESS_DRAIN = 100;
/** Al liberar fuera: drenaje parcial (%) */
export const PENALTY_DRAIN = 12;
/** Multiplicador de velocidad tras penalización (acumula) */
export const PENALTY_SPEED_MULT = 1.06;

/** Cada N liberaciones exitosas sube el nivel de dificultad */
export const DIFFICULTY_EVERY_SUCCESS = 5;

/** Duración del flash de éxito/error (ms) para feedback */
export const FEEDBACK_FLASH_MS = 180;

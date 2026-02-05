/**
 * VOID. Punto central; tocar cualquier límite = game over.
 * Un input invierte la dirección.
 */

export const CANVAS_WIDTH = 400;
export const CANVAS_HEIGHT = 280;

/** Velocidad del punto (px/s) */
export const POINT_SPEED = 70;

/** Margen inicial desde cada borde (px). El espacio jugable se reduce con el tiempo. */
export const INITIAL_MARGIN = 30;

/** Cuántos px por segundo se reduce el margen (por lado). */
export const SHRINK_RATE_PER_SEC = 1.5;

/** Margen mínimo (px). El espacio deja de reducirse aquí. */
export const MIN_MARGIN = 20;

/** Radio del punto (px) */
export const POINT_RADIUS = 5;

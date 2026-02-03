/**
 * Constantes del juego Snake. Fácil de tunear.
 */

export const GRID_SIZE = 20;
export const CELL_SIZE = 18;

/** Intervalo base en ms (menor = más rápido) */
export const SPEED = {
  classic: { initial: 120, min: 60, step: 2 },
  timeAttack: { initial: 110, min: 55, step: 2 },
  hardcore: { initial: 70, min: 45, step: 1 },
} as const;

export const TIME_ATTACK_DURATION_MS = 60 * 1000;
export const BONUS_FOOD_DURATION_MS = 5000;
export const BONUS_FOOD_SPAWN_CHANCE = 0.15;
export const POISON_SPAWN_CHANCE = 0.08;

export const SCORE = {
  normal: 1,
  bonus: 5,
  poison: -2,
} as const;

export const SNAKE_STORAGE_KEY = "mad-games-snake-stats";

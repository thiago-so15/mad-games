/**
 * Constantes de Ping Pong v2. Área de juego, física y power-ups.
 */

export const TABLE_WIDTH = 400;
export const TABLE_HEIGHT = 300;
export const PADDLE_WIDTH = 10;
export const PADDLE_HEIGHT = 50;
export const BALL_RADIUS = 6;
export const BALL_SPEED_INITIAL = 4;
export const BALL_SPEED_MAX = 14;
export const BALL_ACCELERATION = 0.12;
export const BALL_FAST_MODE_SPEED = 9;
export const BALL_ANGLE_VARIATION_BOUNCES = 5;
export const BALL_ANGLE_VARIATION_MAX = 0.08;
export const PADDLE_SPEED = 6;
export const WINNING_SCORE = 11;
export const SERVE_DELAY_MS = 800;

/** Palas: escala tras recibir punto y duración */
export const PADDLE_SHRINK_SCALE = 0.65;
export const PADDLE_SHRINK_DURATION_MS = 4000;
/** Power-up Long Paddle */
export const PADDLE_LONG_SCALE = 1.5;
export const PADDLE_LONG_DURATION_MS = 8000;

/** Power-ups: spawn y duración */
export const POWER_UP_SPAWN_INTERVAL_MS = 12000;
export const POWER_UP_RADIUS = 14;
export const POWER_UP_SPEED_BALL_DURATION_MS = 6000;
export const POWER_UP_SPEED_BALL_MULTIPLIER = 1.4;
export const POWER_UP_SHIELD_DURATION_MS = 0;
export const POWER_UP_LONG_PADDLE_DURATION_MS = 8000;

/** Survival: aumento de dificultad por segundo */
export const SURVIVAL_SPEED_INCREASE_PER_SEC = 0.015;
export const SURVIVAL_INITIAL_SPEED = 4;

/** AI */
export const AI_REACTION: Record<string, number> = {
  easy: 0.4,
  normal: 0.7,
  hard: 1,
};
export const AI_ERROR: Record<string, number> = {
  easy: 0.4,
  normal: 0.2,
  hard: 0.05,
};

export const POWER_UP_TYPES = ["speedBall", "shield", "longPaddle"] as const;

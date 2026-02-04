/**
 * Constantes de Breakout v2.
 */

import type { BlockType } from "./types";

export const CANVAS_WIDTH = 400;
export const CANVAS_HEIGHT = 500;
export const PADDLE_WIDTH = 70;
export const PADDLE_HEIGHT = 12;
export const PADDLE_Y = CANVAS_HEIGHT - 30;
export const PADDLE_SPEED = 8;
export const PADDLE_LONG_MULTIPLIER = 1.5;
export const BALL_RADIUS = 6;
export const BALL_SPEED = 5;
export const BALL_SPEED_FAST_MULTIPLIER = 1.35;
export const BLOCK_WIDTH = 36;
export const BLOCK_HEIGHT = 16;
export const BLOCK_COLS = 10;
export const BLOCK_ROWS_MAX = 8;
export const BLOCK_ROWS = 5;
export const BLOCK_MARGIN = 2;
export const INITIAL_LIVES = 3;
export const POWER_UP_DROP_CHANCE = 0.2;
export const POWER_UP_FALL_SPEED = 3;
export const POWER_UP_SIZE = 20;
export const LONG_PADDLE_DURATION_MS = 10000;
export const FAST_BALL_DURATION_MS = 8000;
export const EXPLOSIVE_RADIUS = 1.5;

export const SCORE_BLOCK = 10;
export const SCORE_RESISTANT = 15;
export const SCORE_EXPLOSIVE = 25;

/** Layouts Campaign: cada nivel = filas de tipos (vacío = 0). */
export type LevelRow = (BlockType | 0)[];
export const CAMPAIGN_LEVELS: LevelRow[][] = [
  [["normal", "normal", "normal", "normal", "normal", "normal", "normal", "normal", "normal", "normal"]],
  [
    ["normal", "normal", "normal", "normal", "normal", "normal", "normal", "normal", "normal", "normal"],
    ["normal", "resistant", "normal", "resistant", "normal", "resistant", "normal", "resistant", "normal", "resistant"],
  ],
  [
    ["normal", "normal", "explosive", "normal", "normal", "normal", "explosive", "normal", "normal", "normal"],
    ["resistant", "resistant", "resistant", "resistant", "resistant", "resistant", "resistant", "resistant", "resistant", "resistant"],
  ],
  [
    ["indestructible", "normal", "normal", "normal", "explosive", "explosive", "normal", "normal", "normal", "indestructible"],
    ["normal", "normal", "normal", "resistant", "resistant", "resistant", "resistant", "normal", "normal", "normal"],
    ["normal", "normal", "normal", "normal", "normal", "normal", "normal", "normal", "normal", "normal"],
  ],
  [
    ["indestructible", 0, "normal", "normal", "explosive", "explosive", "normal", "normal", 0, "indestructible"],
    ["resistant", "resistant", "resistant", "resistant", "resistant", "resistant", "resistant", "resistant", "resistant", "resistant"],
    ["normal", "normal", "normal", "normal", "normal", "normal", "normal", "normal", "normal", "normal"],
    ["normal", "normal", "normal", "normal", "normal", "normal", "normal", "normal", "normal", "normal"],
  ],
];

export const BLOCK_HITS: Record<BlockType, number> = {
  normal: 1,
  resistant: 3,
  explosive: 1,
  indestructible: -1,
};

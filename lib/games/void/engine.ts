/**
 * Motor VOID. Punto se mueve; límites se acercan; tocar límite = game over.
 * Un input invierte la dirección al instante.
 */

import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  POINT_SPEED,
  INITIAL_MARGIN,
  SHRINK_RATE_PER_SEC,
  MIN_MARGIN,
  POINT_RADIUS,
} from "./constants";
import type { VoidGameState } from "./types";

function getMarginAt(elapsedSec: number): number {
  const shrink = SHRINK_RATE_PER_SEC * elapsedSec;
  return Math.max(MIN_MARGIN, INITIAL_MARGIN - shrink);
}

export function createInitialState(): VoidGameState {
  const now = Date.now();
  const cx = CANVAS_WIDTH / 2;
  const cy = CANVAS_HEIGHT / 2;
  return {
    x: cx,
    y: cy,
    vx: POINT_SPEED,
    vy: 0,
    gameStartTime: now,
    lastUpdateAt: now,
    phase: "playing",
    paused: false,
    survivalTimeMs: 0,
  };
}

export function reverseDirection(state: VoidGameState): VoidGameState {
  if (state.phase !== "playing" || state.paused) return state;
  return {
    ...state,
    vx: -state.vx,
    vy: -state.vy,
  };
}

export function tick(state: VoidGameState, now: number): VoidGameState {
  if (state.phase !== "playing" || state.paused) return state;

  const dtMs = now - state.lastUpdateAt;
  const dtSec = dtMs / 1000;
  const elapsedSec = (now - state.gameStartTime) / 1000;
  const margin = getMarginAt(elapsedSec);

  const left = margin;
  const right = CANVAS_WIDTH - margin;
  const top = margin;
  const bottom = CANVAS_HEIGHT - margin;

  let x = state.x + state.vx * dtSec;
  let y = state.y + state.vy * dtSec;

  const r = POINT_RADIUS;
  if (x - r <= left || x + r >= right || y - r <= top || y + r >= bottom) {
    return {
      ...state,
      x,
      y,
      lastUpdateAt: now,
      survivalTimeMs: Math.max(0, now - state.gameStartTime),
      phase: "gameOver",
    };
  }

  return {
    ...state,
    x,
    y,
    lastUpdateAt: now,
    survivalTimeMs: now - state.gameStartTime,
  };
}

export function togglePause(state: VoidGameState): VoidGameState {
  if (state.phase !== "playing") return state;
  return { ...state, paused: !state.paused };
}

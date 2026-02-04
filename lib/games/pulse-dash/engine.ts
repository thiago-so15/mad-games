/**
 * Motor Pulse Dash: corredor avanza, zonas seguras/peligrosas alternan, dash con cooldown.
 */

import {
  RUNNER_SPEED,
  LANE_COUNT,
  DASH_COOLDOWN_MS,
  ZONE_SWITCH_MS,
  DIFFICULTY_INTERVAL_MS,
} from "./constants";
import type { PulseDashGameState } from "./types";

export function createInitialState(): PulseDashGameState {
  return {
    distance: 0,
    lane: 1,
    dashCooldownMs: 0,
    zoneDanger: false,
    safeLane: 0,
    gameStartTime: Date.now(),
    phase: "playing",
    paused: false,
    difficultyLevel: 0,
  };
}

export function tick(
  state: PulseDashGameState,
  dt: number,
  speedMultiplier: number,
  dashPressed: boolean,
  now: number
): PulseDashGameState {
  if (state.phase !== "playing" || state.paused) return state;

  const elapsed = now - state.gameStartTime;
  const difficultyLevel = Math.floor(elapsed / DIFFICULTY_INTERVAL_MS);
  const speed = RUNNER_SPEED * (1 + difficultyLevel * 0.1) * speedMultiplier * (dt / 16);
  const zoneSwitch = ZONE_SWITCH_MS * Math.max(0.5, 1 - difficultyLevel * 0.05);
  const zoneIndex = Math.floor(elapsed / zoneSwitch);
  const zoneDanger = zoneIndex % 2 === 1;
  /** Carril seguro rota cada fase de peligro: 0 → 1 → 2 → 0 … */
  const safeLane = zoneIndex % LANE_COUNT;

  let { distance, lane, dashCooldownMs } = state;

  distance += speed;

  if (dashCooldownMs > 0) {
    dashCooldownMs = Math.max(0, dashCooldownMs - dt);
  } else if (dashPressed) {
    lane = (lane + 1) % LANE_COUNT;
    dashCooldownMs = DASH_COOLDOWN_MS;
  }

  const gameOver = zoneDanger && lane !== safeLane;

  return {
    ...state,
    distance,
    lane,
    dashCooldownMs,
    zoneDanger,
    safeLane,
    difficultyLevel,
    phase: gameOver ? "gameOver" : "playing",
  };
}

export function togglePause(state: PulseDashGameState): PulseDashGameState {
  if (state.phase !== "playing") return state;
  return { ...state, paused: !state.paused };
}

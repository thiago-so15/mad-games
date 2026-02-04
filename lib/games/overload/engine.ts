/**
 * Motor OVERLOAD. Una regla: energía al 100% = game over.
 * Barra sube; liberar en zona segura = éxito; fuera = penalización.
 */

import {
  ENERGY_MAX,
  CHARGE_SPEED_BASE,
  CHARGE_SPEED_PER_LEVEL,
  SAFE_ZONE_START_BASE,
  SAFE_ZONE_END_BASE,
  SAFE_ZONE_SHRINK_PER_LEVEL,
  SUCCESS_DRAIN,
  PENALTY_DRAIN,
  PENALTY_SPEED_MULT,
  DIFFICULTY_EVERY_SUCCESS,
  FEEDBACK_FLASH_MS,
} from "./constants";
import type { OverloadGameState } from "./types";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getSafeZone(level: number): { start: number; end: number } {
  const shrink = level * SAFE_ZONE_SHRINK_PER_LEVEL;
  const start = clamp(SAFE_ZONE_START_BASE + shrink, 20, 75);
  const end = clamp(SAFE_ZONE_END_BASE - shrink, 25, 95);
  return { start: Math.min(start, end - 5), end };
}

function getBaseChargeSpeed(level: number, speedMultiplier: number): number {
  return (CHARGE_SPEED_BASE + level * CHARGE_SPEED_PER_LEVEL) * speedMultiplier;
}

export function createInitialState(speedMultiplier: number): OverloadGameState {
  const now = Date.now();
  const { start, end } = getSafeZone(0);
  return {
    energy: 0,
    chargeSpeed: getBaseChargeSpeed(0, speedMultiplier),
    safeZoneStart: start,
    safeZoneEnd: end,
    difficultyLevel: 0,
    score: 0,
    perfectCombo: 0,
    bestCombo: 0,
    lastUpdateAt: now,
    phase: "playing",
    paused: false,
    gameStartTime: now,
    feedback: null,
    feedbackUntil: 0,
  };
}

export function tick(
  state: OverloadGameState,
  now: number,
  speedMultiplier: number
): OverloadGameState {
  if (state.phase !== "playing" || state.paused) return state;

  const dtMs = now - state.lastUpdateAt;
  const dtSec = dtMs / 1000;
  let energy = state.energy + state.chargeSpeed * dtSec;

  if (energy >= ENERGY_MAX) {
    return {
      ...state,
      energy: ENERGY_MAX,
      lastUpdateAt: now,
      phase: "gameOver",
    };
  }

  let feedback = state.feedback;
  let feedbackUntil = state.feedbackUntil;
  if (state.feedback && now >= state.feedbackUntil) {
    feedback = null;
    feedbackUntil = 0;
  }

  return {
    ...state,
    energy: clamp(energy, 0, ENERGY_MAX),
    lastUpdateAt: now,
    feedback,
    feedbackUntil,
  };
}

/** Un solo botón: liberar energía al instante. Sin delay. */
export function release(
  state: OverloadGameState,
  now: number,
  speedMultiplier: number
): OverloadGameState {
  if (state.phase !== "playing" || state.paused) return state;

  const inZone =
    state.energy >= state.safeZoneStart && state.energy <= state.safeZoneEnd;

  if (inZone) {
    const comboBonus = Math.min(state.perfectCombo, 5);
    const newScore = state.score + 1 + comboBonus;
    const newCombo = state.perfectCombo + 1;
    const newBestCombo = Math.max(state.bestCombo, newCombo);
    const newLevel = Math.floor((state.score + 1) / DIFFICULTY_EVERY_SUCCESS);
    const { start, end } = getSafeZone(newLevel);
    const baseSpeed = getBaseChargeSpeed(newLevel, speedMultiplier);
    const chargeSpeed = Math.max(state.chargeSpeed, baseSpeed);

    return {
      ...state,
      energy: Math.max(0, state.energy - SUCCESS_DRAIN),
      chargeSpeed,
      safeZoneStart: start,
      safeZoneEnd: end,
      difficultyLevel: newLevel,
      score: newScore,
      perfectCombo: newCombo,
      bestCombo: newBestCombo,
      lastUpdateAt: now,
      feedback: "success",
      feedbackUntil: now + FEEDBACK_FLASH_MS,
    };
  }

  const energyAfter = Math.max(0, state.energy - PENALTY_DRAIN);
  const chargeSpeedAfter = state.chargeSpeed * PENALTY_SPEED_MULT;

  return {
    ...state,
    energy: energyAfter,
    chargeSpeed: chargeSpeedAfter,
    perfectCombo: 0,
    lastUpdateAt: now,
    feedback: "penalty",
    feedbackUntil: now + FEEDBACK_FLASH_MS,
  };
}

export function togglePause(state: OverloadGameState): OverloadGameState {
  if (state.phase !== "playing") return state;
  return { ...state, paused: !state.paused };
}

/**
 * Motor Reactor Break. Una regla: escudo ACTIVO en el instante del pulso = éxito.
 * Loop: charge → warning → pulse (evaluar) → passed → siguiente ciclo (más rápido).
 */

import {
  CHARGE_MS_BASE,
  CHARGE_MS_MIN,
  WARNING_MS,
  PASSED_MS,
  SHIELD_COOLDOWN_MS,
  DIFFICULTY_EVERY_PULSES,
  CHARGE_REDUCTION_PER_LEVEL,
} from "./constants";
import type { ReactorGameState } from "./types";

function getChargeMs(level: number, speedMultiplier: number): number {
  const reduction = level * CHARGE_REDUCTION_PER_LEVEL;
  return Math.max(CHARGE_MS_MIN, (CHARGE_MS_BASE - reduction) / speedMultiplier);
}

export function createInitialState(speedMultiplier: number): ReactorGameState {
  const now = Date.now();
  return {
    shieldOn: false,
    pulsePhase: "charge",
    cycleStartAt: now,
    passedUntil: 0,
    shieldCooldownUntil: 0,
    pulsesSurvived: 0,
    bestCombo: 0,
    currentCombo: 0,
    phase: "playing",
    gameOverReason: null,
    gameStartTime: now,
    paused: false,
    difficultyLevel: 0,
  };
}

export function tick(state: ReactorGameState, now: number, speedMultiplier: number): ReactorGameState {
  if (state.phase !== "playing" || state.paused) return state;

  const chargeMs = getChargeMs(state.difficultyLevel, speedMultiplier);
  const pulseTime = state.cycleStartAt + chargeMs + WARNING_MS;

  if (state.pulsePhase === "charge") {
    if (now >= state.cycleStartAt + chargeMs) {
      return { ...state, pulsePhase: "warning" };
    }
    return state;
  }

  if (state.pulsePhase === "warning") {
    if (now >= pulseTime) {
      // PULSO: evaluar escudo solo en este instante
      if (state.shieldOn) {
        const newCombo = state.currentCombo + 1;
        return {
          ...state,
          pulsePhase: "passed",
          passedUntil: now + PASSED_MS,
          shieldOn: false,
          shieldCooldownUntil: now + SHIELD_COOLDOWN_MS,
          pulsesSurvived: state.pulsesSurvived + 1,
          currentCombo: newCombo,
          bestCombo: Math.max(state.bestCombo, newCombo),
        };
      }
      return {
        ...state,
        phase: "gameOver",
        gameOverReason: "miss",
      };
    }
    return state;
  }

  if (state.pulsePhase === "passed") {
    if (now >= state.passedUntil) {
      const nextLevel = Math.floor((state.pulsesSurvived + 1) / DIFFICULTY_EVERY_PULSES);
      return {
        ...state,
        pulsePhase: "charge",
        cycleStartAt: now,
        difficultyLevel: nextLevel,
      };
    }
    return state;
  }

  return state;
}

/** Input en tiempo real: mantener = escudo activo, soltar = inactivo. Durante el cooldown no se puede activar. */
export function setShield(state: ReactorGameState, on: boolean, now: number = 0): ReactorGameState {
  if (state.phase !== "playing") return state;
  if (on && state.shieldCooldownUntil > 0 && now < state.shieldCooldownUntil) {
    return { ...state, shieldOn: false };
  }
  return { ...state, shieldOn: on };
}

export function togglePause(state: ReactorGameState): ReactorGameState {
  if (state.phase !== "playing") return state;
  return { ...state, paused: !state.paused };
}

/** Progreso de la fase de carga (0 a 1) para animación. */
export function getChargeProgress(state: ReactorGameState, now: number, speedMultiplier: number): number {
  if (state.pulsePhase !== "charge") return 1;
  const chargeMs = getChargeMs(state.difficultyLevel, speedMultiplier);
  const elapsed = now - state.cycleStartAt;
  return Math.min(1, elapsed / chargeMs);
}

/** Progreso de la señal previa (0 a 1). */
export function getWarningProgress(state: ReactorGameState, now: number, speedMultiplier: number): number {
  if (state.pulsePhase !== "warning") return state.pulsePhase === "pulse" || state.pulsePhase === "passed" ? 1 : 0;
  const chargeMs = getChargeMs(state.difficultyLevel, speedMultiplier);
  const warningStart = state.cycleStartAt + chargeMs;
  const elapsed = now - warningStart;
  return Math.min(1, elapsed / WARNING_MS);
}

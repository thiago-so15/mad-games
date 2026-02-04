/**
 * Motor Reactor Break: pulsos, ventana de hit, combo, dificultad progresiva. Sin UI.
 */

import {
  PULSE_ACTIVE_MS,
  PULSE_WARNING_MS,
  PULSE_INTERVAL_BASE_MS,
  PULSE_INTERVAL_MIN_MS,
  DIFFICULTY_EVERY_PULSES,
  FAKE_PULSE_CHANCE,
} from "./constants";
import type { ReactorGameState } from "./types";

export function createInitialState(speedMultiplier: number): ReactorGameState {
  const now = Date.now();
  const interval = Math.max(PULSE_INTERVAL_MIN_MS, PULSE_INTERVAL_BASE_MS / speedMultiplier);
  return {
    shieldOn: false,
    pulsePhase: "idle",
    pulseActiveAt: 0,
    nextPulseAt: now + interval - PULSE_WARNING_MS,
    pulsesSurvived: 0,
    bestCombo: 0,
    currentCombo: 0,
    phase: "playing",
    gameOverReason: null,
    gameStartTime: now,
    paused: false,
    difficultyLevel: 0,
    isFakePulse: false,
  };
}

function getPulseInterval(level: number, speedMultiplier: number): number {
  const reduction = Math.min(level * 45, PULSE_INTERVAL_BASE_MS - PULSE_INTERVAL_MIN_MS);
  return Math.max(PULSE_INTERVAL_MIN_MS, (PULSE_INTERVAL_BASE_MS - reduction) / speedMultiplier);
}

export function tick(state: ReactorGameState, now: number, speedMultiplier: number): ReactorGameState {
  if (state.phase !== "playing" || state.paused) return state;

  let s = { ...state };

  if (s.pulsePhase === "idle" && now >= s.nextPulseAt) {
    s.pulsePhase = "warning";
    s.nextPulseAt = now + PULSE_WARNING_MS;
  } else if (s.pulsePhase === "warning" && now >= s.nextPulseAt) {
    s.pulsePhase = "active";
    s.pulseActiveAt = now;
    s.nextPulseAt = now + PULSE_ACTIVE_MS;
  } else if (s.pulsePhase === "active") {
    if (s.shieldOn) {
      if (!s.isFakePulse) {
        s.pulsesSurvived += 1;
        s.currentCombo += 1;
        s.bestCombo = Math.max(s.bestCombo, s.currentCombo);
      }
      s.pulsePhase = "passed";
      s.nextPulseAt = now + PULSE_ACTIVE_MS * 0.3;
    } else if (now - s.pulseActiveAt >= PULSE_ACTIVE_MS) {
      if (!s.isFakePulse) {
        s.phase = "gameOver";
        s.gameOverReason = "miss";
      } else {
        s.pulsePhase = "passed";
        s.nextPulseAt = now + PULSE_ACTIVE_MS * 0.3;
      }
    }
  } else if (s.pulsePhase === "passed" && now >= s.nextPulseAt) {
    if (!s.shieldOn) s.currentCombo = 0;
    s.difficultyLevel = Math.floor(s.pulsesSurvived / DIFFICULTY_EVERY_PULSES);
    const interval = getPulseInterval(s.difficultyLevel, speedMultiplier);
    s.nextPulseAt = now + interval - PULSE_WARNING_MS;
    s.pulsePhase = "idle";
    s.isFakePulse = Math.random() < FAKE_PULSE_CHANCE;
  }

  return s;
}

export function toggleShield(state: ReactorGameState): ReactorGameState {
  if (state.phase !== "playing") return state;
  return { ...state, shieldOn: !state.shieldOn };
}

export function togglePause(state: ReactorGameState): ReactorGameState {
  if (state.phase !== "playing") return state;
  return { ...state, paused: !state.paused };
}

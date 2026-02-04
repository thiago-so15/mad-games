/**
 * Motor Memory Glitch: patrones breves, el jugador repite, tiempo disminuye.
 */

import {
  BUTTON_COUNT,
  SHOW_DURATION_BASE_MS,
  SHOW_DURATION_MIN_MS,
  INPUT_DURATION_BASE_MS,
  INPUT_DURATION_MIN_MS,
  PATTERN_LENGTH_START,
} from "./constants";
import type { MemoryGlitchGameState } from "./types";

function getShowDuration(round: number): number {
  return Math.max(SHOW_DURATION_MIN_MS, SHOW_DURATION_BASE_MS - round * 50);
}

function getInputDuration(round: number): number {
  return Math.max(INPUT_DURATION_MIN_MS, INPUT_DURATION_BASE_MS - round * 80);
}

function generatePattern(length: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < length; i++) {
    out.push(Math.floor(Math.random() * BUTTON_COUNT));
  }
  return out;
}

export function createInitialState(): MemoryGlitchGameState {
  const len = PATTERN_LENGTH_START;
  const pattern = generatePattern(len);
  const showDuration = getShowDuration(0);
  const now = Date.now();
  return {
    pattern,
    input: [],
    round: 0,
    phase: "show",
    phaseEndAt: now + showDuration,
    gameStartTime: now,
    showDurationMs: showDuration,
    inputDurationMs: getInputDuration(0),
    perfectRound: true,
    gameOver: false,
    paused: false,
  };
}

export function tick(
  state: MemoryGlitchGameState,
  now: number
): MemoryGlitchGameState {
  if (state.gameOver || state.paused) return state;

  if (state.phase === "show" && now >= state.phaseEndAt) {
    return {
      ...state,
      phase: "input",
      phaseEndAt: now + state.inputDurationMs,
    };
  }

  if (state.phase === "input" && now >= state.phaseEndAt) {
    return { ...state, gameOver: true };
  }

  if (state.phase === "correct" && now >= state.phaseEndAt) {
    const nextRound = state.round + 1;
    const patternLen = PATTERN_LENGTH_START + Math.floor(nextRound / 2);
    const pattern = generatePattern(patternLen);
    const showDuration = getShowDuration(nextRound);
    const inputDuration = getInputDuration(nextRound);
    return {
      ...state,
      round: nextRound,
      pattern,
      input: [],
      phase: "show",
      phaseEndAt: now + showDuration,
      showDurationMs: showDuration,
      inputDurationMs: inputDuration,
      perfectRound: true,
    };
  }

  if (state.phase === "wrong") {
    return { ...state, gameOver: true };
  }

  return state;
}

export function inputKey(
  state: MemoryGlitchGameState,
  keyIndex: number,
  now: number
): MemoryGlitchGameState {
  if (state.phase !== "input" || state.gameOver) return state;

  const expected = state.pattern[state.input.length];
  const correct = keyIndex === expected;
  const newInput = [...state.input, keyIndex];

  if (!correct) {
    return { ...state, phase: "wrong", input: newInput };
  }

  if (newInput.length === state.pattern.length) {
    return {
      ...state,
      input: newInput,
      phase: "correct",
      phaseEndAt: now + 400,
    };
  }

  return { ...state, input: newInput };
}

export function togglePause(state: MemoryGlitchGameState): MemoryGlitchGameState {
  if (state.gameOver) return state;
  return { ...state, paused: !state.paused };
}

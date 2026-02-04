/**
 * Motor PHASE. Una regla: fase correcta en el impacto = sigue; incorrecta = game over.
 * Obstáculos vienen hacia la línea de impacto; un botón cambia la fase al instante.
 */

import {
  IMPACT_LINE_X,
  CANVAS_WIDTH,
  OBSTACLE_SPEED_BASE,
  OBSTACLE_SPEED_PER_LEVEL,
  SPAWN_INTERVAL_BASE_MS,
  SPAWN_INTERVAL_MIN_MS,
  DIFFICULTY_EVERY_SUCCESS,
  OBSTACLE_WIDTH,
  OBSTACLE_HEIGHT,
  FEEDBACK_FLASH_MS,
} from "./constants";
import type { PhaseGameState, PhaseObstacle, PhaseKind } from "./types";

let obstacleId = 0;

/** Velocidad en px por segundo */
function getObstacleSpeed(level: number, speedMultiplier: number): number {
  return (OBSTACLE_SPEED_BASE + level * OBSTACLE_SPEED_PER_LEVEL) * speedMultiplier;
}

export function createInitialState(speedMultiplier: number): PhaseGameState {
  const now = Date.now();
  return {
    playerPhase: 0,
    obstaculos: [],
    score: 0,
    perfectCombo: 0,
    bestCombo: 0,
    gameStartTime: now,
    lastSpawnAt: now,
    lastUpdateAt: now,
    phase: "playing",
    paused: false,
    difficultyLevel: 0,
    feedback: null,
    feedbackUntil: 0,
  };
}

export function togglePhase(state: PhaseGameState): PhaseGameState {
  if (state.phase !== "playing" || state.paused) return state;
  return {
    ...state,
    playerPhase: (state.playerPhase === 0 ? 1 : 0) as PhaseKind,
  };
}

export function tick(
  state: PhaseGameState,
  now: number,
  speedMultiplier: number
): PhaseGameState {
  if (state.phase !== "playing" || state.paused) return state;

  const dtMs = now - state.lastUpdateAt;
  const dtSec = dtMs / 1000;
  const level = state.difficultyLevel;
  const spawnInterval = Math.max(
    SPAWN_INTERVAL_MIN_MS,
    SPAWN_INTERVAL_BASE_MS - level * 60
  );

  let obstaculos = state.obstaculos
    .map((o) => ({ ...o, x: o.x - o.speed * (dtMs / 1000) }))
    .filter((o) => o.x + o.width > 0);

  let lastSpawnAt = state.lastSpawnAt;
  if (now - state.lastSpawnAt >= spawnInterval) {
    const phase = (Math.random() < 0.5 ? 0 : 1) as PhaseKind;
    const speed = getObstacleSpeed(level, speedMultiplier);
    obstaculos = [
      ...obstaculos,
      {
        id: `phase-${++obstacleId}-${now}`,
        x: CANVAS_WIDTH,
        phase,
        speed,
        width: OBSTACLE_WIDTH,
        height: OBSTACLE_HEIGHT,
      },
    ];
    lastSpawnAt = now;
  }

  let score = state.score;
  let perfectCombo = state.perfectCombo;
  let bestCombo = state.bestCombo;
  let difficultyLevel = state.difficultyLevel;
  let feedback = state.feedback;
  let feedbackUntil = state.feedbackUntil;
  let gameOver = false;
  const remaining: PhaseObstacle[] = [];

  for (const o of obstaculos) {
    if (gameOver) {
      remaining.push(o);
      continue;
    }
    const impactX = o.x + o.width * 0.5;
    if (impactX <= IMPACT_LINE_X) {
      if (o.phase === state.playerPhase) {
        score += 1;
        perfectCombo += 1;
        bestCombo = Math.max(bestCombo, perfectCombo);
        difficultyLevel = Math.floor(score / DIFFICULTY_EVERY_SUCCESS);
        feedback = "success";
        feedbackUntil = now + FEEDBACK_FLASH_MS;
      } else {
        gameOver = true;
        feedback = "fail";
        feedbackUntil = now + FEEDBACK_FLASH_MS;
      }
      continue;
    }
    remaining.push(o);
  }

  if (!gameOver && state.feedback && now >= state.feedbackUntil) {
    feedback = null;
    feedbackUntil = 0;
  }

  return {
    ...state,
    obstaculos: remaining,
    score,
    perfectCombo: gameOver ? state.perfectCombo : perfectCombo,
    bestCombo,
    lastSpawnAt,
    lastUpdateAt: now,
    difficultyLevel,
    phase: gameOver ? "gameOver" : "playing",
    feedback: gameOver ? "fail" : feedback,
    feedbackUntil,
  };
}

export function togglePause(state: PhaseGameState): PhaseGameState {
  if (state.phase !== "playing") return state;
  return { ...state, paused: !state.paused };
}

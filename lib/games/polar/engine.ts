/**
 * Motor POLAR. Una regla: polaridad correcta en el impacto = sigue; incorrecta = game over.
 * Obstáculos se acercan a la línea de impacto; un botón alterna polaridad al instante.
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
import type { PolarGameState, PolarObstacle, PolarityKind } from "./types";

let obstacleId = 0;

/** Velocidad en px por segundo */
function getObstacleSpeed(level: number, speedMultiplier: number): number {
  return (OBSTACLE_SPEED_BASE + level * OBSTACLE_SPEED_PER_LEVEL) * speedMultiplier;
}

export function createInitialState(speedMultiplier: number): PolarGameState {
  const now = Date.now();
  return {
    playerPolarity: 0,
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

export function togglePolarity(state: PolarGameState): PolarGameState {
  if (state.phase !== "playing" || state.paused) return state;
  return {
    ...state,
    playerPolarity: (state.playerPolarity === 0 ? 1 : 0) as PolarityKind,
  };
}

export function tick(
  state: PolarGameState,
  now: number,
  speedMultiplier: number
): PolarGameState {
  if (state.phase !== "playing" || state.paused) return state;

  const dtMs = now - state.lastUpdateAt;
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
    const polarity = (Math.random() < 0.5 ? 0 : 1) as PolarityKind;
    const speed = getObstacleSpeed(level, speedMultiplier);
    obstaculos = [
      ...obstaculos,
      {
        id: `polar-${++obstacleId}-${now}`,
        x: CANVAS_WIDTH,
        polarity,
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
  const remaining: PolarObstacle[] = [];

  for (const o of obstaculos) {
    if (gameOver) {
      remaining.push(o);
      continue;
    }
    const impactX = o.x + o.width * 0.5;
    if (impactX <= IMPACT_LINE_X) {
      if (o.polarity === state.playerPolarity) {
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

export function togglePause(state: PolarGameState): PolarGameState {
  if (state.phase !== "playing") return state;
  return { ...state, paused: !state.paused };
}

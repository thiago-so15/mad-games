/**
 * Motor Shift: dos fases, obstáculos por fase, cambiar a tiempo.
 */

import {
  CANVAS_HEIGHT,
  PLAYER_Y,
  PLAYER_SIZE,
  OBSTACLE_HEIGHT,
  OBSTACLE_SPEED,
  SPAWN_INTERVAL_MS,
  PHASE_SWITCH_COOLDOWN_MS,
  DIFFICULTY_INTERVAL_MS,
} from "./constants";
import type { ShiftGameState, ShiftObstacle } from "./types";

let obsId = 0;

export function createInitialState(): ShiftGameState {
  const now = Date.now();
  return {
    playerPhase: 0,
    playerY: PLAYER_Y,
    obstacles: [],
    gameStartTime: now,
    lastSpawnAt: now,
    lastSwitchAt: 0,
    survivalTimeMs: 0,
    phase: "playing",
    paused: false,
    difficultyLevel: 0,
  };
}

export function tick(
  state: ShiftGameState,
  dt: number,
  speedMultiplier: number,
  switchPressed: boolean,
  now: number
): ShiftGameState {
  if (state.phase !== "playing" || state.paused) return state;

  const elapsed = now - state.gameStartTime;
  const survivalTimeMs = elapsed;
  const difficultyLevel = Math.floor(elapsed / DIFFICULTY_INTERVAL_MS);
  const spawnInterval = Math.max(600, SPAWN_INTERVAL_MS - difficultyLevel * 50);
  const baseSpeed = OBSTACLE_SPEED * (1 + difficultyLevel * 0.08) * speedMultiplier;

  let playerPhase = state.playerPhase;
  let lastSwitchAt = state.lastSwitchAt;
  if (switchPressed && now - state.lastSwitchAt >= PHASE_SWITCH_COOLDOWN_MS) {
    playerPhase = (state.playerPhase === 0 ? 1 : 0) as 0 | 1;
    lastSwitchAt = now;
  }

  let obstacles = state.obstacles.map((o) => ({
    ...o,
    y: o.y + o.speed * (dt / 16),
  }));

  let nextSpawnAt = state.lastSpawnAt;
  if (now - state.lastSpawnAt >= spawnInterval) {
    const phase = Math.random() < 0.5 ? 0 : 1;
    obstacles = [
      ...obstacles,
      {
        id: `o-${++obsId}-${now}`,
        y: -OBSTACLE_HEIGHT,
        phase: phase as 0 | 1,
        height: OBSTACLE_HEIGHT,
        speed: baseSpeed,
      },
    ];
    nextSpawnAt = now;
  }

  obstacles = obstacles.filter((o) => o.y < CANVAS_HEIGHT + o.height);

  let gameOver = false;
  const playerTop = PLAYER_Y - PLAYER_SIZE / 2;
  const playerBottom = PLAYER_Y + PLAYER_SIZE / 2;

  for (const o of obstacles) {
    if (o.phase !== playerPhase) continue;
    const oTop = o.y;
    const oBottom = o.y + o.height;
    if (playerBottom >= oTop && playerTop <= oBottom) {
      gameOver = true;
      break;
    }
  }

  return {
    ...state,
    playerPhase,
    obstacles,
    lastSpawnAt: nextSpawnAt,
    lastSwitchAt,
    survivalTimeMs,
    difficultyLevel,
    phase: gameOver ? "gameOver" : "playing",
  };
}

export function togglePause(state: ShiftGameState): ShiftGameState {
  if (state.phase !== "playing") return state;
  return { ...state, paused: !state.paused };
}

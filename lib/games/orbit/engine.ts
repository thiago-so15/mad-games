/**
 * Motor Orbit: núcleo orbita, obstáculos desde centro. Sin UI.
 */

import {
  CENTER,
  PLAYER_RADIUS,
  RADIUS_MIN,
  RADIUS_MAX,
  RADIUS_SPEED,
  ANGLE_SPEED,
  OBSTACLE_SIZE,
  OBSTACLE_SPEED_MIN,
  OBSTACLE_SPEED_MAX,
  SPAWN_INTERVAL_BASE_MS,
  SPAWN_INTERVAL_MIN_MS,
  DIFFICULTY_INTERVAL_MS,
} from "./constants";
import type { OrbitGameState, OrbitObstacle } from "./types";

let obstacleId = 0;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function playerPos(angle: number, radius: number): { x: number; y: number } {
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  };
}

function obstaclePos(angle: number, distance: number): { x: number; y: number } {
  return {
    x: CENTER + distance * Math.cos(angle),
    y: CENTER + distance * Math.sin(angle),
  };
}

export function createInitialState(): OrbitGameState {
  return {
    angle: 0,
    radius: (RADIUS_MIN + RADIUS_MAX) / 2,
    holding: false,
    score: 0,
    obstacles: [],
    gameStartTime: Date.now(),
    phase: "playing",
    paused: false,
    difficultyLevel: 0,
  };
}

export function tick(
  state: OrbitGameState,
  dt: number,
  speedMultiplier: number,
  holding: boolean,
  lastSpawnAt: number,
  now: number
): { state: OrbitGameState; lastSpawnAt: number } {
  if (state.phase !== "playing" || state.paused) {
    return { state, lastSpawnAt };
  }

  const elapsed = now - state.gameStartTime;
  const difficultyLevel = Math.floor(elapsed / DIFFICULTY_INTERVAL_MS);
  const spawnInterval = Math.max(
    SPAWN_INTERVAL_MIN_MS,
    SPAWN_INTERVAL_BASE_MS - difficultyLevel * 40
  );

  let angle = state.angle + ANGLE_SPEED * speedMultiplier * (dt / 16);
  if (angle > Math.PI * 2) angle -= Math.PI * 2;
  if (angle < 0) angle += Math.PI * 2;

  const targetRadius = holding ? RADIUS_MIN : RADIUS_MAX;
  const radiusStep = RADIUS_SPEED * (dt / 16) * speedMultiplier;
  let radius = state.radius;
  if (radius < targetRadius) radius = Math.min(radius + radiusStep, targetRadius);
  else if (radius > targetRadius) radius = Math.max(radius - radiusStep, targetRadius);
  radius = clamp(radius, RADIUS_MIN, RADIUS_MAX);

  const speedRange = OBSTACLE_SPEED_MAX - OBSTACLE_SPEED_MIN;
  const obstacleSpeedBase = OBSTACLE_SPEED_MIN + speedRange * Math.min(0.5 + difficultyLevel * 0.05, 0.8);

  let obstacles = state.obstacles.map((o) => ({
    ...o,
    distance: o.distance + o.speed * (dt / 16) * speedMultiplier,
  }));

  let nextSpawnAt = lastSpawnAt;
  if (now - lastSpawnAt >= spawnInterval) {
    const angleOffset = Math.random() * Math.PI * 2;
    obstacles = [
      ...obstacles,
      {
        id: `obs-${++obstacleId}-${now}`,
        angle: angleOffset,
        distance: 0,
        speed: obstacleSpeedBase * (0.9 + Math.random() * 0.2),
        size: OBSTACLE_SIZE,
      },
    ];
    nextSpawnAt = now;
  }

  const player = playerPos(angle, radius);
  let score = state.score;
  const remaining: OrbitObstacle[] = [];
  let gameOver = false;

  for (const o of obstacles) {
    if (o.distance > RADIUS_MAX + o.size * 2) {
      score += 1;
      continue;
    }
    const op = obstaclePos(o.angle, o.distance);
    const dist = Math.hypot(player.x - op.x, player.y - op.y);
    if (dist < PLAYER_RADIUS + o.size) {
      gameOver = true;
      break;
    }
    remaining.push(o);
  }

  return {
    state: {
      ...state,
      angle,
      radius,
      holding,
      score,
      obstacles: remaining,
      difficultyLevel,
      phase: gameOver ? "gameOver" : "playing",
    },
    lastSpawnAt: nextSpawnAt,
  };
}

export function togglePause(state: OrbitGameState): OrbitGameState {
  if (state.phase !== "playing") return state;
  return { ...state, paused: !state.paused };
}

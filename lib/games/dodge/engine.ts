/**
 * Motor Dodge Madness: obstáculos desde bordes, colisiones, dificultad progresiva. Sin UI.
 */

import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PLAYER_SIZE,
  PLAYER_SPEED,
  OBSTACLE_BASE_SIZE,
  OBSTACLE_MIN_SPEED,
  OBSTACLE_MAX_SPEED,
  DIFFICULTY_INTERVAL_MS,
  SPAWN_INTERVAL_BASE_MS,
  SPAWN_INTERVAL_MIN_MS,
  OBSTACLES_PER_LEVEL,
} from "./constants";
import type { DodgeGameState, Obstacle, Vec2 } from "./types";

let obstacleId = 0;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Bordes: top, right, bottom, left. Spawn en un punto del borde, velocidad hacia el centro. */
function spawnObstacle(state: DodgeGameState, speedMultiplier: number): Obstacle {
  const level = state.difficultyLevel;
  const speedRange = OBSTACLE_MAX_SPEED - OBSTACLE_MIN_SPEED;
  const speed = OBSTACLE_MIN_SPEED + (speedRange * (0.4 + 0.5 * Math.min(level / 15, 1))) * speedMultiplier;
  const size = Math.max(8, OBSTACLE_BASE_SIZE - Math.floor(level / 5) * 1);

  const edge = Math.floor(Math.random() * 4);
  const centerX = CANVAS_WIDTH / 2;
  const centerY = CANVAS_HEIGHT / 2;

  let pos: Vec2;
  let vel: Vec2;

  switch (edge) {
    case 0: // top
      pos = { x: Math.random() * CANVAS_WIDTH, y: -size - 2 };
      vel = { x: (centerX - pos.x) * (speed / Math.hypot(centerX - pos.x, centerY - pos.y)), y: (centerY - pos.y) * (speed / Math.hypot(centerX - pos.x, centerY - pos.y)) };
      break;
    case 1: // right
      pos = { x: CANVAS_WIDTH + size + 2, y: Math.random() * CANVAS_HEIGHT };
      vel = { x: (centerX - pos.x) * (speed / Math.hypot(centerX - pos.x, centerY - pos.y)), y: (centerY - pos.y) * (speed / Math.hypot(centerX - pos.x, centerY - pos.y)) };
      break;
    case 2: // bottom
      pos = { x: Math.random() * CANVAS_WIDTH, y: CANVAS_HEIGHT + size + 2 };
      vel = { x: (centerX - pos.x) * (speed / Math.hypot(centerX - pos.x, centerY - pos.y)), y: (centerY - pos.y) * (speed / Math.hypot(centerX - pos.x, centerY - pos.y)) };
      break;
    default: // left
      pos = { x: -size - 2, y: Math.random() * CANVAS_HEIGHT };
      vel = { x: (centerX - pos.x) * (speed / Math.hypot(centerX - pos.x, centerY - pos.y)), y: (centerY - pos.y) * (speed / Math.hypot(centerX - pos.x, centerY - pos.y)) };
  }

  return {
    id: `obs-${++obstacleId}`,
    pos,
    vel,
    size,
  };
}

function rectOverlap(
  ax: number, ay: number, asize: number,
  bx: number, by: number, bsize: number
): boolean {
  const halfA = asize / 2;
  const halfB = bsize / 2;
  return (
    ax - halfA < bx + halfB &&
    ax + halfA > bx - halfB &&
    ay - halfA < by + halfB &&
    ay + halfA > by - halfB
  );
}

export function createInitialState(speedMultiplier: number): DodgeGameState {
  return {
    player: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 },
    obstacles: [],
    survivalTimeMs: 0,
    gameStartTime: Date.now(),
    phase: "playing",
    paused: false,
    difficultyLevel: 0,
  };
}

export function tick(
  state: DodgeGameState,
  dt: number,
  speedMultiplier: number,
  keys: { up: boolean; down: boolean; left: boolean; right: boolean },
  lastSpawnAt: number,
  now: number
): { state: DodgeGameState; lastSpawnAt: number } {
  if (state.phase !== "playing" || state.paused) {
    return { state, lastSpawnAt };
  }

  const elapsed = now - state.gameStartTime;
  const survivalTimeMs = elapsed;
  const difficultyLevel = Math.floor(elapsed / DIFFICULTY_INTERVAL_MS);
  const spawnInterval = Math.max(
    SPAWN_INTERVAL_MIN_MS,
    SPAWN_INTERVAL_BASE_MS - difficultyLevel * 60
  );

  let player = { ...state.player };
  const speed = PLAYER_SPEED * speedMultiplier * (dt / 16);
  if (keys.up) player.y -= speed;
  if (keys.down) player.y += speed;
  if (keys.left) player.x -= speed;
  if (keys.right) player.x += speed;
  player.x = clamp(player.x, PLAYER_SIZE / 2, CANVAS_WIDTH - PLAYER_SIZE / 2);
  player.y = clamp(player.y, PLAYER_SIZE / 2, CANVAS_HEIGHT - PLAYER_SIZE / 2);

  let obstacles = state.obstacles.map((o) => ({
    ...o,
    pos: {
      x: o.pos.x + o.vel.x * (dt / 16),
      y: o.pos.y + o.vel.y * (dt / 16),
    },
  }));

  const countForLevel = Math.max(1, 1 + Math.floor(difficultyLevel * OBSTACLES_PER_LEVEL));
  let nextSpawnAt = lastSpawnAt;
  if (now - lastSpawnAt >= spawnInterval) {
    for (let i = 0; i < countForLevel; i++) {
      const newState: DodgeGameState = {
        ...state,
        player,
        obstacles,
        survivalTimeMs,
        difficultyLevel,
      };
      obstacles = [...obstacles, spawnObstacle(newState, speedMultiplier)];
    }
    nextSpawnAt = now;
  }

  obstacles = obstacles.filter(
    (o) =>
      o.pos.x > -o.size * 2 &&
      o.pos.x < CANVAS_WIDTH + o.size * 2 &&
      o.pos.y > -o.size * 2 &&
      o.pos.y < CANVAS_HEIGHT + o.size * 2
  );

  let gameOver = false;
  for (const o of obstacles) {
    if (rectOverlap(player.x, player.y, PLAYER_SIZE, o.pos.x, o.pos.y, o.size)) {
      gameOver = true;
      break;
    }
  }

  const nextState: DodgeGameState = {
    ...state,
    player,
    obstacles,
    survivalTimeMs,
    difficultyLevel,
    phase: gameOver ? "gameOver" : "playing",
  };

  return { state: nextState, lastSpawnAt: nextSpawnAt };
}

export function togglePause(state: DodgeGameState): DodgeGameState {
  if (state.phase !== "playing") return state;
  return { ...state, paused: !state.paused };
}

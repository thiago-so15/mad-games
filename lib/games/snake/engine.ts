/**
 * Motor de juego Snake: lógica pura, sin UI.
 * Fácil de testear y extender.
 */

import {
  GRID_SIZE,
  SPEED,
  TIME_ATTACK_DURATION_MS,
  BONUS_FOOD_DURATION_MS,
  BONUS_FOOD_SPAWN_CHANCE,
  POISON_SPAWN_CHANCE,
  SCORE,
} from "./constants";
import type { Cell, Direction, FoodState, FoodType, GameMode, SnakeGameState } from "./types";

export function createInitialState(mode: GameMode, speedMultiplier: number = 1): SnakeGameState {
  const speedConfig = SPEED[mode === "timeAttack" ? "timeAttack" : mode === "hardcore" ? "hardcore" : "classic"];
  const initialSpeed = Math.round(speedConfig.initial * speedMultiplier);
  return {
    snake: [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ],
    direction: "right",
    food: null,
    score: 0,
    mode,
    timeLeftMs: mode === "timeAttack" ? TIME_ATTACK_DURATION_MS : 0,
    gameOver: false,
    paused: false,
    speedMs: initialSpeed,
    lastTickAt: Date.now(),
  };
}

function randomCell(): Cell {
  return {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  }
}

function isOccupied(cell: Cell, snake: Cell[], food: FoodState | null): boolean {
  if (snake.some((c) => c.x === cell.x && c.y === cell.y)) return true;
  if (food && food.cell.x === cell.x && food.cell.y === cell.y) return true;
  return false;
}

function spawnFood(snake: Cell[], existingFood: FoodState | null, now: number): FoodState {
  let cell = randomCell();
  while (isOccupied(cell, snake, existingFood)) {
    cell = randomCell();
  }
  let type: FoodType = "normal";
  const r = Math.random();
  if (r < POISON_SPAWN_CHANCE) type = "poison";
  else if (r < POISON_SPAWN_CHANCE + BONUS_FOOD_SPAWN_CHANCE) type = "bonus";
  return {
    cell,
    type,
    spawnTime: type === "bonus" ? now : undefined,
  };
}

function getNextSpeed(state: SnakeGameState): number {
  const key = state.mode === "timeAttack" ? "timeAttack" : state.mode === "hardcore" ? "hardcore" : "classic";
  const config = SPEED[key];
  const next = state.speedMs - config.step;
  return Math.max(config.min, next);
}

function isDeadBorders(mode: GameMode): boolean {
  return mode === "hardcore";
}

export function tick(state: SnakeGameState, now: number): SnakeGameState {
  if (state.gameOver || state.paused) return state;

  const head = state.snake[0];
  let nx = head.x;
  let ny = head.y;
  const d = state.direction;
  if (d === "up") ny--;
  if (d === "down") ny++;
  if (d === "left") nx--;
  if (d === "right") nx++;

  const deadBorders = isDeadBorders(state.mode);
  if (deadBorders) {
    if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) {
      return { ...state, gameOver: true, gameOverReason: "wall", lastTickAt: now };
    }
  } else {
    nx = (nx + GRID_SIZE) % GRID_SIZE;
    ny = (ny + GRID_SIZE) % GRID_SIZE;
  }

  const hitSelf = state.snake.some((c) => c.x === nx && c.y === ny);
  if (hitSelf) {
    return { ...state, gameOver: true, gameOverReason: "self", lastTickAt: now };
  }

  let newSnake = [{ x: nx, y: ny }, ...state.snake];
  let newScore = state.score;
  let newFood = state.food;
  let newTimeLeft = state.timeLeftMs;

  if (state.mode === "timeAttack") {
    const elapsed = now - state.lastTickAt;
    newTimeLeft = Math.max(0, state.timeLeftMs - elapsed);
    if (newTimeLeft <= 0) {
      return { ...state, gameOver: true, gameOverReason: "time", lastTickAt: now };
    }
  }

  if (state.food && nx === state.food.cell.x && ny === state.food.cell.y) {
    const type = state.food.type;
    if (type === "poison") {
      newScore = Math.max(0, state.score + SCORE.poison);
      if (newSnake.length <= 2) {
        return { ...state, gameOver: true, gameOverReason: "poison", lastTickAt: now };
      }
      newSnake.pop();
      newSnake.pop();
    } else {
      newScore = state.score + (type === "bonus" ? SCORE.bonus : SCORE.normal);
    }
    newFood = spawnFood(newSnake, null, now);
  } else {
    newSnake.pop();
    if (!state.food || (state.food.type === "bonus" && state.food.spawnTime && now - state.food.spawnTime > BONUS_FOOD_DURATION_MS)) {
      newFood = spawnFood(newSnake, state.food, now);
    } else {
      newFood = state.food;
    }
  }

  const nextSpeed = newScore > state.score ? getNextSpeed({ ...state, score: newScore }) : state.speedMs;

  return {
    ...state,
    snake: newSnake,
    score: newScore,
    food: newFood,
    timeLeftMs: newTimeLeft,
    speedMs: nextSpeed,
    lastTickAt: now,
  };
}

export function setDirection(state: SnakeGameState, dir: Direction): SnakeGameState {
  if (state.gameOver) return state;
  const opposite: Record<Direction, Direction> = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
  };
  if (opposite[state.direction] === dir) return state;
  return { ...state, direction: dir };
}

export function togglePause(state: SnakeGameState): SnakeGameState {
  if (state.gameOver) return state;
  return { ...state, paused: !state.paused };
}

export function isBonusExpired(food: FoodState | null, now: number): boolean {
  if (!food || food.type !== "bonus" || food.spawnTime == null) return false;
  return now - food.spawnTime > BONUS_FOOD_DURATION_MS;
}

/**
 * Motor Ping Pong v2: física, power-ups, palas dinámicas, survival. Sin UI.
 */

import {
  TABLE_WIDTH,
  TABLE_HEIGHT,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  BALL_RADIUS,
  BALL_SPEED_INITIAL,
  BALL_SPEED_MAX,
  BALL_ACCELERATION,
  BALL_FAST_MODE_SPEED,
  BALL_ANGLE_VARIATION_BOUNCES,
  BALL_ANGLE_VARIATION_MAX,
  PADDLE_SPEED,
  WINNING_SCORE,
  PADDLE_SHRINK_SCALE,
  PADDLE_SHRINK_DURATION_MS,
  PADDLE_LONG_SCALE,
  PADDLE_LONG_DURATION_MS,
  POWER_UP_SPAWN_INTERVAL_MS,
  POWER_UP_RADIUS,
  POWER_UP_SPEED_BALL_DURATION_MS,
  POWER_UP_SPEED_BALL_MULTIPLIER,
  POWER_UP_LONG_PADDLE_DURATION_MS,
  POWER_UP_TYPES,
  AI_REACTION,
  AI_ERROR,
  SURVIVAL_SPEED_INCREASE_PER_SEC,
  SURVIVAL_INITIAL_SPEED,
} from "./constants";
import type {
  Ball,
  PaddleState,
  PongGameState,
  Vec2,
  AiDifficulty,
  GameMode,
  PowerUpType,
  PowerUpEntity,
} from "./types";

const PADDLE_HALF = PADDLE_HEIGHT / 2;
const LEFT_X = PADDLE_WIDTH;
const RIGHT_X = TABLE_WIDTH - PADDLE_WIDTH;
let powerUpId = 0;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getPaddleHeightScale(paddle: PaddleState, now: number): number {
  if (paddle.longUntil > now) return PADDLE_LONG_SCALE;
  if (paddle.shrinkUntil > now) return PADDLE_SHRINK_SCALE;
  return 1;
}

export function getPaddleEffectiveHeight(paddle: PaddleState, now: number): number {
  return PADDLE_HEIGHT * getPaddleHeightScale(paddle, now);
}

function serveBallPosition(serveSide: "left" | "right"): Ball {
  return {
    pos: {
      x:
        serveSide === "left"
          ? LEFT_X + PADDLE_WIDTH + BALL_RADIUS
          : RIGHT_X - PADDLE_WIDTH - BALL_RADIUS,
      y: TABLE_HEIGHT / 2,
    },
    vel: { x: 0, y: 0 },
    bounceCount: 0,
    isFastMode: false,
  };
}

function serveBall(
  serveSide: "left" | "right",
  speedMultiplier: number,
  baseSpeed?: number
): Ball {
  const speed = (baseSpeed ?? BALL_SPEED_INITIAL) * speedMultiplier;
  const angle = (Math.random() * 0.4 - 0.2) * Math.PI;
  const towardRight = serveSide === "left";
  return {
    ...serveBallPosition(serveSide),
    vel: {
      x: (towardRight ? 1 : -1) * speed * Math.cos(angle),
      y: speed * Math.sin(angle),
    },
  };
}

function createPaddle(): PaddleState {
  return {
    y: TABLE_HEIGHT / 2 - PADDLE_HALF,
    vy: 0,
    heightScale: 1,
    shrinkUntil: 0,
    longUntil: 0,
  };
}

export function createInitialState(
  mode: GameMode,
  aiDifficulty: AiDifficulty,
  speedMultiplier: number = 1
): PongGameState {
  const serveSide: "left" | "right" = Math.random() < 0.5 ? "left" : "right";
  const now = Date.now();
  return {
    ball: serveBallPosition(serveSide),
    paddleLeft: createPaddle(),
    paddleRight: createPaddle(),
    scoreLeft: 0,
    scoreRight: 0,
    mode,
    aiDifficulty,
    serveSide,
    phase: "serve",
    gameOver: false,
    winner: null,
    paused: false,
    pointsConceded: 0,
    currentStreak: 0,
    lastHitBy: null,
    powerUps: [],
    nextPowerUpAt: mode === "classic" ? now + POWER_UP_SPAWN_INTERVAL_MS * 0.6 : Infinity,
    shieldLeft: false,
    shieldRight: false,
    speedBallUntil: 0,
    survivalStartTime: mode === "survival" ? now : 0,
    survivalTimeMs: 0,
  };
}

function reflectAngle(
  ball: Ball,
  paddleY: number,
  paddleEffectiveHalf: number,
  side: "left" | "right"
): Vec2 {
  const relY = ball.pos.y - (paddleY + paddleEffectiveHalf);
  const norm = Math.max(-1, Math.min(1, relY / paddleEffectiveHalf));
  const angle = norm * (Math.PI / 3);
  let speed = Math.sqrt(ball.vel.x * ball.vel.x + ball.vel.y * ball.vel.y);
  speed = Math.min(BALL_SPEED_MAX, speed + BALL_ACCELERATION);
  const dx = side === "left" ? 1 : -1;
  return {
    x: dx * speed * Math.cos(angle),
    y: speed * Math.sin(angle),
  };
}

function spawnPowerUp(now: number): PowerUpEntity {
  const type = POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)] as PowerUpType;
  return {
    id: `pu-${++powerUpId}-${now}`,
    type,
    pos: {
      x: TABLE_WIDTH / 2 + (Math.random() - 0.5) * 120,
      y: POWER_UP_RADIUS + Math.random() * (TABLE_HEIGHT - POWER_UP_RADIUS * 2),
    },
    spawnTime: now,
  };
}

function dist(a: Vec2, b: Vec2): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function tick(
  state: PongGameState,
  dt: number,
  speedMultiplier: number,
  keys?: {
    paddleLeftUp: boolean;
    paddleLeftDown: boolean;
    paddleRightUp: boolean;
    paddleRightDown: boolean;
  }
): PongGameState {
  if (state.gameOver || state.paused) return state;

  const now = Date.now();
  const dtSec = dt / 1000;
  let {
    ball,
    paddleLeft,
    paddleRight,
    scoreLeft,
    scoreRight,
    phase,
    serveSide,
    powerUps,
    nextPowerUpAt,
    shieldLeft,
    shieldRight,
    speedBallUntil,
    lastHitBy,
  } = state;

  if (phase === "serve") return state;

  const paddleSpeed = PADDLE_SPEED * speedMultiplier;
  const leftScale = getPaddleHeightScale(paddleLeft, now);
  const rightScale = getPaddleHeightScale(paddleRight, now);
  const leftEffectiveHeight = PADDLE_HEIGHT * leftScale;
  const rightEffectiveHeight = PADDLE_HEIGHT * rightScale;

  if (keys) {
    if (state.mode === "vsAi" || state.mode === "classic" || state.mode === "survival" || state.mode === "local2p") {
      if (keys.paddleLeftUp) paddleLeft = { ...paddleLeft, vy: -paddleSpeed };
      if (keys.paddleLeftDown) paddleLeft = { ...paddleLeft, vy: paddleSpeed };
      if (!keys.paddleLeftUp && !keys.paddleLeftDown) paddleLeft = { ...paddleLeft, vy: 0 };
    }
    if (state.mode === "local2p") {
      if (keys.paddleRightUp) paddleRight = { ...paddleRight, vy: -paddleSpeed };
      if (keys.paddleRightDown) paddleRight = { ...paddleRight, vy: paddleSpeed };
      if (!keys.paddleRightUp && !keys.paddleRightDown) paddleRight = { ...paddleRight, vy: 0 };
    }
  }

  const leftMaxY = TABLE_HEIGHT - leftEffectiveHeight;
  const rightMaxY = TABLE_HEIGHT - rightEffectiveHeight;
  paddleLeft.y = clamp(paddleLeft.y + paddleLeft.vy * dtSec * 60, 0, leftMaxY);
  paddleRight.y = clamp(paddleRight.y + paddleRight.vy * dtSec * 60, 0, rightMaxY);

  if (state.mode === "vsAi") {
    const reaction = AI_REACTION[state.aiDifficulty] ?? 0.7;
    const err = AI_ERROR[state.aiDifficulty] ?? 0.2;
    const targetY = ball.pos.y - rightEffectiveHeight / 2 + (Math.random() - 0.5) * rightEffectiveHeight * err;
    const diff = targetY - paddleRight.y;
    const move = Math.sign(diff) * paddleSpeed * reaction;
    paddleRight.y = clamp(paddleRight.y + move * dtSec * 60, 0, rightMaxY);
  }

  let ballSpeedMultiplier = 1;
  if (speedBallUntil > now) ballSpeedMultiplier = POWER_UP_SPEED_BALL_MULTIPLIER;
  if (state.mode === "survival") {
    const elapsed = (now - state.survivalStartTime) / 1000;
    ballSpeedMultiplier *= 1 + elapsed * SURVIVAL_SPEED_INCREASE_PER_SEC;
  }

  ball = {
    pos: {
      x: ball.pos.x + ball.vel.x * dtSec * 60 * ballSpeedMultiplier,
      y: ball.pos.y + ball.vel.y * dtSec * 60 * ballSpeedMultiplier,
    },
    vel: { ...ball.vel },
    bounceCount: ball.bounceCount,
    isFastMode: ball.isFastMode,
  };

  const currentSpeed = Math.sqrt(ball.vel.x * ball.vel.x + ball.vel.y * ball.vel.y) * ballSpeedMultiplier;
  ball.isFastMode = currentSpeed >= BALL_FAST_MODE_SPEED;

  if (ball.pos.y <= BALL_RADIUS || ball.pos.y >= TABLE_HEIGHT - BALL_RADIUS) {
    ball.vel.y = -ball.vel.y;
    ball.pos.y = clamp(ball.pos.y, BALL_RADIUS, TABLE_HEIGHT - BALL_RADIUS);
  }

  const leftPaddleHalf = leftEffectiveHeight / 2;
  const rightPaddleHalf = rightEffectiveHeight / 2;

  if (ball.pos.x <= LEFT_X + PADDLE_WIDTH + BALL_RADIUS && ball.vel.x < 0) {
    if (
      ball.pos.y >= paddleLeft.y &&
      ball.pos.y <= paddleLeft.y + leftEffectiveHeight
    ) {
      ball.vel = reflectAngle(ball, paddleLeft.y, leftPaddleHalf, "left");
      ball.pos.x = LEFT_X + PADDLE_WIDTH + BALL_RADIUS;
      ball.bounceCount++;
      if (ball.bounceCount >= BALL_ANGLE_VARIATION_BOUNCES) {
        ball.bounceCount = 0;
        const vary = (Math.random() - 0.5) * 2 * BALL_ANGLE_VARIATION_MAX;
        const mag = Math.hypot(ball.vel.x, ball.vel.y);
        ball.vel = {
          x: ball.vel.x * Math.cos(vary) - ball.vel.y * Math.sin(vary),
          y: ball.vel.x * Math.sin(vary) + ball.vel.y * Math.cos(vary),
        };
        const m = mag / Math.hypot(ball.vel.x, ball.vel.y);
        ball.vel.x *= m;
        ball.vel.y *= m;
      }
      lastHitBy = "left";
    } else if (ball.pos.x < LEFT_X) {
      if (shieldLeft) {
        return {
          ...state,
          shieldLeft: false,
          serveSide: "left",
          phase: "serve",
          ball: serveBallPosition("left"),
          paddleLeft,
          paddleRight,
        };
      }
      if (state.mode === "survival") {
        return {
          ...state,
          gameOver: true,
          winner: "right",
          survivalTimeMs: now - state.survivalStartTime,
          paddleLeft,
          paddleRight,
        };
      }
      scoreRight++;
      paddleLeft = {
        ...paddleLeft,
        shrinkUntil: now + PADDLE_SHRINK_DURATION_MS,
      };
      const pointsConceded = state.mode === "classic" ? 0 : state.pointsConceded + 1;
      const gameOver = scoreLeft >= WINNING_SCORE || scoreRight >= WINNING_SCORE;
      const winner = gameOver ? (scoreLeft > scoreRight ? "left" : "right") : null;
      return {
        ...state,
        scoreLeft,
        scoreRight,
        paddleLeft,
        paddleRight,
        pointsConceded,
        gameOver,
        winner,
        serveSide: "left",
        phase: "serve",
        ball: serveBallPosition("left"),
      };
    }
  }

  if (ball.pos.x >= RIGHT_X - PADDLE_WIDTH - BALL_RADIUS && ball.vel.x > 0) {
    if (
      ball.pos.y >= paddleRight.y &&
      ball.pos.y <= paddleRight.y + rightEffectiveHeight
    ) {
      ball.vel = reflectAngle(ball, paddleRight.y, rightPaddleHalf, "right");
      ball.pos.x = RIGHT_X - PADDLE_WIDTH - BALL_RADIUS;
      ball.bounceCount++;
      if (ball.bounceCount >= BALL_ANGLE_VARIATION_BOUNCES) {
        ball.bounceCount = 0;
        const vary = (Math.random() - 0.5) * 2 * BALL_ANGLE_VARIATION_MAX;
        const mag = Math.hypot(ball.vel.x, ball.vel.y);
        ball.vel = {
          x: ball.vel.x * Math.cos(vary) - ball.vel.y * Math.sin(vary),
          y: ball.vel.x * Math.sin(vary) + ball.vel.y * Math.cos(vary),
        };
        const m = mag / Math.hypot(ball.vel.x, ball.vel.y);
        ball.vel.x *= m;
        ball.vel.y *= m;
      }
      lastHitBy = "right";
    } else if (ball.pos.x > RIGHT_X) {
      if (shieldRight) {
        return {
          ...state,
          shieldRight: false,
          serveSide: "right",
          phase: "serve",
          ball: serveBallPosition("right"),
          paddleLeft,
          paddleRight,
        };
      }
      scoreLeft++;
      paddleRight = {
        ...paddleRight,
        shrinkUntil: now + PADDLE_SHRINK_DURATION_MS,
      };
      const gameOver = scoreLeft >= WINNING_SCORE || scoreRight >= WINNING_SCORE;
      const winner = gameOver ? (scoreLeft > scoreRight ? "left" : "right") : null;
      return {
        ...state,
        scoreLeft,
        scoreRight,
        paddleLeft,
        paddleRight,
        gameOver,
        winner,
        serveSide: "right",
        phase: "serve",
        ball: serveBallPosition("right"),
      };
    }
  }

  if (state.mode === "classic" && now >= nextPowerUpAt) {
    powerUps = [...powerUps, spawnPowerUp(now)];
    nextPowerUpAt = now + POWER_UP_SPAWN_INTERVAL_MS;
  }

  const remainingPowerUps: PowerUpEntity[] = [];
  for (const pu of powerUps) {
    if (dist(ball.pos, pu.pos) < BALL_RADIUS + POWER_UP_RADIUS) {
      const side = state.lastHitBy ?? (ball.vel.x > 0 ? "left" : "right");
      if (pu.type === "speedBall") {
        speedBallUntil = now + POWER_UP_SPEED_BALL_DURATION_MS;
      } else if (pu.type === "shield") {
        if (side === "left") shieldLeft = true;
        else shieldRight = true;
      } else if (pu.type === "longPaddle") {
        if (side === "left") paddleLeft = { ...paddleLeft, longUntil: now + POWER_UP_LONG_PADDLE_DURATION_MS };
        else paddleRight = { ...paddleRight, longUntil: now + POWER_UP_LONG_PADDLE_DURATION_MS };
      }
    } else {
      remainingPowerUps.push(pu);
    }
  }
  powerUps = remainingPowerUps;

  return {
    ...state,
    ball,
    paddleLeft,
    paddleRight,
    scoreLeft,
    scoreRight,
    powerUps,
    nextPowerUpAt,
    shieldLeft,
    shieldRight,
    speedBallUntil,
    lastHitBy,
  };
}

export function launchServe(state: PongGameState, speedMultiplier: number): PongGameState {
  if (state.phase !== "serve" || state.gameOver) return state;
  const baseSpeed = state.mode === "survival" ? SURVIVAL_INITIAL_SPEED : undefined;
  const ball = serveBall(state.serveSide, speedMultiplier, baseSpeed);
  return {
    ...state,
    ball,
    phase: "playing",
  };
}

export function togglePause(state: PongGameState): PongGameState {
  if (state.gameOver) return state;
  return { ...state, paused: !state.paused };
}

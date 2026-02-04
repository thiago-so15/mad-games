/**
 * Motor Breakout v2: física, bloques, power-ups, niveles. Sin UI.
 */

import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_Y,
  PADDLE_SPEED,
  PADDLE_LONG_MULTIPLIER,
  BALL_RADIUS,
  BALL_SPEED,
  BALL_SPEED_FAST_MULTIPLIER,
  BLOCK_WIDTH,
  BLOCK_HEIGHT,
  BLOCK_COLS,
  BLOCK_MARGIN,
  INITIAL_LIVES,
  POWER_UP_DROP_CHANCE,
  POWER_UP_FALL_SPEED,
  POWER_UP_SIZE,
  LONG_PADDLE_DURATION_MS,
  FAST_BALL_DURATION_MS,
  EXPLOSIVE_RADIUS,
  SCORE_BLOCK,
  SCORE_RESISTANT,
  SCORE_EXPLOSIVE,
  BLOCK_HITS,
  CAMPAIGN_LEVELS,
  BLOCK_ROWS_MAX,
} from "./constants";
import type { LevelRow } from "./constants";
import type {
  Block,
  Ball,
  PowerUpEntity,
  PowerUpType,
  BreakoutGameState,
  GameMode,
  BlockType,
} from "./types";

let blockId = 0;
let ballId = 0;
let powerUpId = 0;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function buildBlocksFromLayout(layout: LevelRow[]): Block[] {
  const blocks: Block[] = [];
  for (let row = 0; row < layout.length; row++) {
    const line = layout[row];
    for (let col = 0; col < line.length; col++) {
      const type = line[col];
      if (!type) continue;
      const hits = BLOCK_HITS[type as BlockType];
      if (hits < 0) continue;
      blocks.push({
        id: `b-${++blockId}`,
        type: type as BlockType,
        x: col * (BLOCK_WIDTH + BLOCK_MARGIN) + BLOCK_MARGIN,
        y: row * (BLOCK_HEIGHT + BLOCK_MARGIN) + BLOCK_MARGIN + 40,
        w: BLOCK_WIDTH,
        h: BLOCK_HEIGHT,
        hitsLeft: type === "resistant" ? 3 : 1,
      });
    }
  }
  return blocks;
}

function generateEndlessLevel(levelIndex: number): LevelRow[] {
  const rows = Math.min(BLOCK_ROWS_MAX, 2 + Math.floor(levelIndex / 2));
  const layout: LevelRow[] = [];
  const types: BlockType[] = ["normal", "normal", "resistant", "explosive"];
  for (let r = 0; r < rows; r++) {
    const row: LevelRow = [];
    for (let c = 0; c < BLOCK_COLS; c++) {
      if (levelIndex >= 3 && r === 0 && (c === 0 || c === BLOCK_COLS - 1)) {
        row.push("indestructible");
      } else {
        const roll = Math.random();
        row.push(roll < 0.6 ? types[Math.floor(Math.random() * types.length)] : 0);
      }
    }
    layout.push(row);
  }
  return layout;
}

function getLevelLayout(mode: GameMode, levelIndex: number): LevelRow[] {
  if (mode === "campaign") {
    return CAMPAIGN_LEVELS[levelIndex % CAMPAIGN_LEVELS.length] ?? CAMPAIGN_LEVELS[0];
  }
  if (mode === "endless") {
    return generateEndlessLevel(levelIndex);
  }
  return CAMPAIGN_LEVELS[0];
}

function createBall(x: number, y: number, speedMult: number): Ball {
  const speed = BALL_SPEED * speedMult;
  return {
    id: `ball-${++ballId}`,
    pos: { x, y },
    vel: { x: (Math.random() - 0.5) * 2, y: -speed },
  };
}

export function createInitialState(mode: GameMode, level: number, speedMultiplier: number): BreakoutGameState {
  const layout = getLevelLayout(mode, level);
  const blocks = buildBlocksFromLayout(layout);
  const paddleW = PADDLE_WIDTH * (mode === "challenge" ? 1.2 : 1);
  return {
    balls: [createBall(CANVAS_WIDTH / 2, PADDLE_Y - BALL_RADIUS - 5, speedMultiplier)],
    paddle: { x: (CANVAS_WIDTH - paddleW) / 2, w: paddleW },
    blocks,
    powerUps: [],
    score: 0,
    lives: INITIAL_LIVES,
    level,
    mode,
    phase: "playing",
    paused: false,
    longPaddleUntil: 0,
    fastBallUntil: 0,
    gameStartTime: Date.now(),
  };
}

function spawnPowerUp(x: number, y: number): PowerUpEntity | null {
  if (Math.random() > POWER_UP_DROP_CHANCE) return null;
  const types: PowerUpType[] = ["longPaddle", "fastBall", "multiBall", "extraLife"];
  const type = types[Math.floor(Math.random() * types.length)];
  return {
    id: `pu-${++powerUpId}`,
    type,
    x: x - POWER_UP_SIZE / 2,
    y,
    w: POWER_UP_SIZE,
    h: POWER_UP_SIZE,
    vy: POWER_UP_FALL_SPEED,
  };
}

function hitBlock(
  state: BreakoutGameState,
  block: Block,
  speedMultiplier: number
): { blocks: Block[]; powerUps: PowerUpEntity[]; score: number } {
  let score = 0;
  if (block.type === "normal") score = SCORE_BLOCK;
  if (block.type === "resistant") score = SCORE_RESISTANT;
  if (block.type === "explosive") score = SCORE_EXPLOSIVE;

  const toRemove = new Set<string>([block.id]);
  if (block.type === "explosive") {
    const bx = block.x + block.w / 2;
    const by = block.y + block.h / 2;
    for (const b of state.blocks) {
      if (b.type === "indestructible") continue;
      const dx = (b.x + b.w / 2) - bx;
      const dy = (b.y + b.h / 2) - by;
      const dist = Math.sqrt(dx * dx + dy * dy) / (BLOCK_WIDTH + BLOCK_MARGIN);
      if (dist <= EXPLOSIVE_RADIUS) toRemove.add(b.id);
    }
  }

  const newBlocks = state.blocks.flatMap((b) => {
    if (!toRemove.has(b.id)) return [b];
    if (b.type === "resistant" && b.hitsLeft > 1) return [{ ...b, hitsLeft: b.hitsLeft - 1 }];
    return [];
  });

  const powerUps: PowerUpEntity[] = [];
  const pu = spawnPowerUp(block.x + block.w / 2, block.y + block.h / 2);
  if (pu && toRemove.has(block.id)) powerUps.push(pu);

  let totalScore = 0;
  for (const b of state.blocks) {
    if (toRemove.has(b.id)) {
      if (b.type === "normal") totalScore += SCORE_BLOCK;
      if (b.type === "resistant") totalScore += SCORE_RESISTANT;
      if (b.type === "explosive") totalScore += SCORE_EXPLOSIVE;
    }
  }

  return { blocks: newBlocks, powerUps, score: totalScore };
}

export function tick(
  state: BreakoutGameState,
  dt: number,
  speedMultiplier: number,
  keys: { left: boolean; right: boolean }
): BreakoutGameState {
  if (state.phase !== "playing" || state.paused) return state;

  const now = Date.now();
  const dtSec = dt / 1000;
  const paddleSpeed = PADDLE_SPEED * speedMultiplier;
  let paddleW = state.paddle.w;
  if (state.longPaddleUntil > now) {
    paddleW = PADDLE_WIDTH * PADDLE_LONG_MULTIPLIER;
  }
  const ballSpeedMult = state.fastBallUntil > now ? BALL_SPEED_FAST_MULTIPLIER : 1;

  let paddleX = state.paddle.x + (keys.right ? paddleSpeed : keys.left ? -paddleSpeed : 0) * dtSec * 60;
  paddleX = clamp(paddleX, 0, CANVAS_WIDTH - paddleW);

  let longPaddleUntil = state.longPaddleUntil;
  let fastBallUntil = state.fastBallUntil;
  let lives = state.lives;
  const extraBalls: Ball[] = [];

  const powerUps: PowerUpEntity[] = [];
  for (const pu of state.powerUps) {
    const ny = pu.y + pu.vy * dtSec * 60;
    if (ny > CANVAS_HEIGHT) continue;
    const collected =
      ny + pu.h >= PADDLE_Y &&
      pu.x + pu.w >= paddleX &&
      pu.x <= paddleX + paddleW;
    if (collected) {
      if (pu.type === "longPaddle") longPaddleUntil = now + LONG_PADDLE_DURATION_MS;
      if (pu.type === "fastBall") fastBallUntil = now + FAST_BALL_DURATION_MS;
      if (pu.type === "extraLife") lives++;
      if (pu.type === "multiBall" && state.balls.length > 0) {
        const ref = state.balls[state.balls.length - 1];
        extraBalls.push(createBall(ref.pos.x, ref.pos.y, speedMultiplier), createBall(ref.pos.x, ref.pos.y, speedMultiplier));
      }
      continue;
    }
    powerUps.push({ ...pu, y: ny });
  }

  let blocks = state.blocks;
  let score = state.score;
  const balls: Ball[] = [];
  const allBalls = [...state.balls, ...extraBalls];

  for (const ball of allBalls) {
    let pos = { x: ball.pos.x + ball.vel.x * dtSec * 60 * ballSpeedMult, y: ball.pos.y + ball.vel.y * dtSec * 60 * ballSpeedMult };
    let vel = { ...ball.vel };

    if (pos.x <= BALL_RADIUS || pos.x >= CANVAS_WIDTH - BALL_RADIUS) vel.x = -vel.x;
    pos.x = clamp(pos.x, BALL_RADIUS, CANVAS_WIDTH - BALL_RADIUS);
    if (pos.y <= BALL_RADIUS) vel.y = -vel.y;
    pos.y = Math.max(BALL_RADIUS, pos.y);

    if (pos.y >= PADDLE_Y - BALL_RADIUS && pos.y <= PADDLE_Y + PADDLE_HEIGHT && vel.y > 0) {
      if (pos.x >= paddleX && pos.x <= paddleX + paddleW) {
        const rel = (pos.x - (paddleX + paddleW / 2)) / (paddleW / 2);
        const angle = rel * 0.6 * Math.PI;
        const speed = Math.hypot(vel.x, vel.y);
        vel = { x: Math.sin(angle) * speed, y: -Math.cos(angle) * speed };
        pos.y = PADDLE_Y - BALL_RADIUS;
      }
    }

    if (pos.y > CANVAS_HEIGHT + BALL_RADIUS) continue;

    let hitBlockThisFrame = false;
    for (const block of blocks) {
      if (block.type === "indestructible") {
        if (pos.x + BALL_RADIUS >= block.x && pos.x - BALL_RADIUS <= block.x + block.w &&
            pos.y + BALL_RADIUS >= block.y && pos.y - BALL_RADIUS <= block.y + block.h) {
          const overlapLeft = (pos.x + BALL_RADIUS) - block.x;
          const overlapRight = (block.x + block.w) - (pos.x - BALL_RADIUS);
          const overlapTop = (pos.y + BALL_RADIUS) - block.y;
          const overlapBottom = (block.y + block.h) - (pos.y - BALL_RADIUS);
          const min = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
          if (min === overlapLeft || min === overlapRight) vel.x = -vel.x;
          else vel.y = -vel.y;
          pos = ball.pos;
        }
        continue;
      }
      if (pos.x + BALL_RADIUS >= block.x && pos.x - BALL_RADIUS <= block.x + block.w &&
          pos.y + BALL_RADIUS >= block.y && pos.y - BALL_RADIUS <= block.y + block.h) {
        const res = hitBlock({ ...state, blocks }, block, speedMultiplier);
        blocks = res.blocks;
        score += res.score;
        for (const p of res.powerUps) powerUps.push(p);
        vel.y = -vel.y;
        hitBlockThisFrame = true;
        break;
      }
    }
    if (!hitBlockThisFrame) {
      for (const block of blocks) {
        if (block.type === "indestructible") continue;
        if (pos.x + BALL_RADIUS >= block.x && pos.x - BALL_RADIUS <= block.x + block.w &&
            pos.y + BALL_RADIUS >= block.y && pos.y - BALL_RADIUS <= block.y + block.h) {
          const res = hitBlock({ ...state, blocks }, block, speedMultiplier);
          blocks = res.blocks;
          score += res.score;
          for (const p of res.powerUps) powerUps.push(p);
          vel.x = -vel.x;
          break;
        }
      }
    }

    balls.push({ ...ball, pos, vel });
  }

  if (balls.length === 0) {
    const nextLives = lives - 1;
    if (nextLives <= 0) {
      return {
        ...state,
        phase: "gameOver",
        score,
        lives: 0,
        blocks,
        powerUps,
        paddle: { x: paddleX, w: paddleW },
        longPaddleUntil,
        fastBallUntil,
      };
    }
    const newBall = createBall(paddleX + paddleW / 2, PADDLE_Y - BALL_RADIUS - 5, speedMultiplier);
    return {
      ...state,
      balls: [newBall],
      lives: nextLives,
      score,
      blocks,
      powerUps,
      paddle: { x: paddleX, w: paddleW },
      longPaddleUntil,
      fastBallUntil,
    };
  }

  const destructibleLeft = blocks.some((b) => b.type !== "indestructible");
  if (!destructibleLeft) {
    return {
      ...state,
      balls,
      score,
      blocks,
      powerUps,
      paddle: { x: paddleX, w: paddleW },
      phase: "levelComplete",
      longPaddleUntil,
      fastBallUntil,
    };
  }

  return {
    ...state,
    balls,
    score,
    blocks,
    powerUps,
    paddle: { x: paddleX, w: paddleW },
    longPaddleUntil,
    fastBallUntil,
  };
}

export function togglePause(state: BreakoutGameState): BreakoutGameState {
  if (state.phase !== "playing") return state;
  return { ...state, paused: !state.paused };
}

export function getLevelLayoutForMode(mode: GameMode, level: number): LevelRow[] {
  return getLevelLayout(mode, level);
}


/**
 * Motor Core Defense: escudo rotatorio, bloquea proyectiles.
 */

import {
  SHIELD_RADIUS,
  SHIELD_WIDTH_RAD,
  SHIELD_SPEED,
  PROJECTILE_SPEED,
  SPAWN_INTERVAL_MS,
  DIFFICULTY_INTERVAL_MS,
  IMPACT_DURATION_MS,
} from "./constants";
import type { CoreDefenseGameState, CoreDefenseImpact } from "./types";

let projId = 0;

function normAngle(a: number): number {
  let x = a % (Math.PI * 2);
  if (x < 0) x += Math.PI * 2;
  return x;
}

function angleDiff(a: number, b: number): number {
  let d = normAngle(a - b);
  if (d > Math.PI) d -= Math.PI * 2;
  return d;
}

export function createInitialState(): CoreDefenseGameState {
  const now = Date.now();
  return {
    shieldAngle: 0,
    shieldWidth: SHIELD_WIDTH_RAD,
    streak: 0,
    projectiles: [],
    impacts: [],
    gameStartTime: now,
    lastSpawnAt: now,
    phase: "playing",
    paused: false,
    difficultyLevel: 0,
  };
}

export function tick(
  state: CoreDefenseGameState,
  dt: number,
  speedMultiplier: number,
  keys: { left: boolean; right: boolean },
  now: number
): CoreDefenseGameState {
  if (state.phase !== "playing" || state.paused) return state;

  const elapsed = now - state.gameStartTime;
  const difficultyLevel = Math.floor(elapsed / DIFFICULTY_INTERVAL_MS);
  const spawnInterval = Math.max(400, SPAWN_INTERVAL_MS - difficultyLevel * 40);

  let shieldAngle = state.shieldAngle;
  if (keys.left) shieldAngle -= SHIELD_SPEED * (dt / 16) * speedMultiplier;
  if (keys.right) shieldAngle += SHIELD_SPEED * (dt / 16) * speedMultiplier;
  shieldAngle = normAngle(shieldAngle);

  const halfShield = state.shieldWidth / 2;
  const shieldStart = shieldAngle - halfShield;
  const shieldEnd = shieldAngle + halfShield;

  let projectiles = state.projectiles.map((p) => ({
    ...p,
    distance: p.distance - p.speed * (dt / 16) * speedMultiplier,
  }));

  let nextSpawnAt = state.lastSpawnAt;
  if (now - state.lastSpawnAt >= spawnInterval) {
    const angle = Math.random() * Math.PI * 2;
    projectiles = [
      ...projectiles,
      {
        id: `p-${++projId}-${now}`,
        angle,
        distance: 180,
        speed: PROJECTILE_SPEED * (1 + difficultyLevel * 0.08),
      },
    ];
    nextSpawnAt = now;
  }

  let streak = state.streak;
  let gameOver = false;
  const remaining: typeof projectiles = [];
  const newImpacts: CoreDefenseImpact[] = [];

  for (const p of projectiles) {
    if (p.distance <= 0) continue;
    if (p.distance < SHIELD_RADIUS + 10) {
      const d = angleDiff(p.angle, shieldAngle);
      if (Math.abs(d) <= halfShield) {
        streak += 1;
        newImpacts.push({ angle: p.angle, distance: Math.min(p.distance, SHIELD_RADIUS), createdAt: now });
        continue;
      }
      gameOver = true;
      break;
    }
    remaining.push(p);
  }

  const impacts = [
    ...state.impacts.filter((i) => now - i.createdAt < IMPACT_DURATION_MS),
    ...newImpacts,
  ];

  return {
    ...state,
    shieldAngle,
    streak,
    projectiles: remaining,
    impacts,
    lastSpawnAt: nextSpawnAt,
    difficultyLevel,
    phase: gameOver ? "gameOver" : "playing",
  };
}

export function togglePause(state: CoreDefenseGameState): CoreDefenseGameState {
  if (state.phase !== "playing") return state;
  return { ...state, paused: !state.paused };
}

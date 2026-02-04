/**
 * Tipos para Breakout v2. Lógica desacoplada de la UI.
 */

export type GameMode = "campaign" | "endless" | "challenge";

export type BlockType = "normal" | "resistant" | "explosive" | "indestructible";

export type PowerUpType = "longPaddle" | "fastBall" | "multiBall" | "extraLife";

export interface Vec2 {
  x: number;
  y: number;
}

export interface Block {
  id: string;
  type: BlockType;
  x: number;
  y: number;
  w: number;
  h: number;
  hitsLeft: number;
}

export interface Ball {
  id: string;
  pos: Vec2;
  vel: Vec2;
}

export interface PowerUpEntity {
  id: string;
  type: PowerUpType;
  x: number;
  y: number;
  w: number;
  h: number;
  vy: number;
}

export interface BreakoutGameState {
  balls: Ball[];
  paddle: { x: number; w: number };
  blocks: Block[];
  powerUps: PowerUpEntity[];
  score: number;
  lives: number;
  level: number;
  mode: GameMode;
  phase: "playing" | "levelComplete" | "gameOver";
  paused: boolean;
  longPaddleUntil: number;
  fastBallUntil: number;
  gameStartTime: number;
}


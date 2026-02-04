/**
 * Tipos para Ping Pong v2. Lógica desacoplada de la UI.
 */

export type GameMode = "classic" | "vsAi" | "local2p" | "survival";

export type AiDifficulty = "easy" | "normal" | "hard";

export type PowerUpType = "speedBall" | "shield" | "longPaddle";

export interface Vec2 {
  x: number;
  y: number;
}

export interface PaddleState {
  y: number;
  vy: number;
  /** Escala de altura: 1 = normal, <1 = reducida, >1 = power-up */
  heightScale: number;
  /** Timestamp hasta cuando la pala está reducida (tras recibir punto) */
  shrinkUntil: number;
  /** Timestamp hasta cuando la pala está agrandada (power-up) */
  longUntil: number;
}

export interface Ball {
  pos: Vec2;
  vel: Vec2;
  /** Rebotes desde el último cambio de ángulo (para variación leve) */
  bounceCount: number;
  /** Modo rápido: velocidad por encima del umbral */
  isFastMode: boolean;
}

export interface PowerUpEntity {
  id: string;
  type: PowerUpType;
  pos: Vec2;
  spawnTime: number;
}

export interface PongGameState {
  ball: Ball;
  paddleLeft: PaddleState;
  paddleRight: PaddleState;
  scoreLeft: number;
  scoreRight: number;
  mode: GameMode;
  aiDifficulty: AiDifficulty;
  serveSide: "left" | "right";
  phase: "serve" | "playing";
  gameOver: boolean;
  winner: "left" | "right" | null;
  paused: boolean;
  /** Challenge legacy / Survival: puntos recibidos (survival = 1 vida, 1 punto = game over) */
  pointsConceded: number;
  currentStreak: number;
  /** Último lado que tocó la pelota (para asignar power-up) */
  lastHitBy: "left" | "right" | null;
  /** Power-ups activos en mesa */
  powerUps: PowerUpEntity[];
  /** Timestamp próximo spawn de power-up */
  nextPowerUpAt: number;
  /** Efectos activos: escudo (bloquea 1 punto) */
  shieldLeft: boolean;
  shieldRight: boolean;
  /** Speed ball activo hasta (timestamp) */
  speedBallUntil: number;
  /** Survival: tiempo de inicio de partida */
  survivalStartTime: number;
  /** Survival: tiempo sobrevivido en ms (al game over) */
  survivalTimeMs: number;
}

export interface PongConfig {
  mode: GameMode;
  aiDifficulty: AiDifficulty;
  speedMultiplier?: number;
}

export interface PongStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  currentStreak: number;
  bestStreak: number;
  /** Mejor tiempo en Survival (ms) */
  bestSurvivalTimeMs: number;
}

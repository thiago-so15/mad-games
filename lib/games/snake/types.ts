/**
 * Tipos para Snake v2. Lógica desacoplada de la UI.
 */

export type Direction = "up" | "down" | "left" | "right";

export interface Cell {
  x: number;
  y: number;
}

export type FoodType = "normal" | "bonus" | "poison";

export interface FoodState {
  cell: Cell;
  type: FoodType;
  /** Timestamp de aparición (para bonus que expira) */
  spawnTime?: number;
}

export type GameMode = "classic" | "timeAttack" | "hardcore";

export interface SnakeGameState {
  snake: Cell[];
  direction: Direction;
  food: FoodState | null;
  score: number;
  mode: GameMode;
  /** Tiempo restante en ms (solo Time Attack) */
  timeLeftMs: number;
  /** Si la partida terminó */
  gameOver: boolean;
  /** Causa de game over */
  gameOverReason?: "wall" | "self" | "poison" | "time";
  /** Pausado */
  paused: boolean;
  /** Velocidad actual (intervalo en ms entre ticks) */
  speedMs: number;
  /** Timestamp del último tick (para calcular tiempo jugado) */
  lastTickAt: number;
}

export interface SnakeConfig {
  mode: GameMode;
  /** Multiplicador de velocidad (1 = normal, mayor = más lento intervalo) */
  speedMultiplier?: number;
  /** Tiempo límite en segundos (Time Attack) */
  timeLimitSec?: number;
}

export interface SnakeStats {
  bestScoreByMode: Partial<Record<GameMode, number>>;
  gamesPlayed: number;
  totalTimeMs: number;
}

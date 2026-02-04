/**
 * Tipos para Orbit. Núcleo que orbita; esquiva obstáculos desde el centro.
 */

export interface Vec2 {
  x: number;
  y: number;
}

/** Obstáculo que sale del centro y se aleja */
export interface OrbitObstacle {
  id: string;
  angle: number;
  distance: number;
  speed: number;
  size: number;
}

export interface OrbitGameState {
  /** Ángulo actual del jugador (rad) */
  angle: number;
  /** Radio actual (entre min y max) */
  radius: number;
  /** true = mantiene presionado → órbita más cerrada */
  holding: boolean;
  score: number;
  obstacles: OrbitObstacle[];
  gameStartTime: number;
  /** Último momento en que se generó un obstáculo (ms) */
  lastSpawnAt: number;
  phase: "playing" | "gameOver";
  paused: boolean;
  difficultyLevel: number;
}

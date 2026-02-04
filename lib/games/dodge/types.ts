/**
 * Tipos para Dodge Madness. Lógica desacoplada de la UI.
 */

export interface Vec2 {
  x: number;
  y: number;
}

/** Obstáculo que se mueve desde el borde hacia el centro */
export interface Obstacle {
  id: string;
  pos: Vec2;
  vel: Vec2;
  size: number; // lado del cuadrado (o radio si se usa círculo)
}

export interface DodgeGameState {
  player: Vec2;
  obstacles: Obstacle[];
  survivalTimeMs: number;
  gameStartTime: number;
  phase: "playing" | "gameOver";
  paused: boolean;
  /** Nivel de dificultad alcanzado (aumenta spawn y velocidad) */
  difficultyLevel: number;
}

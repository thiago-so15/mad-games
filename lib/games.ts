import type { GameMeta } from "./types";

/**
 * Catálogo de juegos de la plataforma.
 * Agregar aquí cada nuevo juego para que aparezca en /games.
 */
export const GAMES_CATALOG: GameMeta[] = [
  {
    slug: "snake",
    name: "Snake",
    description: "Clásico snake. Come, crece y no te muerdas la cola.",
    icon: "🐍",
    available: true,
  },
  {
    slug: "pong",
    name: "Ping Pong v2",
    description: "Classic con power-ups, Vs AI, 2 jugadores o Survival. Palas dinámicas y rebotes.",
    icon: "🏓",
    available: true,
  },
];

export function getGameBySlug(slug: string): GameMeta | undefined {
  return GAMES_CATALOG.find((g) => g.slug === slug);
}

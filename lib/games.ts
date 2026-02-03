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
  // Ejemplos para el catálogo (available: false hasta implementarlos)
  // { slug: "memory", name: "Memory", description: "Encontrá los pares.", icon: "🧠", available: false },
];

export function getGameBySlug(slug: string): GameMeta | undefined {
  return GAMES_CATALOG.find((g) => g.slug === slug);
}

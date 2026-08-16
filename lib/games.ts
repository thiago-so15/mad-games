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
    category: "clásico",
    difficulty: 1,
  },
  {
    slug: "pong",
    name: "Ping Pong v2",
    description: "Ping pong clásico: palas, rebotes y power-ups. Vs IA, 2 jugadores o Survival.",
    icon: "🏓",
    available: true,
    category: "arcade",
    difficulty: 2,
  },
  {
    slug: "breakout",
    name: "Breakout v2",
    description: "Rompebloques con power-ups, niveles y modos Campaign, Endless y Challenge.",
    icon: "🧱",
    available: true,
    category: "arcade",
    difficulty: 2,
  },
  {
    slug: "dodge",
    name: "Dodge Madness",
    description: "Esquiva obstáculos que vienen desde los bordes. Sobrevive el mayor tiempo posible.",
    icon: "🕹️",
    available: true,
    category: "arcade",
    difficulty: 2,
  },
  {
    slug: "reactor",
    name: "Reactor Break",
    description: "Activa el escudo en el momento exacto cuando el reactor emite pulsos.",
    icon: "⚡",
    available: true,
    category: "habilidad",
    difficulty: 3,
  },
  {
    slug: "orbit",
    name: "Orbit",
    description: "Núcleo que orbita. Mantené para órbita cerrada, soltá para amplia. Esquivá obstáculos.",
    icon: "🕹️",
    available: true,
    category: "arcade",
    difficulty: 2,
  },
  {
    slug: "pulse-dash",
    name: "Pulse Dash",
    description: "Corredor automático. Dasheá entre zonas seguras con un botón.",
    icon: "⚡",
    available: true,
    category: "arcade",
    difficulty: 2,
  },
  {
    slug: "memory-glitch",
    name: "Memory Glitch",
    description: "Memoria rápida bajo presión. Repetí los patrones antes de que se acabe el tiempo.",
    icon: "🧠",
    available: true,
    category: "habilidad",
    difficulty: 2,
  },
  {
    slug: "core-defense",
    name: "Core Defense",
    description: "Defendé el núcleo central. Rotá el escudo y bloqueá los impactos.",
    icon: "💣",
    available: true,
    category: "arcade",
    difficulty: 2,
  },
  {
    slug: "shift",
    name: "Shift",
    description: "El mundo alterna estados. Cambiá de fase en el momento justo.",
    icon: "🌀",
    available: true,
    category: "habilidad",
    difficulty: 3,
  },
  {
    slug: "overload",
    name: "Overload",
    description: "El núcleo se sobrecarga. Liberá energía en la zona verde antes del 100%.",
    icon: "🔥",
    available: true,
    category: "habilidad",
    difficulty: 3,
  },
  {
    slug: "polar",
    name: "Polar",
    description: "Núcleo con polaridad + o −. Coincidí con la polaridad del obstáculo en el impacto.",
    icon: "🧲",
    available: true,
    category: "habilidad",
    difficulty: 3,
  },
];

/** Juego oculto; solo se muestra cuando está desbloqueado. */
export const HIDDEN_GAME: GameMeta = {
  slug: "void",
  name: "Void",
  description: "Un punto. Un límite. No toques los bordes.",
  icon: "◯",
  available: true,
  category: "arcade",
  difficulty: 3,
};

export function getGameBySlug(slug: string): GameMeta | undefined {
  const fromCatalog = GAMES_CATALOG.find((g) => g.slug === slug);
  if (fromCatalog) return fromCatalog;
  if (slug === HIDDEN_GAME.slug) return HIDDEN_GAME;
  return undefined;
}

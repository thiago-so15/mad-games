"use client";

import { SnakeGame } from "@/components/games/Snake";

const GAME_COMPONENTS: Record<string, React.ComponentType<object>> = {
  snake: SnakeGame,
};

interface GameRendererProps {
  slug: string;
}

export function GameRenderer({ slug }: GameRendererProps) {
  const Game = GAME_COMPONENTS[slug];
  if (!Game) return null;
  return <Game />;
}

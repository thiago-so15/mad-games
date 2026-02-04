"use client";

import { SnakeGame } from "@/components/games/Snake";
import { PongGame } from "@/components/games/Pong";

const GAME_COMPONENTS: Record<string, React.ComponentType<object>> = {
  snake: SnakeGame,
  pong: PongGame,
};

interface GameRendererProps {
  slug: string;
}

export function GameRenderer({ slug }: GameRendererProps) {
  const Game = GAME_COMPONENTS[slug];
  if (!Game) return null;
  return <Game />;
}

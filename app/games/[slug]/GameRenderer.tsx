"use client";

import { SnakeGame } from "@/components/games/Snake";
import { PongGame } from "@/components/games/Pong";
import { BreakoutGame } from "@/components/games/Breakout";
import { DodgeGame } from "@/components/games/Dodge";
import { ReactorGame } from "@/components/games/Reactor";

const GAME_COMPONENTS: Record<string, React.ComponentType<object>> = {
  snake: SnakeGame,
  pong: PongGame,
  breakout: BreakoutGame,
  dodge: DodgeGame,
  reactor: ReactorGame,
};

interface GameRendererProps {
  slug: string;
}

export function GameRenderer({ slug }: GameRendererProps) {
  const Game = GAME_COMPONENTS[slug];
  if (!Game) return null;
  return <Game />;
}

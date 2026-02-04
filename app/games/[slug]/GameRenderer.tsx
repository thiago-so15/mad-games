"use client";

import { SnakeGame } from "@/components/games/Snake";
import { PongGame } from "@/components/games/Pong";
import { BreakoutGame } from "@/components/games/Breakout";
import { DodgeGame } from "@/components/games/Dodge";
import { ReactorGame } from "@/components/games/Reactor";
import { OrbitGame } from "@/components/games/Orbit";
import { PulseDashGame } from "@/components/games/PulseDash";
import { MemoryGlitchGame } from "@/components/games/MemoryGlitch";
import { CoreDefenseGame } from "@/components/games/CoreDefense";
import { ShiftGame } from "@/components/games/Shift";
import { OverloadGame } from "@/components/games/Overload";
import { PolarGame } from "@/components/games/Polar";
import { VoidGame } from "@/components/games/Void";

const GAME_COMPONENTS: Record<string, React.ComponentType<{ slug: string }>> = {
  snake: SnakeGame,
  pong: PongGame,
  breakout: BreakoutGame,
  dodge: DodgeGame,
  reactor: ReactorGame,
  orbit: OrbitGame,
  "pulse-dash": PulseDashGame,
  "memory-glitch": MemoryGlitchGame,
  "core-defense": CoreDefenseGame,
  shift: ShiftGame,
  overload: OverloadGame,
  polar: PolarGame,
  void: VoidGame,
};

interface GameRendererProps {
  slug: string;
}

export function GameRenderer({ slug }: GameRendererProps) {
  const Game = GAME_COMPONENTS[slug];
  if (!Game) return null;
  return <Game slug={slug} />;
}

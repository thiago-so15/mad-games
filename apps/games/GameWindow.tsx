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
import { getGameBySlug } from "@/lib/games";
import { Suspense, type ComponentType } from "react";

const GAME_COMPONENTS: Record<string, ComponentType<{ slug: string }>> = {
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

export function GameWindow({ slug }: { slug: string }) {
  const game = getGameBySlug(slug);
  const Game = GAME_COMPONENTS[slug];
  if (!game || !Game) {
    return <p className="p-4 text-sm text-zinc-400">This game is not installed.</p>;
  }

  return (
    <div className="game-container dark h-full overflow-auto p-3">
      <Suspense fallback={<p className="text-sm text-zinc-400">Loading {game.name}…</p>}>
        <Game slug={slug} />
      </Suspense>
    </div>
  );
}

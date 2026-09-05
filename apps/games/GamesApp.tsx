"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GAMES_CATALOG, HIDDEN_GAME } from "@/lib/games";
import { useStore } from "@/lib/store";
import { useOsStore } from "@/store/os-store";

export function GamesApp() {
  const hiddenUnlocked = useStore((s) => s.hiddenGameUnlocked);
  const openApp = useOsStore((s) => s.openApp);
  const games = hiddenUnlocked ? [...GAMES_CATALOG, HIDDEN_GAME] : GAMES_CATALOG;

  return (
    <div className="h-full overflow-auto p-4">
      <header className="mb-4">
        <h2 className="text-sm font-semibold text-white">MAD Games</h2>
        <p className="text-xs text-zinc-400">Play launches inside a window.</p>
      </header>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {games.map((game) => (
          <Card key={game.slug} className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden>
                {game.icon}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-white">{game.name}</h3>
                <p className="text-[11px] text-zinc-500 capitalize">{game.category}</p>
              </div>
            </div>
            <p className="mt-2 flex-1 text-xs text-zinc-400">{game.description}</p>
            <Button
              variant="primary"
              className="mt-3"
              onClick={() => openApp("game", { gameSlug: game.slug })}
            >
              Play
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

"use client";

import { AboutApp } from "@/apps/about/AboutApp";
import { GameWindow } from "@/apps/games/GameWindow";
import { GamesApp } from "@/apps/games/GamesApp";
import { ProfileApp } from "@/apps/profile/ProfileApp";
import { SettingsApp } from "@/apps/settings/SettingsApp";
import { StoreApp } from "@/apps/store/StoreApp";
import { TerminalApp } from "@/apps/terminal/TerminalApp";
import { TrashApp } from "@/apps/trash/TrashApp";
import { VersionsApp } from "@/apps/versions/VersionsApp";
import { getGameBySlug } from "@/lib/games";
import type { WindowInstance } from "@/types/os";

export function AppContent({ win }: { win: WindowInstance }) {
  switch (win.appId) {
    case "settings":
      return <SettingsApp />;
    case "store":
      return <StoreApp />;
    case "games":
      return <GamesApp />;
    case "profile":
      return <ProfileApp />;
    case "terminal":
      return <TerminalApp />;
    case "about":
      return <AboutApp />;
    case "versions":
      return <VersionsApp />;
    case "trash":
      return <TrashApp />;
    case "game": {
      const slug = win.payload?.gameSlug;
      if (!slug) return null;
      const game = getGameBySlug(slug);
      return <GameWindow slug={game?.slug ?? slug} />;
    }
    default:
      return null;
  }
}

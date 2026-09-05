import type { AppId } from "@/types/os";

export interface AppDefinition {
  id: Exclude<AppId, "game">;
  name: string;
  icon: string;
  description: string;
  defaultWidth: number;
  defaultHeight: number;
  desktop: boolean;
}

export const APP_DEFINITIONS: AppDefinition[] = [
  {
    id: "games",
    name: "Games",
    icon: "games",
    description: "MAD Games library",
    defaultWidth: 820,
    defaultHeight: 560,
    desktop: true,
  },
  {
    id: "store",
    name: "Store",
    icon: "store",
    description: "MAD Store",
    defaultWidth: 780,
    defaultHeight: 560,
    desktop: true,
  },
  {
    id: "settings",
    name: "Settings",
    icon: "settings",
    description: "System settings",
    defaultWidth: 680,
    defaultHeight: 540,
    desktop: true,
  },
  {
    id: "profile",
    name: "Profile",
    icon: "profile",
    description: "User profile",
    defaultWidth: 480,
    defaultHeight: 560,
    desktop: true,
  },
  {
    id: "terminal",
    name: "Terminal",
    icon: "terminal",
    description: "MAD Terminal",
    defaultWidth: 640,
    defaultHeight: 420,
    desktop: true,
  },
  {
    id: "about",
    name: "About MAD OS",
    icon: "about",
    description: "About this system",
    defaultWidth: 460,
    defaultHeight: 380,
    desktop: true,
  },
  {
    id: "versions",
    name: "Versions",
    icon: "versions",
    description: "Switch between MAD GAMES and MAD OS",
    defaultWidth: 520,
    defaultHeight: 420,
    desktop: true,
  },
  {
    id: "trash",
    name: "Trash",
    icon: "trash",
    description: "Deleted files",
    defaultWidth: 560,
    defaultHeight: 420,
    desktop: false,
  },
];

export const DESKTOP_APP_IDS = APP_DEFINITIONS.filter((app) => app.desktop).map((app) => app.id);

export function getAppDefinition(id: AppId): AppDefinition | undefined {
  if (id === "game") return undefined;
  return APP_DEFINITIONS.find((app) => app.id === id);
}

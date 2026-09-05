import type { OsAchievement } from "@/types/os";

export const OS_ACHIEVEMENTS: OsAchievement[] = [
  {
    id: "first_boot",
    name: "First Boot",
    description: "Start MAD OS for the first time.",
    icon: "⏻",
  },
  {
    id: "terminal_user",
    name: "Terminal User",
    description: "Run a command in MAD Terminal.",
    icon: ">_ ",
  },
  {
    id: "shopper",
    name: "Shopper",
    description: "Buy an item in MAD Store.",
    icon: "🛒",
  },
  {
    id: "customizer",
    name: "Customizer",
    description: "Change the wallpaper.",
    icon: "🎨",
  },
  {
    id: "curious",
    name: "Curious",
    description: "Open every MAD OS application.",
    icon: "✦",
  },
];

export const REQUIRED_APPS_FOR_CURIOUS = [
  "settings",
  "store",
  "games",
  "profile",
  "terminal",
  "about",
] as const;

export function getAchievement(id: string): OsAchievement | undefined {
  return OS_ACHIEVEMENTS.find((item) => item.id === id);
}

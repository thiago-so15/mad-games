import type { WallpaperDef } from "@/types/os";

export const WALLPAPERS: WallpaperDef[] = [
  { id: "crimson-grid", name: "Crimson Grid", className: "wp-crimson-grid" },
  { id: "void", name: "Void", className: "wp-void" },
  { id: "signal", name: "Signal", className: "wp-signal" },
  { id: "ember", name: "Ember", className: "wp-ember" },
  { id: "circuit", name: "Circuit", className: "wp-circuit" },
  { id: "aurora", name: "Aurora", className: "wp-aurora" },
];

export function getWallpaper(id: string): WallpaperDef {
  return WALLPAPERS.find((item) => item.id === id) ?? WALLPAPERS[0];
}

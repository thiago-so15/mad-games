import { getWallpaper } from "@/data/wallpapers";

export function Wallpaper({ wallpaperId }: { wallpaperId: string }) {
  const wallpaper = getWallpaper(wallpaperId);
  return (
    <div className={`absolute inset-0 ${wallpaper.className}`} aria-hidden>
      <div className="absolute inset-0 bg-black/10" />
      <div className="os-theme-wash absolute inset-0" />
    </div>
  );
}

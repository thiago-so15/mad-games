"use client";

import { AppGlyph } from "@/components/ui/AppGlyph";
import { APP_DEFINITIONS } from "@/data/apps";
import { useOsStore } from "@/store/os-store";

export function StartMenu() {
  const open = useOsStore((s) => s.startMenuOpen);
  const setStartMenuOpen = useOsStore((s) => s.setStartMenuOpen);
  const openApp = useOsStore((s) => s.openApp);
  const user = useOsStore((s) => s.user);
  const coins = useOsStore((s) => s.coins);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="absolute inset-0 z-40 cursor-default"
        aria-label="Close start menu"
        onClick={() => setStartMenuOpen(false)}
      />
      <div
        role="menu"
        aria-label="Start menu"
        className="os-panel absolute bottom-14 left-2 z-50 w-[min(100%-16px,320px)] rounded-xl border p-3 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
          <div>
            <p className="os-muted text-xs">Signed in locally</p>
            <p className="text-sm font-medium">{user.displayName}</p>
          </div>
          <p className="text-xs text-red-300">{coins} MC</p>
        </div>
        <ul className="grid grid-cols-1 gap-1">
          {APP_DEFINITIONS.map((app) => (
            <li key={app.id}>
              <button
                type="button"
                role="menuitem"
                onClick={() => openApp(app.id)}
                className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                <AppGlyph name={app.icon} className="h-4 w-4 opacity-80" />
                <span>
                  <span className="block">{app.name}</span>
                  <span className="os-muted block text-[11px]">{app.description}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

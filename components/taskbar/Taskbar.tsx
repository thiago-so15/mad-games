"use client";

import { AppGlyph, glyphForApp } from "@/components/ui/AppGlyph";
import { Clock } from "@/components/taskbar/Clock";
import { BatteryIndicator, NetworkIndicator } from "@/components/taskbar/SystemTray";
import { useOsStore } from "@/store/os-store";

export function Taskbar() {
  const windows = useOsStore((s) => s.windows);
  const activeWindowId = useOsStore((s) => s.activeWindowId);
  const coins = useOsStore((s) => s.coins);
  const startMenuOpen = useOsStore((s) => s.startMenuOpen);
  const trayOpen = useOsStore((s) => s.trayOpen);
  const notifications = useOsStore((s) => s.notifications);
  const setStartMenuOpen = useOsStore((s) => s.setStartMenuOpen);
  const setTrayOpen = useOsStore((s) => s.setTrayOpen);
  const focusWindow = useOsStore((s) => s.focusWindow);
  const minimizeWindow = useOsStore((s) => s.minimizeWindow);
  const clearNotifications = useOsStore((s) => s.clearNotifications);

  return (
    <footer className="os-taskbar absolute inset-x-0 bottom-0 z-30 flex h-12 items-center gap-1 border-t px-1.5 backdrop-blur-xl sm:px-2">
      <button
        type="button"
        aria-label="Open start menu"
        aria-expanded={startMenuOpen}
        onClick={(event) => {
          event.stopPropagation();
          setStartMenuOpen(!startMenuOpen);
        }}
        className={`flex h-9 items-center gap-2 rounded-md px-2 text-xs font-semibold tracking-[0.18em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${startMenuOpen ? "os-accent-fill" : "hover:bg-white/10"}`}
      >
        MAD
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
        {windows.map((win) => {
          const active = win.id === activeWindowId && !win.isMinimized;
          return (
            <button
              key={win.id}
              type="button"
              aria-label={win.title}
              aria-pressed={active}
              onClick={(event) => {
                event.stopPropagation();
                if (active) minimizeWindow(win.id);
                else focusWindow(win.id);
              }}
              className={`flex h-9 min-w-9 items-center gap-1.5 rounded-md px-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${active ? "os-accent-soft" : "hover:bg-white/10"}`}
            >
              <AppGlyph name={glyphForApp(win.icon)} className="h-3.5 w-3.5" />
              <span className="hidden max-w-[9rem] truncate sm:inline">{win.title}</span>
            </button>
          );
        })}
      </div>

      <p className="hidden rounded-md px-2 font-mono text-[11px] text-red-200 sm:block" aria-label={`${coins} Mad Coins`}>
        {coins} MC
      </p>
      <NetworkIndicator />
      <BatteryIndicator />
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={trayOpen}
        onClick={(event) => {
          event.stopPropagation();
          setTrayOpen(!trayOpen);
        }}
        className="rounded-md px-2 py-1 text-xs hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      >
        {notifications.length > 0 ? "●" : "○"}
      </button>
      <Clock />
      {trayOpen ? (
        <div className="os-panel absolute right-2 bottom-14 w-72 rounded-xl border p-3 shadow-2xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold">Notifications</p>
            <button type="button" className="text-[11px] text-zinc-400 hover:text-white" onClick={clearNotifications}>
              Clear
            </button>
          </div>
          {notifications.length === 0 ? (
            <p className="text-xs text-zinc-500">No notifications.</p>
          ) : (
            <ul className="space-y-2">
              {notifications.map((item) => (
                <li key={item.id} className="rounded-md border p-2" style={{ borderColor: "var(--os-border)" }}>
                  <p className="text-xs font-medium">{item.title}</p>
                  <p className="os-muted text-[11px]">{item.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </footer>
  );
}

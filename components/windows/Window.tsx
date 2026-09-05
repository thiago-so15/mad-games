"use client";

import { useCallback, type CSSProperties, type PointerEvent } from "react";
import { WindowHeader } from "@/components/windows/WindowHeader";
import { useOsStore } from "@/store/os-store";
import type { WindowInstance } from "@/types/os";
import { AppContent } from "@/apps/registry";

const TASKBAR = 48;

interface WindowProps {
  win: WindowInstance;
}

export function Window({ win }: WindowProps) {
  const focused = useOsStore((s) => s.activeWindowId === win.id);
  const animations = useOsStore((s) => s.settings.animations);
  const windowStyle = useOsStore((s) => s.settings.windowStyle);
  const closeWindow = useOsStore((s) => s.closeWindow);
  const minimizeWindow = useOsStore((s) => s.minimizeWindow);
  const toggleMaximize = useOsStore((s) => s.toggleMaximize);
  const focusWindow = useOsStore((s) => s.focusWindow);
  const moveWindow = useOsStore((s) => s.moveWindow);

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      focusWindow(win.id);
      if (win.isMaximized || event.pointerType !== "mouse") {
        if (window.innerWidth < 768) return;
        if (win.isMaximized) return;
      }
      if (window.innerWidth < 768) return;

      const dx = event.clientX - win.x;
      const dy = event.clientY - win.y;
      const move = (next: globalThis.PointerEvent) => {
        moveWindow(win.id, next.clientX - dx, next.clientY - dy);
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    },
    [focusWindow, moveWindow, win.id, win.isMaximized, win.x, win.y]
  );

  const radius =
    windowStyle === "sharp" ? "rounded-none" : windowStyle === "glass" ? "rounded-2xl" : "rounded-xl";
  const frame =
    windowStyle === "glass" ? "backdrop-blur-xl" : windowStyle === "sharp" ? "" : "backdrop-blur-md";

  const style: CSSProperties = win.isMaximized
    ? { left: 0, top: 0, width: "100%", height: `calc(100% - ${TASKBAR}px)` }
    : { left: win.x, top: win.y, width: win.width, height: win.height };

  return (
    <section
      role="dialog"
      aria-label={win.title}
      onPointerDown={() => focusWindow(win.id)}
      className={`os-window absolute flex flex-col overflow-hidden border shadow-2xl shadow-black/50 ${radius} ${frame} ${focused ? "os-window-focused" : ""} ${animations ? "os-anim" : ""}`}
      style={{ ...style, zIndex: win.zIndex }}
    >
      <WindowHeader
        title={win.title}
        icon={win.icon}
        focused={focused}
        isMaximized={win.isMaximized}
        onPointerDown={onPointerDown}
        onMinimize={() => minimizeWindow(win.id)}
        onMaximize={() => toggleMaximize(win.id)}
        onClose={() => closeWindow(win.id)}
      />
      <div className="os-window-body min-h-0 flex-1 overflow-auto">
        <AppContent win={win} />
      </div>
    </section>
  );
}

"use client";

import type { PointerEvent, ReactNode } from "react";
import { AppGlyph, glyphForApp } from "@/components/ui/AppGlyph";

interface WindowHeaderProps {
  title: string;
  icon: string;
  focused: boolean;
  isMaximized: boolean;
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
}

export function WindowHeader({
  title,
  icon,
  focused,
  isMaximized,
  onPointerDown,
  onMinimize,
  onMaximize,
  onClose,
}: WindowHeaderProps) {
  return (
    <header
      className={`os-window-header flex h-9 shrink-0 items-center gap-2 border-b px-2 ${focused ? "" : "opacity-80"}`}
      onPointerDown={onPointerDown}
    >
      <AppGlyph name={glyphForApp(icon)} className="h-4 w-4 opacity-80" />
      <h2 className="min-w-0 flex-1 truncate text-xs font-medium">{title}</h2>
      <div className="flex items-center gap-1">
        <WindowControl label="Minimize" onClick={onMinimize}>
          <span className="mb-1 block h-px w-2.5 bg-current" />
        </WindowControl>
        <WindowControl label={isMaximized ? "Restore" : "Maximize"} onClick={onMaximize}>
          <span className="block h-2 w-2 border border-current" />
        </WindowControl>
        <WindowControl label="Close" onClick={onClose} danger>
          <span className="block text-[10px] leading-none">✕</span>
        </WindowControl>
      </div>
    </header>
  );
}

function WindowControl({
  label,
  onClick,
  children,
  danger,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={`flex h-6 w-6 items-center justify-center rounded-sm opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${danger ? "hover:bg-red-600 hover:text-white hover:opacity-100" : "hover:opacity-100"}`}
    >
      {children}
    </button>
  );
}

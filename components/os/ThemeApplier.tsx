"use client";

import { useEffect } from "react";
import { useOsStore } from "@/store/os-store";

const SCALE: Record<string, string> = {
  small: "0.92",
  medium: "1",
  large: "1.08",
};

export function ThemeApplier() {
  const settings = useOsStore((s) => s.settings);

  useEffect(() => {
    const root = document.documentElement;
    root.removeAttribute("data-theme");
    root.dataset.osTheme = settings.theme;
    root.dataset.osAnim = settings.animations ? "on" : "off";
    root.dataset.osCursor = settings.cursor;
    root.dataset.osFx = settings.visualEffect;
    root.dataset.osWin = settings.windowStyle;
    root.style.setProperty("--os-scale", SCALE[settings.uiScale] ?? "1");

    if (settings.theme === "light") {
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
    }
    root.classList.add("mad-os-mode");
    return () => {
      root.classList.remove("mad-os-mode");
      root.classList.add("dark");
      delete root.dataset.osTheme;
      delete root.dataset.osAnim;
      delete root.dataset.osCursor;
      delete root.dataset.osFx;
      delete root.dataset.osWin;
    };
  }, [settings]);

  return null;
}

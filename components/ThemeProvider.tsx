"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { getShopItemById } from "@/lib/shop";

const VALID_THEMES = ["midnight", "forest", "sunset", "neon"] as const;

/** Aplica tema (light/dark) y tema de plataforma (midnight, forest, sunset, neon) al documento. */
export function ThemeProvider() {
  const settingsTheme = useStore((s) => s.settings.theme);
  const equippedThemeId = useStore((s) => s.inventory?.equipped?.theme ?? null);

  useEffect(() => {
    const root = document.documentElement;
    if (settingsTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [settingsTheme]);

  useEffect(() => {
    const root = document.documentElement;
    const id = useStore.getState().inventory?.equipped?.theme ?? null;
    const themeValue = id ? getShopItemById(id)?.value : null;
    root.removeAttribute("data-theme");
    if (themeValue && VALID_THEMES.includes(themeValue as (typeof VALID_THEMES)[number])) {
      root.setAttribute("data-theme", themeValue);
    }
  }, [equippedThemeId]);

  return null;
}

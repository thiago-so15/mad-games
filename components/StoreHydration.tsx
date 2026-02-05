"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { getShopItemById } from "@/lib/shop";

const VALID_THEMES = ["midnight", "forest", "sunset", "neon"] as const;
const VALID_CURSORS = ["crosshair", "pointer", "cell", "glow"] as const;

/**
 * Rehidrata el store de Zustand en el cliente para evitar mismatch con SSR.
 * También aplica tema y cursor de plataforma equipados tras la rehidratación.
 */
export function StoreHydration() {
  useEffect(() => {
    useStore.persist.rehydrate();
    const state = useStore.getState();
    const root = document.documentElement;

    // Aplicar tema
    const themeId = state.inventory?.equipped?.theme ?? null;
    const themeValue = themeId ? getShopItemById(themeId)?.value : null;
    root.removeAttribute("data-theme");
    if (themeValue && VALID_THEMES.includes(themeValue as (typeof VALID_THEMES)[number])) {
      root.setAttribute("data-theme", themeValue);
    }

    // Aplicar cursor
    const cursorId = state.inventory?.equipped?.cursor ?? null;
    const cursorValue = cursorId ? getShopItemById(cursorId)?.value : null;
    root.removeAttribute("data-cursor");
    if (cursorValue && VALID_CURSORS.includes(cursorValue as (typeof VALID_CURSORS)[number])) {
      root.setAttribute("data-cursor", cursorValue);
    }
  }, []);
  return null;
}

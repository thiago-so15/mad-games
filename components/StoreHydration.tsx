"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { getShopItemById } from "@/lib/shop";

const VALID_THEMES = ["midnight", "forest", "sunset", "neon"] as const;

/**
 * Rehidrata el store de Zustand en el cliente para evitar mismatch con SSR.
 * También aplica el tema de plataforma equipado tras la rehidratación.
 */
export function StoreHydration() {
  useEffect(() => {
    useStore.persist.rehydrate();
    const id = useStore.getState().inventory?.equipped?.theme ?? null;
    const themeValue = id ? getShopItemById(id)?.value : null;
    const root = document.documentElement;
    root.removeAttribute("data-theme");
    if (themeValue && VALID_THEMES.includes(themeValue as (typeof VALID_THEMES)[number])) {
      root.setAttribute("data-theme", themeValue);
    }
  }, []);
  return null;
}

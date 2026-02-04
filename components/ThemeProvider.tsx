"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

/** Aplica tema (light/dark) al documento según settings. Debe montarse tras StoreHydration. */
export function ThemeProvider() {
  const theme = useStore((s) => s.settings.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return null;
}

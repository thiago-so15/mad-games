"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

/**
 * Aplica flags visuales globales para reducir/activar animaciones.
 */
export function VisualEffectsProvider() {
  const visualEffects = useStore((s) => s.settings.visualEffects ?? "high");
  const lowPerformanceMode = useStore((s) => s.settings.lowPerformanceMode ?? false);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-vfx", visualEffects);
    if (lowPerformanceMode) {
      root.setAttribute("data-performance", "low");
    } else {
      root.removeAttribute("data-performance");
    }
  }, [visualEffects, lowPerformanceMode]);

  return null;
}


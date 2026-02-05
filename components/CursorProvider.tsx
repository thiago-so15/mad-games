"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { getShopItemById } from "@/lib/shop";

const VALID_CURSORS = ["crosshair", "pointer", "cell", "glow"] as const;

/**
 * Aplica el cursor cosmético equipado al documento.
 * Solo cambia el aspecto visual, no afecta precisión ni área de click.
 */
export function CursorProvider() {
  const equippedCursorId = useStore((s) => s.inventory?.equipped?.cursor ?? null);

  useEffect(() => {
    const root = document.documentElement;
    const cursorValue = equippedCursorId ? getShopItemById(equippedCursorId)?.value : null;
    root.removeAttribute("data-cursor");
    if (cursorValue && VALID_CURSORS.includes(cursorValue as (typeof VALID_CURSORS)[number])) {
      root.setAttribute("data-cursor", cursorValue);
    }
  }, [equippedCursorId]);

  return null;
}

"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

/**
 * Rehidrata el store de Zustand en el cliente para evitar mismatch con SSR.
 * Debe montarse una sola vez (ej. en el layout).
 */
export function StoreHydration() {
  useEffect(() => {
    useStore.persist.rehydrate();
  }, []);
  return null;
}

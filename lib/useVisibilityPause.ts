"use client";

import { useEffect } from "react";

/** Llama a onHide cuando la pestaña pierde visibilidad (pausa automática al cambiar de ventana). */
export function useVisibilityPause(onHide: () => void) {
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") onHide();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [onHide]);
}

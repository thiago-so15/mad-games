"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { tick, togglePause as engineTogglePause, createInitialState } from "./engine";

export function useShiftGame(speedMultiplier: number) {
  const [state, setState] = useState(() => createInitialState());
  /** Una pulsación de cambio de fase: se consume en el siguiente tick */
  const switchRequestedRef = useRef(false);
  const lastTimeRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "p" || e.key === "P") {
        e.preventDefault();
        if (e.key === "p" || e.key === "P") {
          setState((s) => engineTogglePause(s));
          return;
        }
      }
      if ((e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") && e.type === "keydown") {
        switchRequestedRef.current = true;
      }
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("keyup", handleKey);
    };
  }, []);

  useEffect(() => {
    if (state.phase !== "playing" || state.paused) return;
    const loop = () => {
      const now = Date.now();
      const dt = lastTimeRef.current ? now - lastTimeRef.current : 16;
      lastTimeRef.current = now;
      const switchPressed = switchRequestedRef.current;
      if (switchPressed) switchRequestedRef.current = false;
      setState((s) => tick(s, dt, speedMultiplier, switchPressed, now));
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [state.phase, state.paused, speedMultiplier, state.gameStartTime]);

  const start = useCallback(() => {
    switchRequestedRef.current = false;
    setState(createInitialState());
    lastTimeRef.current = 0;
  }, []);

  const togglePause = useCallback(() => setState((s) => engineTogglePause(s)), []);

  return { state, start, togglePause };
}

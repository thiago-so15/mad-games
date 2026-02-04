"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { tick, togglePause as engineTogglePause, createInitialState } from "./engine";

export function usePulseDashGame(speedMultiplier: number) {
  const [state, setState] = useState(() => createInitialState());
  const dashRef = useRef(false);
  const lastTimeRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "p" || e.key === "P") {
        e.preventDefault();
        setState((s) => engineTogglePause(s));
        return;
      }
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        dashRef.current = e.type === "keydown";
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
      setState((s) => tick(s, dt, speedMultiplier, dashRef.current, now));
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [state.phase, state.paused, speedMultiplier, state.gameStartTime]);

  const start = useCallback(() => {
    dashRef.current = false;
    setState(createInitialState());
    lastTimeRef.current = 0;
  }, []);

  const togglePause = useCallback(() => setState((s) => engineTogglePause(s)), []);

  return { state, start, togglePause };
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { tick, togglePause as engineTogglePause, createInitialState } from "./engine";
import type { GameMode } from "./types";

export function useBreakoutGame(mode: GameMode, speedMultiplier: number) {
  const [state, setState] = useState(() => createInitialState(mode, 0, speedMultiplier));
  const keysRef = useRef({ left: false, right: false });
  const lastTimeRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const down = e.type === "keydown";
      if (e.key === "ArrowLeft") keysRef.current.left = down;
      if (e.key === "ArrowRight") keysRef.current.right = down;
      if (e.key === " " || e.key === "p" || e.key === "P") {
        e.preventDefault();
        setState((s) => engineTogglePause(s));
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

    const loop = (now: number) => {
      const dt = lastTimeRef.current ? now - lastTimeRef.current : 16;
      lastTimeRef.current = now;
      setState((s) => tick(s, dt, speedMultiplier, keysRef.current));
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame((now) => {
      lastTimeRef.current = now;
      loop(now);
    });
    return () => cancelAnimationFrame(rafRef.current);
  }, [state.phase, state.paused, speedMultiplier]);

  const start = useCallback((startLevel: number = 0) => {
    keysRef.current = { left: false, right: false };
    setState(createInitialState(mode, startLevel, speedMultiplier));
    lastTimeRef.current = 0;
  }, [mode, speedMultiplier]);

  const nextLevel = useCallback(() => {
    setState((s) => createInitialState(mode, s.level + 1, speedMultiplier));
  }, [mode, speedMultiplier]);

  const togglePause = useCallback(() => {
    setState((s) => engineTogglePause(s));
  }, []);

  return { state, start, nextLevel, togglePause };
}

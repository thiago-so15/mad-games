"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { tick, togglePause as engineTogglePause, createInitialState } from "./engine";

export function useDodgeGame(speedMultiplier: number) {
  const [state, setState] = useState(() => createInitialState(speedMultiplier));
  const keysRef = useRef({ up: false, down: false, left: false, right: false });
  const lastTimeRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const down = e.type === "keydown";
      if (e.key === "ArrowUp") keysRef.current.up = down;
      if (e.key === "ArrowDown") keysRef.current.down = down;
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

    const loop = () => {
      const now = Date.now();
      const dt = lastTimeRef.current ? now - lastTimeRef.current : 16;
      lastTimeRef.current = now;
      setState((s) => {
        const { state: nextState, lastSpawnAt } = tick(
          s,
          dt,
          speedMultiplier,
          keysRef.current,
          lastSpawnRef.current,
          now
        );
        lastSpawnRef.current = lastSpawnAt;
        return nextState;
      });
      rafRef.current = requestAnimationFrame(loop);
    };
    lastSpawnRef.current = state.gameStartTime;
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [state.phase, state.paused, speedMultiplier, state.gameStartTime]);

  const start = useCallback(() => {
    keysRef.current = { up: false, down: false, left: false, right: false };
    const initial = createInitialState(speedMultiplier);
    setState(initial);
    lastTimeRef.current = 0;
    lastSpawnRef.current = initial.gameStartTime;
  }, [speedMultiplier]);

  const togglePause = useCallback(() => {
    setState((s) => engineTogglePause(s));
  }, []);

  return { state, start, togglePause };
}

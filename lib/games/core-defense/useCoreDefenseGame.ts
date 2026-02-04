"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { tick, togglePause as engineTogglePause, createInitialState } from "./engine";

export function useCoreDefenseGame(speedMultiplier: number) {
  const [state, setState] = useState(() => createInitialState());
  const keysRef = useRef({ left: false, right: false });
  const lastTimeRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "p" || e.key === "P") {
        e.preventDefault();
        setState((s) => engineTogglePause(s));
        return;
      }
      const down = e.type === "keydown";
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keysRef.current.left = down;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keysRef.current.right = down;
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
        const { state: nextState, lastSpawnAt } = tick(s, dt, speedMultiplier, keysRef.current, lastSpawnRef.current, now);
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
    keysRef.current = { left: false, right: false };
    const initial = createInitialState();
    setState(initial);
    lastSpawnRef.current = initial.gameStartTime;
  }, []);

  const togglePause = useCallback(() => setState((s) => engineTogglePause(s)), []);

  return { state, start, togglePause };
}

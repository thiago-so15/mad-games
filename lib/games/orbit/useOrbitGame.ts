"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { tick, togglePause as engineTogglePause, createInitialState } from "./engine";

export function useOrbitGame(speedMultiplier: number) {
  const [state, setState] = useState(() => createInitialState());
  const holdRef = useRef(false);
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
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        holdRef.current = e.type === "keydown";
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
          holdRef.current,
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
    holdRef.current = false;
    const initial = createInitialState();
    setState(initial);
    lastTimeRef.current = 0;
    lastSpawnRef.current = initial.gameStartTime;
  }, []);

  const togglePause = useCallback(() => {
    setState((s) => engineTogglePause(s));
  }, []);

  return { state, start, togglePause };
}

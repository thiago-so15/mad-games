"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { tick, togglePause as engineTogglePause, createInitialState } from "./engine";

export function useCoreDefenseGame(speedMultiplier: number) {
  const [state, setState] = useState(() => createInitialState());
  const stateRef = useRef(state);
  stateRef.current = state;
  const canvasStateRef = useRef(state);
  const keysRef = useRef({ left: false, right: false });
  const lastTimeRef = useRef(0);
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
      const nextState = tick(stateRef.current, dt, speedMultiplier, keysRef.current, now);
      canvasStateRef.current = nextState;
      setState(nextState);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [state.phase, state.paused, speedMultiplier, state.gameStartTime]);

  const start = useCallback(() => {
    keysRef.current = { left: false, right: false };
    const initial = createInitialState();
    setState(initial);
    canvasStateRef.current = initial;
  }, []);

  const togglePause = useCallback(() => setState((s) => engineTogglePause(s)), []);

  return { state, canvasStateRef, start, togglePause };
}

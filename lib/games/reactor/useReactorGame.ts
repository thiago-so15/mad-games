"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { tick, toggleShield as engineToggleShield, togglePause as engineTogglePause, createInitialState } from "./engine";

export function useReactorGame(speedMultiplier: number) {
  const [state, setState] = useState(() => createInitialState(speedMultiplier));
  const lastTimeRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        setState((s) => engineToggleShield(s));
      }
      if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        setState((s) => engineTogglePause(s));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (state.phase !== "playing" || state.paused) return;

    const loop = (now: number) => {
      setState((s) => tick(s, now, speedMultiplier));
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [state.phase, state.paused, speedMultiplier]);

  const start = useCallback(() => {
    setState(createInitialState(speedMultiplier));
    lastTimeRef.current = 0;
  }, [speedMultiplier]);

  const toggleShield = useCallback(() => {
    setState((s) => engineToggleShield(s));
  }, []);

  const togglePause = useCallback(() => {
    setState((s) => engineTogglePause(s));
  }, []);

  return { state, start, toggleShield, togglePause };
}

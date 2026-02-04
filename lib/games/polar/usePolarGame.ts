"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  tick,
  togglePolarity as engineTogglePolarity,
  togglePause as engineTogglePause,
  createInitialState,
} from "./engine";
import type { PolarGameState } from "./types";

const POLAR_KEYS = new Set([" ", "Enter", "x", "X", "c", "C"]);

export function usePolarGame(speedMultiplier: number) {
  const [state, setState] = useState(() => createInitialState(speedMultiplier));
  const stateRef = useRef<PolarGameState>(state);
  stateRef.current = state;
  const rafRef = useRef(0);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        setState((s) => engineTogglePause(s));
        return;
      }
      if (POLAR_KEYS.has(e.key) && e.type === "keydown") {
        e.preventDefault();
        setState((s) => engineTogglePolarity(s));
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
      const next = tick(stateRef.current, now, speedMultiplier);
      stateRef.current = next;
      setState(next);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [state.phase, state.paused, speedMultiplier, state.gameStartTime]);

  const start = useCallback(() => {
    setState(createInitialState(speedMultiplier));
  }, [speedMultiplier]);

  const togglePolarity = useCallback(() => {
    setState((s) => engineTogglePolarity(s));
  }, []);

  const togglePause = useCallback(() => {
    setState((s) => engineTogglePause(s));
  }, []);

  return { state, start, togglePolarity, togglePause };
}

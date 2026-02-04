"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  tick,
  togglePhase as engineTogglePhase,
  togglePause as engineTogglePause,
  createInitialState,
} from "./engine";
import type { PhaseGameState } from "./types";

const PHASE_KEYS = new Set([" ", "Enter", "x", "X", "c", "C"]);

export function usePhaseGame(speedMultiplier: number) {
  const [state, setState] = useState(() => createInitialState(speedMultiplier));
  const stateRef = useRef<PhaseGameState>(state);
  stateRef.current = state;
  const rafRef = useRef(0);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        setState((s) => engineTogglePause(s));
        return;
      }
      if (PHASE_KEYS.has(e.key) && e.type === "keydown") {
        e.preventDefault();
        setState((s) => engineTogglePhase(s));
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

  const togglePhase = useCallback(() => {
    setState((s) => engineTogglePhase(s));
  }, []);

  const togglePause = useCallback(() => {
    setState((s) => engineTogglePause(s));
  }, []);

  return { state, start, togglePhase, togglePause };
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  tick,
  reverseDirection as engineReverse,
  togglePause as engineTogglePause,
  createInitialState,
} from "./engine";
import type { VoidGameState } from "./types";

const VOID_KEYS = new Set([" ", "Enter", "x", "X", "c", "C", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);

export function useVoidGame() {
  const [state, setState] = useState<VoidGameState>(() => createInitialState());
  const stateRef = useRef<VoidGameState>(state);
  stateRef.current = state;
  const rafRef = useRef(0);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        setState((s) => engineTogglePause(s));
        return;
      }
      if (VOID_KEYS.has(e.key) && e.type === "keydown") {
        e.preventDefault();
        setState((s) => engineReverse(s));
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
      const next = tick(stateRef.current, now);
      stateRef.current = next;
      setState(next);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [state.phase, state.paused, state.gameStartTime]);

  const start = useCallback(() => {
    setState(createInitialState());
  }, []);

  const reverseDirection = useCallback(() => {
    setState((s) => engineReverse(s));
  }, []);

  const togglePause = useCallback(() => {
    setState((s) => engineTogglePause(s));
  }, []);

  return { state, start, reverseDirection, togglePause };
}

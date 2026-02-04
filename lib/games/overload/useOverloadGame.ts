"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  tick,
  release as engineRelease,
  togglePause as engineTogglePause,
  createInitialState,
} from "./engine";
import type { OverloadGameState } from "./types";

const RELEASE_KEYS = new Set([" ", "Enter", "e", "E", "x", "X"]);

export function useOverloadGame(speedMultiplier: number) {
  const [state, setState] = useState(() => createInitialState(speedMultiplier));
  const stateRef = useRef<OverloadGameState>(state);
  stateRef.current = state;
  const releaseRequestedRef = useRef(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        setState((s) => engineTogglePause(s));
        return;
      }
      if (RELEASE_KEYS.has(e.key) && e.type === "keydown") {
        e.preventDefault();
        releaseRequestedRef.current = true;
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
      let next = tick(stateRef.current, now, speedMultiplier);
      if (releaseRequestedRef.current) {
        releaseRequestedRef.current = false;
        next = engineRelease(next, now, speedMultiplier);
      }
      stateRef.current = next;
      setState(next);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [state.phase, state.paused, speedMultiplier, state.gameStartTime]);

  const start = useCallback(() => {
    releaseRequestedRef.current = false;
    setState(createInitialState(speedMultiplier));
  }, [speedMultiplier]);

  const release = useCallback(() => {
    releaseRequestedRef.current = true;
  }, []);

  const togglePause = useCallback(() => {
    setState((s) => engineTogglePause(s));
  }, []);

  return { state, start, release, togglePause };
}

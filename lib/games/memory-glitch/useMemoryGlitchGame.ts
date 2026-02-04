"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { tick, inputKey, togglePause as engineTogglePause, createInitialState } from "./engine";

export function useMemoryGlitchGame() {
  const [state, setState] = useState(() => createInitialState());
  const rafRef = useRef(0);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        setState((s) => engineTogglePause(s));
        return;
      }
      if (state.phase !== "input" || state.gameOver) return;
      const k = ["1", "2", "3", "4"].indexOf(e.key);
      if (k >= 0) {
        e.preventDefault();
        setState((s) => inputKey(s, k, Date.now()));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [state.phase, state.gameOver]);

  useEffect(() => {
    if (state.gameOver || state.paused) return;
    const loop = () => {
      setState((s) => tick(s, Date.now()));
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [state.gameOver, state.paused]);

  const start = useCallback(() => setState(createInitialState()), []);
  const togglePause = useCallback(() => setState((s) => engineTogglePause(s)), []);

  return { state, start, togglePause, inputKey: (i: number) => setState((s) => inputKey(s, i, Date.now())) };
}

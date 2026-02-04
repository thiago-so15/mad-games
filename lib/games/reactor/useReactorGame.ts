"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { tick, setShield as engineSetShield, togglePause as engineTogglePause, createInitialState } from "./engine";

const SHIELD_KEYS = new Set([" ", "Enter", "s", "S"]);

export function useReactorGame(speedMultiplier: number) {
  const [state, setState] = useState(() => createInitialState(speedMultiplier));
  const rafRef = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (SHIELD_KEYS.has(e.key)) {
        e.preventDefault();
        setState((s) => engineSetShield(s, true, Date.now()));
      }
      if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        setState((s) => engineTogglePause(s));
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (SHIELD_KEYS.has(e.key)) {
        e.preventDefault();
        setState((s) => engineSetShield(s, false));
      }
    };
    const handleBlur = () => {
      setState((s) => engineSetShield(s, false));
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  useEffect(() => {
    if (state.phase !== "playing" || state.paused) return;

    const loop = () => {
      setState((s) => tick(s, Date.now(), speedMultiplier));
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [state.phase, state.paused, speedMultiplier]);

  const start = useCallback(() => {
    setState(createInitialState(speedMultiplier));
  }, [speedMultiplier]);

  const setShield = useCallback((on: boolean) => {
    setState((s) => engineSetShield(s, on));
  }, []);

  const togglePause = useCallback(() => {
    setState((s) => engineTogglePause(s));
  }, []);

  return { state, start, setShield, togglePause };
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { tick, launchServe, togglePause as engineTogglePause, createInitialState } from "./engine";
import type { GameMode, AiDifficulty } from "./types";

export interface PongKeys {
  paddleLeftUp: boolean;
  paddleLeftDown: boolean;
  paddleRightUp: boolean;
  paddleRightDown: boolean;
}

const defaultKeys: PongKeys = {
  paddleLeftUp: false,
  paddleLeftDown: false,
  paddleRightUp: false,
  paddleRightDown: false,
};

export function usePongGame(mode: GameMode, aiDifficulty: AiDifficulty, speedMultiplier: number) {
  const [state, setState] = useState(() => createInitialState(mode, aiDifficulty, speedMultiplier));
  const keysRef = useRef<PongKeys>({ ...defaultKeys });
  const lastTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  const setKeys = useCallback((k: Partial<PongKeys>) => {
    keysRef.current = { ...keysRef.current, ...k };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const key = e.key;
      if (key === " " || key === "p" || key === "P") {
        e.preventDefault();
        setState((s) => engineTogglePause(s));
        return;
      }
      if (state.gameOver) return;
      const down = e.type === "keydown";
      if (key === "w" || key === "W") keysRef.current.paddleLeftUp = down;
      if (key === "s" || key === "S") keysRef.current.paddleLeftDown = down;
      if (key === "ArrowUp") keysRef.current.paddleRightUp = down;
      if (key === "ArrowDown") keysRef.current.paddleRightDown = down;
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("keyup", handleKey);
    };
  }, [state.gameOver]);

  useEffect(() => {
    if (state.gameOver || state.paused) return;

    const loop = (now: number) => {
      const dt = lastTimeRef.current ? now - lastTimeRef.current : 16;
      lastTimeRef.current = now;
      setState((s) => tick(s, dt, speedMultiplier, { ...keysRef.current }));
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame((now) => {
      lastTimeRef.current = now;
      loop(now);
    });
    return () => cancelAnimationFrame(rafRef.current);
  }, [state.gameOver, state.paused, speedMultiplier]);

  const start = useCallback(() => {
    keysRef.current = { ...defaultKeys };
    setState(createInitialState(mode, aiDifficulty, speedMultiplier));
    lastTimeRef.current = 0;
  }, [mode, aiDifficulty, speedMultiplier]);

  const launch = useCallback(() => {
    setState((s) => launchServe(s, speedMultiplier));
  }, [speedMultiplier]);

  const togglePause = useCallback(() => {
    setState((s) => engineTogglePause(s));
  }, []);

  return { state, setKeys, start, launch, togglePause };
}

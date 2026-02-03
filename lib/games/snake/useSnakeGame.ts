"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Direction, GameMode } from "./types";
import { createInitialState, tick, setDirection as engineSetDirection, togglePause as engineTogglePause } from "./engine";

export function useSnakeGame(mode: GameMode, speedMultiplier: number) {
  const [state, setState] = useState(() => createInitialState(mode, speedMultiplier));
  const nextDirRef = useRef<Direction>(state.direction);
  const gameStartRef = useRef<number>(0);

  const setDirection = useCallback((dir: Direction) => {
    nextDirRef.current = dir;
  }, []);

  useEffect(() => {
    nextDirRef.current = state.direction;
  }, [state.direction]);

  useEffect(() => {
    if (state.gameOver || state.paused) return;
    const id = setInterval(() => {
      setState((s) => {
        const withDir = engineSetDirection(s, nextDirRef.current);
        return tick(withDir, Date.now());
      });
    }, state.speedMs);
    return () => clearInterval(id);
  }, [state.gameOver, state.paused, state.speedMs]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const key = e.key;
      if (key === " " || key === "p" || key === "P") {
        e.preventDefault();
        setState((s) => engineTogglePause(s));
        return;
      }
      if (state.gameOver) return;
      if (key === "ArrowUp" || key === "w" || key === "W") setDirection("up");
      if (key === "ArrowDown" || key === "s" || key === "S") setDirection("down");
      if (key === "ArrowLeft" || key === "a" || key === "A") setDirection("left");
      if (key === "ArrowRight" || key === "d" || key === "D") setDirection("right");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [state.gameOver, setDirection]);

  const start = useCallback(() => {
    gameStartRef.current = Date.now();
    setState(createInitialState(mode, speedMultiplier));
    nextDirRef.current = "right";
  }, [mode, speedMultiplier]);

  const togglePause = useCallback(() => {
    setState((s) => engineTogglePause(s));
  }, []);

  const getTimePlayedMs = useCallback(() => {
    return Math.max(0, Date.now() - gameStartRef.current);
  }, []);

  return { state, setDirection, start, togglePause, getTimePlayedMs };
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { platform } from "@/lib/platform-events";
import { useVisibilityPause } from "@/lib/useVisibilityPause";
import { useSnakeGame } from "@/lib/games/snake/useSnakeGame";
import type { GameMode } from "@/lib/games/snake/types";
import { StartScreen } from "./StartScreen";
import { GameScreen } from "./GameScreen";
import { GameOverScreen } from "./GameOverScreen";

type Screen = "start" | "playing" | "gameOver";

interface SnakeGameProps {
  slug: string;
}

export function SnakeGame({ slug }: SnakeGameProps) {
  const settings = useStore((s) => s.settings);
  const snakeStats = useStore((s) => s.snakeStats);
  const addScore = useStore((s) => s.addScore);
  const updateSnakeStats = useStore((s) => s.updateSnakeStats);
  const setLastPlayedGame = useStore((s) => s.setLastPlayedGame);

  const [screen, setScreen] = useState<Screen>("start");
  const [mode, setMode] = useState<GameMode>("classic");
  const recordedGameOverRef = useRef(false);
  const prevScoreRef = useRef(0);
  const [eatFeedback, setEatFeedback] = useState<string | null>(null);

  const speedMultiplier = settings.snakeSpeedMultiplier;
  const { state, start, togglePause, getTimePlayedMs } = useSnakeGame(mode, speedMultiplier);

  useEffect(() => {
    if (state.score > prevScoreRef.current) {
      const delta = state.score - prevScoreRef.current;
      setEatFeedback(delta > 0 ? `+${delta}` : `${delta}`);
      const t = setTimeout(() => setEatFeedback(null), 450);
      return () => clearTimeout(t);
    }
    prevScoreRef.current = state.score;
  }, [state.score]);

  const handlePlay = useCallback(() => {
    recordedGameOverRef.current = false;
    platform.emit("gameStart", { gameSlug: slug });
    setLastPlayedGame(slug);
    setScreen("playing");
    start();
  }, [start, slug, setLastPlayedGame]);

  const handleRetry = useCallback(() => {
    recordedGameOverRef.current = false;
    setScreen("playing");
    start();
  }, [start]);

  useEffect(() => {
    if (screen !== "playing" || !state.gameOver || recordedGameOverRef.current) return;
    recordedGameOverRef.current = true;
    const timePlayed = getTimePlayedMs();
    updateSnakeStats({ mode, score: state.score, timePlayedMs: timePlayed });
    addScore({
      gameSlug: "snake",
      score: state.score,
      extra: { mode, timePlayedMs: String(timePlayed) },
    });
    setScreen("gameOver");
  }, [screen, state.gameOver, mode, state.score, getTimePlayedMs, updateSnakeStats, addScore]);

  useVisibilityPause(
    useCallback(() => {
      if (screen === "playing" && !state.paused && !state.gameOver) togglePause();
    }, [screen, state.paused, state.gameOver, togglePause])
  );

  const bestForMode = snakeStats.bestScoreByMode[mode] ?? 0;
  const bestScore = Math.max(bestForMode, state.score);

  if (screen === "start") {
    return (
      <StartScreen
        selectedMode={mode}
        onSelectMode={setMode}
        onPlay={handlePlay}
      />
    );
  }

  if (screen === "gameOver") {
    return (
      <GameOverScreen
        score={state.score}
        bestScore={bestScore}
        mode={mode}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="relative">
      <GameScreen
        state={state}
        onPause={togglePause}
        eatFeedback={eatFeedback}
      />
      {state.paused && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-zinc-950/80 backdrop-blur-sm">
          <div className="rounded-xl border border-zinc-700 bg-zinc-900 px-8 py-6 text-center">
            <p className="text-lg font-semibold text-white">Pausa</p>
            <p className="mt-1 text-sm text-zinc-400">Espacio o P para reanudar</p>
          </div>
        </div>
      )}
    </div>
  );
}

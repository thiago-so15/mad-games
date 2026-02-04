"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { platform } from "@/lib/platform-events";
import { useBreakoutGame } from "@/lib/games/breakout/useBreakoutGame";
import type { GameMode } from "@/lib/games/breakout/types";
import { StartScreen } from "./StartScreen";
import { GameScreen } from "./GameScreen";
import { ResultScreen } from "./ResultScreen";

type Screen = "start" | "playing" | "result";

interface BreakoutGameProps {
  slug: string;
}

export function BreakoutGame({ slug }: BreakoutGameProps) {
  const settings = useStore((s) => s.settings);
  const breakoutStats = useStore((s) => s.breakoutStats);
  const addScore = useStore((s) => s.addScore);
  const updateBreakoutStats = useStore((s) => s.updateBreakoutStats);
  const setLastPlayedGame = useStore((s) => s.setLastPlayedGame);

  const [screen, setScreen] = useState<Screen>("start");
  const [mode, setMode] = useState<GameMode>("campaign");
  const recordedRef = useRef(false);

  const speedMultiplier = settings.breakoutSpeedMultiplier ?? 1;
  const { state, start, nextLevel, togglePause } = useBreakoutGame(mode, speedMultiplier);

  const handlePlay = useCallback(() => {
    recordedRef.current = false;
    platform.emit("gameStart", { gameSlug: slug });
    setLastPlayedGame(slug);
    setScreen("playing");
    start(0);
  }, [start, slug, setLastPlayedGame]);

  const handleRetry = useCallback(() => {
    recordedRef.current = false;
    setScreen("playing");
    start(0);
  }, [start]);

  const handleContinue = useCallback(() => {
    setScreen("playing");
    nextLevel();
  }, [nextLevel]);

  useEffect(() => {
    if (screen !== "playing") return;

    if (state.phase === "levelComplete") {
      const timePlayed = Date.now() - state.gameStartTime;
      updateBreakoutStats({
        mode,
        score: state.score,
        levelReached: state.level + 1,
        timePlayedMs: timePlayed,
        levelCompleteOnly: true,
      });
      setScreen("result");
      return;
    }

    if (state.phase === "gameOver" && !recordedRef.current) {
      recordedRef.current = true;
      const timePlayed = Date.now() - state.gameStartTime;
      updateBreakoutStats({
        mode,
        score: state.score,
        levelReached: state.level,
        timePlayedMs: timePlayed,
      });
      addScore({
        gameSlug: "breakout",
        score: state.score,
        extra: { mode, level: String(state.level + 1) },
      });
      setScreen("result");
    }
  }, [screen, state.phase, state.score, state.level, state.gameStartTime, mode, updateBreakoutStats, addScore]);

  if (screen === "start") {
    return (
      <StartScreen selectedMode={mode} onSelectMode={setMode} onPlay={handlePlay} />
    );
  }

  if (screen === "result") {
    const bestScore = breakoutStats.bestScoreByMode[mode] ?? 0;
    return (
      <ResultScreen
        phase={state.phase === "levelComplete" ? "levelComplete" : "gameOver"}
        score={state.score}
        level={state.level}
        mode={mode}
        bestScore={Math.max(bestScore, state.score)}
        onContinue={handleContinue}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="relative">
      <GameScreen state={state} onPause={togglePause} />
      {state.paused && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-zinc-950/80 backdrop-blur-sm">
          <div className="rounded-xl border border-zinc-700 bg-zinc-900 px-8 py-6 text-center">
            <p className="text-lg font-semibold text-white">Pausa</p>
            <p className="mt-1 text-sm text-zinc-400">P o Espacio para reanudar</p>
          </div>
        </div>
      )}
    </div>
  );
}

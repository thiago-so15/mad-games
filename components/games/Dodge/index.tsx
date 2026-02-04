"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { useDodgeGame } from "@/lib/games/dodge/useDodgeGame";
import { StartScreen } from "./StartScreen";
import { GameScreen } from "./GameScreen";
import { ResultScreen } from "./ResultScreen";

type Screen = "start" | "playing" | "result";

interface DodgeGameProps {
  slug: string;
}

export function DodgeGame({ slug }: DodgeGameProps) {
  const settings = useStore((s) => s.settings);
  const dodgeStats = useStore((s) => s.dodgeStats);
  const addScore = useStore((s) => s.addScore);
  const updateDodgeStats = useStore((s) => s.updateDodgeStats);
  const setLastPlayedGame = useStore((s) => s.setLastPlayedGame);

  const [screen, setScreen] = useState<Screen>("start");
  const recordedRef = useRef(false);
  const gameStartTimeRef = useRef(0);

  const speedMultiplier = settings.dodgeSpeedMultiplier ?? 1;
  const { state, start, togglePause } = useDodgeGame(speedMultiplier);

  const handlePlay = useCallback(() => {
    recordedRef.current = false;
    gameStartTimeRef.current = Date.now();
    setLastPlayedGame(slug);
    setScreen("playing");
    start();
  }, [start, slug, setLastPlayedGame]);

  const handleRetry = useCallback(() => {
    recordedRef.current = false;
    gameStartTimeRef.current = Date.now();
    setScreen("playing");
    start();
  }, [start]);

  useEffect(() => {
    if (screen !== "playing" || state.phase !== "gameOver" || recordedRef.current) return;
    recordedRef.current = true;

    const timePlayedMs = Math.max(0, Date.now() - gameStartTimeRef.current);
    updateDodgeStats({
      survivalTimeMs: state.survivalTimeMs,
      timePlayedMs,
    });
    addScore({
      gameSlug: "dodge",
      score: state.survivalTimeMs,
      extra: { survivalTimeMs: String(state.survivalTimeMs) },
    });
    setScreen("result");
  }, [screen, state.phase, state.survivalTimeMs, updateDodgeStats, addScore]);

  if (screen === "start") {
    return <StartScreen onPlay={handlePlay} />;
  }

  if (screen === "result") {
    const bestTimeMs = dodgeStats.bestSurvivalTimeMs ?? 0;
    return (
      <ResultScreen
        survivalTimeMs={state.survivalTimeMs}
        bestTimeMs={Math.max(bestTimeMs, state.survivalTimeMs)}
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

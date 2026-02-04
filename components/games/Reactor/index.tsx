"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { useReactorGame } from "@/lib/games/reactor/useReactorGame";
import { StartScreen } from "./StartScreen";
import { GameScreen } from "./GameScreen";
import { ResultScreen } from "./ResultScreen";

type Screen = "start" | "playing" | "result";

interface ReactorGameProps {
  slug: string;
}

export function ReactorGame({ slug }: ReactorGameProps) {
  const settings = useStore((s) => s.settings);
  const reactorStats = useStore((s) => s.reactorStats);
  const addScore = useStore((s) => s.addScore);
  const updateReactorStats = useStore((s) => s.updateReactorStats);
  const setLastPlayedGame = useStore((s) => s.setLastPlayedGame);

  const [screen, setScreen] = useState<Screen>("start");
  const recordedRef = useRef(false);
  const gameStartTimeRef = useRef(0);

  const speedMultiplier = settings.reactorSpeedMultiplier ?? 1;
  const { state, start, togglePause } = useReactorGame(speedMultiplier);

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
    updateReactorStats({
      pulsesSurvived: state.pulsesSurvived,
      bestCombo: state.bestCombo,
      timePlayedMs,
    });
    addScore({
      gameSlug: "reactor",
      score: state.pulsesSurvived,
      extra: { bestCombo: String(state.bestCombo) },
    });
    setScreen("result");
  }, [screen, state.phase, state.pulsesSurvived, state.bestCombo, updateReactorStats, addScore]);

  if (screen === "start") {
    return <StartScreen onPlay={handlePlay} />;
  }

  if (screen === "result") {
    const bestPulses = reactorStats.bestPulsesSurvived ?? 0;
    return (
      <ResultScreen
        pulsesSurvived={state.pulsesSurvived}
        bestCombo={state.bestCombo}
        bestPulsesEver={Math.max(bestPulses, state.pulsesSurvived)}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="relative">
      <GameScreen
        state={state}
        onPause={togglePause}
        screenShake={state.phase === "gameOver" && state.gameOverReason === "miss"}
      />
      {state.paused && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-zinc-950/80 backdrop-blur-sm">
          <div className="rounded-xl border border-zinc-700 bg-zinc-900 px-8 py-6 text-center">
            <p className="text-lg font-semibold text-white">Pausa</p>
            <p className="mt-1 text-sm text-zinc-400">P para reanudar</p>
          </div>
        </div>
      )}
    </div>
  );
}

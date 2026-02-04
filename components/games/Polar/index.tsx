"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { platform } from "@/lib/platform-events";
import { usePolarGame } from "@/lib/games/polar/usePolarGame";
import { StartScreen } from "./StartScreen";
import { GameScreen } from "./GameScreen";
import { ResultScreen } from "./ResultScreen";

type Screen = "start" | "playing" | "result";

export function PolarGame({ slug }: { slug: string }) {
  const settings = useStore((s) => s.settings);
  const polarStats = useStore((s) => s.polarStats);
  const updatePolarStats = useStore((s) => s.updatePolarStats);
  const setLastPlayedGame = useStore((s) => s.setLastPlayedGame);

  const [screen, setScreen] = useState<Screen>("start");
  const recordedRef = useRef(false);
  const gameStartTimeRef = useRef(0);

  const speedMultiplier = settings.polarSpeedMultiplier ?? 1;
  const { state, start, togglePolarity, togglePause } = usePolarGame(speedMultiplier);

  const handlePlay = useCallback(() => {
    recordedRef.current = false;
    gameStartTimeRef.current = Date.now();
    platform.emit("gameStart", { gameSlug: slug });
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
    if (screen !== "playing" || state.phase !== "gameOver" || recordedRef.current)
      return;
    recordedRef.current = true;

    const timePlayedMs = Math.max(0, Date.now() - gameStartTimeRef.current);
    updatePolarStats({
      score: state.score,
      bestCombo: state.bestCombo,
      timePlayedMs,
    });
    platform.emit("gameEnd", {
      gameSlug: slug,
      score: state.score,
      extra: { bestCombo: String(state.bestCombo), timePlayedMs: String(timePlayedMs) },
    });
    setScreen("result");
  }, [screen, state.phase, state.score, state.bestCombo, updatePolarStats, slug]);

  if (screen === "start") return <StartScreen onPlay={handlePlay} />;

  if (screen === "result") {
    const best = polarStats?.bestScore ?? 0;
    return (
      <ResultScreen
        score={state.score}
        bestCombo={state.bestCombo}
        bestScoreEver={Math.max(best, state.score)}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="relative">
      <GameScreen state={state} onTogglePolarity={togglePolarity} onPause={togglePause} />
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

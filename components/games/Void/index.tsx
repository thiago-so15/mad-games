"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { platform } from "@/lib/platform-events";
import { useVoidGame } from "@/lib/games/void/useVoidGame";
import { StartScreen } from "./StartScreen";
import { GameScreen } from "./GameScreen";
import { ResultScreen } from "./ResultScreen";

type Screen = "start" | "playing" | "result";

export function VoidGame({ slug }: { slug: string }) {
  const voidStats = useStore((s) => s.voidStats);
  const updateVoidStats = useStore((s) => s.updateVoidStats);
  const setLastPlayedGame = useStore((s) => s.setLastPlayedGame);

  const [screen, setScreen] = useState<Screen>("start");
  const recordedRef = useRef(false);
  const gameStartTimeRef = useRef(0);

  const { state, start, reverseDirection, togglePause } = useVoidGame();

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
    const survivalMs = state.survivalTimeMs;
    updateVoidStats({
      survivalTimeMs: survivalMs,
      timePlayedMs,
    });
    platform.emit("gameEnd", {
      gameSlug: slug,
      score: Math.floor(survivalMs / 1000),
      extra: { survivalTimeMs: String(survivalMs), timePlayedMs: String(timePlayedMs) },
    });
    setScreen("result");
  }, [screen, state.phase, state.survivalTimeMs, updateVoidStats, slug]);

  if (screen === "start") return <StartScreen onPlay={handlePlay} />;

  if (screen === "result") {
    const best = voidStats?.bestSurvivalTimeMs ?? 0;
    return (
      <ResultScreen
        survivalTimeMs={state.survivalTimeMs}
        bestTimeMs={Math.max(best, state.survivalTimeMs)}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="relative">
      <GameScreen state={state} onReverse={reverseDirection} onPause={togglePause} />
      {state.paused && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/90 backdrop-blur-sm">
          <div className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-4 text-center">
            <p className="text-base font-medium text-zinc-300">Pausa</p>
            <p className="mt-1 text-xs text-zinc-500">P para reanudar</p>
          </div>
        </div>
      )}
    </div>
  );
}

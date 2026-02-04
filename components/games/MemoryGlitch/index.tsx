"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { platform } from "@/lib/platform-events";
import { useMemoryGlitchGame } from "@/lib/games/memory-glitch/useMemoryGlitchGame";
import { StartScreen } from "./StartScreen";
import { GameScreen } from "./GameScreen";
import { ResultScreen } from "./ResultScreen";

type Screen = "start" | "playing" | "result";

export function MemoryGlitchGame({ slug }: { slug: string }) {
  const memoryGlitchStats = useStore((s) => s.memoryGlitchStats);
  const updateMemoryGlitchStats = useStore((s) => s.updateMemoryGlitchStats);
  const setLastPlayedGame = useStore((s) => s.setLastPlayedGame);
  const [screen, setScreen] = useState<Screen>("start");
  const recordedRef = useRef(false);
  const gameStartTimeRef = useRef(0);

  const { state, start, togglePause, inputKey } = useMemoryGlitchGame();

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
    if (screen !== "playing" || !state.gameOver || recordedRef.current) return;
    recordedRef.current = true;
    const timePlayedMs = Math.max(0, Date.now() - gameStartTimeRef.current);
    updateMemoryGlitchStats({ rounds: state.round, timePlayedMs });
    platform.emit("gameEnd", {
      gameSlug: slug,
      score: state.round,
      extra: { timePlayedMs: String(timePlayedMs) },
    });
    setScreen("result");
  }, [screen, state.gameOver, state.round, updateMemoryGlitchStats, slug]);

  if (screen === "start") return <StartScreen onPlay={handlePlay} />;
  if (screen === "result") {
    const best = memoryGlitchStats?.bestRounds ?? 0;
    return <ResultScreen rounds={state.round} bestRounds={Math.max(best, state.round)} onRetry={handleRetry} />;
  }
  return (
    <div className="relative">
      <GameScreen state={state} onPause={togglePause} onInput={inputKey} />
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

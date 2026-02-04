"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { platform } from "@/lib/platform-events";
import { usePulseDashGame } from "@/lib/games/pulse-dash/usePulseDashGame";
import { StartScreen } from "./StartScreen";
import { GameScreen } from "./GameScreen";
import { ResultScreen } from "./ResultScreen";

type Screen = "start" | "playing" | "result";

export function PulseDashGame({ slug }: { slug: string }) {
  const settings = useStore((s) => s.settings);
  const pulseDashStats = useStore((s) => s.pulseDashStats);
  const updatePulseDashStats = useStore((s) => s.updatePulseDashStats);
  const setLastPlayedGame = useStore((s) => s.setLastPlayedGame);
  const [screen, setScreen] = useState<Screen>("start");
  const recordedRef = useRef(false);
  const gameStartTimeRef = useRef(0);

  const speedMultiplier = settings.pulseDashSpeedMultiplier ?? 1;
  const { state, start, togglePause } = usePulseDashGame(speedMultiplier);

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
    if (screen !== "playing" || state.phase !== "gameOver" || recordedRef.current) return;
    recordedRef.current = true;
    const timePlayedMs = Math.max(0, Date.now() - gameStartTimeRef.current);
    updatePulseDashStats({ distance: state.distance, timePlayedMs });
    platform.emit("gameEnd", {
      gameSlug: slug,
      score: Math.floor(state.distance),
      extra: { timePlayedMs: String(timePlayedMs) },
    });
    setScreen("result");
  }, [screen, state.phase, state.distance, updatePulseDashStats, slug]);

  if (screen === "start") return <StartScreen onPlay={handlePlay} />;
  if (screen === "result") {
    const best = pulseDashStats?.bestDistance ?? 0;
    return <ResultScreen distance={state.distance} bestDistance={Math.max(best, state.distance)} onRetry={handleRetry} />;
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

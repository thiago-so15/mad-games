"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { usePongGame } from "@/lib/games/pong/usePongGame";
import type { GameMode, AiDifficulty } from "@/lib/games/pong/types";
import { StartScreen } from "./StartScreen";
import { GameScreen } from "./GameScreen";
import { ResultScreen } from "./ResultScreen";

type Screen = "start" | "playing" | "result";

export function PongGame() {
  const settings = useStore((s) => s.settings);
  const pongStats = useStore((s) => s.pongStats);
  const addScore = useStore((s) => s.addScore);
  const updatePongStats = useStore((s) => s.updatePongStats);

  const [screen, setScreen] = useState<Screen>("start");
  const [mode, setMode] = useState<GameMode>("classic");
  const [aiDifficulty, setAiDifficulty] = useState<AiDifficulty>("normal");
  const recordedResultRef = useRef(false);

  const speedMultiplier = settings.pongSpeedMultiplier ?? 1;
  const { state, start, launch, togglePause } = usePongGame(
    mode,
    aiDifficulty,
    speedMultiplier
  );

  useEffect(() => {
    if (state.phase === "serve" && screen === "playing") {
      const handleSpace = (e: KeyboardEvent) => {
        if (e.key === " ") {
          e.preventDefault();
          launch();
        }
      };
      window.addEventListener("keydown", handleSpace);
      return () => window.removeEventListener("keydown", handleSpace);
    }
  }, [state.phase, screen, launch]);

  const handlePlay = useCallback(() => {
    recordedResultRef.current = false;
    setScreen("playing");
    start();
  }, [start]);

  const handleRetry = useCallback(() => {
    recordedResultRef.current = false;
    setScreen("playing");
    start();
  }, [start]);

  useEffect(() => {
    if (screen !== "playing" || !state.gameOver || !state.winner || recordedResultRef.current)
      return;
    recordedResultRef.current = true;

    const playerWon = state.winner === "left";
    if (mode === "vsAi") {
      updatePongStats({ won: playerWon });
    } else if (mode === "local2p") {
      updatePongStats({});
    } else if (mode === "survival") {
      updatePongStats({ survivalTimeMs: state.survivalTimeMs });
    } else {
      updatePongStats({ won: playerWon });
    }

    addScore({
      gameSlug: "pong",
      score: state.mode === "survival" ? state.survivalTimeMs : state.scoreLeft,
      extra: {
        mode,
        scoreRight: String(state.scoreRight),
        winner: state.winner,
        ...(state.survivalTimeMs ? { survivalTimeMs: String(state.survivalTimeMs) } : {}),
      },
    });
    setScreen("result");
  }, [
    screen,
    state.gameOver,
    state.winner,
    state.scoreLeft,
    state.scoreRight,
    state.survivalTimeMs,
    mode,
    updatePongStats,
    addScore,
  ]);

  if (screen === "start") {
    return (
      <StartScreen
        selectedMode={mode}
        selectedDifficulty={aiDifficulty}
        onSelectMode={setMode}
        onSelectDifficulty={setAiDifficulty}
        onPlay={handlePlay}
      />
    );
  }

  if (screen === "result" && state.winner) {
    const isPlayerLeft = true;
    return (
      <ResultScreen
        winner={state.winner}
        scoreLeft={state.scoreLeft}
        scoreRight={state.scoreRight}
        mode={mode}
        isPlayerLeft={isPlayerLeft}
        survivalTimeMs={state.survivalTimeMs || undefined}
        bestSurvivalTimeMs={pongStats.bestSurvivalTimeMs || undefined}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="relative">
      <GameScreen state={state} onLaunch={launch} onPause={togglePause} />
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

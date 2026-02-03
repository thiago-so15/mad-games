"use client";

import { GRID_SIZE, CELL_SIZE } from "@/lib/games/snake/constants";
import type { SnakeGameState } from "@/lib/games/snake/types";

interface GameScreenProps {
  state: SnakeGameState;
  onPause: () => void;
  /** Feedback visual al comer (ej. +1) */
  eatFeedback: string | null;
}

export function GameScreen({ state, onPause, eatFeedback }: GameScreenProps) {
  const timeLeftSec = state.mode === "timeAttack" ? Math.ceil(state.timeLeftMs / 1000) : null;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-[364px] items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-zinc-400">
            Puntos: <strong className="text-white">{state.score}</strong>
          </span>
          {timeLeftSec !== null && (
            <span className={`rounded px-2 py-0.5 text-sm font-medium ${
              timeLeftSec <= 10 ? "bg-red-500/20 text-red-400" : "bg-zinc-700 text-zinc-300"
            }`}>
              {timeLeftSec}s
            </span>
          )}
          {eatFeedback && (
            <span className="animate-[zoom-in_0.2s_ease-out] text-amber-400 font-medium">
              {eatFeedback}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onPause}
          className="rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700"
        >
          Pausa
        </button>
      </div>

      <div
        className="rounded-lg border-2 border-zinc-700 bg-zinc-900 p-1 shadow-xl"
        style={{
          width: GRID_SIZE * CELL_SIZE + 4,
          height: GRID_SIZE * CELL_SIZE + 4,
        }}
      >
        <svg
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="block"
          viewBox={`0 0 ${GRID_SIZE * CELL_SIZE} ${GRID_SIZE * CELL_SIZE}`}
        >
          {state.snake.map((cell, i) => (
            <rect
              key={`${cell.x}-${cell.y}-${i}`}
              x={cell.x * CELL_SIZE + 1}
              y={cell.y * CELL_SIZE + 1}
              width={CELL_SIZE - 2}
              height={CELL_SIZE - 2}
              fill={i === 0 ? "#f59e0b" : "#22c55e"}
              rx={2}
              className={i === 0 ? "drop-shadow-sm" : ""}
            />
          ))}
          {state.food && (
            <g>
              <rect
                x={state.food.cell.x * CELL_SIZE + 2}
                y={state.food.cell.y * CELL_SIZE + 2}
                width={CELL_SIZE - 4}
                height={CELL_SIZE - 4}
                fill={state.food.type === "poison" ? "#7c3aed" : state.food.type === "bonus" ? "#eab308" : "#ef4444"}
                rx={CELL_SIZE / 2 - 2}
                className="animate-pulse"
              />
            </g>
          )}
        </svg>
      </div>

      <p className="text-xs text-zinc-500">
        🍎 +1 · ⭐ +5 (limitado) · ☠️ -2 / reduce cola
      </p>
    </div>
  );
}

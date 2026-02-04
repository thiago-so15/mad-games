"use client";

import { useEffect, useRef } from "react";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PADDLE_HEIGHT,
  PADDLE_Y,
  BALL_RADIUS,
  POWER_UP_SIZE,
} from "@/lib/games/breakout/constants";
import type { BreakoutGameState, BlockType } from "@/lib/games/breakout/types";

const BLOCK_COLORS: Record<BlockType, string> = {
  normal: "#3b82f6",
  resistant: "#ef4444",
  explosive: "#eab308",
  indestructible: "#27272a",
};

interface GameScreenProps {
  state: BreakoutGameState;
  onPause: () => void;
}

export function GameScreen({ state, onPause }: GameScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio : 1);
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    canvas.style.width = `${CANVAS_WIDTH}px`;
    canvas.style.height = `${CANVAS_HEIGHT}px`;
    ctx.scale(dpr, dpr);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#18181b";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    for (const block of state.blocks) {
      ctx.fillStyle = BLOCK_COLORS[block.type];
      ctx.fillRect(block.x, block.y, block.w, block.h);
      if (block.type === "resistant" && block.hitsLeft > 1) {
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.strokeRect(block.x + 2, block.y + 2, block.w - 4, block.h - 4);
      }
    }

    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(state.paddle.x, PADDLE_Y, state.paddle.w, PADDLE_HEIGHT);

    for (const pu of state.powerUps) {
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(pu.x, pu.y, pu.w, pu.h);
    }

    for (const ball of state.balls) {
      ctx.fillStyle = state.fastBallUntil > Date.now() ? "#fbbf24" : "#fafafa";
      ctx.beginPath();
      ctx.arc(ball.pos.x, ball.pos.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [state]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-[400px] items-center justify-between">
        <span className="text-zinc-400">
          Score: <strong className="text-white">{state.score}</strong>
        </span>
        <span className="text-zinc-400">
          Nivel <strong className="text-white">{state.level + 1}</strong>
        </span>
        <span className="flex items-center gap-1 text-zinc-400">
          ❤️ × <strong className="text-white">{state.lives}</strong>
        </span>
      </div>
      <div className="flex items-center gap-2">
        {state.longPaddleUntil > Date.now() && (
          <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">📏</span>
        )}
        {state.fastBallUntil > Date.now() && (
          <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">⚡</span>
        )}
        <button
          type="button"
          onClick={onPause}
          className="rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700"
        >
          Pausa
        </button>
      </div>

      <div className="rounded-lg border-2 border-zinc-700 bg-zinc-900 overflow-hidden shadow-xl">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="block" />
      </div>
    </div>
  );
}

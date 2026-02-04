"use client";

import { useEffect, useRef } from "react";
import {
  TABLE_WIDTH,
  TABLE_HEIGHT,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  BALL_RADIUS,
  POWER_UP_RADIUS,
} from "@/lib/games/pong/constants";
import { getPaddleEffectiveHeight } from "@/lib/games/pong/engine";
import type { PongGameState } from "@/lib/games/pong/types";

interface GameScreenProps {
  state: PongGameState;
  onLaunch: () => void;
  onPause: () => void;
}

export function GameScreen({ state, onLaunch, onPause }: GameScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const now = Date.now();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio : 1);
    const w = TABLE_WIDTH;
    const h = TABLE_HEIGHT;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = TABLE_WIDTH;
    const h = TABLE_HEIGHT;
    ctx.fillStyle = "#18181b";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "#3f3f46";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.stroke();
    ctx.setLineDash([]);

    const leftH = getPaddleEffectiveHeight(state.paddleLeft, now);
    const rightH = getPaddleEffectiveHeight(state.paddleRight, now);

    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(0, state.paddleLeft.y, PADDLE_WIDTH, leftH);
    ctx.fillRect(w - PADDLE_WIDTH, state.paddleRight.y, PADDLE_WIDTH, rightH);

    for (const pu of state.powerUps) {
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.arc(pu.pos.x, pu.pos.y, POWER_UP_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#93c5fd";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    if (state.ball.isFastMode) {
      ctx.shadowColor = "#f59e0b";
      ctx.shadowBlur = 12;
    }
    ctx.fillStyle = state.ball.isFastMode ? "#fbbf24" : "#fafafa";
    ctx.beginPath();
    ctx.arc(state.ball.pos.x, state.ball.pos.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }, [state, now]);

  const survivalElapsed =
    state.mode === "survival" && state.survivalStartTime
      ? Math.floor((Date.now() - state.survivalStartTime) / 1000)
      : null;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-[400px] items-center justify-between">
        <span className="text-2xl font-bold tabular-nums text-white">
          {state.mode === "survival" ? "—" : state.scoreLeft}
        </span>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {state.mode === "survival" && survivalElapsed !== null && (
            <span className="rounded bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">
              {survivalElapsed}s
            </span>
          )}
          {state.mode === "vsAi" && (
            <span className="rounded bg-zinc-700 px-2 py-0.5 text-xs text-zinc-300">
              {state.aiDifficulty === "easy" ? "Fácil" : state.aiDifficulty === "hard" ? "Difícil" : "Normal"}
            </span>
          )}
          {state.mode === "classic" && (
            <span className="flex gap-1 text-sm">
              {state.shieldLeft && <span title="Escudo">🛡️</span>}
              {state.speedBallUntil > Date.now() && <span title="Velocidad">⚡</span>}
            </span>
          )}
          <button
            type="button"
            onClick={onPause}
            className="rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700"
          >
            Pausa
          </button>
        </div>
        <span className="text-2xl font-bold tabular-nums text-white">
          {state.mode === "survival" ? "—" : state.scoreRight}
        </span>
      </div>

      <div className="rounded-lg border-2 border-zinc-700 bg-zinc-900 overflow-hidden shadow-xl">
        <canvas
          ref={canvasRef}
          width={TABLE_WIDTH}
          height={TABLE_HEIGHT}
          className="block w-full max-w-[400px]"
        />
      </div>

      {state.mode === "classic" && (
        <p className="text-xs text-zinc-500">
          ⚡ Speed  🛡️ Shield  📏 Long paddle
        </p>
      )}

      {state.phase === "serve" && (
        <div className="animate-[fade-in_0.2s_ease-out] text-center">
          <p className="text-zinc-400">
            {state.serveSide === "left" ? "Tu saque" : "Saque rival"}
          </p>
          <button
            type="button"
            onClick={onLaunch}
            className="mt-2 rounded-lg bg-amber-500 px-6 py-2 font-semibold text-zinc-900 hover:bg-amber-400"
          >
            Sacar (Espacio)
          </button>
        </div>
      )}

      {state.paused && (
        <div className="text-center text-zinc-500 text-sm">
          Pausa — P o Espacio para reanudar
        </div>
      )}
    </div>
  );
}

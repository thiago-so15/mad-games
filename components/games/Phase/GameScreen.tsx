"use client";

import { useEffect, useRef } from "react";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  IMPACT_LINE_X,
  OBSTACLE_HEIGHT,
} from "@/lib/games/phase/constants";
import type { PhaseGameState } from "@/lib/games/phase/types";

interface GameScreenProps {
  state: PhaseGameState;
  onTogglePhase: () => void;
  onPause: () => void;
}

const PHASE_A_COLOR = "#3b82f6";
const PHASE_B_COLOR = "#eab308";

export function GameScreen({ state, onTogglePhase, onPause }: GameScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

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

    const draw = () => {
      const s = stateRef.current;

      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      if (s.phase === "gameOver") {
        ctx.fillStyle = "rgba(220, 38, 38, 0.85)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 28px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("FASE INCORRECTA", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        return;
      }

      if (s.feedback === "success") {
        ctx.fillStyle = "rgba(34, 197, 94, 0.3)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }
      if (s.feedback === "fail") {
        ctx.fillStyle = "rgba(220, 38, 38, 0.4)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }

      const centerY = CANVAS_HEIGHT / 2;
      const halfH = OBSTACLE_HEIGHT / 2;

      ctx.strokeStyle = "#fafafa";
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(IMPACT_LINE_X, 0);
      ctx.lineTo(IMPACT_LINE_X, CANVAS_HEIGHT);
      ctx.stroke();
      ctx.setLineDash([]);

      for (const o of s.obstaculos) {
        ctx.fillStyle = o.phase === 0 ? PHASE_A_COLOR : PHASE_B_COLOR;
        ctx.fillRect(o.x, centerY - halfH, o.width, o.height);
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 2;
        ctx.strokeRect(o.x, centerY - halfH, o.width, o.height);
      }

      const indicatorX = 24;
      const indicatorW = 36;
      const indicatorH = 48;
      ctx.fillStyle = s.playerPhase === 0 ? PHASE_A_COLOR : PHASE_B_COLOR;
      ctx.fillRect(indicatorX, centerY - indicatorH / 2, indicatorW, indicatorH);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(s.playerPhase === 0 ? "A" : "B", indicatorX + indicatorW / 2, centerY + 6);
    };

    draw();
    const raf = requestAnimationFrame(function loop() {
      draw();
      requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-[400px] items-center justify-between">
        <span className="text-zinc-400">
          Puntos: <strong className="text-white">{state.score}</strong>
        </span>
        <span className="text-zinc-400">
          Racha: <strong className="text-white">{state.perfectCombo}</strong>
        </span>
        <button
          type="button"
          onClick={onPause}
          className="rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700"
        >
          Pausa
        </button>
      </div>

      <div
        className="overflow-hidden rounded-lg border-2 border-zinc-700 bg-zinc-900 shadow-xl"
        role="button"
        tabIndex={0}
        onClick={onTogglePhase}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            onTogglePhase();
          }
        }}
        aria-label="Cambiar fase"
      >
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="block cursor-pointer" />
      </div>

      <p className="text-xs text-zinc-500">
        <span style={{ color: PHASE_A_COLOR }}>A</span> / <span style={{ color: PHASE_B_COLOR }}>B</span> · Espacio o clic para cambiar
      </p>
    </div>
  );
}

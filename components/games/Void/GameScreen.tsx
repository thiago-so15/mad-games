"use client";

import { useEffect, useRef } from "react";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  POINT_RADIUS,
  INITIAL_MARGIN,
  SHRINK_RATE_PER_SEC,
  MIN_MARGIN,
} from "@/lib/games/void/constants";
import type { VoidGameState } from "@/lib/games/void/types";

function getMarginAt(elapsedSec: number): number {
  const shrink = SHRINK_RATE_PER_SEC * elapsedSec;
  return Math.max(MIN_MARGIN, INITIAL_MARGIN - shrink);
}

interface GameScreenProps {
  state: VoidGameState;
  onReverse: () => void;
  onPause: () => void;
}

export function GameScreen({ state, onReverse, onPause }: GameScreenProps) {
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
      const elapsedSec = s.phase === "playing"
        ? (Date.now() - s.gameStartTime) / 1000
        : s.survivalTimeMs / 1000;
      const margin = getMarginAt(elapsedSec);

      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      if (s.phase === "gameOver") {
        ctx.fillStyle = "rgba(0,0,0,0.92)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = "#525252";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Límite", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        return;
      }

      ctx.strokeStyle = "#27272a";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 6]);
      const l = margin;
      const r = CANVAS_WIDTH - margin;
      const t = margin;
      const b = CANVAS_HEIGHT - margin;
      ctx.strokeRect(l, t, r - l, b - t);
      ctx.setLineDash([]);

      ctx.fillStyle = "#fafafa";
      ctx.beginPath();
      ctx.arc(s.x, s.y, POINT_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    };

    draw();
    const raf = requestAnimationFrame(function loop() {
      draw();
      requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const seconds = Math.floor(state.survivalTimeMs / 1000);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-[400px] items-center justify-between">
        <span className="text-zinc-500 text-sm">
          <span className="text-zinc-300 font-medium">{seconds}</span> s
        </span>
        <button
          type="button"
          onClick={onPause}
          className="rounded border border-zinc-600 bg-zinc-800/80 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-700"
        >
          Pausa
        </button>
      </div>
      <div
        className="overflow-hidden rounded-lg border border-zinc-800 bg-black"
        role="button"
        tabIndex={0}
        onClick={onReverse}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            onReverse();
          }
        }}
        aria-label="Invertir dirección"
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block cursor-pointer"
        />
      </div>
      <p className="text-xs text-zinc-600">Espacio o clic para invertir</p>
    </div>
  );
}

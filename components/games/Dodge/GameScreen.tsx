"use client";

import { useEffect, useRef } from "react";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PLAYER_SIZE,
} from "@/lib/games/dodge/constants";
import type { DodgeGameState } from "@/lib/games/dodge/types";

interface GameScreenProps {
  state: DodgeGameState;
  onPause: () => void;
}

export function GameScreen({ state, onPause }: GameScreenProps) {
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

      for (const o of s.obstacles) {
        ctx.fillStyle = "#dc2626";
        ctx.fillRect(o.pos.x - o.size / 2, o.pos.y - o.size / 2, o.size, o.size);
      }

      ctx.fillStyle = "#fafafa";
      ctx.fillRect(
        s.player.x - PLAYER_SIZE / 2,
        s.player.y - PLAYER_SIZE / 2,
        PLAYER_SIZE,
        PLAYER_SIZE
      );
    };

    draw();
    let raf = 0;
    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const seconds = Math.floor(state.survivalTimeMs / 1000);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-[400px] items-center justify-between">
        <span className="text-zinc-400">
          Tiempo: <strong className="text-white">{seconds}s</strong>
        </span>
        <span className="text-zinc-400">
          Nivel <strong className="text-white">{state.difficultyLevel + 1}</strong>
        </span>
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

"use client";

import { useEffect, useRef } from "react";
import { CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER_Y, PLAYER_SIZE, OBSTACLE_HEIGHT } from "@/lib/games/shift/constants";
import type { ShiftGameState } from "@/lib/games/shift/types";

interface GameScreenProps {
  state: ShiftGameState;
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
        ctx.fillStyle = o.phase === 0 ? "rgba(239,68,68,0.7)" : "rgba(59,130,246,0.7)";
        ctx.fillRect(0, o.y, CANVAS_WIDTH, o.height);
      }

      ctx.fillStyle = s.playerPhase === 0 ? "#ef4444" : "#3b82f6";
      ctx.fillRect(CANVAS_WIDTH / 2 - PLAYER_SIZE / 2, PLAYER_Y - PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE);
    };
    draw();
    let raf = requestAnimationFrame(function loop() {
      draw();
      raf = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-[400px] items-center justify-between">
        <span className="text-zinc-400">
          Tiempo: <strong className="text-white">{Math.floor(state.survivalTimeMs / 1000)}s</strong>
        </span>
        <button type="button" onClick={onPause} className="rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700">
          Pausa
        </button>
      </div>
      <div className="rounded-lg border-2 border-zinc-700 bg-zinc-900 overflow-hidden shadow-xl">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="block" />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { CANVAS_WIDTH, CANVAS_HEIGHT, LANE_COUNT, LANE_HEIGHT } from "@/lib/games/pulse-dash/constants";
import type { PulseDashGameState } from "@/lib/games/pulse-dash/types";

interface GameScreenProps {
  state: PulseDashGameState;
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
      for (let i = 0; i < LANE_COUNT; i++) {
        ctx.fillStyle = s.zoneDanger && i !== s.safeLane ? "rgba(220,38,38,0.4)" : "rgba(34,197,94,0.2)";
        ctx.fillRect(0, i * LANE_HEIGHT, CANVAS_WIDTH, LANE_HEIGHT);
        ctx.strokeStyle = "#27272a";
        ctx.strokeRect(0, i * LANE_HEIGHT, CANVAS_WIDTH, LANE_HEIGHT);
      }
      const x = 80;
      const y = s.lane * LANE_HEIGHT + LANE_HEIGHT / 2;
      ctx.fillStyle = "#fafafa";
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fill();
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
          Distancia: <strong className="text-white">{Math.floor(state.distance)}</strong>
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

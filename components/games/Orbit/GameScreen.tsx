"use client";

import { useEffect, useRef } from "react";
import { CANVAS_SIZE, CENTER, PLAYER_RADIUS } from "@/lib/games/orbit/constants";
import type { OrbitGameState } from "@/lib/games/orbit/types";

function playerPos(angle: number, radius: number): { x: number; y: number } {
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  };
}

function obstaclePos(angle: number, distance: number): { x: number; y: number } {
  return {
    x: CENTER + distance * Math.cos(angle),
    y: CENTER + distance * Math.sin(angle),
  };
}

interface GameScreenProps {
  state: OrbitGameState;
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
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    canvas.style.width = `${CANVAS_SIZE}px`;
    canvas.style.height = `${CANVAS_SIZE}px`;
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
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, 140, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, 40, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "rgba(239,68,68,0.25)";
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, 8, 0, Math.PI * 2);
      ctx.fill();

      for (const o of s.obstacles) {
        const pos = obstaclePos(o.angle, o.distance);
        ctx.fillStyle = "#dc2626";
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, o.size, 0, Math.PI * 2);
        ctx.fill();
      }

      const p = playerPos(s.angle, s.radius);
      ctx.fillStyle = "#fafafa";
      ctx.beginPath();
      ctx.arc(p.x, p.y, PLAYER_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#fafafa";
      ctx.lineWidth = 2;
      ctx.stroke();
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

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-[400px] items-center justify-between">
        <span className="text-zinc-400">
          Puntos: <strong className="text-white">{state.score}</strong>
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
        <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} className="block" />
      </div>
    </div>
  );
}

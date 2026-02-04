"use client";

import { useEffect, useRef } from "react";
import { CANVAS_SIZE, CENTER, CORE_RADIUS, SHIELD_RADIUS } from "@/lib/games/core-defense/constants";
import type { CoreDefenseGameState } from "@/lib/games/core-defense/types";

interface GameScreenProps {
  state: CoreDefenseGameState;
  canvasStateRef?: React.MutableRefObject<CoreDefenseGameState | null>;
  onPause: () => void;
}

export function GameScreen({ state, canvasStateRef, onPause }: GameScreenProps) {
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
      const s = (canvasStateRef?.current ?? stateRef.current) as CoreDefenseGameState;
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      ctx.fillStyle = "rgba(239,68,68,0.3)";
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, CORE_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      const start = s.shieldAngle - s.shieldWidth / 2;
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.moveTo(CENTER, CENTER);
      ctx.arc(CENTER, CENTER, SHIELD_RADIUS, start, start + s.shieldWidth);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#16a34a";
      ctx.lineWidth = 2;
      ctx.stroke();

      for (const i of s.impacts) {
        const x = CENTER + i.distance * Math.cos(i.angle);
        const y = CENTER + i.distance * Math.sin(i.angle);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(250,204,21,0.9)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      for (const p of s.projectiles) {
        const x = CENTER + p.distance * Math.cos(p.angle);
        const y = CENTER + p.distance * Math.sin(p.angle);
        ctx.fillStyle = "#dc2626";
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
      }
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
          Racha: <strong className="text-white">{state.streak}</strong>
        </span>
        <button type="button" onClick={onPause} className="rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700">
          Pausa
        </button>
      </div>
      <div className="rounded-lg border-2 border-zinc-700 bg-zinc-900 overflow-hidden shadow-xl">
        <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} className="block" />
      </div>
    </div>
  );
}

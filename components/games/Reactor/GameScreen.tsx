"use client";

import { useEffect, useRef, useState } from "react";
import { CANVAS_SIZE, REACTOR_RADIUS } from "@/lib/games/reactor/constants";
import type { ReactorGameState } from "@/lib/games/reactor/types";

interface GameScreenProps {
  state: ReactorGameState;
  onPause: () => void;
  screenShake: boolean;
}

export function GameScreen({ state, onPause, screenShake }: GameScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (screenShake && !shake) {
      setShake(true);
      const t = setTimeout(() => setShake(false), 400);
      return () => clearTimeout(t);
    }
  }, [screenShake, shake]);

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

    const cx = CANVAS_SIZE / 2;
    const cy = CANVAS_SIZE / 2;

    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.save();
    ctx.translate(cx, cy);

    const pulseIntensity =
      state.pulsePhase === "warning"
        ? 0.4 + 0.4 * Math.sin(Date.now() / 80)
        : state.pulsePhase === "active"
          ? 1
          : 0.2;
    const r = REACTOR_RADIUS;
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 2);
    g.addColorStop(0, `rgba(251, 146, 60, ${pulseIntensity * 0.9})`);
    g.addColorStop(0.5, `rgba(239, 68, 68, ${pulseIntensity * 0.5})`);
    g.addColorStop(1, "rgba(127, 29, 29, 0.3)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, r * 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = state.pulsePhase === "active" ? "#fef3c7" : "#f97316";
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    if (state.shieldOn) {
      ctx.strokeStyle = "rgba(250, 204, 21, 0.9)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, REACTOR_RADIUS + 25, 0, Math.PI * 2);
      ctx.stroke();
    }
  }, [state]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-[320px] items-center justify-between">
        <span className="text-zinc-400">
          Pulsos: <strong className="text-white">{state.pulsesSurvived}</strong>
        </span>
        <span className="text-zinc-400">
          Racha: <strong className="text-white">{state.currentCombo}</strong>
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
        className={`rounded-lg border-2 border-zinc-700 bg-zinc-900 overflow-hidden shadow-xl transition-transform ${shake ? "animate-[shake_0.4s_ease-out]" : ""}`}
      >
        <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} className="block" />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  ENERGY_MAX,
} from "@/lib/games/overload/constants";
import type { OverloadGameState } from "@/lib/games/overload/types";

interface GameScreenProps {
  state: OverloadGameState;
  onRelease: () => void;
  onPause: () => void;
}

export function GameScreen({ state, onRelease, onPause }: GameScreenProps) {
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
      const now = Date.now();

      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      if (s.phase === "gameOver") {
        ctx.fillStyle = "rgba(220, 38, 38, 0.85)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 32px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("EXPLOSIÓN", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        return;
      }

      if (s.feedback === "success") {
        ctx.fillStyle = "rgba(34, 197, 94, 0.35)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }
      if (s.feedback === "penalty") {
        ctx.fillStyle = "rgba(220, 38, 38, 0.4)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }

      const barY = CANVAS_HEIGHT / 2 - 20;
      const barH = 40;
      const barW = CANVAS_WIDTH - 48;
      const barX = 24;

      ctx.fillStyle = "#27272a";
      ctx.fillRect(barX, barY, barW, barH);

      const safeStartPx = (s.safeZoneStart / ENERGY_MAX) * barW;
      const safeEndPx = (s.safeZoneEnd / ENERGY_MAX) * barW;
      ctx.fillStyle = "rgba(34, 197, 94, 0.5)";
      ctx.fillRect(barX + safeStartPx, barY, safeEndPx - safeStartPx, barH);

      const energyPx = (s.energy / ENERGY_MAX) * barW;
      const gradient = ctx.createLinearGradient(barX, 0, barX + barW, 0);
      gradient.addColorStop(0, "#22c55e");
      gradient.addColorStop(0.5, "#eab308");
      gradient.addColorStop(1, "#dc2626");
      ctx.fillStyle = gradient;
      ctx.fillRect(barX, barY, energyPx, barH);

      const nearLimit = s.energy >= 75;
      if (nearLimit && s.phase === "playing") {
        const shake = Math.sin(now / 40) * 2;
        ctx.strokeStyle = "rgba(250, 204, 21, 0.9)";
        ctx.lineWidth = 3;
        ctx.strokeRect(barX + shake, barY, barW, barH);
      } else {
        ctx.strokeStyle = "#52525b";
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barW, barH);
      }

      ctx.fillStyle = "#fafafa";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`${Math.round(s.energy)}%`, barX + barW + 6, barY + barH / 2 + 4);
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
        onClick={onRelease}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            onRelease();
          }
        }}
        aria-label="Liberar energía"
      >
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="block cursor-pointer" />
      </div>

      <p className="text-xs text-zinc-500">
        Liberá en la <span className="text-green-400">zona verde</span> · Espacio o clic
      </p>
    </div>
  );
}

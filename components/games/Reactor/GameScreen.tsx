"use client";

import { useEffect, useRef } from "react";
import { CANVAS_SIZE, REACTOR_RADIUS } from "@/lib/games/reactor/constants";
import { getChargeProgress } from "@/lib/games/reactor/engine";
import type { ReactorGameState } from "@/lib/games/reactor/types";

interface GameScreenProps {
  state: ReactorGameState;
  speedMultiplier: number;
  onPause: () => void;
  showErrorFeedback: boolean;
}

export function GameScreen({ state, speedMultiplier, onPause, showErrorFeedback }: GameScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const now = Date.now();
    const cx = CANVAS_SIZE / 2;
    const cy = CANVAS_SIZE / 2;
    const r = REACTOR_RADIUS;

    // Fondo
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Error: pantalla roja
    if (showErrorFeedback) {
      ctx.fillStyle = "rgba(220, 38, 38, 0.5)";
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }

    const chargeProgress = getChargeProgress(state, now, speedMultiplier);

    let intensity: number;
    let coreColor: string;

    if (state.pulsePhase === "charge") {
      intensity = 0.15 + 0.6 * chargeProgress;
      coreColor = "#ea580c";
    } else if (state.pulsePhase === "warning") {
      const flicker = Math.sin(now / 60) * 0.2 + 0.8;
      intensity = 0.7 + 0.3 * flicker;
      coreColor = "#f97316";
    } else if (state.pulsePhase === "pulse") {
      intensity = 1;
      coreColor = "#fef3c7";
    } else {
      // passed (éxito): flash breve
      intensity = 1;
      coreColor = "#fef3c7";
    }

    ctx.save();
    ctx.translate(cx, cy);

    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 2);
    g.addColorStop(0, `rgba(251, 146, 60, ${intensity * 0.95})`);
    g.addColorStop(0.5, `rgba(239, 68, 68, ${intensity * 0.5})`);
    g.addColorStop(1, "rgba(127, 29, 29, 0.2)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, r * 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = coreColor;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Escudo activo: halo visible constante
    if (state.shieldOn) {
      ctx.strokeStyle = "rgba(34, 197, 94, 0.95)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(cx, cy, REACTOR_RADIUS + 28, 0, Math.PI * 2);
      ctx.stroke();
    }
  }, [state, speedMultiplier, showErrorFeedback]);

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
        className={`rounded-lg border-2 border-zinc-700 bg-zinc-900 overflow-hidden shadow-xl transition-transform ${showErrorFeedback ? "animate-[shake_0.4s_ease-out]" : ""}`}
      >
        <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} className="block" />
      </div>
      <p className="text-xs text-zinc-500">
        {state.shieldCooldownUntil > Date.now() ? (
          <span className="text-amber-500/90">
            Escudo en enfriamiento… Pulsá de nuevo cuando veas el flash.
          </span>
        ) : (
          <>
            Mantené <kbd className="rounded border border-zinc-600 bg-zinc-800 px-1.5 py-0.5">Espacio</kbd> o{" "}
            <kbd className="rounded border border-zinc-600 bg-zinc-800 px-1.5 py-0.5">S</kbd> en el momento del pulso.
          </>
        )}
      </p>
    </div>
  );
}

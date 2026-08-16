"use client";

import { useEffect, useState, type ReactNode } from "react";
import { getGameBySlug } from "@/lib/games";

const LOAD_MS = 10_000;
const SLIDE_COUNT = 3;

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 400 250" className="h-full w-full" aria-hidden>
      <rect width="400" height="250" fill="#18181b" rx="8" />
      {children}
    </svg>
  );
}

const PREVIEWS: Record<string, { caption: string; scene: ReactNode }[]> = {
  snake: [
    {
      caption: "Comé la comida y crecé",
      scene: (
        <Frame>
          {[...Array(6)].map((_, i) => (
            <rect key={i} x={40 + i * 18} y={120} width={16} height={16} rx="3" fill={i === 5 ? "#f59e0b" : "#22c55e"} />
          ))}
          <circle cx="280" cy="90" r="9" fill="#ef4444" />
        </Frame>
      ),
    },
    {
      caption: "No te muerdas la cola",
      scene: (
        <Frame>
          <rect x="80" y="40" width="16" height="16" rx="3" fill="#22c55e" />
          <rect x="80" y="58" width="16" height="16" rx="3" fill="#22c55e" />
          <rect x="80" y="76" width="16" height="16" rx="3" fill="#22c55e" />
          {[...Array(8)].map((_, i) => (
            <rect key={i} x={80 + i * 18} y="94" width={16} height={16} rx="3" fill="#22c55e" />
          ))}
          <rect x="224" y="94" width="16" height="16" rx="3" fill="#f59e0b" />
          <circle cx="300" cy="160" r="9" fill="#eab308" />
        </Frame>
      ),
    },
    {
      caption: "Cuidado con la comida veneno",
      scene: (
        <Frame>
          {[...Array(10)].map((_, i) => (
            <rect key={i} x={30 + i * 18} y={140} width={16} height={16} rx="3" fill={i === 9 ? "#f59e0b" : "#22c55e"} />
          ))}
          <circle cx="120" cy="70" r="9" fill="#ef4444" />
          <circle cx="260" cy="80" r="9" fill="#7c3aed" />
        </Frame>
      ),
    },
  ],
  pong: [
    {
      caption: "Rebotá la pelota con la pala",
      scene: (
        <Frame>
          <rect x="18" y="90" width="10" height="70" rx="3" fill="#f59e0b" />
          <rect x="372" y="70" width="10" height="70" rx="3" fill="#e4e4e7" />
          <line x1="200" y1="20" x2="200" y2="230" stroke="#3f3f46" strokeDasharray="8 10" />
          <circle cx="160" cy="130" r="8" fill="#fafafa" />
        </Frame>
      ),
    },
    {
      caption: "Vs IA, 2 jugadores o Survival",
      scene: (
        <Frame>
          <rect x="18" y="50" width="10" height="90" rx="3" fill="#f59e0b" />
          <rect x="372" y="110" width="10" height="90" rx="3" fill="#e4e4e7" />
          <circle cx="240" cy="80" r="8" fill="#fafafa" />
          <text x="90" y="36" fill="#a1a1aa" fontSize="14" fontFamily="sans-serif">
            3
          </text>
          <text x="290" y="36" fill="#a1a1aa" fontSize="14" fontFamily="sans-serif">
            2
          </text>
        </Frame>
      ),
    },
    {
      caption: "Atrapá power-ups en la mesa",
      scene: (
        <Frame>
          <rect x="18" y="100" width="10" height="55" rx="3" fill="#f59e0b" />
          <rect x="372" y="85" width="10" height="90" rx="3" fill="#22c55e" />
          <circle cx="200" cy="140" r="8" fill="#fbbf24" />
          <circle cx="200" cy="70" r="12" fill="#22c55e" opacity="0.9" />
        </Frame>
      ),
    },
  ],
  breakout: [
    {
      caption: "Rompe todos los bloques",
      scene: (
        <Frame>
          {["#3b82f6", "#ef4444", "#eab308", "#3b82f6"].map((c, row) =>
            [...Array(8)].map((_, col) => (
              <rect
                key={`${row}-${col}`}
                x={24 + col * 46}
                y={28 + row * 22}
                width="42"
                height="18"
                rx="2"
                fill={c}
              />
            ))
          )}
          <rect x="150" y="220" width="80" height="10" rx="3" fill="#f59e0b" />
          <circle cx="190" cy="190" r="7" fill="#fafafa" />
        </Frame>
      ),
    },
    {
      caption: "Hay bloques resistentes y explosivos",
      scene: (
        <Frame>
          {[...Array(8)].map((_, col) => (
            <rect key={`a-${col}`} x={24 + col * 46} y="36" width="42" height="18" rx="2" fill="#ef4444" />
          ))}
          {[...Array(8)].map((_, col) => (
            <rect key={`b-${col}`} x={24 + col * 46} y="58" width="42" height="18" rx="2" fill="#eab308" />
          ))}
          <rect x="120" y="220" width="100" height="10" rx="3" fill="#f59e0b" />
          <circle cx="250" cy="160" r="7" fill="#fbbf24" />
        </Frame>
      ),
    },
    {
      caption: "Campaign, Endless o Challenge",
      scene: (
        <Frame>
          {[...Array(6)].map((_, col) => (
            <rect key={col} x={50 + col * 50} y="50" width="44" height="18" rx="2" fill="#3b82f6" />
          ))}
          <rect x="90" y="90" width="44" height="18" rx="2" fill="#22c55e" />
          <rect x="160" y="220" width="70" height="10" rx="3" fill="#f59e0b" />
          <circle cx="175" cy="175" r="7" fill="#fafafa" />
          <circle cx="210" cy="140" r="7" fill="#fafafa" />
        </Frame>
      ),
    },
  ],
  dodge: [
    {
      caption: "Esquivá lo que viene de los bordes",
      scene: (
        <Frame>
          <circle cx="200" cy="125" r="12" fill="#f59e0b" />
          <rect x="20" y="40" width="40" height="14" rx="4" fill="#ef4444" />
          <rect x="340" y="160" width="40" height="14" rx="4" fill="#ef4444" />
          <rect x="180" y="16" width="14" height="36" rx="4" fill="#a78bfa" />
          <rect x="90" y="210" width="14" height="30" rx="4" fill="#a78bfa" />
        </Frame>
      ),
    },
    {
      caption: "Sobreviví el mayor tiempo posible",
      scene: (
        <Frame>
          <circle cx="150" cy="150" r="12" fill="#f59e0b" />
          <rect x="60" y="70" width="50" height="14" rx="4" fill="#ef4444" />
          <rect x="250" y="50" width="50" height="14" rx="4" fill="#ef4444" />
          <rect x="280" y="170" width="14" height="50" rx="4" fill="#a78bfa" />
          <rect x="40" y="180" width="14" height="40" rx="4" fill="#a78bfa" />
          <text x="16" y="28" fill="#a1a1aa" fontSize="12" fontFamily="sans-serif">
            00:24
          </text>
        </Frame>
      ),
    },
    {
      caption: "El ritmo sube con el tiempo",
      scene: (
        <Frame>
          <circle cx="220" cy="110" r="12" fill="#f59e0b" />
          {[30, 90, 200, 310].map((y, i) => (
            <rect key={i} x={20 + i * 20} y={y} width="48" height="12" rx="4" fill="#ef4444" />
          ))}
          <rect x="300" y="30" width="12" height="55" rx="4" fill="#a78bfa" />
          <rect x="120" y="190" width="12" height="45" rx="4" fill="#a78bfa" />
        </Frame>
      ),
    },
  ],
  reactor: [
    {
      caption: "El reactor emite pulsos",
      scene: (
        <Frame>
          <circle cx="200" cy="125" r="70" fill="none" stroke="#f59e0b" strokeWidth="3" opacity="0.4" />
          <circle cx="200" cy="125" r="42" fill="none" stroke="#fbbf24" strokeWidth="4" />
          <circle cx="200" cy="125" r="18" fill="#f59e0b" />
        </Frame>
      ),
    },
    {
      caption: "Activá el escudo en el momento justo",
      scene: (
        <Frame>
          <circle cx="200" cy="125" r="55" fill="none" stroke="#22c55e" strokeWidth="8" />
          <circle cx="200" cy="125" r="18" fill="#f59e0b" />
          <circle cx="200" cy="125" r="90" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.35" />
        </Frame>
      ),
    },
    {
      caption: "Fallar un pulso termina la ronda",
      scene: (
        <Frame>
          <circle cx="200" cy="125" r="70" fill="none" stroke="#ef4444" strokeWidth="3" opacity="0.5" />
          <circle cx="200" cy="125" r="18" fill="#ef4444" />
          <text x="148" y="230" fill="#f87171" fontSize="13" fontFamily="sans-serif">
            ¡Demasiado tarde!
          </text>
        </Frame>
      ),
    },
  ],
  orbit: [
    {
      caption: "Mantené para órbita cerrada",
      scene: (
        <Frame>
          <circle cx="200" cy="125" r="8" fill="#fafafa" />
          <circle cx="200" cy="125" r="36" fill="none" stroke="#52525b" strokeDasharray="4 6" />
          <circle cx="236" cy="125" r="10" fill="#f59e0b" />
        </Frame>
      ),
    },
    {
      caption: "Soltá para una órbita amplia",
      scene: (
        <Frame>
          <circle cx="200" cy="125" r="8" fill="#fafafa" />
          <circle cx="200" cy="125" r="78" fill="none" stroke="#52525b" strokeDasharray="4 6" />
          <circle cx="278" cy="125" r="10" fill="#f59e0b" />
          <rect x="310" y="40" width="22" height="22" rx="4" fill="#ef4444" />
        </Frame>
      ),
    },
    {
      caption: "Esquivá los obstáculos en el camino",
      scene: (
        <Frame>
          <circle cx="200" cy="125" r="8" fill="#fafafa" />
          <circle cx="200" cy="125" r="55" fill="none" stroke="#52525b" strokeDasharray="4 6" />
          <circle cx="245" cy="80" r="10" fill="#f59e0b" />
          <rect x="80" y="70" width="20" height="20" rx="4" fill="#ef4444" />
          <rect x="300" y="150" width="20" height="20" rx="4" fill="#a78bfa" />
        </Frame>
      ),
    },
  ],
  "pulse-dash": [
    {
      caption: "Corredor automático: un botón para dashear",
      scene: (
        <Frame>
          <rect x="0" y="70" width="400" height="110" fill="#27272a" />
          <rect x="0" y="118" width="400" height="14" fill="#3f3f46" />
          <rect x="80" y="108" width="36" height="34" rx="6" fill="#f59e0b" />
          <rect x="220" y="70" width="50" height="110" fill="#ef4444" opacity="0.85" />
        </Frame>
      ),
    },
    {
      caption: "Dasheá entre zonas seguras",
      scene: (
        <Frame>
          <rect x="0" y="70" width="400" height="110" fill="#27272a" />
          <rect x="160" y="70" width="80" height="110" fill="#22c55e" opacity="0.35" />
          <rect x="188" y="108" width="36" height="34" rx="6" fill="#f59e0b" />
          <rect x="40" y="70" width="40" height="110" fill="#ef4444" opacity="0.8" />
          <rect x="300" y="70" width="50" height="110" fill="#ef4444" opacity="0.8" />
        </Frame>
      ),
    },
    {
      caption: "Cuanto más lejos, más puntos",
      scene: (
        <Frame>
          <rect x="0" y="70" width="400" height="110" fill="#27272a" />
          <rect x="250" y="108" width="36" height="34" rx="6" fill="#f59e0b" />
          <text x="16" y="36" fill="#a1a1aa" fontSize="13" fontFamily="sans-serif">
            Distancia 842
          </text>
        </Frame>
      ),
    },
  ],
  "memory-glitch": [
    {
      caption: "Memorizá el patrón de luces",
      scene: (
        <Frame>
          {["#ef4444", "#3b82f6", "#22c55e", "#eab308"].map((c, i) => (
            <rect
              key={i}
              x={70 + (i % 2) * 140}
              y={40 + Math.floor(i / 2) * 90}
              width="120"
              height="80"
              rx="10"
              fill={c}
              opacity={i === 2 ? 1 : 0.35}
            />
          ))}
        </Frame>
      ),
    },
    {
      caption: "Repetilo antes de que se acabe el tiempo",
      scene: (
        <Frame>
          {["#ef4444", "#3b82f6", "#22c55e", "#eab308"].map((c, i) => (
            <rect
              key={i}
              x={70 + (i % 2) * 140}
              y={40 + Math.floor(i / 2) * 90}
              width="120"
              height="80"
              rx="10"
              fill={c}
              opacity={0.45}
            />
          ))}
          <text x="150" y="132" fill="#fafafa" fontSize="18" fontFamily="sans-serif">
            0:08
          </text>
        </Frame>
      ),
    },
    {
      caption: "Cada ronda suma un paso más",
      scene: (
        <Frame>
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={70 + (i % 2) * 140}
              y={40 + Math.floor(i / 2) * 90}
              width="120"
              height="80"
              rx="10"
              fill="#3f3f46"
            />
          ))}
          <rect x="70" y="40" width="120" height="80" rx="10" fill="#ef4444" />
        </Frame>
      ),
    },
  ],
  "core-defense": [
    {
      caption: "Defendé el núcleo central",
      scene: (
        <Frame>
          <circle cx="200" cy="125" r="16" fill="#f59e0b" />
          <path d="M200 70 A55 55 0 0 1 255 125" fill="none" stroke="#22c55e" strokeWidth="10" strokeLinecap="round" />
          <circle cx="200" cy="40" r="8" fill="#ef4444" />
        </Frame>
      ),
    },
    {
      caption: "Rotá el escudo y bloqueá impactos",
      scene: (
        <Frame>
          <circle cx="200" cy="125" r="16" fill="#f59e0b" />
          <path d="M145 125 A55 55 0 0 1 200 70" fill="none" stroke="#22c55e" strokeWidth="10" strokeLinecap="round" />
          <circle cx="80" cy="125" r="8" fill="#ef4444" />
          <circle cx="320" cy="90" r="8" fill="#a78bfa" />
        </Frame>
      ),
    },
    {
      caption: "Si un disparo llega al núcleo, perdés",
      scene: (
        <Frame>
          <circle cx="200" cy="125" r="16" fill="#ef4444" />
          <path d="M200 180 A55 55 0 0 1 145 125" fill="none" stroke="#52525b" strokeWidth="10" strokeLinecap="round" />
          <circle cx="210" cy="128" r="8" fill="#f87171" />
        </Frame>
      ),
    },
  ],
  shift: [
    {
      caption: "El mundo alterna entre dos fases",
      scene: (
        <Frame>
          <rect width="200" height="250" fill="#1e3a5f" rx="8" />
          <rect x="200" width="200" height="250" fill="#431407" />
          <circle cx="120" cy="125" r="14" fill="#38bdf8" />
          <circle cx="280" cy="125" r="14" fill="#fb923c" opacity="0.35" />
        </Frame>
      ),
    },
    {
      caption: "Cambiá de fase en el momento justo",
      scene: (
        <Frame>
          <rect width="400" height="250" fill="#431407" rx="8" />
          <circle cx="200" cy="125" r="14" fill="#fb923c" />
          <rect x="80" y="40" width="28" height="28" rx="4" fill="#7c2d12" />
          <rect x="300" y="170" width="28" height="28" rx="4" fill="#7c2d12" />
        </Frame>
      ),
    },
    {
      caption: "Lo que era peligro se vuelve camino",
      scene: (
        <Frame>
          <rect width="400" height="250" fill="#1e3a5f" rx="8" />
          <circle cx="160" cy="140" r="14" fill="#38bdf8" />
          <rect x="240" y="90" width="90" height="18" rx="4" fill="#38bdf8" opacity="0.5" />
          <rect x="50" y="180" width="90" height="18" rx="4" fill="#38bdf8" opacity="0.5" />
        </Frame>
      ),
    },
  ],
  overload: [
    {
      caption: "El núcleo se sobrecarga",
      scene: (
        <Frame>
          <circle cx="200" cy="110" r="40" fill="#f59e0b" />
          <rect x="80" y="190" width="240" height="16" rx="8" fill="#27272a" />
          <rect x="80" y="190" width="140" height="16" rx="8" fill="#ef4444" />
        </Frame>
      ),
    },
    {
      caption: "Liberá energía en la zona verde",
      scene: (
        <Frame>
          <circle cx="200" cy="110" r="40" fill="#22c55e" />
          <rect x="80" y="190" width="240" height="16" rx="8" fill="#27272a" />
          <rect x="80" y="190" width="175" height="16" rx="8" fill="#22c55e" />
          <rect x="230" y="186" width="36" height="24" rx="4" fill="#22c55e" opacity="0.4" />
        </Frame>
      ),
    },
    {
      caption: "Si llega al 100%, explotás",
      scene: (
        <Frame>
          <circle cx="200" cy="110" r="48" fill="#ef4444" />
          <rect x="80" y="190" width="240" height="16" rx="8" fill="#ef4444" />
          <text x="155" y="50" fill="#fca5a5" fontSize="14" fontFamily="sans-serif">
            OVERLOAD
          </text>
        </Frame>
      ),
    },
  ],
  polar: [
    {
      caption: "El núcleo tiene polaridad + o −",
      scene: (
        <Frame>
          <circle cx="200" cy="125" r="28" fill="#3b82f6" />
          <text x="191" y="134" fill="#fff" fontSize="22" fontFamily="sans-serif">
            +
          </text>
        </Frame>
      ),
    },
    {
      caption: "Coincidí polaridad al impactar",
      scene: (
        <Frame>
          <circle cx="200" cy="125" r="28" fill="#ef4444" />
          <text x="193" y="134" fill="#fff" fontSize="22" fontFamily="sans-serif">
            −
          </text>
          <circle cx="80" cy="80" r="16" fill="#ef4444" />
          <text x="74" y="86" fill="#fff" fontSize="14" fontFamily="sans-serif">
            −
          </text>
          <circle cx="320" cy="170" r="16" fill="#3b82f6" />
          <text x="314" y="176" fill="#fff" fontSize="14" fontFamily="sans-serif">
            +
          </text>
        </Frame>
      ),
    },
    {
      caption: "Si no coinciden, perdés",
      scene: (
        <Frame>
          <circle cx="200" cy="125" r="28" fill="#3b82f6" />
          <text x="191" y="134" fill="#fff" fontSize="22" fontFamily="sans-serif">
            +
          </text>
          <circle cx="200" cy="50" r="16" fill="#ef4444" />
          <text x="194" y="56" fill="#fff" fontSize="14" fontFamily="sans-serif">
            −
          </text>
        </Frame>
      ),
    },
  ],
  void: [
    {
      caption: "Un punto. Un límite.",
      scene: (
        <Frame>
          <circle cx="200" cy="125" r="7" fill="#fafafa" />
          <rect x="12" y="12" width="376" height="226" fill="none" stroke="#3f3f46" strokeWidth="4" rx="4" />
        </Frame>
      ),
    },
    {
      caption: "No toques los bordes",
      scene: (
        <Frame>
          <circle cx="60" cy="50" r="7" fill="#fafafa" />
          <rect x="12" y="12" width="376" height="226" fill="none" stroke="#ef4444" strokeWidth="4" rx="4" />
        </Frame>
      ),
    },
    {
      caption: "El espacio se cierra con el tiempo",
      scene: (
        <Frame>
          <circle cx="200" cy="125" r="7" fill="#fafafa" />
          <rect x="70" y="50" width="260" height="150" fill="none" stroke="#a1a1aa" strokeWidth="4" rx="4" />
        </Frame>
      ),
    },
  ],
};

const FALLBACK = PREVIEWS.snake;

export function GameLoadingScreen({ slug, children }: { slug: string; children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [slide, setSlide] = useState(0);

  const game = getGameBySlug(slug);
  const slides = PREVIEWS[slug] ?? FALLBACK;

  useEffect(() => {
    setReady(false);
    setProgress(0);
    setSlide(0);
    const start = Date.now();
    const id = window.setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / LOAD_MS);
      setProgress(p);
      setSlide(Math.min(SLIDE_COUNT - 1, Math.floor(p * SLIDE_COUNT)));
      if (p >= 1) {
        window.clearInterval(id);
        setReady(true);
      }
    }, 50);
    return () => window.clearInterval(id);
  }, [slug]);

  if (ready) return <>{children}</>;

  const current = slides[slide] ?? slides[0];
  const remaining = Math.max(0, Math.ceil((LOAD_MS * (1 - progress)) / 1000));

  return (
    <div className="flex w-full flex-col items-center" aria-busy="true" aria-live="polite">
      <p className="mb-1 text-sm font-medium text-zinc-300">
        Cargando {game?.name ?? "juego"}… {remaining}s
      </p>
      {game?.description && (
        <p className="mb-3 max-w-[520px] text-center text-sm text-zinc-400">{game.description}</p>
      )}
      <div className="relative w-full max-w-[520px] overflow-hidden rounded-xl border-2 border-zinc-700 bg-zinc-950 shadow-xl">
        <div className="aspect-[8/5] w-full">{current.scene}</div>
        <p className="border-t border-zinc-800 bg-zinc-900/90 px-4 py-3 text-center text-sm text-zinc-300">
          {current.caption}
        </p>
        <div className="flex justify-center gap-1.5 pb-3">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${i === slide ? "bg-amber-400" : "bg-zinc-600"}`}
            />
          ))}
        </div>
      </div>
      <div className="mt-4 h-1.5 w-full max-w-[520px] overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-amber-500 transition-[width] duration-100 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}

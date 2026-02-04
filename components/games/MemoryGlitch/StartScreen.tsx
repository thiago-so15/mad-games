"use client";

interface StartScreenProps {
  onPlay: () => void;
}

export function StartScreen({ onPlay }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center gap-8 animate-[fade-in_0.3s_ease-out]">
      <h2 className="text-2xl font-bold text-white">Memory Glitch</h2>
      <p className="text-zinc-400 text-center max-w-sm">
        Memorizá el patrón que se muestra y repetilo con las teclas 1, 2, 3, 4. Cada ronda el tiempo baja.
      </p>
      <button type="button" onClick={onPlay} className="rounded-lg bg-amber-500 px-8 py-3 font-semibold text-zinc-900 shadow-lg transition hover:bg-amber-400 active:scale-[0.98]">
        Jugar
      </button>
      <p className="text-xs text-zinc-500">1 2 3 4 para repetir · P: pausa</p>
    </div>
  );
}

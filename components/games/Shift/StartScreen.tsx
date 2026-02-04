"use client";

interface StartScreenProps {
  onPlay: () => void;
}

export function StartScreen({ onPlay }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center gap-8 animate-[fade-in_0.3s_ease-out]">
      <h2 className="text-2xl font-bold text-white">Shift</h2>
      <p className="text-zinc-400 text-center max-w-sm">
        El mundo alterna entre dos fases. Cambiá de fase (Espacio o ↑) para que los obstáculos no te toquen. Sobreviví.
      </p>
      <button type="button" onClick={onPlay} className="rounded-lg bg-amber-500 px-8 py-3 font-semibold text-zinc-900 shadow-lg transition hover:bg-amber-400 active:scale-[0.98]">
        Jugar
      </button>
      <p className="text-xs text-zinc-500">Espacio o ↑: cambiar fase · P: pausa</p>
    </div>
  );
}

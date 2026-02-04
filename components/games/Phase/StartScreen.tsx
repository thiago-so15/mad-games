"use client";

interface StartScreenProps {
  onPlay: () => void;
}

export function StartScreen({ onPlay }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center gap-8 animate-[fade-in_0.3s_ease-out]">
      <h2 className="text-2xl font-bold text-white">PHASE</h2>
      <p className="max-w-sm text-center text-zinc-400">
        Dos estados (A y B). Los obstáculos llegan a la línea. Cambiá a la fase que coincida con el color del obstáculo en el impacto.
      </p>

      <button
        type="button"
        onClick={onPlay}
        className="rounded-lg bg-amber-500 px-8 py-3 font-semibold text-zinc-900 shadow-lg transition hover:bg-amber-400 active:scale-[0.98]"
      >
        Jugar
      </button>

      <p className="text-xs text-zinc-500">
        Espacio o Enter = cambiar fase · P = pausa
      </p>
    </div>
  );
}

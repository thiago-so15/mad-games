"use client";

interface StartScreenProps {
  onPlay: () => void;
}

export function StartScreen({ onPlay }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center gap-8 animate-[fade-in_0.3s_ease-out]">
      <h2 className="text-2xl font-bold text-white">OVERLOAD</h2>
      <p className="max-w-sm text-center text-zinc-400">
        El núcleo se sobrecarga. Liberá energía en la zona verde antes de que llegue al 100%. Un solo botón.
      </p>

      <button
        type="button"
        onClick={onPlay}
        className="rounded-lg bg-amber-500 px-8 py-3 font-semibold text-zinc-900 shadow-lg transition hover:bg-amber-400 active:scale-[0.98]"
      >
        Jugar
      </button>

      <p className="text-xs text-zinc-500">
        Espacio o Enter = liberar · P = pausa
      </p>
    </div>
  );
}

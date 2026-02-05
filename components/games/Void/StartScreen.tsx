"use client";

interface StartScreenProps {
  onPlay: () => void;
}

export function StartScreen({ onPlay }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center gap-8 animate-[fade-in_0.4s_ease-out]">
      <h2 className="text-2xl font-bold text-zinc-100">VOID</h2>
      <p className="max-w-sm text-center text-zinc-500 text-sm">
        Un punto. Un límite. No toques los bordes.
      </p>
      <button
        type="button"
        onClick={onPlay}
        className="rounded-lg border border-zinc-600 bg-zinc-800 px-8 py-3 font-medium text-zinc-200 transition hover:bg-zinc-700 hover:border-zinc-500 active:scale-[0.98]"
      >
        Jugar
      </button>
      <p className="text-xs text-zinc-600">
        Espacio o clic = invertir dirección · P = pausa
      </p>
    </div>
  );
}

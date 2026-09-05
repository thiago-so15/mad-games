"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getEdition, setEdition, type MadEdition } from "@/lib/edition";

interface VersionPickerProps {
  variant?: "page" | "app";
}

export function VersionPicker({ variant = "page" }: VersionPickerProps) {
  const router = useRouter();
  const [last, setLast] = useState<MadEdition | null>(null);

  useEffect(() => {
    setLast(getEdition());
  }, []);

  const choose = (edition: MadEdition) => {
    setEdition(edition);
    router.push(edition === "os" ? "/os" : "/arcade");
  };

  const compact = variant === "app";

  return (
    <div className={compact ? "flex h-full flex-col p-4" : "flex h-full w-full flex-col items-center justify-center px-4"}>
      <p className={`tracking-[0.4em] text-red-500 ${compact ? "text-[10px]" : "text-xs"}`}>MAD</p>
      <h1 className={`mt-2 font-semibold text-white ${compact ? "text-lg" : "text-3xl"}`}>Elegí una versión</h1>
      <p className="mt-2 max-w-md text-center text-sm text-zinc-400">
        MAD GAMES es el arcade. MAD OS es el sistema operativo. Podés cambiar cuando quieras.
      </p>

      <div className={`mt-8 grid w-full gap-3 ${compact ? "grid-cols-1" : "max-w-2xl sm:grid-cols-2"}`}>
        <VersionCard
          title="MAD GAMES"
          subtitle="Arcade"
          description="Catálogo, tienda, perfil y partidas a pantalla completa."
          last={last === "games"}
          onSelect={() => choose("games")}
        />
        <VersionCard
          title="MAD OS"
          subtitle="Sistema"
          description="Escritorio, ventanas, archivos, terminal y la tienda interna."
          last={last === "os"}
          onSelect={() => choose("os")}
        />
      </div>
    </div>
  );
}

function VersionCard({
  title,
  subtitle,
  description,
  last,
  onSelect,
}: {
  title: string;
  subtitle: string;
  description: string;
  last: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-2xl border p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${last ? "border-red-500 bg-red-600/15" : "border-white/10 bg-white/5 hover:border-red-500/40 hover:bg-white/10"}`}
    >
      <p className="text-[11px] tracking-[0.2em] text-zinc-400 uppercase">{subtitle}</p>
      <p className="mt-1 text-xl font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm text-zinc-400">{description}</p>
      {last ? <p className="mt-4 text-xs text-red-300">Última vez usada</p> : <p className="mt-4 text-xs text-zinc-500">Entrar</p>}
    </button>
  );
}

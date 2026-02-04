import { CatalogGrid } from "@/components/CatalogGrid";

export default function GamesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
        Catálogo de juegos
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Elegí un juego. Los puntajes y el progreso se guardan en tu perfil.
      </p>
      <CatalogGrid />
    </div>
  );
}

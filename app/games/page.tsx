import Link from "next/link";
import { GAMES_CATALOG } from "@/lib/games";

export default function GamesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Catálogo de juegos</h1>
      <p className="mt-2 text-zinc-400">
        Elegí un juego para jugar. Los puntajes se guardan en tu perfil.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES_CATALOG.map((game) => (
          <li key={game.slug}>
            <Link
              href={game.available ? `/games/${game.slug}` : "#"}
              className={`block rounded-xl border p-6 transition ${
                game.available
                  ? "border-zinc-700 bg-zinc-900/50 hover:border-amber-500/50 hover:bg-zinc-800/50"
                  : "cursor-not-allowed border-zinc-800 bg-zinc-900/30 opacity-70"
              }`}
            >
              <span className="text-4xl" role="img" aria-hidden>
                {game.icon ?? "🎮"}
              </span>
              <h2 className="mt-3 text-xl font-semibold text-white">
                {game.name}
              </h2>
              <p className="mt-1 text-sm text-zinc-400">{game.description}</p>
              {game.available ? (
                <span className="mt-4 inline-block text-sm font-medium text-amber-400">
                  Jugar →
                </span>
              ) : (
                <span className="mt-4 inline-block text-sm text-zinc-500">
                  Próximamente
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

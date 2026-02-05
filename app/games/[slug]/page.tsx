import { notFound } from "next/navigation";
import { getGameBySlug } from "@/lib/games";
import { GameRenderer } from "./GameRenderer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function GamePage({ params }: PageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) notFound();
  if (!game.available) notFound();

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex items-center gap-3">
        <span className="text-3xl" role="img" aria-hidden>
          {game.icon ?? "🎮"}
        </span>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{game.name}</h1>
      </div>
      {/* Container con tema oscuro forzado para que los juegos siempre tengan buen contraste */}
      <div className="game-container dark w-full rounded-2xl bg-zinc-900 p-6 text-zinc-100 shadow-xl">
        <GameRenderer slug={slug} />
      </div>
    </div>
  );
}

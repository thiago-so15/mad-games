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
        <h1 className="text-2xl font-bold text-white">{game.name}</h1>
      </div>
      <GameRenderer slug={slug} />
    </div>
  );
}

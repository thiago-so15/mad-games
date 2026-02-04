import Link from "next/link";
import Image from "next/image";
import { HomeStats } from "../components/HomeStats";
import { DailyChallengeCard } from "../components/DailyChallengeCard";

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="animate-[fade-in_0.4s_ease-out]">
        <Image
          src="/mad-games-logo-tr.png"
          alt="MAD GAMES"
          width={280}
          height={280}
          className="mx-auto h-auto w-48 sm:w-56 md:w-64"
          priority
        />
        <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl">
          Arcade moderno. Jugá, sumá XP, desbloqueá logros y niveles.
        </p>
      </div>

      <HomeStats />
      <DailyChallengeCard />

      <div className="mt-12 flex flex-wrap justify-center gap-4">
        <Link
          href="/games"
          className="rounded-xl bg-red-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-arcade hover-lift hover:bg-red-600 active:scale-[0.98] dark:bg-red-500 dark:hover:bg-red-400"
        >
          Ver catálogo
        </Link>
        <Link
          href="/profile"
          className="rounded-xl border-2 border-zinc-300 bg-white px-8 py-4 text-lg font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-700"
        >
          Mi perfil
        </Link>
      </div>

      <p className="mt-8 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
        Modo invitado siempre activo. Todo se guarda en tu dispositivo. Sin cuenta, sin servidor.
      </p>
    </div>
  );
}

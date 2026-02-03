import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
        Mad Games
      </h1>
      <p className="mt-4 max-w-xl text-lg text-zinc-400">
        Plataforma de juegos online. Elegí un juego, jugá y guardá tu puntaje en
        tu perfil local.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/games"
          className="rounded-lg bg-amber-500 px-6 py-3 font-semibold text-zinc-900 transition hover:bg-amber-400"
        >
          Ver catálogo
        </Link>
        <Link
          href="/profile"
          className="rounded-lg border border-zinc-600 px-6 py-3 font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white"
        >
          Mi perfil
        </Link>
      </div>
    </div>
  );
}

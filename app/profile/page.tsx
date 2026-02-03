"use client";

import { useStore } from "@/lib/store";
import Link from "next/link";

export default function ProfilePage() {
  const profile = useStore((s) => s.profile);
  const scores = useStore((s) => s.scores);
  const setProfile = useStore((s) => s.setProfile);
  const getScoresByGame = useStore((s) => s.getScoresByGame);

  const snakeScores = getScoresByGame("snake").slice(0, 10);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold text-white">Mi perfil</h1>
      <p className="mt-2 text-zinc-400">
        Tu perfil y puntajes se guardan solo en este dispositivo.
      </p>

      <section className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-lg font-semibold text-white">Datos locales</h2>
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <div>
            <label htmlFor="nickname" className="block text-sm text-zinc-400">
              Nickname
            </label>
            <input
              id="nickname"
              type="text"
              value={profile.nickname}
              onChange={(e) => setProfile({ nickname: e.target.value })}
              className="mt-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label htmlFor="avatar" className="block text-sm text-zinc-400">
              Avatar (emoji)
            </label>
            <input
              id="avatar"
              type="text"
              value={profile.avatar}
              onChange={(e) => setProfile({ avatar: e.target.value || "🎮" })}
              className="mt-1 w-20 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-center text-2xl focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              maxLength={2}
            />
          </div>
        </div>
        <p className="mt-3 text-xs text-zinc-500">
          Los cambios se guardan automáticamente en tu navegador.
        </p>
      </section>

      <section className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-lg font-semibold text-white">Historial de puntajes</h2>
        {scores.length === 0 ? (
          <p className="mt-4 text-zinc-500">
            Aún no tenés puntajes guardados.{" "}
            <Link href="/games" className="text-amber-400 hover:underline">
              Jugá un juego
            </Link>{" "}
            y guardá tu puntaje al terminar.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            <li className="text-sm font-medium text-zinc-400">Snake</li>
            {snakeScores.map((s, i) => (
              <li
                key={s.playedAt}
                className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-4 py-2"
              >
                <span className="text-zinc-300">
                  #{i + 1} — {s.score} pts
                </span>
                <span className="text-xs text-zinc-500">
                  {new Date(s.playedAt).toLocaleDateString("es-AR")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

"use client";

import { useStore, getXpToNextLevel } from "@/lib/store";
import Link from "next/link";

function formatTime(ms: number): string {
  if (ms < 60000) return "0 min";
  const min = Math.floor(ms / 60000);
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}min` : `${h}h`;
}

export default function ProfilePage() {
  const profile = useStore((s) => s.profile);
  const setProfile = useStore((s) => s.setProfile);
  const scores = useStore((s) => s.scores);
  const getScoresByGame = useStore((s) => s.getScoresByGame);
  const snakeStats = useStore((s) => s.snakeStats);
  const pongStats = useStore((s) => s.pongStats);
  const breakoutStats = useStore((s) => s.breakoutStats);
  const totalXp = useStore((s) => s.progression.totalXp);

  const { level, xpInLevel, xpNeeded } = getXpToNextLevel(totalXp);
  const progressPct = xpNeeded > 0 ? Math.min(100, (xpInLevel / xpNeeded) * 100) : 100;
  const totalGames = snakeStats.gamesPlayed + pongStats.gamesPlayed + breakoutStats.gamesPlayed;
  const totalTimeMs = snakeStats.totalTimeMs + (pongStats.totalTimeMs ?? 0) + breakoutStats.totalTimeMs;

  const snakeScores = getScoresByGame("snake").slice(0, 5);
  const pongScores = getScoresByGame("pong").slice(0, 5);
  const breakoutScores = getScoresByGame("breakout").slice(0, 5);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Mi perfil</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Todo se guarda en este dispositivo. Sin cuenta.
      </p>

      <section className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Identidad</h2>
        <div className="mt-4 flex flex-wrap items-end gap-6">
          <div>
            <label htmlFor="nickname" className="block text-sm text-zinc-500 dark:text-zinc-400">
              Nickname
            </label>
            <input
              id="nickname"
              type="text"
              value={profile.nickname}
              onChange={(e) => setProfile({ nickname: e.target.value })}
              className="mt-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label htmlFor="avatar" className="block text-sm text-zinc-500 dark:text-zinc-400">
              Avatar (emoji)
            </label>
            <input
              id="avatar"
              type="text"
              value={profile.avatar}
              onChange={(e) => setProfile({ avatar: e.target.value || "🎮" })}
              className="mt-1 w-20 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-center text-2xl dark:border-zinc-600 dark:bg-zinc-800"
              maxLength={2}
            />
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Progresión</h2>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500 text-2xl font-bold text-zinc-900">
            {level}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Nivel {level} · {totalXp} XP
            </p>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className="h-full rounded-full bg-amber-500 transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Estadísticas globales</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-zinc-100 p-4 dark:bg-zinc-800/50">
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{totalGames}</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Partidas jugadas</p>
          </div>
          <div className="rounded-xl bg-zinc-100 p-4 dark:bg-zinc-800/50">
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{formatTime(totalTimeMs)}</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Tiempo total</p>
          </div>
          <div className="rounded-xl bg-zinc-100 p-4 dark:bg-zinc-800/50 sm:col-span-2 sm:col-span-1">
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{scores.length}</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Puntajes guardados</p>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Por juego</h2>
        {scores.length === 0 ? (
          <p className="mt-4 text-zinc-500 dark:text-zinc-400">
            Aún no hay puntajes.{" "}
            <Link href="/games" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
              Jugá un juego
            </Link>
          </p>
        ) : (
          <ul className="mt-4 space-y-6">
            <li>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Snake</p>
              <p className="text-xs text-zinc-400">Mejor por modo · {snakeStats.gamesPlayed} partidas</p>
              {snakeScores.map((s, i) => (
                <div key={s.playedAt} className="mt-1 flex justify-between rounded-lg bg-zinc-100 px-3 py-2 text-sm dark:bg-zinc-800/50">
                  <span className="text-zinc-700 dark:text-zinc-300">#{i + 1} — {s.score} pts</span>
                  <span className="text-zinc-500">{new Date(s.playedAt).toLocaleDateString("es-AR")}</span>
                </div>
              ))}
            </li>
            <li>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Pong</p>
              <p className="text-xs text-zinc-400">{pongStats.wins}V / {pongStats.losses}D · Racha: {pongStats.bestStreak}</p>
              {pongScores.map((s, i) => (
                <div key={s.playedAt} className="mt-1 flex justify-between rounded-lg bg-zinc-100 px-3 py-2 text-sm dark:bg-zinc-800/50">
                  <span className="text-zinc-700 dark:text-zinc-300">#{i + 1} — {s.score}–{s.extra?.scoreRight ?? "?"}</span>
                  <span className="text-zinc-500">{new Date(s.playedAt).toLocaleDateString("es-AR")}</span>
                </div>
              ))}
            </li>
            <li>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Breakout</p>
              <p className="text-xs text-zinc-400">Nivel máx: {breakoutStats.maxLevelReached} · {breakoutStats.gamesPlayed} partidas</p>
              {breakoutScores.map((s, i) => (
                <div key={s.playedAt} className="mt-1 flex justify-between rounded-lg bg-zinc-100 px-3 py-2 text-sm dark:bg-zinc-800/50">
                  <span className="text-zinc-700 dark:text-zinc-300">#{i + 1} — {s.score} pts{s.extra?.level ? ` (nivel ${s.extra.level})` : ""}</span>
                  <span className="text-zinc-500">{new Date(s.playedAt).toLocaleDateString("es-AR")}</span>
                </div>
              ))}
            </li>
          </ul>
        )}
      </section>
    </div>
  );
}

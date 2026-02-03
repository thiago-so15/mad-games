"use client";

import { useStore } from "@/lib/store";

export default function SettingsPage() {
  const profile = useStore((s) => s.profile);
  const scores = useStore((s) => s.scores);
  const settings = useStore((s) => s.settings);
  const setSettings = useStore((s) => s.setSettings);

  const clearAllData = () => {
    if (typeof window === "undefined") return;
    if (!confirm("¿Borrar todos los datos locales (perfil y puntajes)? No se puede deshacer.")) return;
    useStore.setState({
      profile: {
        nickname: "Jugador",
        avatar: "🎮",
        updatedAt: Date.now(),
      },
      scores: [],
      settings: { soundEnabled: true, snakeSpeedMultiplier: 1 },
      snakeStats: { bestScoreByMode: {}, gamesPlayed: 0, totalTimeMs: 0 },
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold text-white">Ajustes</h1>
      <p className="mt-2 text-zinc-400">
        Configuración local. Todo se guarda solo en este navegador.
      </p>

      <section className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-lg font-semibold text-white">Juego (Snake)</h2>
        <div className="mt-4 space-y-4">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => setSettings({ soundEnabled: e.target.checked })}
              className="rounded border-zinc-600 bg-zinc-800 text-amber-500 focus:ring-amber-500"
            />
            <span className="text-sm text-zinc-300">Sonido</span>
          </label>
          <div>
            <label htmlFor="speed" className="block text-sm text-zinc-400">
              Velocidad base (Snake)
            </label>
            <select
              id="speed"
              value={settings.snakeSpeedMultiplier}
              onChange={(e) => setSettings({ snakeSpeedMultiplier: Number(e.target.value) })}
              className="mt-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
            >
              <option value={0.75}>Más rápido</option>
              <option value={1}>Normal</option>
              <option value={1.25}>Más lento</option>
            </select>
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-lg font-semibold text-white">Datos almacenados</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Perfil: <strong className="text-zinc-300">{profile.nickname}</strong> (
          {profile.avatar}) — {scores.length} puntaje(s) guardado(s).
        </p>
        <button
          type="button"
          onClick={clearAllData}
          className="mt-4 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-950/50"
        >
          Borrar todos los datos
        </button>
      </section>
    </div>
  );
}

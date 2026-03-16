"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

export default function SettingsPage() {
  const [showClearModal, setShowClearModal] = useState(false);
  const profile = useStore((s) => s.profile);
  const scores = useStore((s) => s.scores);
  const settings = useStore((s) => s.settings);
  const setSettings = useStore((s) => s.setSettings);

  const clearAllData = () => {
    useStore.setState({
      profile: {
        nickname: "Jugador",
        avatar: "🎮",
        updatedAt: Date.now(),
        favoriteGameSlugs: [],
        lastPlayedGameSlug: null,
      },
      scores: [],
      settings: {
        soundEnabled: true,
        theme: "dark",
        controlScheme: "keyboard",
        visualEffects: "high",
        lowPerformanceMode: false,
        snakeSpeedMultiplier: 1,
        pongSpeedMultiplier: 1,
        breakoutSpeedMultiplier: 1,
        dodgeSpeedMultiplier: 1,
        reactorSpeedMultiplier: 1,
        orbitSpeedMultiplier: 1,
        pulseDashSpeedMultiplier: 1,
        memoryGlitchSpeedMultiplier: 1,
        coreDefenseSpeedMultiplier: 1,
        shiftSpeedMultiplier: 1,
        overloadSpeedMultiplier: 1,
        polarSpeedMultiplier: 1,
      },
      snakeStats: { bestScoreByMode: {}, gamesPlayed: 0, totalTimeMs: 0 },
      pongStats: { gamesPlayed: 0, wins: 0, losses: 0, currentStreak: 0, bestStreak: 0, bestSurvivalTimeMs: 0, totalTimeMs: 0 },
      breakoutStats: { bestScoreByMode: {}, maxLevelReached: 0, gamesPlayed: 0, totalTimeMs: 0 },
      dodgeStats: { bestSurvivalTimeMs: 0, gamesPlayed: 0, totalTimeMs: 0 },
      reactorStats: { bestPulsesSurvived: 0, bestCombo: 0, gamesPlayed: 0, totalTimeMs: 0 },
      orbitStats: { bestScore: 0, gamesPlayed: 0, totalTimeMs: 0 },
      pulseDashStats: { bestDistance: 0, gamesPlayed: 0, totalTimeMs: 0 },
      memoryGlitchStats: { bestRounds: 0, gamesPlayed: 0, totalTimeMs: 0 },
      coreDefenseStats: { bestStreak: 0, gamesPlayed: 0, totalTimeMs: 0 },
      shiftStats: { bestSurvivalTimeMs: 0, gamesPlayed: 0, totalTimeMs: 0 },
      overloadStats: { bestScore: 0, bestCombo: 0, gamesPlayed: 0, totalTimeMs: 0 },
      polarStats: { bestScore: 0, bestCombo: 0, gamesPlayed: 0, totalTimeMs: 0 },
      voidStats: { bestSurvivalTimeMs: 0, gamesPlayed: 0, totalTimeMs: 0 },
      hiddenGameUnlocked: false,
      progression: { totalXp: 0 },
      unlockedAchievementIds: [],
      wallet: { madCoins: 0 },
      inventory: {
        purchasedItemIds: [],
        equipped: { avatar: null, border: null, title: null, badge: null, theme: null, cursor: null, soundPack: null, screenEffect: null },
      },
    });
    setShowClearModal(false);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Ajustes</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Configuración global. Aplica a todos los juegos.
      </p>

      <section className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Apariencia</h2>
        <div className="mt-4 space-y-6">
          <div>
            <label className="block text-sm text-zinc-500 dark:text-zinc-400">Tema</label>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setSettings({ theme: "light" })}
                className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition ${
                settings.theme === "light"
                  ? "border-red-500 bg-red-500/15 text-red-600 dark:text-red-400"
                  : "border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-500"
              }`}
            >
              Claro
            </button>
            <button
              type="button"
              onClick={() => setSettings({ theme: "dark" })}
              className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition ${
                settings.theme === "dark"
                  ? "border-red-500 bg-red-500/15 text-red-600 dark:text-red-400"
                  : "border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-500"
              }`}
            >
              Oscuro
            </button>
          </div>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Sonido y controles</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Aplica a toda la plataforma.</p>
        <div className="mt-4 space-y-4">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => setSettings({ soundEnabled: e.target.checked })}
              className="rounded border-zinc-400 text-red-500 focus:ring-red-500 dark:border-zinc-500 dark:bg-zinc-700"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">Sonido master</span>
          </label>
          <div>
            <label className="block text-sm text-zinc-500 dark:text-zinc-400">Esquema de controles</label>
            <p className="mt-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200">
              Teclado
            </p>
          </div>
          <div>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={settings.lowPerformanceMode ?? false}
                onChange={(e) => setSettings({ lowPerformanceMode: e.target.checked })}
                className="rounded border-zinc-400 text-red-500 focus:ring-red-500 dark:border-zinc-500 dark:bg-zinc-700"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Modo bajo rendimiento</span>
            </label>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Menos animaciones y efectos para dispositivos lentos.</p>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Datos locales</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {profile.nickname} ({profile.avatar}) · {scores.length} puntajes guardados
        </p>
        <button
          type="button"
          onClick={() => setShowClearModal(true)}
          className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
        >
          Borrar todo el progreso
        </button>
      </section>

      {showClearModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-progress-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl">
            <h3 id="clear-progress-title" className="text-lg font-semibold text-white">
              Borrar progreso local
            </h3>
            <p className="mt-2 text-sm text-zinc-300">
              Se eliminarán perfil, puntajes, XP, logros, favoritos e inventario.
              Esta acción no se puede deshacer.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={clearAllData}
                className="rounded-lg border border-red-700 bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
              >
                Sí, borrar todo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

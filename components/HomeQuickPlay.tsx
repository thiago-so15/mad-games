"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GAMES_CATALOG, HIDDEN_GAME } from "@/lib/games";
import { useStore } from "@/lib/store";
import {
  DAILY_CHALLENGES,
  DAILY_CHALLENGE_COINS,
  DAILY_CHALLENGE_XP,
  getDailyChallenge,
  getDailyProgress,
  getTodayDateKey,
} from "@/lib/daily-challenges";

type ModeOption = { id: string; label: string };

const MODE_OPTIONS_BY_SLUG: Record<string, ModeOption[]> = {
  snake: [
    { id: "classic", label: "Clasico" },
    { id: "timeAttack", label: "Contra reloj" },
    { id: "hardcore", label: "Hardcore" },
  ],
  pong: [
    { id: "classic", label: "Classic v2" },
    { id: "vsAi", label: "Solo vs AI" },
    { id: "local2p", label: "Dos jugadores" },
    { id: "survival", label: "Survival" },
  ],
  breakout: [
    { id: "campaign", label: "Campaign" },
    { id: "endless", label: "Endless" },
    { id: "challenge", label: "Challenge" },
  ],
};

export function HomeQuickPlay() {
  const router = useRouter();
  const hiddenGameUnlocked = useStore((s) => s.hiddenGameUnlocked);
  const dailyChallengeState = useStore((s) => s.dailyChallenge);
  const reactorStats = useStore((s) => s.reactorStats);

  const [open, setOpen] = useState(false);
  const [openMissions, setOpenMissions] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openNotes, setOpenNotes] = useState(false);
  const [openGuide, setOpenGuide] = useState(false);
  const [expandedGuideItem, setExpandedGuideItem] = useState<string | null>(null);
  const [notesText, setNotesText] = useState("");
  const [selectedGameSlug, setSelectedGameSlug] = useState<string | null>(null);
  const [selectedModeId, setSelectedModeId] = useState<string | null>(null);

  const games = useMemo(() => {
    const base = GAMES_CATALOG.filter((g) => g.available);
    if (hiddenGameUnlocked) return [...base, HIDDEN_GAME];
    return base;
  }, [hiddenGameUnlocked]);

  const selectedGame = selectedGameSlug
    ? games.find((g) => g.slug === selectedGameSlug) ?? null
    : null;
  const todayKey = getTodayDateKey();
  const todayMission = getDailyChallenge(todayKey);
  const safeDaily = dailyChallengeState ?? {
    completedDailyDates: [],
    dailyGamesPlayedCount: 0,
    dailyGamesPlayedDate: "",
    dailyBeatRecordDate: null,
  };
  const todayProgress = getDailyProgress(
    safeDaily,
    todayKey,
    todayMission,
    { reactorBestPulses: reactorStats?.bestPulsesSurvived }
  );

  const modeOptions = selectedGame
    ? MODE_OPTIONS_BY_SLUG[selectedGame.slug] ?? [{ id: "default", label: "Modo unico" }]
    : [];

  const handleSelectGame = (slug: string) => {
    setSelectedGameSlug(slug);
    setSelectedModeId((MODE_OPTIONS_BY_SLUG[slug] ?? [{ id: "default", label: "Modo unico" }])[0].id);
  };

  const handlePlay = () => {
    if (!selectedGame) return;
    const params = new URLSearchParams();
    params.set("autoplay", "1");
    params.set("from", "home");
    if (selectedModeId && selectedModeId !== "default") {
      params.set("mode", selectedModeId);
    }
    if (selectedGame.slug === "pong" && selectedModeId === "vsAi") {
      params.set("difficulty", "normal");
    }
    router.push(`/games/${selectedGame.slug}?${params.toString()}`);
    setOpen(false);
  };

  const handleGoToMissions = () => {
    setOpen(false);
    setOpenMissions(true);
  };

  return (
    <>
      <Link
        href="/shop"
        className="fixed right-3 top-14 z-30 rounded-full border border-amber-400/60 bg-zinc-900 px-3 py-2 text-xs font-semibold text-amber-300 shadow-xl transition hover:bg-zinc-800 active:scale-[0.98] sm:right-5 sm:top-16 sm:px-4 sm:text-sm"
      >
        🛒 Tienda
      </Link>

      <button
        type="button"
        onClick={() => setOpenSidebar((v) => !v)}
        aria-label="Abrir selector de juego"
        className="fixed left-3 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-zinc-600 bg-zinc-900/90 px-2 py-3 text-zinc-200 shadow-xl transition hover:bg-zinc-800 active:scale-[0.98] sm:block"
      >
        ▸
      </button>

      <button
        type="button"
        onClick={() => setOpenSidebar((v) => !v)}
        aria-label="Abrir accesos"
        className="fixed bottom-6 left-3 z-30 rounded-full border border-zinc-600 bg-zinc-900/90 px-3 py-2 text-xs text-zinc-200 shadow-xl transition hover:bg-zinc-800 active:scale-[0.98] sm:hidden"
      >
        ☰
      </button>

      {openSidebar && (
        <aside className="fixed bottom-24 left-3 right-3 z-30 rounded-2xl border border-zinc-700 bg-zinc-900/95 p-3 shadow-2xl sm:left-0 sm:right-auto sm:top-1/2 sm:w-52 sm:-translate-y-1/2 sm:rounded-r-2xl sm:rounded-l-none">
          <div className="mb-2 flex items-center justify-between gap-2 px-1">
            <p className="text-xs uppercase tracking-wide text-zinc-400">Accesos</p>
            <button
              type="button"
              onClick={() => setOpenSidebar(false)}
              aria-label="Cerrar accesos"
              className="rounded-md border border-zinc-600 px-2 py-0.5 text-sm text-zinc-300 transition hover:bg-zinc-800"
            >
              ◀
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setOpenNotes(true)}
              className="rounded-lg border border-zinc-700 bg-zinc-800/70 px-3 py-2 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800"
            >
              📝 Notas
            </button>
            <button
              type="button"
              onClick={() => setOpenGuide(true)}
              className="rounded-lg border border-zinc-700 bg-zinc-800/70 px-3 py-2 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800"
            >
              📘 Guia
            </button>
            <Link
              href="/settings"
              className="rounded-lg border border-zinc-700 bg-zinc-800/70 px-3 py-2 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800"
            >
              ⚙️ Ajustes
            </Link>
          </div>
        </aside>
      )}

      {openNotes && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/70 p-3 sm:items-center sm:p-4">
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-700 bg-black p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-200">
                Aca podes anotar lo que quieras
              </h2>
              <button
                type="button"
                onClick={() => setOpenNotes(false)}
                className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-900"
              >
                Cerrar
              </button>
            </div>
            <textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Escribi tus notas..."
              className="min-h-[320px] w-full resize-y rounded-xl border border-zinc-800 bg-black p-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-zinc-600"
            />
          </div>
        </div>
      )}

      {openGuide && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/70 p-3 sm:items-center sm:p-4">
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-700 bg-zinc-900 p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-zinc-100">Guia de MAD GAMES</h2>
              <button
                type="button"
                onClick={() => setOpenGuide(false)}
                className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
              >
                Cerrar
              </button>
            </div>

            <p className="mb-3 text-xs text-zinc-400">
              Toca cada linea para ver mas informacion.
            </p>

            <ul className="space-y-2 text-sm text-zinc-200">
              <li>
                <button
                  type="button"
                  onClick={() => setExpandedGuideItem((v) => (v === "games" ? null : "games"))}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/70 px-3 py-2 text-left hover:bg-zinc-800"
                >
                  🎮 <strong>Juegos</strong>
                </button>
                {expandedGuideItem === "games" && (
                  <div className="mt-1 rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 py-2 text-xs text-zinc-300">
                    Tenes 12 juegos principales (Snake, Pong, Breakout, Dodge, Reactor, Orbit, Pulse Dash, Memory Glitch, Core Defense, Shift, Overload y Polar).<br />
                    Desde el boton Jugar podes elegir juego y modo, y el juego arranca directo.
                  </div>
                )}
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => setExpandedGuideItem((v) => (v === "coins" ? null : "coins"))}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/70 px-3 py-2 text-left hover:bg-zinc-800"
                >
                  🪙 <strong>MAD Coins</strong>
                </button>
                {expandedGuideItem === "coins" && (
                  <div className="mt-1 rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 py-2 text-xs text-zinc-300">
                    Se ganan jugando partidas y completando objetivos (nunca con dinero real).<br />
                    Se usan para comprar personalizacion en la tienda: temas, cursores, sonidos y efectos.
                  </div>
                )}
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => setExpandedGuideItem((v) => (v === "shop" ? null : "shop"))}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/70 px-3 py-2 text-left hover:bg-zinc-800"
                >
                  🛒 <strong>Tienda</strong>
                </button>
                {expandedGuideItem === "shop" && (
                  <div className="mt-1 rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 py-2 text-xs text-zinc-300">
                    Todo lo de tienda es cosmetico: no cambia dificultad ni mecánicas.<br />
                    Podes equipar items cuando quieras y combinarlos con tu perfil.
                  </div>
                )}
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => setExpandedGuideItem((v) => (v === "progress" ? null : "progress"))}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/70 px-3 py-2 text-left hover:bg-zinc-800"
                >
                  🏆 <strong>Progreso y logros</strong>
                </button>
                {expandedGuideItem === "progress" && (
                  <div className="mt-1 rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 py-2 text-xs text-zinc-300">
                    Ganas XP por jugar y batir récords. Al subir de nivel desbloqueas contenido visual.<br />
                    Los logros se registran automaticamente según tus estadisticas.
                  </div>
                )}
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => setExpandedGuideItem((v) => (v === "missions" ? null : "missions"))}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/70 px-3 py-2 text-left hover:bg-zinc-800"
                >
                  📅 <strong>Misiones</strong>
                </button>
                {expandedGuideItem === "missions" && (
                  <div className="mt-1 rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 py-2 text-xs text-zinc-300">
                    El sistema diario elige una mision del dia y muestra tu progreso actual.<br />
                    Al completarla recibis bonus de XP y MAD Coins.
                  </div>
                )}
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => setExpandedGuideItem((v) => (v === "settings" ? null : "settings"))}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/70 px-3 py-2 text-left hover:bg-zinc-800"
                >
                  ⚙️ <strong>Ajustes</strong>
                </button>
                {expandedGuideItem === "settings" && (
                  <div className="mt-1 rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 py-2 text-xs text-zinc-300">
                    Desde Ajustes podes configurar sonido master, rendimiento y datos locales.<br />
                    Tambien podes borrar todo el progreso desde el panel de confirmacion.
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}

      <div className="fixed bottom-5 right-3 z-40 flex items-center gap-2 sm:right-5 sm:gap-3">
        <button
          type="button"
          onClick={handleGoToMissions}
          className="rounded-full border border-amber-400/60 bg-zinc-900 px-3 py-2 text-xs font-semibold text-amber-300 shadow-xl transition hover:bg-zinc-800 active:scale-[0.98] sm:px-5 sm:py-3 sm:text-sm"
        >
          Misiones
        </button>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-2xl transition hover:bg-red-500 active:scale-[0.98] sm:px-7 sm:py-4 sm:text-base"
        >
          Jugar
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/60 p-3 sm:justify-end sm:p-6">
          <div className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-2xl border border-zinc-700 bg-zinc-900 p-4 text-left shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                {selectedGame ? "Elegi modo" : "Elegi juego"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setSelectedGameSlug(null);
                  setSelectedModeId(null);
                }}
                className="rounded-md border border-zinc-600 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
              >
                Cerrar
              </button>
            </div>

            {!selectedGame ? (
              <ul className="max-h-[55vh] space-y-2 overflow-y-auto pr-1">
                {games.map((game) => (
                  <li key={game.slug}>
                    <button
                      type="button"
                      onClick={() => handleSelectGame(game.slug)}
                      className="flex w-full items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-800/70 px-3 py-2 text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800"
                    >
                      <span className="text-xl" aria-hidden>{game.icon ?? "🎮"}</span>
                      <span className="font-medium">{game.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div>
                <p className="mb-2 text-sm text-zinc-400">
                  {selectedGame.icon} {selectedGame.name}
                </p>
                <ul className="space-y-2">
                  {modeOptions.map((mode) => (
                    <li key={mode.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedModeId(mode.id)}
                        className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                          selectedModeId === mode.id
                            ? "border-amber-500 bg-amber-500/10 text-amber-300"
                            : "border-zinc-700 bg-zinc-800/70 text-zinc-300 hover:border-zinc-500"
                        }`}
                      >
                        {mode.label}
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGameSlug(null);
                      setSelectedModeId(null);
                    }}
                    className="rounded-lg border border-zinc-600 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                  >
                    Volver
                  </button>
                  <button
                    type="button"
                    onClick={handlePlay}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
                  >
                    Jugar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {openMissions && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/60 p-3 sm:justify-end sm:p-6">
          <div className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-2xl border border-zinc-700 bg-zinc-900 p-4 text-left shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Misiones</h2>
              <button
                type="button"
                onClick={() => setOpenMissions(false)}
                className="rounded-md border border-zinc-600 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
              >
                Cerrar
              </button>
            </div>

            <div className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3">
              <p className="text-sm font-semibold text-amber-300">Mision de hoy</p>
              <p className="mt-1 text-sm text-zinc-200">
                {todayMission.icon} {todayMission.title}
              </p>
              <p className="mt-1 text-xs text-zinc-400">{todayMission.description}</p>
              <p className="mt-2 text-xs text-zinc-300">
                Progreso: {todayProgress.current}/{todayProgress.target}
              </p>
              <p className="mt-1 text-xs text-amber-300">
                Recompensa: +{DAILY_CHALLENGE_XP} XP · +{DAILY_CHALLENGE_COINS} MAD Coins
              </p>
            </div>

            <p className="mb-2 text-xs uppercase tracking-wide text-zinc-400">Lista de misiones</p>
            <ul className="max-h-[45vh] space-y-2 overflow-y-auto pr-1">
              {DAILY_CHALLENGES.map((mission) => (
                <li
                  key={mission.id}
                  className="rounded-lg border border-zinc-700 bg-zinc-800/70 px-3 py-2"
                >
                  <p className="text-sm font-medium text-zinc-200">
                    {mission.icon} {mission.title}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-400">{mission.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}


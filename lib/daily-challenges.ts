/**
 * Retos diarios globales. 100% local, mismo reto para todos por fecha.
 */

export type DailyGoalType =
  | "reactor_pulses"   // Sobreviví N pulsos en Reactor (una partida)
  | "play_3_games"     // Jugá 3 partidas (hoy)
  | "beat_any_record"; // Superá tu récord en cualquier juego (hoy)

export interface DailyChallengeDef {
  id: string;
  goalType: DailyGoalType;
  /** Juego asociado (opcional; para reactor_pulses es "reactor") */
  gameSlug: string | null;
  title: string;
  description: string;
  /** Meta numérica (pulsos, cantidad de partidas, etc.) */
  target: number;
  icon: string;
}

export const DAILY_CHALLENGES: DailyChallengeDef[] = [
  {
    id: "reactor_30",
    goalType: "reactor_pulses",
    gameSlug: "reactor",
    title: "30 pulsos en Reactor",
    description: "Sobreviví 30 pulsos en una partida de Reactor Break.",
    target: 30,
    icon: "⚡",
  },
  {
    id: "reactor_50",
    goalType: "reactor_pulses",
    gameSlug: "reactor",
    title: "50 pulsos en Reactor",
    description: "Sobreviví 50 pulsos en una partida de Reactor Break.",
    target: 50,
    icon: "⚡",
  },
  {
    id: "play_3",
    goalType: "play_3_games",
    gameSlug: null,
    title: "3 partidas hoy",
    description: "Jugá 3 partidas (cualquier juego) hoy.",
    target: 3,
    icon: "🎯",
  },
  {
    id: "play_5",
    goalType: "play_3_games",
    gameSlug: null,
    title: "5 partidas hoy",
    description: "Jugá 5 partidas (cualquier juego) hoy.",
    target: 5,
    icon: "🎯",
  },
  {
    id: "beat_record",
    goalType: "beat_any_record",
    gameSlug: null,
    title: "Superá un récord",
    description: "Superá tu récord personal en cualquier juego hoy.",
    target: 1,
    icon: "🏆",
  },
];

/** Fecha en formato YYYY-MM-DD (timezone local) */
export function getTodayDateKey(): string {
  if (typeof window === "undefined") {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Hash simple de string a número (determinista) */
function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** Reto del día: mismo para todos según la fecha (local). */
export function getDailyChallenge(dateKey: string): DailyChallengeDef {
  const index = hashString(dateKey) % DAILY_CHALLENGES.length;
  return DAILY_CHALLENGES[index];
}

/** Recompensa por completar el reto diario */
export const DAILY_CHALLENGE_XP = 30;
export const DAILY_CHALLENGE_COINS = 5;

/** Estado diario mínimo para evaluar progreso (evita dependencia circular con store) */
export interface DailyStateForProgress {
  completedDailyDates: string[];
  dailyGamesPlayedCount: number;
  dailyGamesPlayedDate: string;
  dailyBeatRecordDate: string | null;
}

/** Progreso actual hacia el reto del día (para UI) */
export function getDailyProgress(
  daily: DailyStateForProgress,
  dateKey: string,
  challenge: DailyChallengeDef,
  stats: {
    reactorBestPulses?: number;
  }
): { current: number; target: number; completed: boolean } {
  const target = challenge.target;
  if (challenge.goalType === "reactor_pulses") {
    const current = stats.reactorBestPulses ?? 0;
    return { current, target, completed: current >= target };
  }
  if (challenge.goalType === "play_3_games") {
    const count = daily.dailyGamesPlayedDate === dateKey ? daily.dailyGamesPlayedCount : 0;
    return { current: count, target, completed: count >= target };
  }
  if (challenge.goalType === "beat_any_record") {
    const completed = daily.dailyBeatRecordDate === dateKey;
    return { current: completed ? 1 : 0, target: 1, completed };
  }
  return { current: 0, target, completed: false };
}

/** Estado diario para aplicar después de una partida (evita dependencia circular) */
export interface DailyChallengeStateUpdate {
  completedDailyDates: string[];
  dailyGamesPlayedCount: number;
  dailyGamesPlayedDate: string;
  dailyBeatRecordDate: string | null;
}

/** Evento de partida para actualizar progreso diario */
export interface DailyProgressEvent {
  gameSlug: string;
  pulsesSurvived?: number;
  isNewRecord?: boolean;
}

/**
 * Actualiza el estado diario tras una partida y devuelve si se completó el reto (y recompensa).
 * Llamar desde el store en cada update*Stats.
 */
export function applyDailyProgress(
  daily: DailyChallengeStateUpdate,
  dateKey: string,
  event: DailyProgressEvent
): { dailyChallenge: DailyChallengeStateUpdate; xpReward: number; coinsReward: number } {
  const challenge = getDailyChallenge(dateKey);
  const nextDaily: DailyChallengeStateUpdate = { ...daily };

  if (nextDaily.dailyGamesPlayedDate !== dateKey) {
    nextDaily.dailyGamesPlayedCount = 0;
    nextDaily.dailyGamesPlayedDate = dateKey;
  }
  nextDaily.dailyGamesPlayedCount += 1;
  if (event.isNewRecord) {
    nextDaily.dailyBeatRecordDate = nextDaily.dailyBeatRecordDate ?? dateKey;
  }

  const alreadyCompleted = nextDaily.completedDailyDates.includes(dateKey);
  let xpReward = 0;
  let coinsReward = 0;

  if (!alreadyCompleted) {
    const completed =
      (challenge.goalType === "reactor_pulses" &&
        event.gameSlug === "reactor" &&
        (event.pulsesSurvived ?? 0) >= challenge.target) ||
      (challenge.goalType === "play_3_games" && nextDaily.dailyGamesPlayedCount >= challenge.target) ||
      (challenge.goalType === "beat_any_record" && nextDaily.dailyBeatRecordDate === dateKey);
    if (completed) {
      nextDaily.completedDailyDates = [...nextDaily.completedDailyDates, dateKey];
      xpReward = DAILY_CHALLENGE_XP;
      coinsReward = DAILY_CHALLENGE_COINS;
    }
  }

  return { dailyChallenge: nextDaily, xpReward, coinsReward };
}

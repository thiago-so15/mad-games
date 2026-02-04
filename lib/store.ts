"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserProfile, GameScore, GameSettings, SnakeStats, PongStats, BreakoutStats, DodgeStats, ReactorStats, Progression } from "./types";

const STORAGE_KEY = "mad-games-store";

const defaultSettings: GameSettings = {
  soundEnabled: true,
  theme: "dark",
  controlScheme: "keyboard",
  snakeSpeedMultiplier: 1,
  pongSpeedMultiplier: 1,
  breakoutSpeedMultiplier: 1,
  dodgeSpeedMultiplier: 1,
  reactorSpeedMultiplier: 1,
};

const defaultSnakeStats: SnakeStats = {
  bestScoreByMode: {},
  gamesPlayed: 0,
  totalTimeMs: 0,
};

const defaultPongStats: PongStats = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  currentStreak: 0,
  bestStreak: 0,
  bestSurvivalTimeMs: 0,
  totalTimeMs: 0,
};

const defaultBreakoutStats: BreakoutStats = {
  bestScoreByMode: {},
  maxLevelReached: 0,
  gamesPlayed: 0,
  totalTimeMs: 0,
};

const defaultDodgeStats: DodgeStats = {
  bestSurvivalTimeMs: 0,
  gamesPlayed: 0,
  totalTimeMs: 0,
};

const defaultReactorStats: ReactorStats = {
  bestPulsesSurvived: 0,
  bestCombo: 0,
  gamesPlayed: 0,
  totalTimeMs: 0,
};

const defaultProgression: Progression = {
  totalXp: 0,
};

/** XP por partida jugada; bonus por récord/challenge */
export const XP_PER_GAME = 10;
export const XP_NEW_RECORD = 50;
export const XP_CHALLENGE = 30;

function xpToLevel(xp: number): number {
  if (xp <= 0) return 1;
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

function xpForNextLevel(level: number): number {
  return level * level * 100;
}

export function getXpToNextLevel(totalXp: number): { level: number; xpInLevel: number; xpNeeded: number } {
  const level = xpToLevel(totalXp);
  const xpAtLevelStart = (level - 1) * (level - 1) * 100;
  const xpNeeded = level * level * 100 - xpAtLevelStart;
  const xpInLevel = totalXp - xpAtLevelStart;
  return { level, xpInLevel, xpNeeded };
}

type StoreState = {
  profile: UserProfile;
  scores: GameScore[];
  settings: GameSettings;
  snakeStats: SnakeStats;
  pongStats: PongStats;
  breakoutStats: BreakoutStats;
  dodgeStats: DodgeStats;
  reactorStats: ReactorStats;
  progression: Progression;
  setProfile: (partial: Partial<UserProfile>) => void;
  setSettings: (partial: Partial<GameSettings>) => void;
  addScore: (score: Omit<GameScore, "playedAt">) => void;
  addXp: (amount: number) => void;
  getScoresByGame: (gameSlug: string) => GameScore[];
  getGlobalStats: () => { totalGames: number; totalTimeMs: number };
  updateSnakeStats: (params: { mode: "classic" | "timeAttack" | "hardcore"; score: number; timePlayedMs: number }) => void;
  updatePongStats: (params: { won?: boolean; survivalTimeMs?: number; timePlayedMs?: number }) => void;
  updateBreakoutStats: (params: { mode: "campaign" | "endless" | "challenge"; score: number; levelReached: number; timePlayedMs: number; levelCompleteOnly?: boolean }) => void;
  updateDodgeStats: (params: { survivalTimeMs: number; timePlayedMs: number }) => void;
  updateReactorStats: (params: { pulsesSurvived: number; bestCombo: number; timePlayedMs: number }) => void;
};

const defaultProfile: UserProfile = {
  nickname: "Jugador",
  avatar: "🎮",
  updatedAt: 0,
};

function getDefaultState() {
  return {
    profile: defaultProfile,
    scores: [] as GameScore[],
    settings: defaultSettings,
    snakeStats: defaultSnakeStats,
    pongStats: defaultPongStats,
    breakoutStats: defaultBreakoutStats,
    dodgeStats: defaultDodgeStats,
    reactorStats: defaultReactorStats,
    progression: defaultProgression,
  };
}

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

function getStorage() {
  if (typeof window === "undefined") return noopStorage;
  return localStorage;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...getDefaultState(),
      setProfile: (partial) =>
        set((state) => ({
          profile: {
            ...state.profile,
            ...partial,
            updatedAt: Date.now(),
          },
        })),
      setSettings: (partial) =>
        set((state) => ({
          settings: { ...state.settings, ...partial },
        })),
      updateSnakeStats: ({ mode, score, timePlayedMs }) =>
        set((state) => {
          const prev = state.snakeStats.bestScoreByMode[mode] ?? 0;
          const isNewRecord = score > prev;
          return {
            snakeStats: {
              ...state.snakeStats,
              bestScoreByMode: {
                ...state.snakeStats.bestScoreByMode,
                [mode]: Math.max(prev, score),
              },
              gamesPlayed: state.snakeStats.gamesPlayed + 1,
              totalTimeMs: state.snakeStats.totalTimeMs + timePlayedMs,
            },
            progression: {
              totalXp: state.progression.totalXp + XP_PER_GAME + (isNewRecord ? XP_NEW_RECORD : 0),
            },
          };
        }),
      updatePongStats: ({ won, survivalTimeMs, timePlayedMs }) =>
        set((state) => {
          const prev = state.pongStats;
          const bestSurvivalTimeMs = Math.max(prev.bestSurvivalTimeMs, survivalTimeMs ?? 0);
          const addedTime = timePlayedMs ?? 0;
          const xp = state.progression.totalXp + XP_PER_GAME;
          if (won === undefined) {
            return {
              pongStats: {
                ...prev,
                gamesPlayed: prev.gamesPlayed + 1,
                bestSurvivalTimeMs,
                totalTimeMs: (prev.totalTimeMs ?? 0) + addedTime,
              },
              progression: { totalXp: xp },
            };
          }
          const newStreak = won ? prev.currentStreak + 1 : 0;
          const isNewRecord = newStreak > 0 && newStreak >= prev.bestStreak;
          return {
            pongStats: {
              gamesPlayed: prev.gamesPlayed + 1,
              wins: prev.wins + (won ? 1 : 0),
              losses: prev.losses + (won ? 0 : 1),
              currentStreak: newStreak,
              bestStreak: Math.max(prev.bestStreak, newStreak),
              bestSurvivalTimeMs,
              totalTimeMs: (prev.totalTimeMs ?? 0) + addedTime,
            },
            progression: { totalXp: xp + (isNewRecord && won ? XP_NEW_RECORD : 0) },
          };
        }),
      updateBreakoutStats: ({ mode, score, levelReached, timePlayedMs, levelCompleteOnly }) =>
        set((state) => {
          const prev = state.breakoutStats;
          const bestScore = Math.max(prev.bestScoreByMode[mode] ?? 0, score);
          const maxLevel = Math.max(prev.maxLevelReached, levelReached);
          const isNewRecord = score > (prev.bestScoreByMode[mode] ?? 0);
          const xp = state.progression.totalXp + (levelCompleteOnly ? XP_CHALLENGE : XP_PER_GAME) + (isNewRecord ? XP_NEW_RECORD : 0);
          if (levelCompleteOnly) {
            return {
              breakoutStats: {
                ...prev,
                bestScoreByMode: { ...prev.bestScoreByMode, [mode]: bestScore },
                maxLevelReached: maxLevel,
              },
              progression: { totalXp: xp },
            };
          }
          return {
            breakoutStats: {
              ...prev,
              bestScoreByMode: { ...prev.bestScoreByMode, [mode]: bestScore },
              maxLevelReached: maxLevel,
              gamesPlayed: prev.gamesPlayed + 1,
              totalTimeMs: prev.totalTimeMs + timePlayedMs,
            },
            progression: { totalXp: xp },
          };
        }),
      updateDodgeStats: ({ survivalTimeMs, timePlayedMs }) =>
        set((state) => {
          const prev = state.dodgeStats;
          const isNewRecord = survivalTimeMs > (prev.bestSurvivalTimeMs ?? 0);
          return {
            dodgeStats: {
              ...prev,
              bestSurvivalTimeMs: Math.max(prev.bestSurvivalTimeMs ?? 0, survivalTimeMs),
              gamesPlayed: prev.gamesPlayed + 1,
              totalTimeMs: (prev.totalTimeMs ?? 0) + timePlayedMs,
            },
            progression: {
              totalXp: state.progression.totalXp + XP_PER_GAME + (isNewRecord ? XP_NEW_RECORD : 0),
            },
          };
        }),
      updateReactorStats: ({ pulsesSurvived, bestCombo, timePlayedMs }) =>
        set((state) => {
          const prev = state.reactorStats;
          const isNewRecord = pulsesSurvived > (prev.bestPulsesSurvived ?? 0);
          return {
            reactorStats: {
              ...prev,
              bestPulsesSurvived: Math.max(prev.bestPulsesSurvived ?? 0, pulsesSurvived),
              bestCombo: Math.max(prev.bestCombo ?? 0, bestCombo),
              gamesPlayed: prev.gamesPlayed + 1,
              totalTimeMs: (prev.totalTimeMs ?? 0) + timePlayedMs,
            },
            progression: {
              totalXp: state.progression.totalXp + XP_PER_GAME + (isNewRecord ? XP_NEW_RECORD : 0),
            },
          };
        }),
      addScore: (entry) =>
        set((state) => ({
          scores: [
            ...state.scores,
            { ...entry, playedAt: Date.now() },
          ].sort((a, b) => b.playedAt - a.playedAt),
        })),
      addXp: (amount) =>
        set((state) => ({
          progression: { totalXp: state.progression.totalXp + amount },
        })),
      getScoresByGame: (gameSlug) =>
        get().scores
          .filter((s) => s.gameSlug === gameSlug)
          .sort((a, b) => b.score - a.score),
      getGlobalStats: () => {
        const s = get();
        const totalGames =
          s.snakeStats.gamesPlayed +
          s.pongStats.gamesPlayed +
          s.breakoutStats.gamesPlayed +
          (s.dodgeStats?.gamesPlayed ?? 0) +
          (s.reactorStats?.gamesPlayed ?? 0);
        const totalTimeMs =
          s.snakeStats.totalTimeMs +
          (s.pongStats.totalTimeMs ?? 0) +
          s.breakoutStats.totalTimeMs +
          (s.dodgeStats?.totalTimeMs ?? 0) +
          (s.reactorStats?.totalTimeMs ?? 0);
        return { totalGames, totalTimeMs };
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(getStorage),
      partialize: (state) => ({
        profile: state.profile,
        scores: state.scores,
        settings: state.settings,
        snakeStats: state.snakeStats,
        pongStats: state.pongStats,
        breakoutStats: state.breakoutStats,
        dodgeStats: state.dodgeStats,
        reactorStats: state.reactorStats,
        progression: state.progression,
      }),
      skipHydration: true,
    }
  )
);

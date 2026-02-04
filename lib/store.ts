"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserProfile, GameScore, GameSettings, SnakeStats, PongStats } from "./types";

const STORAGE_KEY = "mad-games-store";

const defaultSettings: GameSettings = {
  soundEnabled: true,
  snakeSpeedMultiplier: 1,
  pongSpeedMultiplier: 1,
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
};

type StoreState = {
  profile: UserProfile;
  scores: GameScore[];
  settings: GameSettings;
  snakeStats: SnakeStats;
  pongStats: PongStats;
  setProfile: (partial: Partial<UserProfile>) => void;
  setSettings: (partial: Partial<GameSettings>) => void;
  addScore: (score: Omit<GameScore, "playedAt">) => void;
  getScoresByGame: (gameSlug: string) => GameScore[];
  updateSnakeStats: (params: { mode: "classic" | "timeAttack" | "hardcore"; score: number; timePlayedMs: number }) => void;
  /** won: undefined = solo sumar partida; survivalTimeMs para modo Survival */
  updatePongStats: (params: { won?: boolean; survivalTimeMs?: number }) => void;
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
          };
        }),
      updatePongStats: ({ won, survivalTimeMs }) =>
        set((state) => {
          const prev = state.pongStats;
          const bestSurvivalTimeMs = Math.max(prev.bestSurvivalTimeMs, survivalTimeMs ?? 0);
          if (won === undefined) {
            return {
              pongStats: {
                ...prev,
                gamesPlayed: prev.gamesPlayed + 1,
                bestSurvivalTimeMs,
              },
            };
          }
          const newStreak = won ? prev.currentStreak + 1 : 0;
          return {
            pongStats: {
              gamesPlayed: prev.gamesPlayed + 1,
              wins: prev.wins + (won ? 1 : 0),
              losses: prev.losses + (won ? 0 : 1),
              currentStreak: newStreak,
              bestStreak: Math.max(prev.bestStreak, newStreak),
              bestSurvivalTimeMs,
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
      getScoresByGame: (gameSlug) =>
        get().scores
          .filter((s) => s.gameSlug === gameSlug)
          .sort((a, b) => b.score - a.score),
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
      }),
      skipHydration: true,
    }
  )
);

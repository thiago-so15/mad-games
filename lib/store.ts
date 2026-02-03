"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserProfile, GameScore, GameSettings, SnakeStats } from "./types";

const STORAGE_KEY = "mad-games-store";

const defaultSettings: GameSettings = {
  soundEnabled: true,
  snakeSpeedMultiplier: 1,
};

const defaultSnakeStats: SnakeStats = {
  bestScoreByMode: {},
  gamesPlayed: 0,
  totalTimeMs: 0,
};

type StoreState = {
  profile: UserProfile;
  scores: GameScore[];
  settings: GameSettings;
  snakeStats: SnakeStats;
  setProfile: (partial: Partial<UserProfile>) => void;
  setSettings: (partial: Partial<GameSettings>) => void;
  addScore: (score: Omit<GameScore, "playedAt">) => void;
  getScoresByGame: (gameSlug: string) => GameScore[];
  updateSnakeStats: (params: { mode: "classic" | "timeAttack" | "hardcore"; score: number; timePlayedMs: number }) => void;
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
      }),
      skipHydration: true,
    }
  )
);

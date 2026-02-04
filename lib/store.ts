"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserProfile, GameScore, GameSettings, SnakeStats, PongStats, BreakoutStats, DodgeStats, ReactorStats, Progression, Wallet, Inventory, EquipSlot } from "./types";
import { getUnlockedAchievementIds } from "./achievements";
import { platform } from "./platform-events";
import { getShopItemById, getEquipSlotForItemType } from "./shop";

const STORAGE_KEY = "mad-games-store";

const defaultSettings: GameSettings = {
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

const defaultWallet: Wallet = {
  madCoins: 0,
};

const defaultInventory: Inventory = {
  purchasedItemIds: [],
  equipped: {
    avatar: null,
    border: null,
    title: null,
    badge: null,
    theme: null,
  },
};

/** XP por partida jugada; bonus por récord/challenge */
export const XP_PER_GAME = 10;
export const XP_NEW_RECORD = 50;
export const XP_CHALLENGE = 30;

/** MAD Coins: por partida, récord, subida de nivel. No se compran con dinero real. */
export const COINS_PER_GAME = 2;
export const COINS_NEW_RECORD = 10;
export const COINS_LEVEL_UP = 25;

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

function mergeAchievementIds(
  state: ReturnType<typeof getDefaultState>,
  updates: Partial<ReturnType<typeof getDefaultState>>
): string[] {
  const next = { ...state, ...updates };
  const newIds = getUnlockedAchievementIds(next);
  const current = state.unlockedAchievementIds ?? [];
  return Array.from(new Set([...current, ...newIds]));
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
  unlockedAchievementIds: string[];
  wallet: Wallet;
  inventory: Inventory;
  setProfile: (partial: Partial<UserProfile>) => void;
  setSettings: (partial: Partial<GameSettings>) => void;
  setLastPlayedGame: (gameSlug: string) => void;
  toggleFavorite: (gameSlug: string) => void;
  addScore: (score: Omit<GameScore, "playedAt">) => void;
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  purchaseItem: (itemId: string) => boolean;
  equipItem: (itemId: string) => void;
  unequipSlot: (slot: EquipSlot) => void;
  getScoresByGame: (gameSlug: string) => GameScore[];
  getGlobalStats: () => { totalGames: number; totalTimeMs: number };
  updateSnakeStats: (params: { mode: "classic" | "timeAttack" | "hardcore"; score: number; timePlayedMs: number }) => void;
  updatePongStats: (params: { won?: boolean; survivalTimeMs?: number; timePlayedMs?: number }) => void;
  updateBreakoutStats: (params: { mode: "campaign" | "endless" | "challenge"; score: number; levelReached: number; timePlayedMs: number; levelCompleteOnly?: boolean }) => void;
  updateDodgeStats: (params: { survivalTimeMs: number; timePlayedMs: number }) => void;
  updateReactorStats: (params: { pulsesSurvived: number; bestCombo: number; timePlayedMs: number }) => void;
  mergeAchievements: () => void;
};

const defaultProfile: UserProfile = {
  nickname: "Jugador",
  avatar: "🎮",
  updatedAt: 0,
  favoriteGameSlugs: [],
  lastPlayedGameSlug: null,
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
    unlockedAchievementIds: [] as string[],
    wallet: defaultWallet,
    inventory: defaultInventory,
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
      setLastPlayedGame: (gameSlug) =>
        set((state) => ({
          profile: {
            ...state.profile,
            lastPlayedGameSlug: gameSlug,
            updatedAt: Date.now(),
          },
        })),
      toggleFavorite: (gameSlug) =>
        set((state) => {
          const favs = state.profile.favoriteGameSlugs ?? [];
          const next = favs.includes(gameSlug)
            ? favs.filter((s) => s !== gameSlug)
            : [...favs, gameSlug];
          return {
            profile: {
              ...state.profile,
              favoriteGameSlugs: next,
              updatedAt: Date.now(),
            },
          };
        }),
      mergeAchievements: () =>
        set((state) => {
          const next = getUnlockedAchievementIds(state);
          const current = state.unlockedAchievementIds ?? [];
          const merged = Array.from(new Set([...current, ...next]));
          if (merged.length === current.length) return state;
          return { unlockedAchievementIds: merged };
        }),
      updateSnakeStats: ({ mode, score, timePlayedMs }) => {
        let levelUpPayload: { level: number } | null = null;
        set((state) => {
          const prev = state.snakeStats.bestScoreByMode[mode] ?? 0;
          const isNewRecord = score > prev;
          const nextXp = state.progression.totalXp + XP_PER_GAME + (isNewRecord ? XP_NEW_RECORD : 0);
          const prevLevel = xpToLevel(state.progression.totalXp);
          const nextLevel = xpToLevel(nextXp);
          const coins = COINS_PER_GAME + (isNewRecord ? COINS_NEW_RECORD : 0) + (nextLevel > prevLevel ? COINS_LEVEL_UP : 0);
          if (nextLevel > prevLevel) levelUpPayload = { level: nextLevel };
          const snakeStats = {
            ...state.snakeStats,
            bestScoreByMode: {
              ...state.snakeStats.bestScoreByMode,
              [mode]: Math.max(prev, score),
            },
            gamesPlayed: state.snakeStats.gamesPlayed + 1,
            totalTimeMs: state.snakeStats.totalTimeMs + timePlayedMs,
          };
          const progression = { totalXp: nextXp };
          const wallet = { madCoins: (state.wallet?.madCoins ?? 0) + coins };
          return {
            ...state,
            snakeStats,
            progression,
            wallet,
            unlockedAchievementIds: mergeAchievementIds(state, { progression, snakeStats }),
          };
        });
        if (levelUpPayload) platform.emit("levelUp", levelUpPayload);
      },
      updatePongStats: ({ won, survivalTimeMs, timePlayedMs }) => {
        let levelUpPayload: { level: number } | null = null;
        set((state) => {
          const prev = state.pongStats;
          const bestSurvivalTimeMs = Math.max(prev.bestSurvivalTimeMs, survivalTimeMs ?? 0);
          const addedTime = timePlayedMs ?? 0;
          let nextXp: number;
          let pongStats: typeof state.pongStats;
          let coins: number;
          if (won === undefined) {
            nextXp = state.progression.totalXp + XP_PER_GAME;
            coins = COINS_PER_GAME;
            pongStats = {
              ...prev,
              gamesPlayed: prev.gamesPlayed + 1,
              bestSurvivalTimeMs,
              totalTimeMs: (prev.totalTimeMs ?? 0) + addedTime,
            };
          } else {
            const newStreak = won ? prev.currentStreak + 1 : 0;
            const isNewRecord = newStreak > 0 && newStreak >= prev.bestStreak;
            nextXp = state.progression.totalXp + XP_PER_GAME + (isNewRecord && won ? XP_NEW_RECORD : 0);
            coins = COINS_PER_GAME + (isNewRecord && won ? COINS_NEW_RECORD : 0);
            pongStats = {
              gamesPlayed: prev.gamesPlayed + 1,
              wins: prev.wins + (won ? 1 : 0),
              losses: prev.losses + (won ? 0 : 1),
              currentStreak: newStreak,
              bestStreak: Math.max(prev.bestStreak, newStreak),
              bestSurvivalTimeMs,
              totalTimeMs: (prev.totalTimeMs ?? 0) + addedTime,
            };
          }
          const prevLevel = xpToLevel(state.progression.totalXp);
          const nextLevel = xpToLevel(nextXp);
          coins += nextLevel > prevLevel ? COINS_LEVEL_UP : 0;
          if (nextLevel > prevLevel) levelUpPayload = { level: nextLevel };
          const progression = { totalXp: nextXp };
          const wallet = { madCoins: (state.wallet?.madCoins ?? 0) + coins };
          return {
            ...state,
            pongStats,
            progression,
            wallet,
            unlockedAchievementIds: mergeAchievementIds(state, { progression, pongStats }),
          };
        });
        if (levelUpPayload) platform.emit("levelUp", levelUpPayload);
      },
      updateBreakoutStats: ({ mode, score, levelReached, timePlayedMs, levelCompleteOnly }) => {
        let levelUpPayload: { level: number } | null = null;
        set((state) => {
          const prev = state.breakoutStats;
          const bestScore = Math.max(prev.bestScoreByMode[mode] ?? 0, score);
          const maxLevel = Math.max(prev.maxLevelReached, levelReached);
          const isNewRecord = score > (prev.bestScoreByMode[mode] ?? 0);
          const nextXp = state.progression.totalXp + (levelCompleteOnly ? XP_CHALLENGE : XP_PER_GAME) + (isNewRecord ? XP_NEW_RECORD : 0);
          const prevLevel = xpToLevel(state.progression.totalXp);
          const nextLevel = xpToLevel(nextXp);
          const coins = COINS_PER_GAME + (isNewRecord ? COINS_NEW_RECORD : 0) + (nextLevel > prevLevel ? COINS_LEVEL_UP : 0);
          if (nextLevel > prevLevel) levelUpPayload = { level: nextLevel };
          const breakoutStats = levelCompleteOnly
            ? { ...prev, bestScoreByMode: { ...prev.bestScoreByMode, [mode]: bestScore }, maxLevelReached: maxLevel }
            : { ...prev, bestScoreByMode: { ...prev.bestScoreByMode, [mode]: bestScore }, maxLevelReached: maxLevel, gamesPlayed: prev.gamesPlayed + 1, totalTimeMs: prev.totalTimeMs + timePlayedMs };
          const progression = { totalXp: nextXp };
          const wallet = { madCoins: (state.wallet?.madCoins ?? 0) + coins };
          return { ...state, breakoutStats, progression, wallet, unlockedAchievementIds: mergeAchievementIds(state, { progression, breakoutStats }) };
        });
        if (levelUpPayload) platform.emit("levelUp", levelUpPayload);
      },
      updateDodgeStats: ({ survivalTimeMs, timePlayedMs }) => {
        let levelUpPayload: { level: number } | null = null;
        set((state) => {
          const prev = state.dodgeStats;
          const isNewRecord = survivalTimeMs > (prev.bestSurvivalTimeMs ?? 0);
          const nextXp = state.progression.totalXp + XP_PER_GAME + (isNewRecord ? XP_NEW_RECORD : 0);
          const prevLevel = xpToLevel(state.progression.totalXp);
          const nextLevel = xpToLevel(nextXp);
          const coins = COINS_PER_GAME + (isNewRecord ? COINS_NEW_RECORD : 0) + (nextLevel > prevLevel ? COINS_LEVEL_UP : 0);
          if (nextLevel > prevLevel) levelUpPayload = { level: nextLevel };
          const dodgeStats = { ...prev, bestSurvivalTimeMs: Math.max(prev.bestSurvivalTimeMs ?? 0, survivalTimeMs), gamesPlayed: prev.gamesPlayed + 1, totalTimeMs: (prev.totalTimeMs ?? 0) + timePlayedMs };
          const progression = { totalXp: nextXp };
          const wallet = { madCoins: (state.wallet?.madCoins ?? 0) + coins };
          return { ...state, dodgeStats, progression, wallet, unlockedAchievementIds: mergeAchievementIds(state, { progression, dodgeStats }) };
        });
        if (levelUpPayload) platform.emit("levelUp", levelUpPayload);
      },
      updateReactorStats: ({ pulsesSurvived, bestCombo, timePlayedMs }) => {
        let levelUpPayload: { level: number } | null = null;
        set((state) => {
          const prev = state.reactorStats;
          const isNewRecord = pulsesSurvived > (prev.bestPulsesSurvived ?? 0);
          const nextXp = state.progression.totalXp + XP_PER_GAME + (isNewRecord ? XP_NEW_RECORD : 0);
          const prevLevel = xpToLevel(state.progression.totalXp);
          const nextLevel = xpToLevel(nextXp);
          const coins = COINS_PER_GAME + (isNewRecord ? COINS_NEW_RECORD : 0) + (nextLevel > prevLevel ? COINS_LEVEL_UP : 0);
          if (nextLevel > prevLevel) levelUpPayload = { level: nextLevel };
          const reactorStats = { ...prev, bestPulsesSurvived: Math.max(prev.bestPulsesSurvived ?? 0, pulsesSurvived), bestCombo: Math.max(prev.bestCombo ?? 0, bestCombo), gamesPlayed: prev.gamesPlayed + 1, totalTimeMs: (prev.totalTimeMs ?? 0) + timePlayedMs };
          const progression = { totalXp: nextXp };
          const wallet = { madCoins: (state.wallet?.madCoins ?? 0) + coins };
          return { ...state, reactorStats, progression, wallet, unlockedAchievementIds: mergeAchievementIds(state, { progression, reactorStats }) };
        });
        if (levelUpPayload) platform.emit("levelUp", levelUpPayload);
      },
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
      addCoins: (amount) =>
        set((state) => ({
          wallet: { madCoins: Math.max(0, (state.wallet?.madCoins ?? 0) + amount) },
        })),
      purchaseItem: (itemId) => {
        const item = getShopItemById(itemId);
        if (!item) return false;
        const state = get();
        if (state.inventory.purchasedItemIds.includes(itemId)) return false;
        if ((state.wallet?.madCoins ?? 0) < item.price) return false;
        set((s) => ({
          wallet: { madCoins: Math.max(0, (s.wallet?.madCoins ?? 0) - item.price) },
          inventory: {
            ...(s.inventory ?? defaultInventory),
            purchasedItemIds: [...(s.inventory?.purchasedItemIds ?? []), itemId],
          },
        }));
        platform.emit("itemPurchased", { itemId, price: item.price });
        return true;
      },
      equipItem: (itemId) => {
        const state = get();
        if (!(state.inventory?.purchasedItemIds ?? []).includes(itemId)) return;
        const item = getShopItemById(itemId);
        if (!item) return;
        const slot = getEquipSlotForItemType(item.type);
        if (!slot) return;
        set((s) => ({
          inventory: {
            ...(s.inventory ?? defaultInventory),
            equipped: { ...(s.inventory?.equipped ?? defaultInventory.equipped), [slot]: itemId },
          },
        }));
        platform.emit("itemEquipped", { itemId, slot });
      },
      unequipSlot: (slot) =>
        set((state) => ({
          inventory: {
            ...(state.inventory ?? defaultInventory),
            equipped: { ...(state.inventory?.equipped ?? defaultInventory.equipped), [slot]: null },
          },
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
        unlockedAchievementIds: state.unlockedAchievementIds,
        wallet: state.wallet ?? defaultWallet,
        inventory: state.inventory ?? defaultInventory,
      }),
      skipHydration: true,
    }
  )
);

// v4: la plataforma reacciona a eventos emitidos por los juegos
if (typeof window !== "undefined") {
  platform.on("gameStart", (p) => {
    useStore.getState().setLastPlayedGame(p.gameSlug);
  });
  platform.on("gameEnd", (p) => {
    useStore.getState().addScore({
      gameSlug: p.gameSlug,
      score: p.score ?? 0,
      extra: p.extra,
    });
  });
}

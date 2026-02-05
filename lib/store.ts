"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserProfile, GameScore, GameSettings, SnakeStats, PongStats, BreakoutStats, DodgeStats, ReactorStats, OrbitStats, PulseDashStats, MemoryGlitchStats, CoreDefenseStats, ShiftStats, OverloadStats, PolarStats, VoidStats, Progression, Wallet, Inventory, EquipSlot, DailyChallengeState } from "./types";
import { getUnlockedAchievementIds } from "./achievements";
import { platform } from "./platform-events";
import { getShopItemById, getEquipSlotForItemType } from "./shop";
import { getTodayDateKey, applyDailyProgress } from "./daily-challenges";

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
  orbitSpeedMultiplier: 1,
  pulseDashSpeedMultiplier: 1,
  memoryGlitchSpeedMultiplier: 1,
  coreDefenseSpeedMultiplier: 1,
  shiftSpeedMultiplier: 1,
  overloadSpeedMultiplier: 1,
  polarSpeedMultiplier: 1,
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

const defaultOrbitStats: OrbitStats = {
  bestScore: 0,
  gamesPlayed: 0,
  totalTimeMs: 0,
};

const defaultPulseDashStats: PulseDashStats = {
  bestDistance: 0,
  gamesPlayed: 0,
  totalTimeMs: 0,
};

const defaultMemoryGlitchStats: MemoryGlitchStats = {
  bestRounds: 0,
  gamesPlayed: 0,
  totalTimeMs: 0,
};

const defaultCoreDefenseStats: CoreDefenseStats = {
  bestStreak: 0,
  gamesPlayed: 0,
  totalTimeMs: 0,
};

const defaultShiftStats: ShiftStats = {
  bestSurvivalTimeMs: 0,
  gamesPlayed: 0,
  totalTimeMs: 0,
};

const defaultOverloadStats: OverloadStats = {
  bestScore: 0,
  bestCombo: 0,
  gamesPlayed: 0,
  totalTimeMs: 0,
};

const defaultPolarStats: PolarStats = {
  bestScore: 0,
  bestCombo: 0,
  gamesPlayed: 0,
  totalTimeMs: 0,
};

const defaultVoidStats: VoidStats = {
  bestSurvivalTimeMs: 0,
  gamesPlayed: 0,
  totalTimeMs: 0,
};

const defaultProgression: Progression = {
  totalXp: 4900,
};

const defaultWallet: Wallet = {
  madCoins: 10000,
};

const defaultDailyChallenge: DailyChallengeState = {
  completedDailyDates: [],
  dailyGamesPlayedCount: 0,
  dailyGamesPlayedDate: "",
  dailyBeatRecordDate: null,
};

const defaultInventory: Inventory = {
  purchasedItemIds: [],
  equipped: {
    avatar: null,
    border: null,
    title: null,
    badge: null,
    theme: null,
    cursor: null,
    soundPack: null,
    screenEffect: null,
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
  if (xp <= 0) return 0;
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
  orbitStats: OrbitStats;
  pulseDashStats: PulseDashStats;
  memoryGlitchStats: MemoryGlitchStats;
  coreDefenseStats: CoreDefenseStats;
  shiftStats: ShiftStats;
  overloadStats: OverloadStats;
  polarStats: PolarStats;
  voidStats: VoidStats;
  progression: Progression;
  dailyChallenge: DailyChallengeState;
  unlockedAchievementIds: string[];
  wallet: Wallet;
  inventory: Inventory;
  hiddenGameUnlocked: boolean;
  sessionConsecutivePlays: { count: number; gameSlug: string | null };
  pendingUnlockReveal: boolean;
  pendingUnlockMessage: boolean;
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
  updateOrbitStats: (params: { score: number; timePlayedMs: number }) => void;
  updatePulseDashStats: (params: { distance: number; timePlayedMs: number }) => void;
  updateMemoryGlitchStats: (params: { rounds: number; timePlayedMs: number }) => void;
  updateCoreDefenseStats: (params: { streak: number; timePlayedMs: number }) => void;
  updateShiftStats: (params: { survivalTimeMs: number; timePlayedMs: number }) => void;
  updateOverloadStats: (params: { score: number; bestCombo: number; timePlayedMs: number }) => void;
  updatePolarStats: (params: { score: number; bestCombo: number; timePlayedMs: number }) => void;
  updateVoidStats: (params: { survivalTimeMs: number; timePlayedMs: number }) => void;
  recordGameEnd: (gameSlug: string) => void;
  resetSessionConsecutivePlays: () => void;
  clearUnlockMessage: () => void;
  setUnlockRevealDone: () => void;
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
    orbitStats: defaultOrbitStats,
    pulseDashStats: defaultPulseDashStats,
    memoryGlitchStats: defaultMemoryGlitchStats,
    coreDefenseStats: defaultCoreDefenseStats,
    shiftStats: defaultShiftStats,
    overloadStats: defaultOverloadStats,
    polarStats: defaultPolarStats,
    voidStats: defaultVoidStats,
    progression: defaultProgression,
    dailyChallenge: defaultDailyChallenge,
    unlockedAchievementIds: [] as string[],
    wallet: defaultWallet,
    inventory: defaultInventory,
    hiddenGameUnlocked: false,
    sessionConsecutivePlays: { count: 0, gameSlug: null as string | null },
    pendingUnlockReveal: false,
    pendingUnlockMessage: false,
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
          const dateKey = getTodayDateKey();
          const { dailyChallenge, xpReward, coinsReward } = applyDailyProgress(state.dailyChallenge ?? defaultDailyChallenge, dateKey, { gameSlug: "snake", isNewRecord });
          const progression = { totalXp: nextXp + xpReward };
          const wallet = { madCoins: (state.wallet?.madCoins ?? 0) + coins + coinsReward };
          return {
            ...state,
            snakeStats,
            progression,
            wallet,
            dailyChallenge,
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
          const dateKey = getTodayDateKey();
          const pongIsNewRecord = (won && pongStats.bestStreak > (prev.bestStreak ?? 0)) || (bestSurvivalTimeMs > (prev.bestSurvivalTimeMs ?? 0));
          const { dailyChallenge, xpReward, coinsReward } = applyDailyProgress(state.dailyChallenge ?? defaultDailyChallenge, dateKey, { gameSlug: "pong", isNewRecord: pongIsNewRecord });
          const progression = { totalXp: nextXp + xpReward };
          const wallet = { madCoins: (state.wallet?.madCoins ?? 0) + coins + coinsReward };
          return {
            ...state,
            pongStats,
            progression,
            wallet,
            dailyChallenge,
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
          const dateKey = getTodayDateKey();
          const { dailyChallenge, xpReward, coinsReward } = applyDailyProgress(state.dailyChallenge ?? defaultDailyChallenge, dateKey, { gameSlug: "breakout", isNewRecord });
          const progression = { totalXp: nextXp + xpReward };
          const wallet = { madCoins: (state.wallet?.madCoins ?? 0) + coins + coinsReward };
          return { ...state, breakoutStats, progression, wallet, dailyChallenge, unlockedAchievementIds: mergeAchievementIds(state, { progression, breakoutStats }) };
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
          const dateKey = getTodayDateKey();
          const { dailyChallenge, xpReward, coinsReward } = applyDailyProgress(state.dailyChallenge ?? defaultDailyChallenge, dateKey, { gameSlug: "dodge", isNewRecord });
          const progression = { totalXp: nextXp + xpReward };
          const wallet = { madCoins: (state.wallet?.madCoins ?? 0) + coins + coinsReward };
          return { ...state, dodgeStats, progression, wallet, dailyChallenge, unlockedAchievementIds: mergeAchievementIds(state, { progression, dodgeStats }) };
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
          const dateKey = getTodayDateKey();
          const { dailyChallenge, xpReward, coinsReward } = applyDailyProgress(state.dailyChallenge ?? defaultDailyChallenge, dateKey, { gameSlug: "reactor", pulsesSurvived, isNewRecord });
          return {
            ...state,
            reactorStats,
            progression: { totalXp: nextXp + xpReward },
            wallet: { madCoins: (state.wallet?.madCoins ?? 0) + coins + coinsReward },
            dailyChallenge,
            unlockedAchievementIds: mergeAchievementIds(state, { progression: { totalXp: nextXp + xpReward }, reactorStats }),
          };
        });
        if (levelUpPayload) platform.emit("levelUp", levelUpPayload);
      },
      updateOrbitStats: ({ score, timePlayedMs }) => {
        let levelUpPayload: { level: number } | null = null;
        set((state) => {
          const prev = state.orbitStats;
          const isNewRecord = score > (prev.bestScore ?? 0);
          const nextXp = state.progression.totalXp + XP_PER_GAME + (isNewRecord ? XP_NEW_RECORD : 0);
          const prevLevel = xpToLevel(state.progression.totalXp);
          const nextLevel = xpToLevel(nextXp);
          const coins = COINS_PER_GAME + (isNewRecord ? COINS_NEW_RECORD : 0) + (nextLevel > prevLevel ? COINS_LEVEL_UP : 0);
          if (nextLevel > prevLevel) levelUpPayload = { level: nextLevel };
          const orbitStats = { ...prev, bestScore: Math.max(prev.bestScore ?? 0, score), gamesPlayed: prev.gamesPlayed + 1, totalTimeMs: (prev.totalTimeMs ?? 0) + timePlayedMs };
          const dateKey = getTodayDateKey();
          const { dailyChallenge, xpReward, coinsReward } = applyDailyProgress(state.dailyChallenge ?? defaultDailyChallenge, dateKey, { gameSlug: "orbit", isNewRecord });
          const progression = { totalXp: nextXp + xpReward };
          const wallet = { madCoins: (state.wallet?.madCoins ?? 0) + coins + coinsReward };
          return { ...state, orbitStats, progression, wallet, dailyChallenge, unlockedAchievementIds: mergeAchievementIds(state, { progression, orbitStats }) };
        });
        if (levelUpPayload) platform.emit("levelUp", levelUpPayload);
      },
      updatePulseDashStats: ({ distance, timePlayedMs }) => {
        let levelUpPayload: { level: number } | null = null;
        set((state) => {
          const prev = state.pulseDashStats;
          const isNewRecord = distance > (prev.bestDistance ?? 0);
          const nextXp = state.progression.totalXp + XP_PER_GAME + (isNewRecord ? XP_NEW_RECORD : 0);
          const prevLevel = xpToLevel(state.progression.totalXp);
          const nextLevel = xpToLevel(nextXp);
          const coins = COINS_PER_GAME + (isNewRecord ? COINS_NEW_RECORD : 0) + (nextLevel > prevLevel ? COINS_LEVEL_UP : 0);
          if (nextLevel > prevLevel) levelUpPayload = { level: nextLevel };
          const pulseDashStats = { ...prev, bestDistance: Math.max(prev.bestDistance ?? 0, distance), gamesPlayed: prev.gamesPlayed + 1, totalTimeMs: (prev.totalTimeMs ?? 0) + timePlayedMs };
          const dateKey = getTodayDateKey();
          const { dailyChallenge, xpReward, coinsReward } = applyDailyProgress(state.dailyChallenge ?? defaultDailyChallenge, dateKey, { gameSlug: "pulse-dash", isNewRecord });
          const progression = { totalXp: nextXp + xpReward };
          const wallet = { madCoins: (state.wallet?.madCoins ?? 0) + coins + coinsReward };
          return { ...state, pulseDashStats, progression, wallet, dailyChallenge, unlockedAchievementIds: mergeAchievementIds(state, { progression, pulseDashStats }) };
        });
        if (levelUpPayload) platform.emit("levelUp", levelUpPayload);
      },
      updateMemoryGlitchStats: ({ rounds, timePlayedMs }) => {
        let levelUpPayload: { level: number } | null = null;
        set((state) => {
          const prev = state.memoryGlitchStats;
          const isNewRecord = rounds > (prev.bestRounds ?? 0);
          const nextXp = state.progression.totalXp + XP_PER_GAME + (isNewRecord ? XP_NEW_RECORD : 0);
          const prevLevel = xpToLevel(state.progression.totalXp);
          const nextLevel = xpToLevel(nextXp);
          const coins = COINS_PER_GAME + (isNewRecord ? COINS_NEW_RECORD : 0) + (nextLevel > prevLevel ? COINS_LEVEL_UP : 0);
          if (nextLevel > prevLevel) levelUpPayload = { level: nextLevel };
          const memoryGlitchStats = { ...prev, bestRounds: Math.max(prev.bestRounds ?? 0, rounds), gamesPlayed: prev.gamesPlayed + 1, totalTimeMs: (prev.totalTimeMs ?? 0) + timePlayedMs };
          const dateKey = getTodayDateKey();
          const { dailyChallenge, xpReward, coinsReward } = applyDailyProgress(state.dailyChallenge ?? defaultDailyChallenge, dateKey, { gameSlug: "memory-glitch", isNewRecord });
          const progression = { totalXp: nextXp + xpReward };
          const wallet = { madCoins: (state.wallet?.madCoins ?? 0) + coins + coinsReward };
          return { ...state, memoryGlitchStats, progression, wallet, dailyChallenge, unlockedAchievementIds: mergeAchievementIds(state, { progression, memoryGlitchStats }) };
        });
        if (levelUpPayload) platform.emit("levelUp", levelUpPayload);
      },
      updateCoreDefenseStats: ({ streak, timePlayedMs }) => {
        let levelUpPayload: { level: number } | null = null;
        set((state) => {
          const prev = state.coreDefenseStats;
          const isNewRecord = streak > (prev.bestStreak ?? 0);
          const nextXp = state.progression.totalXp + XP_PER_GAME + (isNewRecord ? XP_NEW_RECORD : 0);
          const prevLevel = xpToLevel(state.progression.totalXp);
          const nextLevel = xpToLevel(nextXp);
          const coins = COINS_PER_GAME + (isNewRecord ? COINS_NEW_RECORD : 0) + (nextLevel > prevLevel ? COINS_LEVEL_UP : 0);
          if (nextLevel > prevLevel) levelUpPayload = { level: nextLevel };
          const coreDefenseStats = { ...prev, bestStreak: Math.max(prev.bestStreak ?? 0, streak), gamesPlayed: prev.gamesPlayed + 1, totalTimeMs: (prev.totalTimeMs ?? 0) + timePlayedMs };
          const dateKey = getTodayDateKey();
          const { dailyChallenge, xpReward, coinsReward } = applyDailyProgress(state.dailyChallenge ?? defaultDailyChallenge, dateKey, { gameSlug: "core-defense", isNewRecord });
          const progression = { totalXp: nextXp + xpReward };
          const wallet = { madCoins: (state.wallet?.madCoins ?? 0) + coins + coinsReward };
          return { ...state, coreDefenseStats, progression, wallet, dailyChallenge, unlockedAchievementIds: mergeAchievementIds(state, { progression, coreDefenseStats }) };
        });
        if (levelUpPayload) platform.emit("levelUp", levelUpPayload);
      },
      updateShiftStats: ({ survivalTimeMs, timePlayedMs }) => {
        let levelUpPayload: { level: number } | null = null;
        set((state) => {
          const prev = state.shiftStats;
          const isNewRecord = survivalTimeMs > (prev.bestSurvivalTimeMs ?? 0);
          const nextXp = state.progression.totalXp + XP_PER_GAME + (isNewRecord ? XP_NEW_RECORD : 0);
          const prevLevel = xpToLevel(state.progression.totalXp);
          const nextLevel = xpToLevel(nextXp);
          const coins = COINS_PER_GAME + (isNewRecord ? COINS_NEW_RECORD : 0) + (nextLevel > prevLevel ? COINS_LEVEL_UP : 0);
          if (nextLevel > prevLevel) levelUpPayload = { level: nextLevel };
          const shiftStats = { ...prev, bestSurvivalTimeMs: Math.max(prev.bestSurvivalTimeMs ?? 0, survivalTimeMs), gamesPlayed: prev.gamesPlayed + 1, totalTimeMs: (prev.totalTimeMs ?? 0) + timePlayedMs };
          const dateKey = getTodayDateKey();
          const { dailyChallenge, xpReward, coinsReward } = applyDailyProgress(state.dailyChallenge ?? defaultDailyChallenge, dateKey, { gameSlug: "shift", isNewRecord });
          const progression = { totalXp: nextXp + xpReward };
          const wallet = { madCoins: (state.wallet?.madCoins ?? 0) + coins + coinsReward };
          return { ...state, shiftStats, progression, wallet, dailyChallenge, unlockedAchievementIds: mergeAchievementIds(state, { progression, shiftStats }) };
        });
        if (levelUpPayload) platform.emit("levelUp", levelUpPayload);
      },
      updateOverloadStats: ({ score, bestCombo, timePlayedMs }) => {
        let levelUpPayload: { level: number } | null = null;
        set((state) => {
          const prev = state.overloadStats;
          const isNewRecord = score > (prev.bestScore ?? 0);
          const nextXp = state.progression.totalXp + XP_PER_GAME + (isNewRecord ? XP_NEW_RECORD : 0);
          const prevLevel = xpToLevel(state.progression.totalXp);
          const nextLevel = xpToLevel(nextXp);
          const coins = COINS_PER_GAME + (isNewRecord ? COINS_NEW_RECORD : 0) + (nextLevel > prevLevel ? COINS_LEVEL_UP : 0);
          if (nextLevel > prevLevel) levelUpPayload = { level: nextLevel };
          const overloadStats = {
            ...prev,
            bestScore: Math.max(prev.bestScore ?? 0, score),
            bestCombo: Math.max(prev.bestCombo ?? 0, bestCombo),
            gamesPlayed: prev.gamesPlayed + 1,
            totalTimeMs: (prev.totalTimeMs ?? 0) + timePlayedMs,
          };
          const dateKey = getTodayDateKey();
          const { dailyChallenge, xpReward, coinsReward } = applyDailyProgress(state.dailyChallenge ?? defaultDailyChallenge, dateKey, { gameSlug: "overload", isNewRecord });
          const progression = { totalXp: nextXp + xpReward };
          const wallet = { madCoins: (state.wallet?.madCoins ?? 0) + coins + coinsReward };
          return {
            ...state,
            overloadStats,
            progression,
            wallet,
            dailyChallenge,
            unlockedAchievementIds: mergeAchievementIds(state, { progression, overloadStats }),
          };
        });
        if (levelUpPayload) platform.emit("levelUp", levelUpPayload);
      },
      updatePolarStats: ({ score, bestCombo, timePlayedMs }) => {
        let levelUpPayload: { level: number } | null = null;
        set((state) => {
          const prev = state.polarStats;
          const isNewRecord = score > (prev.bestScore ?? 0);
          const nextXp = state.progression.totalXp + XP_PER_GAME + (isNewRecord ? XP_NEW_RECORD : 0);
          const prevLevel = xpToLevel(state.progression.totalXp);
          const nextLevel = xpToLevel(nextXp);
          const coins = COINS_PER_GAME + (isNewRecord ? COINS_NEW_RECORD : 0) + (nextLevel > prevLevel ? COINS_LEVEL_UP : 0);
          if (nextLevel > prevLevel) levelUpPayload = { level: nextLevel };
          const polarStats = {
            ...prev,
            bestScore: Math.max(prev.bestScore ?? 0, score),
            bestCombo: Math.max(prev.bestCombo ?? 0, bestCombo),
            gamesPlayed: prev.gamesPlayed + 1,
            totalTimeMs: (prev.totalTimeMs ?? 0) + timePlayedMs,
          };
          const dateKey = getTodayDateKey();
          const { dailyChallenge, xpReward, coinsReward } = applyDailyProgress(state.dailyChallenge ?? defaultDailyChallenge, dateKey, { gameSlug: "polar", isNewRecord });
          const progression = { totalXp: nextXp + xpReward };
          const wallet = { madCoins: (state.wallet?.madCoins ?? 0) + coins + coinsReward };
          return {
            ...state,
            polarStats,
            progression,
            wallet,
            dailyChallenge,
            unlockedAchievementIds: mergeAchievementIds(state, { progression, polarStats }),
          };
        });
        if (levelUpPayload) platform.emit("levelUp", levelUpPayload);
      },
      updateVoidStats: ({ survivalTimeMs, timePlayedMs }) => {
        let levelUpPayload: { level: number } | null = null;
        set((state) => {
          const prev = state.voidStats;
          const isNewRecord = survivalTimeMs > (prev.bestSurvivalTimeMs ?? 0);
          const nextXp = state.progression.totalXp + XP_PER_GAME + (isNewRecord ? XP_NEW_RECORD : 0);
          const prevLevel = xpToLevel(state.progression.totalXp);
          const nextLevel = xpToLevel(nextXp);
          const coins = COINS_PER_GAME + (isNewRecord ? COINS_NEW_RECORD : 0) + (nextLevel > prevLevel ? COINS_LEVEL_UP : 0);
          if (nextLevel > prevLevel) levelUpPayload = { level: nextLevel };
          const voidStats = {
            ...prev,
            bestSurvivalTimeMs: Math.max(prev.bestSurvivalTimeMs ?? 0, survivalTimeMs),
            gamesPlayed: prev.gamesPlayed + 1,
            totalTimeMs: (prev.totalTimeMs ?? 0) + timePlayedMs,
          };
          const dateKey = getTodayDateKey();
          const { dailyChallenge, xpReward, coinsReward } = applyDailyProgress(state.dailyChallenge ?? defaultDailyChallenge, dateKey, { gameSlug: "void", isNewRecord });
          const progression = { totalXp: nextXp + xpReward };
          const wallet = { madCoins: (state.wallet?.madCoins ?? 0) + coins + coinsReward };
          return {
            ...state,
            voidStats,
            progression,
            wallet,
            dailyChallenge,
            unlockedAchievementIds: mergeAchievementIds(state, { progression, voidStats }),
          };
        });
        if (levelUpPayload) platform.emit("levelUp", levelUpPayload);
      },
      recordGameEnd: (gameSlug) => {
        const HIDDEN_GAME_SLUG = "void";
        set((state) => {
          const prev = state.sessionConsecutivePlays;
          const sameGame = prev.gameSlug === gameSlug;
          const count = sameGame ? prev.count + 1 : 1;
          const unlocked = state.hiddenGameUnlocked;
          const shouldUnlock = !unlocked && count >= 3;
          return {
            sessionConsecutivePlays: { count, gameSlug },
            ...(shouldUnlock
              ? {
                  hiddenGameUnlocked: true,
                  pendingUnlockReveal: true,
                }
              : {}),
          };
        });
      },
      resetSessionConsecutivePlays: () =>
        set({ sessionConsecutivePlays: { count: 0, gameSlug: null } }),
      clearUnlockMessage: () => set({ pendingUnlockMessage: false }),
      setUnlockRevealDone: () =>
        set({ pendingUnlockReveal: false, pendingUnlockMessage: true }),
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
          (s.reactorStats?.gamesPlayed ?? 0) +
          (s.orbitStats?.gamesPlayed ?? 0) +
          (s.pulseDashStats?.gamesPlayed ?? 0) +
          (s.memoryGlitchStats?.gamesPlayed ?? 0) +
          (s.coreDefenseStats?.gamesPlayed ?? 0) +
          (s.shiftStats?.gamesPlayed ?? 0) +
          (s.overloadStats?.gamesPlayed ?? 0) +
          (s.polarStats?.gamesPlayed ?? 0) +
          (s.voidStats?.gamesPlayed ?? 0);
        const totalTimeMs =
          s.snakeStats.totalTimeMs +
          (s.pongStats.totalTimeMs ?? 0) +
          s.breakoutStats.totalTimeMs +
          (s.dodgeStats?.totalTimeMs ?? 0) +
          (s.reactorStats?.totalTimeMs ?? 0) +
          (s.orbitStats?.totalTimeMs ?? 0) +
          (s.pulseDashStats?.totalTimeMs ?? 0) +
          (s.memoryGlitchStats?.totalTimeMs ?? 0) +
          (s.coreDefenseStats?.totalTimeMs ?? 0) +
          (s.shiftStats?.totalTimeMs ?? 0) +
          (s.overloadStats?.totalTimeMs ?? 0) +
          (s.polarStats?.totalTimeMs ?? 0) +
          (s.voidStats?.totalTimeMs ?? 0);
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
        orbitStats: state.orbitStats,
        pulseDashStats: state.pulseDashStats,
        memoryGlitchStats: state.memoryGlitchStats,
        coreDefenseStats: state.coreDefenseStats,
        shiftStats: state.shiftStats,
        overloadStats: state.overloadStats ?? defaultOverloadStats,
        polarStats: state.polarStats ?? defaultPolarStats,
        voidStats: state.voidStats ?? defaultVoidStats,
        progression: state.progression,
        dailyChallenge: state.dailyChallenge ?? defaultDailyChallenge,
        unlockedAchievementIds: state.unlockedAchievementIds,
        wallet: state.wallet ?? defaultWallet,
        inventory: state.inventory ?? defaultInventory,
        hiddenGameUnlocked: state.hiddenGameUnlocked ?? false,
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
    useStore.getState().recordGameEnd(p.gameSlug);
  });
}

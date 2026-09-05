"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  AppId,
  OsModal,
  OsNotification,
  PersistentOsState,
  StoreCategory,
  WindowInstance,
  WindowPayload,
} from "@/types/os";
import { OS_STORAGE_KEY } from "@/types/os";
import { getAppDefinition } from "@/data/apps";
import { getGameBySlug } from "@/lib/games";
import { getAchievement, REQUIRED_APPS_FOR_CURIOUS } from "@/data/achievements";
import { getStoreItem, STORE_CATALOG } from "@/data/store-catalog";
import { createDefaultPersistentState, DEFAULT_SETTINGS, ROOT_ID } from "@/data/default-state";
import { uniqueName } from "@/lib/file-system";
import { createId } from "@/lib/id";
import { playOsSound } from "@/lib/os-sounds";
import { validatePersistentState } from "@/lib/os-storage";

const TASKBAR_HEIGHT = 48;
const BASE_Z = 100;

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

type OsStore = PersistentOsState & {
  windows: WindowInstance[];
  activeWindowId: string | null;
  nextZ: number;
  notifications: OsNotification[];
  modal: OsModal | null;
  startMenuOpen: boolean;
  clockOpen: boolean;
  trayOpen: boolean;
  hydrated: boolean;
  openApp: (appId: AppId, payload?: WindowPayload) => void;
  closeWindow: (id: string) => void;
  closeActiveWindow: () => void;
  minimizeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  focusWindow: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  addCoins: (amount: number) => void;
  removeCoins: (amount: number) => boolean;
  purchaseItem: (itemId: string) => boolean;
  equipItem: (itemId: string) => void;
  notify: (title: string, message: string) => void;
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;
  setUsername: (name: string) => void;
  patchSettings: (partial: Partial<PersistentOsState["settings"]>) => void;
  saveSettings: () => void;
  restoreSettings: () => void;
  createFolder: (parentId: string, name?: string) => void;
  createFile: (parentId: string, name?: string, content?: string) => void;
  renameNode: (id: string, name: string) => void;
  updateFileContent: (id: string, content: string) => void;
  deleteNode: (id: string) => void;
  restoreNode: (id: string) => void;
  purgeTrashItem: (id: string) => void;
  emptyTrash: () => void;
  unlockAchievement: (id: string) => void;
  markBooted: () => void;
  recordTerminalCommand: () => void;
  setModal: (modal: OsModal | null) => void;
  confirmModal: () => void;
  setStartMenuOpen: (open: boolean) => void;
  setClockOpen: (open: boolean) => void;
  setTrayOpen: (open: boolean) => void;
  resetAndReload: (wipeAllLocalStorage: boolean) => void;
  setHydrated: (value: boolean) => void;
};

function desktopSize(): { width: number; height: number } {
  if (typeof window === "undefined") return { width: 1280, height: 720 };
  return { width: window.innerWidth, height: window.innerHeight - TASKBAR_HEIGHT };
}

function clampWindow(x: number, y: number, width: number): { x: number; y: number } {
  const desk = desktopSize();
  const maxX = Math.max(0, desk.width - 80);
  const maxY = Math.max(0, desk.height - 40);
  return {
    x: Math.min(Math.max(-width + 80, x), maxX),
    y: Math.min(Math.max(0, y), maxY),
  };
}

function isMobile(): boolean {
  return typeof window !== "undefined" && window.innerWidth < 768;
}

function cascadeOffset(count: number): { x: number; y: number } {
  const step = 28;
  const desk = desktopSize();
  const x = 72 + ((count * step) % Math.max(120, desk.width / 3));
  const y = 48 + ((count * step) % Math.max(80, desk.height / 4));
  return { x, y };
}

function persistSlice(state: OsStore): PersistentOsState {
  return {
    user: state.user,
    coins: state.coins,
    inventory: state.inventory,
    settings: state.settings,
    files: state.files,
    trash: state.trash,
    achievements: state.achievements,
    system: state.system,
  };
}

function applyEquip(
  settings: PersistentOsState["settings"],
  category: StoreCategory,
  value: string
): PersistentOsState["settings"] {
  switch (category) {
    case "wallpaper":
      return { ...settings, wallpaper: value };
    case "theme":
      return { ...settings, theme: value as PersistentOsState["settings"]["theme"] };
    case "iconPack":
      return { ...settings, iconPack: value as PersistentOsState["settings"]["iconPack"] };
    case "windowStyle":
      return { ...settings, windowStyle: value as PersistentOsState["settings"]["windowStyle"] };
    case "cursor":
      return { ...settings, cursor: value as PersistentOsState["settings"]["cursor"] };
    case "sound":
      return { ...settings, soundPack: value };
    case "visualEffect":
      return { ...settings, visualEffect: value as PersistentOsState["settings"]["visualEffect"] };
    default:
      return settings;
  }
}

export const useOsStore = create<OsStore>()(
  persist(
    (set, get) => ({
      ...createDefaultPersistentState(),
      windows: [],
      activeWindowId: null,
      nextZ: BASE_Z,
      notifications: [],
      modal: null,
      startMenuOpen: false,
      clockOpen: false,
      trayOpen: false,
      hydrated: false,

      setHydrated: (value) => set({ hydrated: value }),

      openApp: (appId, payload) => {
        const state = get();
        if (appId === "game") {
          const slug = payload?.gameSlug;
          if (!slug) return;
          const existing = state.windows.find((win) => win.appId === "game" && win.payload?.gameSlug === slug);
          if (existing) {
            get().focusWindow(existing.id);
            if (existing.isMinimized) {
              set({
                windows: get().windows.map((win) => (win.id === existing.id ? { ...win, isMinimized: false } : win)),
              });
            }
            return;
          }
        } else {
          const existing = state.windows.find((win) => win.appId === appId);
          if (existing) {
            get().focusWindow(existing.id);
            if (existing.isMinimized) {
              set({
                windows: get().windows.map((win) => (win.id === existing.id ? { ...win, isMinimized: false } : win)),
              });
            }
            return;
          }
        }

        const def = getAppDefinition(appId);
        const desk = desktopSize();
        const mobile = isMobile();
        const offset = cascadeOffset(state.windows.length);
        const width = Math.min(def?.defaultWidth ?? 720, desk.width - 24);
        const height = Math.min(def?.defaultHeight ?? 480, desk.height - 16);
        const pos = clampWindow(offset.x, offset.y, width);
        const z = state.nextZ + 1;
        const id = createId("win");

        const title =
          appId === "game"
            ? (getGameBySlug(payload?.gameSlug ?? "")?.name ?? "Game")
            : (def?.name ?? "Application");
        const icon = appId === "game" ? "games" : (def?.icon ?? "games");

        const win: WindowInstance = {
          id,
          appId,
          title,
          icon,
          x: pos.x,
          y: pos.y,
          width,
          height,
          zIndex: z,
          isMinimized: false,
          isMaximized: mobile,
          restoreBounds: null,
          payload,
        };

        const opened = new Set(state.system.openedAppIds);
        if (appId !== "game") opened.add(appId);
        const gamesLaunched = appId === "game" ? state.system.gamesLaunched + 1 : state.system.gamesLaunched;

        set({
          windows: [...state.windows, win],
          activeWindowId: id,
          nextZ: z,
          startMenuOpen: false,
          system: { ...state.system, openedAppIds: Array.from(opened), gamesLaunched },
        });

        playOsSound("ui", state.settings.uiSounds, state.settings.soundPack);

        if (REQUIRED_APPS_FOR_CURIOUS.every((app) => opened.has(app))) {
          get().unlockAchievement("curious");
        }
      },

      closeWindow: (id) => {
        const state = get();
        const remaining = state.windows.filter((win) => win.id !== id);
        const top = remaining.filter((win) => !win.isMinimized).sort((a, b) => b.zIndex - a.zIndex)[0];
        set({
          windows: remaining,
          activeWindowId: top?.id ?? null,
        });
        playOsSound("ui", state.settings.uiSounds, state.settings.soundPack);
      },

      closeActiveWindow: () => {
        const id = get().activeWindowId;
        if (id) get().closeWindow(id);
      },

      minimizeWindow: (id) => {
        const state = get();
        const remaining = state.windows.map((win) => (win.id === id ? { ...win, isMinimized: true } : win));
        const top = remaining.filter((win) => !win.isMinimized).sort((a, b) => b.zIndex - a.zIndex)[0];
        set({ windows: remaining, activeWindowId: top?.id ?? null });
        playOsSound("ui", state.settings.uiSounds, state.settings.soundPack);
      },

      toggleMaximize: (id) => {
        set((state) => ({
          windows: state.windows.map((win) => {
            if (win.id !== id) return win;
            if (win.isMaximized) {
              const bounds = win.restoreBounds;
              return {
                ...win,
                isMaximized: false,
                x: bounds?.x ?? win.x,
                y: bounds?.y ?? win.y,
                width: bounds?.width ?? win.width,
                height: bounds?.height ?? win.height,
                restoreBounds: null,
              };
            }
            return {
              ...win,
              isMaximized: true,
              restoreBounds: { x: win.x, y: win.y, width: win.width, height: win.height },
            };
          }),
        }));
      },

      focusWindow: (id) => {
        const state = get();
        const z = state.nextZ + 1;
        set({
          activeWindowId: id,
          nextZ: z,
          startMenuOpen: false,
          clockOpen: false,
          trayOpen: false,
          windows: state.windows.map((win) =>
            win.id === id ? { ...win, zIndex: z, isMinimized: false } : win
          ),
        });
      },

      moveWindow: (id, x, y) => {
        set((state) => ({
          windows: state.windows.map((win) => {
            if (win.id !== id || win.isMaximized) return win;
            const pos = clampWindow(x, y, win.width);
            return { ...win, ...pos };
          }),
        }));
      },

      addCoins: (amount) => {
        if (amount <= 0) return;
        set((state) => ({ coins: state.coins + Math.floor(amount) }));
      },

      removeCoins: (amount) => {
        const value = Math.floor(amount);
        if (value <= 0) return true;
        const state = get();
        if (state.coins < value) return false;
        set({ coins: state.coins - value });
        return true;
      },

      purchaseItem: (itemId) => {
        const item = getStoreItem(itemId);
        const state = get();
        if (!item) return false;
        if (state.inventory.purchasedItemIds.includes(itemId)) return false;
        if (!get().removeCoins(item.price)) {
          get().notify("MAD Store", "Not enough Mad Coins.");
          playOsSound("error", state.settings.uiSounds, state.settings.soundPack);
          return false;
        }
        set((current) => {
          const purchasedItemIds = [...current.inventory.purchasedItemIds, itemId];
          const equipped =
            item.category === "theme"
              ? { ...current.inventory.equipped, theme: itemId }
              : current.inventory.equipped;
          return {
            inventory: { ...current.inventory, purchasedItemIds, equipped },
            settings:
              item.category === "theme"
                ? applyEquip(current.settings, item.category, item.value)
                : current.settings,
          };
        });
        get().notify(
          "MAD Store",
          item.category === "theme" ? `${item.name} purchased and equipped.` : "Item purchased."
        );
        get().unlockAchievement("shopper");
        playOsSound("success", get().settings.notificationSounds, get().settings.soundPack);
        return true;
      },

      equipItem: (itemId) => {
        const item = getStoreItem(itemId);
        const state = get();
        if (!item) return;
        if (!state.inventory.purchasedItemIds.includes(itemId)) return;
        const nextSettings = applyEquip(state.settings, item.category, item.value);
        set({
          inventory: {
            ...state.inventory,
            equipped: { ...state.inventory.equipped, [item.category]: itemId },
          },
          settings: nextSettings,
        });
        if (item.category === "wallpaper" && item.value !== state.settings.wallpaper) {
          get().unlockAchievement("customizer");
        }
        get().notify("MAD Store", `${item.name} equipped.`);
        playOsSound("ui", state.settings.uiSounds, state.settings.soundPack);
      },

      notify: (title, message) => {
        const id = createId("ntf");
        set((state) => ({
          notifications: [...state.notifications.slice(-4), { id, title, message, createdAt: Date.now() }],
        }));
        playOsSound("notify", get().settings.notificationSounds, get().settings.soundPack);
        window.setTimeout(() => {
          get().dismissNotification(id);
        }, 4200);
      },

      dismissNotification: (id) => {
        set((state) => ({ notifications: state.notifications.filter((item) => item.id !== id) }));
      },

      clearNotifications: () => set({ notifications: [], trayOpen: false }),

      setUsername: (name) => {
        const displayName = name.trim() || "Thiago.so";
        set({ user: { displayName, avatarSeed: displayName } });
      },

      patchSettings: (partial) => {
        const prev = get().settings;
        set((state) => {
          const settings = { ...state.settings, ...partial };
          let inventory = state.inventory;
          if (partial.theme) {
            const match = STORE_CATALOG.find((item) => item.category === "theme" && item.value === partial.theme);
            if (match && state.inventory.purchasedItemIds.includes(match.id)) {
              inventory = {
                ...state.inventory,
                equipped: { ...state.inventory.equipped, theme: match.id },
              };
            }
          }
          return { settings, inventory };
        });
        if (partial.wallpaper && partial.wallpaper !== prev.wallpaper) {
          get().unlockAchievement("customizer");
        }
      },

      saveSettings: () => {
        get().notify("MAD OS", "Settings saved successfully.");
      },

      restoreSettings: () => {
        const inventory = get().inventory;
        set({
          settings: {
            ...DEFAULT_SETTINGS,
            wallpaper: getStoreItem(inventory.equipped.wallpaper ?? "")?.value ?? DEFAULT_SETTINGS.wallpaper,
          },
        });
        get().notify("MAD OS", "Settings restored.");
      },

      createFolder: (parentId, name) => {
        const state = get();
        const folderName = uniqueName(state.files, parentId, name?.trim() || "New Folder");
        const id = createId("folder");
        const timestamp = Date.now();
        set({
          files: [
            ...state.files,
            {
              id,
              name: folderName,
              type: "folder",
              parentId,
              createdAt: timestamp,
              updatedAt: timestamp,
            },
          ],
        });
      },

      createFile: (parentId, name, content = "") => {
        const state = get();
        const fileName = uniqueName(state.files, parentId, name?.trim() || "untitled.txt");
        const id = createId("file");
        const timestamp = Date.now();
        set({
          files: [
            ...state.files,
            {
              id,
              name: fileName,
              type: "file",
              parentId,
              content,
              createdAt: timestamp,
              updatedAt: timestamp,
            },
          ],
        });
      },

      renameNode: (id, name) => {
        const next = name.trim();
        if (!next) return;
        set((state) => ({
          files: state.files.map((node) =>
            node.id === id && node.id !== ROOT_ID ? { ...node, name: next, updatedAt: Date.now() } : node
          ),
        }));
      },

      updateFileContent: (id, content) => {
        set((state) => ({
          files: state.files.map((node) =>
            node.id === id ? { ...node, content, updatedAt: Date.now() } : node
          ),
        }));
      },

      deleteNode: (id) => {
        if (id === ROOT_ID) return;
        const state = get();
        const toRemove = new Set<string>();
        const visit = (target: string) => {
          toRemove.add(target);
          state.files.filter((node) => node.parentId === target).forEach((child) => visit(child.id));
        };
        visit(id);
        const removed = state.files.filter((node) => toRemove.has(node.id));
        set({
          files: state.files.filter((node) => !toRemove.has(node.id)),
          trash: [
            ...state.trash,
            ...removed.map((node) => ({ node, deletedAt: Date.now() })),
          ],
        });
        get().notify("MAD Files", "File deleted.");
      },

      restoreNode: (id) => {
        const state = get();
        const item = state.trash.find((entry) => entry.node.id === id);
        if (!item) return;
        const parentExists = item.node.parentId
          ? state.files.some((node) => node.id === item.node.parentId)
          : true;
        const restored = {
          ...item.node,
          parentId: parentExists ? item.node.parentId : ROOT_ID,
          name: uniqueName(state.files, parentExists ? item.node.parentId ?? ROOT_ID : ROOT_ID, item.node.name),
        };
        set({
          files: [...state.files, restored],
          trash: state.trash.filter((entry) => entry.node.id !== id),
        });
        get().notify("MAD Files", "Item restored.");
      },

      purgeTrashItem: (id) => {
        set((state) => ({ trash: state.trash.filter((entry) => entry.node.id !== id) }));
      },

      emptyTrash: () => {
        set({ trash: [] });
        get().notify("MAD Files", "Trash emptied.");
      },

      unlockAchievement: (id) => {
        const state = get();
        if (state.achievements.includes(id)) return;
        set({ achievements: [...state.achievements, id] });
        const def = getAchievement(id);
        if (def) get().notify("Achievement", `${def.name} unlocked.`);
      },

      markBooted: () => {
        set((state) => ({
          system: { ...state.system, hasBooted: true, installedAt: state.system.installedAt || Date.now() },
        }));
        get().unlockAchievement("first_boot");
      },

      recordTerminalCommand: () => {
        set((state) => ({
          system: { ...state.system, terminalCommandsRun: state.system.terminalCommandsRun + 1 },
        }));
        get().unlockAchievement("terminal_user");
      },

      setModal: (modal) => set({ modal }),

      confirmModal: () => {
        const modal = get().modal;
        if (!modal) return;
        set({ modal: null });
        if (modal.action === "reset-os") get().resetAndReload(false);
        if (modal.action === "delete-data") get().resetAndReload(false);
        if (modal.action === "empty-trash") get().emptyTrash();
        if (modal.action === "delete-file" && modal.payload) get().purgeTrashItem(modal.payload);
      },

      setStartMenuOpen: (open) => set({ startMenuOpen: open, clockOpen: false, trayOpen: false }),
      setClockOpen: (open) => set({ clockOpen: open, startMenuOpen: false, trayOpen: false }),
      setTrayOpen: (open) => set({ trayOpen: open, startMenuOpen: false, clockOpen: false }),

      resetAndReload: (wipeAllLocalStorage) => {
        if (typeof window === "undefined") return;
        if (wipeAllLocalStorage) {
          window.localStorage.clear();
        } else {
          window.localStorage.removeItem(OS_STORAGE_KEY);
        }
        window.location.reload();
      },
    }),
    {
      name: OS_STORAGE_KEY,
      storage: createJSONStorage(() => (typeof window === "undefined" ? noopStorage : localStorage)),
      partialize: persistSlice,
      merge: (persisted, current) => {
        const valid = validatePersistentState(persisted);
        return { ...current, ...valid };
      },
      skipHydration: true,
    }
  )
);

export function addCoins(amount: number): void {
  useOsStore.getState().addCoins(amount);
}

export function removeCoins(amount: number): boolean {
  return useOsStore.getState().removeCoins(amount);
}

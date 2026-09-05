import { OS_STORAGE_KEY, OS_VERSION } from "@/types/os";
import type { FsNode, OsInventory, OsSettings, PersistentOsState, ThemeId, UiScale } from "@/types/os";
import { STORE_CATALOG } from "@/data/store-catalog";
import { createDefaultFiles, createDefaultInventory, createDefaultPersistentState, DEFAULT_SETTINGS, ROOT_ID } from "@/data/default-state";

const THEMES: ThemeId[] = ["dark", "light", "midnight", "carbon"];
const SCALES: UiScale[] = ["small", "medium", "large"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function validateSettings(raw: unknown): OsSettings {
  const defaults = DEFAULT_SETTINGS;
  if (!isRecord(raw)) return { ...defaults };
  const theme = asString(raw.theme, defaults.theme);
  const uiScale = asString(raw.uiScale, defaults.uiScale);
  return {
    wallpaper: asString(raw.wallpaper, defaults.wallpaper),
    theme: THEMES.includes(theme as ThemeId) ? (theme as ThemeId) : defaults.theme,
    uiScale: SCALES.includes(uiScale as UiScale) ? (uiScale as UiScale) : defaults.uiScale,
    animations: asBoolean(raw.animations, defaults.animations),
    uiSounds: asBoolean(raw.uiSounds, defaults.uiSounds),
    notificationSounds: asBoolean(raw.notificationSounds, defaults.notificationSounds),
    windowStyle: asString(raw.windowStyle, defaults.windowStyle) as OsSettings["windowStyle"],
    iconPack: asString(raw.iconPack, defaults.iconPack) as OsSettings["iconPack"],
    cursor: asString(raw.cursor, defaults.cursor) as OsSettings["cursor"],
    visualEffect: asString(raw.visualEffect, defaults.visualEffect) as OsSettings["visualEffect"],
    soundPack: asString(raw.soundPack, defaults.soundPack),
  };
}

function validateFiles(raw: unknown): FsNode[] {
  if (!Array.isArray(raw)) return createDefaultFiles();
  const nodes: FsNode[] = [];
  for (const item of raw) {
    if (!isRecord(item)) continue;
    if (typeof item.id !== "string" || typeof item.name !== "string") continue;
    if (item.type !== "file" && item.type !== "folder") continue;
    nodes.push({
      id: item.id,
      name: item.name,
      type: item.type,
      parentId: typeof item.parentId === "string" || item.parentId === null ? item.parentId : ROOT_ID,
      content: typeof item.content === "string" ? item.content : undefined,
      createdAt: asNumber(item.createdAt, Date.now()),
      updatedAt: asNumber(item.updatedAt, Date.now()),
      hidden: asBoolean(item.hidden, false) || undefined,
    });
  }
  if (!nodes.some((node) => node.id === ROOT_ID)) return createDefaultFiles();
  return nodes;
}

function validateInventory(raw: unknown): OsInventory {
  const fallback = createDefaultInventory();
  if (!isRecord(raw)) return fallback;
  const purchased = Array.isArray(raw.purchasedItemIds)
    ? raw.purchasedItemIds.filter((id): id is string => typeof id === "string")
    : fallback.purchasedItemIds;
  const validIds = new Set(STORE_CATALOG.map((item) => item.id));
  const purchasedItemIds = Array.from(new Set([...fallback.purchasedItemIds, ...purchased])).filter((id) =>
    validIds.has(id)
  );
  const equipped = isRecord(raw.equipped) ? { ...fallback.equipped } : fallback.equipped;
  if (isRecord(raw.equipped)) {
    for (const [key, value] of Object.entries(raw.equipped)) {
      if (typeof value === "string" && validIds.has(value)) {
        equipped[key as keyof OsInventory["equipped"]] = value;
      }
    }
  }
  return { purchasedItemIds, equipped };
}

export function validatePersistentState(raw: unknown): PersistentOsState {
  const defaults = createDefaultPersistentState();
  if (!isRecord(raw)) return defaults;

  const userRaw = isRecord(raw.user) ? raw.user : {};
  const systemRaw = isRecord(raw.system) ? raw.system : {};
  const trashRaw = Array.isArray(raw.trash) ? raw.trash : [];

  return {
    user: {
      displayName: asString(userRaw.displayName, defaults.user.displayName),
      avatarSeed: asString(userRaw.avatarSeed, asString(userRaw.displayName, defaults.user.avatarSeed)),
    },
    coins: Math.max(0, Math.floor(asNumber(raw.coins, defaults.coins))),
    inventory: validateInventory(raw.inventory),
    settings: validateSettings(raw.settings),
    files: validateFiles(raw.files),
    trash: trashRaw.flatMap((item) => {
      if (!isRecord(item) || !isRecord(item.node)) return [];
      const files = validateFiles([item.node]);
      if (files.length === 0) return [];
      return [{ node: files[0], deletedAt: asNumber(item.deletedAt, Date.now()) }];
    }),
    achievements: Array.isArray(raw.achievements)
      ? raw.achievements.filter((id): id is string => typeof id === "string")
      : [],
    system: {
      version: OS_VERSION,
      installedAt: asNumber(systemRaw.installedAt, Date.now()),
      hasBooted: asBoolean(systemRaw.hasBooted, false),
      openedAppIds: Array.isArray(systemRaw.openedAppIds)
        ? systemRaw.openedAppIds.filter(
            (id): id is PersistentOsState["system"]["openedAppIds"][number] =>
              typeof id === "string" && id !== "files" && id !== "game"
          )
        : [],
      terminalCommandsRun: asNumber(systemRaw.terminalCommandsRun, 0),
      gamesLaunched: asNumber(systemRaw.gamesLaunched, 0),
    },
  };
}

export function loadOsState(): PersistentOsState {
  if (typeof window === "undefined") return createDefaultPersistentState();
  try {
    const raw = window.localStorage.getItem(OS_STORAGE_KEY);
    if (!raw) return createDefaultPersistentState();
    return validatePersistentState(JSON.parse(raw));
  } catch {
    return createDefaultPersistentState();
  }
}

export function saveOsState(state: PersistentOsState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(OS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota or private mode — ignore.
  }
}

export function resetOsStorage(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(OS_STORAGE_KEY);
}

export function clearAllLocalData(): void {
  if (typeof window === "undefined") return;
  window.localStorage.clear();
}

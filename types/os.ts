export const OS_VERSION = "1.0.0";
export const OS_STORAGE_KEY = "madOS";

export type AppId =
  | "settings"
  | "store"
  | "games"
  | "profile"
  | "terminal"
  | "about"
  | "trash"
  | "versions"
  | "game";

export type ThemeId = "dark" | "light" | "midnight" | "carbon";
export type UiScale = "small" | "medium" | "large";
export type WindowStyle = "standard" | "glass" | "sharp";
export type IconPack = "standard" | "glyph" | "neon";
export type CursorStyle = "default" | "precision" | "glow";
export type VisualEffect = "none" | "glow" | "scanline";

export type StoreCategory =
  | "wallpaper"
  | "theme"
  | "iconPack"
  | "windowStyle"
  | "cursor"
  | "sound"
  | "visualEffect";

export type StoreItemStatus = "available" | "purchased" | "equipped";

export interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowInstance {
  id: string;
  appId: AppId;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  restoreBounds: WindowBounds | null;
  payload?: WindowPayload;
}

export interface WindowPayload {
  gameSlug?: string;
  folderId?: string;
}

export interface OsUser {
  displayName: string;
  avatarSeed: string;
}

export interface OsSettings {
  wallpaper: string;
  theme: ThemeId;
  uiScale: UiScale;
  animations: boolean;
  uiSounds: boolean;
  notificationSounds: boolean;
  windowStyle: WindowStyle;
  iconPack: IconPack;
  cursor: CursorStyle;
  visualEffect: VisualEffect;
  soundPack: string;
}

export interface FsNode {
  id: string;
  name: string;
  type: "file" | "folder";
  parentId: string | null;
  content?: string;
  createdAt: number;
  updatedAt: number;
  hidden?: boolean;
}

export interface TrashItem {
  node: FsNode;
  deletedAt: number;
}

export interface StoreCatalogItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: StoreCategory;
  value: string;
  icon: string;
  defaultOwned?: boolean;
  defaultEquipped?: boolean;
}

export interface OsInventory {
  purchasedItemIds: string[];
  equipped: Partial<Record<StoreCategory, string>>;
}

export interface OsAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface OsSystem {
  version: string;
  installedAt: number;
  hasBooted: boolean;
  openedAppIds: AppId[];
  terminalCommandsRun: number;
  gamesLaunched: number;
}

export interface OsNotification {
  id: string;
  title: string;
  message: string;
  createdAt: number;
}

export interface OsModal {
  title: string;
  body: string[];
  confirmLabel: string;
  cancelLabel: string;
  danger?: boolean;
  action: "reset-os" | "delete-data" | "empty-trash" | "delete-file";
  payload?: string;
}

export interface PersistentOsState {
  user: OsUser;
  coins: number;
  inventory: OsInventory;
  settings: OsSettings;
  files: FsNode[];
  trash: TrashItem[];
  achievements: string[];
  system: OsSystem;
}

export interface WallpaperDef {
  id: string;
  name: string;
  className: string;
}

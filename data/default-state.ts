import { OS_VERSION } from "@/types/os";
import type { FsNode, OsInventory, OsSettings, PersistentOsState } from "@/types/os";
import { STORE_CATALOG } from "@/data/store-catalog";

const now = 1_704_067_200_000;

export const ROOT_ID = "mad-root";
export const FOLDER_DOCUMENTS = "folder-documents";
export const FOLDER_DOWNLOADS = "folder-downloads";
export const FOLDER_GAMES = "folder-games";
export const FOLDER_PICTURES = "folder-pictures";
export const FOLDER_MUSIC = "folder-music";
export const FOLDER_SYSTEM = "folder-system";
export const HIDDEN_MAD_FILE = "file-hidden-mad";

export const DEFAULT_SETTINGS: OsSettings = {
  wallpaper: "crimson-grid",
  theme: "dark",
  uiScale: "medium",
  animations: true,
  uiSounds: true,
  notificationSounds: true,
  windowStyle: "standard",
  iconPack: "standard",
  cursor: "default",
  visualEffect: "none",
  soundPack: "soft",
};

export function createDefaultInventory(): OsInventory {
  const purchasedItemIds = STORE_CATALOG.filter((item) => item.defaultOwned).map((item) => item.id);
  const equipped: OsInventory["equipped"] = {};
  for (const item of STORE_CATALOG) {
    if (item.defaultEquipped) {
      equipped[item.category] = item.id;
    }
  }
  return { purchasedItemIds, equipped };
}

export function createDefaultFiles(): FsNode[] {
  return [
    {
      id: ROOT_ID,
      name: "MAD",
      type: "folder",
      parentId: null,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: FOLDER_DOCUMENTS,
      name: "Documents",
      type: "folder",
      parentId: ROOT_ID,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: FOLDER_DOWNLOADS,
      name: "Downloads",
      type: "folder",
      parentId: ROOT_ID,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: FOLDER_GAMES,
      name: "Games",
      type: "folder",
      parentId: ROOT_ID,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: FOLDER_PICTURES,
      name: "Pictures",
      type: "folder",
      parentId: ROOT_ID,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: FOLDER_MUSIC,
      name: "Music",
      type: "folder",
      parentId: ROOT_ID,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: FOLDER_SYSTEM,
      name: "System",
      type: "folder",
      parentId: ROOT_ID,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "file-readme",
      name: "README.txt",
      type: "file",
      parentId: FOLDER_DOCUMENTS,
      content: "Welcome to MAD OS.",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "file-welcome",
      name: "welcome.txt",
      type: "file",
      parentId: FOLDER_DOCUMENTS,
      content: "This is your local machine.\nEverything here stays on this device.",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "file-notes",
      name: "notes.txt",
      type: "file",
      parentId: FOLDER_DOCUMENTS,
      content: "Ideas:\n- Open the Terminal\n- Visit MAD Store\n- Launch a game",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: HIDDEN_MAD_FILE,
      name: ".mad",
      type: "file",
      parentId: FOLDER_SYSTEM,
      content: "You were not supposed to find this.\nMAD remembers.",
      createdAt: now,
      updatedAt: now,
      hidden: true,
    },
  ];
}

export function createDefaultPersistentState(): PersistentOsState {
  return {
    user: {
      displayName: "Thiago.so",
      avatarSeed: "Thiago.so",
    },
    coins: 1000,
    inventory: createDefaultInventory(),
    settings: { ...DEFAULT_SETTINGS },
    files: createDefaultFiles(),
    trash: [],
    achievements: [],
    system: {
      version: OS_VERSION,
      installedAt: Date.now(),
      hasBooted: false,
      openedAppIds: [],
      terminalCommandsRun: 0,
      gamesLaunched: 0,
    },
  };
}

/**
 * Tipos globales de la plataforma.
 * Pensados para evolucionar a backend/DB sin reescribir.
 */

export interface UserProfile {
  nickname: string;
  avatar: string; // emoji por defecto; puede ser overridden por item equipado
  updatedAt: number;
  favoriteGameSlugs: string[];
  lastPlayedGameSlug: string | null;
}

/** Moneda de la plataforma. Solo se gana jugando; no se compra con dinero real. */
export interface Wallet {
  madCoins: number;
}

/** Categorías de la tienda */
export type ShopCategory = "profile" | "platform" | "games";

/** Subcategorías por categoría */
export type ShopItemType =
  | "avatar"
  | "border"
  | "title"
  | "badge"
  | "theme"
  | "ui"
  | "effect"
  | "gameSkin";

/** Estado de un ítem para el usuario */
export type ShopItemState = "locked" | "available" | "purchased" | "equipped";

/** Ítem de la tienda. Todo es permanente; no consumibles, no RNG. */
export interface ShopItem {
  id: string;
  category: ShopCategory;
  type: ShopItemType;
  name: string;
  description: string;
  /** Precio en MAD Coins */
  price: number;
  /** Emoji o valor a aplicar al equipar (avatar, badge, título, tema, etc.) */
  value: string;
  /** Opcional: nivel mínimo para ver como "disponible" (no bloquea compra si ya se compró) */
  minLevel?: number;
  icon?: string;
}

/** Slots de equipamiento (uno por tipo aplicable) */
export type EquipSlot = "avatar" | "border" | "title" | "badge" | "theme";

export interface EquippedItems {
  avatar: string | null;   // itemId o null = usar profile.avatar
  border: string | null;
  title: string | null;
  badge: string | null;
  theme: string | null;   // itemId o null = usar settings.theme
}

export interface Inventory {
  /** IDs de ítems comprados (permanentes) */
  purchasedItemIds: string[];
  equipped: EquippedItems;
}

export interface GameScore {
  gameSlug: string;
  score: number;
  playedAt: number;
  /** Datos extra por juego (ej. nivel, tiempo) */
  extra?: Record<string, number | string>;
}

export interface GameHistoryEntry {
  gameSlug: string;
  playedAt: number;
  score: number;
  extra?: Record<string, number | string>;
}

export interface GameMeta {
  slug: string;
  name: string;
  description: string;
  icon?: string;
  available: boolean;
  /** Para filtros en catálogo */
  category?: "arcade" | "clásico" | "habilidad";
  /** Dificultad percibida 1-3 */
  difficulty?: 1 | 2 | 3;
}

/** Tema de la plataforma */
export type Theme = "light" | "dark";

/** Configuración global (sonido, tema, velocidad, etc.) — v4 */
export interface GameSettings {
  /** Sonido master (efectos, música si hubiera) */
  soundEnabled: boolean;
  theme: Theme;
  /** Esquema de controles (para mostrar en ayuda) */
  controlScheme: "keyboard" | "keyboard-mouse";
  snakeSpeedMultiplier: number;
  pongSpeedMultiplier: number;
  breakoutSpeedMultiplier: number;
  dodgeSpeedMultiplier: number;
  reactorSpeedMultiplier: number;
  orbitSpeedMultiplier: number;
  pulseDashSpeedMultiplier: number;
  memoryGlitchSpeedMultiplier: number;
  coreDefenseSpeedMultiplier: number;
  shiftSpeedMultiplier: number;
  overloadSpeedMultiplier: number;
  polarSpeedMultiplier: number;
  /** Efectos visuales: low = menos animaciones, high = completo */
  visualEffects: "low" | "high";
  /** Modo bajo rendimiento: menos partículas, animaciones reducidas */
  lowPerformanceMode: boolean;
}

/** Progresión global: XP y nivel (calculado). Niveles desbloquean bordes/títulos/badges. */
export interface Progression {
  totalXp: number;
}

/** Niveles no bloquean contenido; desbloquean bordes visuales, títulos, badges locales */
export const LEVEL_UNLOCKS: Record<number, { border?: boolean; title?: string; badge?: string }> = {
  1: { title: "Principiante" },
  3: { border: true, title: "Jugador" },
  5: { badge: "★", title: "Regular" },
  10: { border: true, badge: "★★", title: "Avanzado" },
  15: { title: "Experto" },
  20: { border: true, badge: "★★★", title: "Maestro" },
};

/** Estadísticas por juego (mejor score por modo, partidas, tiempo) */
export interface SnakeStats {
  bestScoreByMode: Partial<Record<"classic" | "timeAttack" | "hardcore", number>>;
  gamesPlayed: number;
  totalTimeMs: number;
}

/** Estadísticas Pong (partidas, victorias, derrotas, racha, survival, tiempo total) */
export interface PongStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  currentStreak: number;
  bestStreak: number;
  bestSurvivalTimeMs: number;
  totalTimeMs: number;
}

/** Estadísticas Breakout (mejor score por modo, nivel máximo, partidas, tiempo) */
export interface BreakoutStats {
  bestScoreByMode: Partial<Record<"campaign" | "endless" | "challenge", number>>;
  maxLevelReached: number;
  gamesPlayed: number;
  totalTimeMs: number;
}

/** Estadísticas Dodge Madness (mejor tiempo de supervivencia, partidas, tiempo total) */
export interface DodgeStats {
  bestSurvivalTimeMs: number;
  gamesPlayed: number;
  totalTimeMs: number;
}

/** Estadísticas Reactor Break (mejor pulsos, mejor racha, partidas, tiempo total) */
export interface ReactorStats {
  bestPulsesSurvived: number;
  bestCombo: number;
  gamesPlayed: number;
  totalTimeMs: number;
}

/** Estadísticas Orbit (mejor score, partidas, tiempo total) */
export interface OrbitStats {
  bestScore: number;
  gamesPlayed: number;
  totalTimeMs: number;
}

/** Estadísticas Pulse Dash (mejor distancia, partidas, tiempo total) */
export interface PulseDashStats {
  bestDistance: number;
  gamesPlayed: number;
  totalTimeMs: number;
}

/** Estadísticas Memory Glitch (mejor rondas, partidas, tiempo total) */
export interface MemoryGlitchStats {
  bestRounds: number;
  gamesPlayed: number;
  totalTimeMs: number;
}

/** Estadísticas Core Defense (mejor racha bloqueados, partidas, tiempo total) */
export interface CoreDefenseStats {
  bestStreak: number;
  gamesPlayed: number;
  totalTimeMs: number;
}

/** Estadísticas Shift (mejor tiempo supervivencia, partidas, tiempo total) */
export interface ShiftStats {
  bestSurvivalTimeMs: number;
  gamesPlayed: number;
  totalTimeMs: number;
}

/** Estadísticas Overload (mejor score, mejor racha, partidas, tiempo total) */
export interface OverloadStats {
  bestScore: number;
  bestCombo: number;
  gamesPlayed: number;
  totalTimeMs: number;
}

/** Estadísticas Polar (mejor score, mejor racha, partidas, tiempo total) */
export interface PolarStats {
  bestScore: number;
  bestCombo: number;
  gamesPlayed: number;
  totalTimeMs: number;
}

/** Rareza visual de logros — v3 */
export type AchievementRarity = "common" | "rare" | "legendary";

/** Definición de un logro (local, sin backend) — v3 con rareza */
export interface AchievementDef {
  id: string;
  icon: string;
  name: string;
  description: string;
  /** Juego específico o null = global */
  gameSlug: string | null;
  /** Rareza visual (común / raro / legendario) */
  rarity: AchievementRarity;
}

/** Estado de retos diarios (local, por fecha) */
export interface DailyChallengeState {
  /** Fechas (YYYY-MM-DD) en que el usuario completó el reto diario */
  completedDailyDates: string[];
  /** Partidas jugadas hoy (para reto "play_3_games") */
  dailyGamesPlayedCount: number;
  /** Fecha del último conteo (YYYY-MM-DD) para resetear al cambiar de día */
  dailyGamesPlayedDate: string;
  /** Fecha en que el usuario superó un récord hoy (para "beat_any_record"), o null */
  dailyBeatRecordDate: string | null;
}

/** Eventos que la plataforma maneja; los juegos emiten, no acceden al store directo */
export type GameEventType =
  | "gameStart"
  | "gameEnd"
  | "scoreUpdate"
  | "newRecord"
  | "levelUp"
  | "itemPurchased"
  | "itemEquipped";

export interface GameEventPayload {
  gameStart: { gameSlug: string };
  gameEnd: { gameSlug: string; score?: number; extra?: Record<string, number | string>; survivalTimeMs?: number; winner?: string };
  scoreUpdate: { gameSlug: string; score: number; extra?: Record<string, number | string> };
  newRecord: { gameSlug: string; kind: string; value: number | string };
  levelUp: { level: number };
  itemPurchased: { itemId: string; price: number };
  itemEquipped: { itemId: string; slot: EquipSlot };
}

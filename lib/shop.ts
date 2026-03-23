/**
 * Catálogo de la tienda MAD GAMES v4.
 * Todo permanente; precios en MAD Coins. Sin RNG, sin loot boxes.
 */

import type { ShopItem, ShopCategory, EquipSlot, ShopItemType } from "./types";

/** Pestañas de la tienda: una por tipo de cosmético (orden de navegación). */
export const SHOP_NAV_SECTIONS: {
  type: ShopItemType;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
}[] = [
  {
    type: "avatar",
    label: "Iconos de perfil",
    shortLabel: "Iconos",
    description: "El emoji que se ve en la barra y en tu perfil (comprás y equipás).",
    icon: "🙂",
  },
  {
    type: "theme",
    label: "Temas",
    shortLabel: "Temas",
    description: "Colores de fondo y ambiente de la app al navegar.",
    icon: "🎨",
  },
  {
    type: "cursor",
    label: "Cursores",
    shortLabel: "Cursores",
    description: "Estilo del puntero en la web.",
    icon: "👆",
  },
  {
    type: "title",
    label: "Títulos",
    shortLabel: "Títulos",
    description: "Textos junto a tu nombre: Arcader, Pro, Leyenda…",
    icon: "🏷️",
  },
  {
    type: "badge",
    label: "Badges",
    shortLabel: "Badges",
    description: "Iconos extra en la insignia de nivel.",
    icon: "✨",
  },
  {
    type: "soundPack",
    label: "Sonidos",
    shortLabel: "Sonidos",
    description: "Packs de sonidos de la interfaz (clics, equipar, etc.).",
    icon: "🔊",
  },
  {
    type: "screenEffect",
    label: "Luces y efectos",
    shortLabel: "Luces",
    description: "Flash, pulso de brillo, sacudida de pantalla al jugar.",
    icon: "💫",
  },
  {
    type: "border",
    label: "Bordes",
    shortLabel: "Bordes",
    description: "Marco alrededor de tu avatar en la navegación.",
    icon: "▢",
  },
];

/** Solo estos dos se eligen gratis en Perfil; el resto se compra en la tienda y se equipa. */
export const FREE_AVATAR_VALUES = ["🎮", "👤"] as const;

export function isFreeProfileAvatar(value: string): boolean {
  return (FREE_AVATAR_VALUES as readonly string[]).includes(value);
}

export const SHOP_ITEMS: ShopItem[] = [
  // —— Perfil: Avatares (excl. los 2 gratis en Perfil: 🎮 👤) ——
  { id: "avatar-snake", category: "profile", type: "avatar", name: "Serpiente", description: "Avatar serpiente (antes gratis)", price: 20, value: "🐍", icon: "🐍" },
  { id: "avatar-pong", category: "profile", type: "avatar", name: "Ping-pong", description: "Avatar raqueta", price: 20, value: "🏓", icon: "🏓" },
  { id: "avatar-brick", category: "profile", type: "avatar", name: "Ladrillo", description: "Avatar breakout", price: 20, value: "🧱", icon: "🧱" },
  { id: "avatar-joystick", category: "profile", type: "avatar", name: "Joystick", description: "Avatar arcade", price: 25, value: "🕹️", icon: "🕹️" },
  { id: "avatar-bolt", category: "profile", type: "avatar", name: "Rayo", description: "Avatar energía", price: 25, value: "⚡", icon: "⚡" },
  { id: "avatar-sparkle", category: "profile", type: "avatar", name: "Estrella", description: "Avatar brillo", price: 30, value: "🌟", icon: "🌟" },
  { id: "avatar-flame", category: "profile", type: "avatar", name: "Fuego", description: "Avatar fuego", price: 30, value: "🔥", icon: "🔥" },
  { id: "avatar-dart", category: "profile", type: "avatar", name: "Diana", description: "Avatar puntería", price: 25, value: "🎯", icon: "🎯" },
  { id: "avatar-crown", category: "profile", type: "avatar", name: "Corona", description: "Avatar exclusivo corona", price: 80, value: "👑", icon: "👑", minLevel: 5 },
  { id: "avatar-mask", category: "profile", type: "avatar", name: "Máscara", description: "Avatar exclusivo máscara", price: 45, value: "🎭", icon: "🎭" },
  { id: "avatar-robot", category: "profile", type: "avatar", name: "Robot", description: "Avatar exclusivo robot", price: 45, value: "🤖", icon: "🤖" },
  { id: "avatar-dragon", category: "profile", type: "avatar", name: "Dragón", description: "Avatar exclusivo dragón", price: 60, value: "🐲", icon: "🐲", minLevel: 3 },
  { id: "avatar-ring", category: "profile", type: "avatar", name: "Ring", description: "Avatar exclusivo ring", price: 55, value: "🎪", icon: "🎪" },
  // —— Perfil: Bordes ——
  { id: "border-red", category: "profile", type: "border", name: "Borde rojo", description: "Borde acento rojo", price: 30, value: "red", icon: "▢" },
  { id: "border-amber", category: "profile", type: "border", name: "Borde ámbar", description: "Borde ámbar", price: 40, value: "amber", icon: "▢" },
  { id: "border-emerald", category: "profile", type: "border", name: "Borde esmeralda", description: "Borde verde", price: 50, value: "emerald", icon: "▢" },
  { id: "border-gold", category: "profile", type: "border", name: "Borde dorado", description: "Borde dorado", price: 120, value: "gold", icon: "◆", minLevel: 5 },
  // —— Perfil: Títulos ——
  { id: "title-arcade", category: "profile", type: "title", name: "Arcader", description: "Título Arcader", price: 25, value: "Arcader", icon: "🏷️" },
  { id: "title-pro", category: "profile", type: "title", name: "Pro", description: "Título Pro", price: 50, value: "Pro", icon: "🏷️" },
  { id: "title-master", category: "profile", type: "title", name: "Maestro", description: "Título Maestro", price: 100, value: "Maestro", icon: "🏷️", minLevel: 3 },
  { id: "title-legend", category: "profile", type: "title", name: "Leyenda", description: "Título Leyenda", price: 200, value: "Leyenda", icon: "🏷️", minLevel: 10 },
  // —— Perfil: Badges ——
  { id: "badge-heart", category: "profile", type: "badge", name: "Corazón", description: "Badge corazón", price: 15, value: "❤️", icon: "❤️" },
  { id: "badge-skull", category: "profile", type: "badge", name: "Calavera", description: "Badge calavera", price: 25, value: "💀", icon: "💀" },
  { id: "badge-trophy", category: "profile", type: "badge", name: "Trofeo", description: "Badge trofeo", price: 60, value: "🏆", icon: "🏆" },
  { id: "badge-diamond", category: "profile", type: "badge", name: "Diamante", description: "Badge diamante", price: 150, value: "💎", icon: "💎", minLevel: 5 },
  // —— Plataforma: Temas ——
  { id: "theme-midnight", category: "platform", type: "theme", name: "Medianoche", description: "Tema azul oscuro", price: 40, value: "midnight", icon: "🌙" },
  { id: "theme-forest", category: "platform", type: "theme", name: "Bosque", description: "Tema verde oscuro", price: 40, value: "forest", icon: "🌲" },
  { id: "theme-sunset", category: "platform", type: "theme", name: "Atardecer", description: "Tema naranja suave", price: 50, value: "sunset", icon: "🌅" },
  { id: "theme-neon", category: "platform", type: "theme", name: "Neón", description: "Tema neón arcade", price: 80, value: "neon", icon: "✨", minLevel: 3 },
  // —— Plataforma: Cursores ——
  { id: "cursor-crosshair", category: "platform", type: "cursor", name: "Mira", description: "Cursor estilo mira de precisión", price: 25, value: "crosshair", icon: "🎯" },
  { id: "cursor-pointer", category: "platform", type: "cursor", name: "Mano", description: "Cursor mano retro", price: 20, value: "pointer", icon: "👆" },
  { id: "cursor-cell", category: "platform", type: "cursor", name: "Celda", description: "Cursor estilo pixelado", price: 30, value: "cell", icon: "⊞" },
  { id: "cursor-glow", category: "platform", type: "cursor", name: "Brillo", description: "Cursor con glow neón", price: 60, value: "glow", icon: "✨", minLevel: 2 },
  // —— Plataforma: Sonidos UI ——
  { id: "sound-arcade", category: "platform", type: "soundPack", name: "Arcade Clásico", description: "Sonidos 8-bit retro", price: 35, value: "arcade", icon: "🔊" },
  { id: "sound-minimal", category: "platform", type: "soundPack", name: "Minimal", description: "Sonidos suaves y sutiles", price: 30, value: "minimal", icon: "🔈" },
  { id: "sound-synth", category: "platform", type: "soundPack", name: "Synth", description: "Sonidos electrónicos modernos", price: 45, value: "synth", icon: "🎹", minLevel: 2 },
  // —— Plataforma: Efectos de pantalla ——
  { id: "effect-shake", category: "platform", type: "screenEffect", name: "Screen Shake", description: "Sacudida suave en impactos", price: 40, value: "shake", icon: "📳" },
  { id: "effect-flash", category: "platform", type: "screenEffect", name: "Flash", description: "Destello al marcar puntos", price: 35, value: "flash", icon: "⚡" },
  { id: "effect-glow", category: "platform", type: "screenEffect", name: "Glow Pulse", description: "Pulso de brillo en eventos", price: 50, value: "glow", icon: "💫", minLevel: 2 },
];

export function getShopItemsByType(type: ShopItemType): ShopItem[] {
  return SHOP_ITEMS.filter((i) => i.type === type);
}

export function getShopItemById(id: string): ShopItem | undefined {
  return SHOP_ITEMS.find((i) => i.id === id);
}

export function getShopItemsByCategory(category: ShopCategory): ShopItem[] {
  return SHOP_ITEMS.filter((i) => i.category === category);
}

export function getEquipSlotForItemType(type: ShopItem["type"]): EquipSlot | null {
  const map: Record<ShopItem["type"], EquipSlot | null> = {
    avatar: "avatar",
    border: "border",
    title: "title",
    badge: "badge",
    theme: "theme",
    cursor: "cursor",
    soundPack: "soundPack",
    screenEffect: "screenEffect",
    ui: null,
    effect: null,
    gameSkin: null,
  };
  return map[type] ?? null;
}

/** Categoría legacy por dominio (perfil vs plataforma); la UI usa `SHOP_NAV_SECTIONS`. */
export const SHOP_CATEGORIES: { id: ShopCategory; label: string; icon: string }[] = [
  { id: "profile", label: "Perfil", icon: "🎨" },
  { id: "platform", label: "Plataforma", icon: "🎮" },
  { id: "games", label: "Juegos", icon: "⚛️" },
];

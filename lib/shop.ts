/**
 * Catálogo de la tienda MAD GAMES v4.
 * Todo permanente; precios en MAD Coins. Sin RNG, sin loot boxes.
 */

import type { ShopItem, ShopCategory, EquipSlot } from "./types";

/** Avatares que ya son gratuitos en Perfil (no vender en tienda) */
export const FREE_AVATAR_VALUES = ["🎮", "🐍", "🏓", "🧱", "🕹️", "⚡", "🌟", "🔥", "👤", "🎯"];

export const SHOP_ITEMS: ShopItem[] = [
  // —— Perfil: Avatares (solo exclusivos; los de perfil son gratis) ——
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
];

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
    ui: null,
    effect: null,
    gameSkin: null,
  };
  return map[type] ?? null;
}

export const SHOP_CATEGORIES: { id: ShopCategory; label: string; icon: string }[] = [
  { id: "profile", label: "Perfil", icon: "🎨" },
  { id: "platform", label: "Plataforma", icon: "🎮" },
  { id: "games", label: "Juegos", icon: "⚛️" },
];

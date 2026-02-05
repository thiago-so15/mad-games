"use client";

import { useState } from "react";
import { useStore, getXpToNextLevel } from "@/lib/store";
import { SHOP_ITEMS, SHOP_CATEGORIES, getShopItemById } from "@/lib/shop";
import type { ShopCategory, ShopItemState, EquipSlot, EquippedItems } from "@/lib/types";

function getItemState(
  item: { id: string; price: number; minLevel?: number },
  madCoins: number,
  level: number,
  purchasedIds: string[],
  equippedObj: EquippedItems
): ShopItemState {
  if (purchasedIds.includes(item.id)) {
    const isEquipped = Object.values(equippedObj).includes(item.id);
    return isEquipped ? "equipped" : "purchased";
  }
  if (item.minLevel != null && level < item.minLevel) return "locked";
  if (madCoins >= item.price) return "available";
  return "locked";
}

export default function ShopPage() {
  const [category, setCategory] = useState<ShopCategory>("profile");
  const wallet = useStore((s) => s.wallet);
  const inventory = useStore((s) => s.inventory);
  const totalXp = useStore((s) => s.progression.totalXp);
  const purchaseItem = useStore((s) => s.purchaseItem);
  const equipItem = useStore((s) => s.equipItem);
  const unequipSlot = useStore((s) => s.unequipSlot);

  const { level } = getXpToNextLevel(totalXp);
  const madCoins = wallet?.madCoins ?? 0;
  const purchased = inventory?.purchasedItemIds ?? [];
  const equipped: EquippedItems = inventory?.equipped ?? { avatar: null, border: null, title: null, badge: null, theme: null, cursor: null, soundPack: null, screenEffect: null };

  const items = SHOP_ITEMS.filter((i) => i.category === category);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Tienda</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Comprá con MAD Coins. Todo es permanente. No afecta el gameplay.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800/50">
        <span className="text-lg font-semibold text-amber-600 dark:text-amber-400">
          {madCoins} <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">MAD Coins</span>
        </span>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Ganás monedas jugando, superando récords y subiendo de nivel.
        </p>
      </div>

      <div className="mt-8 flex gap-2 border-b border-zinc-200 dark:border-zinc-700">
        {SHOP_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
              category === c.id
                ? "border-red-500 text-red-600 dark:border-red-400 dark:text-red-400"
                : "border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
            }`}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const state = getItemState(item, madCoins, level, purchased, equipped);
          const isLocked = state === "locked";
          const isAvailable = state === "available";
          const isPurchased = state === "purchased";
          const isEquipped = state === "equipped";

          return (
            <li
              key={item.id}
              className={`rounded-xl border p-4 transition-arcade ${
                isEquipped
                  ? "border-amber-500/60 bg-amber-500/10 dark:border-amber-400/50 dark:bg-amber-500/10"
                  : isLocked
                    ? "border-zinc-200 bg-zinc-50/80 dark:border-zinc-700 dark:bg-zinc-800/30 opacity-90"
                    : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800/50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-3xl" role="img" aria-hidden>
                  {item.icon ?? item.value}
                </span>
                {item.minLevel != null && level < item.minLevel && (
                  <span className="rounded bg-zinc-200 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                    Nv.{item.minLevel}
                  </span>
                )}
              </div>
              <h3 className="mt-2 font-semibold text-zinc-900 dark:text-white">{item.name}</h3>
              <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{item.description}</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  {item.price} MAD
                </span>
                <div className="flex gap-2">
                  {isAvailable && (
                    <button
                      type="button"
                      onClick={() => purchaseItem(item.id)}
                      className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-medium text-zinc-900 transition hover:bg-amber-400"
                    >
                      Comprar
                    </button>
                  )}
                  {isPurchased && (
                    <button
                      type="button"
                      onClick={() => equipItem(item.id)}
                      className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                      Equipar
                    </button>
                  )}
                  {isEquipped && (
                    <button
                      type="button"
                      onClick={() => {
                        const entry = (Object.entries(equipped) as [EquipSlot, string | null][]).find(([, id]) => id === item.id);
                        if (entry) unequipSlot(entry[0]);
                      }}
                      className="rounded-lg border border-amber-500/50 bg-amber-500/20 px-3 py-1.5 text-sm font-medium text-amber-700 dark:text-amber-400"
                    >
                      Equipado
                    </button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {items.length === 0 && (
        <p className="mt-8 text-center text-zinc-500 dark:text-zinc-400">
          No hay ítems en esta categoría todavía.
        </p>
      )}

      <section className="mt-12 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-800/30">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Inventario</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Todo lo comprado queda en tu inventario. Equipá y desequipá cuando quieras.
        </p>
        {purchased.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Aún no compraste nada. Jugá para ganar MAD Coins.
          </p>
        ) : (
          <ul className="mt-4 flex flex-wrap gap-2">
            {purchased.map((id) => {
              const item = getShopItemById(id);
              if (!item) return null;
              const isEquipped = Object.values(equipped).includes(id);
              return (
                <li
                  key={id}
                  className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
                >
                  <span className="text-xl">{item.icon ?? item.value}</span>
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{item.name}</span>
                  {isEquipped ? (
                    <span className="text-xs text-amber-600 dark:text-amber-400">Equipado</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => equipItem(id)}
                      className="text-xs font-medium text-red-600 hover:underline dark:text-red-400"
                    >
                      Equipar
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useStore, getXpToNextLevel } from "@/lib/store";
import { SHOP_NAV_SECTIONS, getShopItemById, getShopItemsByType } from "@/lib/shop";
import { playSound } from "@/lib/sounds";
import type { ShopItemState, EquipSlot, EquippedItems, ShopItemType } from "@/lib/types";

/** Vista previa aproximada del fondo por tema (solo UI tienda). */
const THEME_PREVIEW: Record<string, string> = {
  midnight: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
  forest: "linear-gradient(135deg, #052e16 0%, #14532d 100%)",
  sunset: "linear-gradient(135deg, #431407 0%, #c2410c 55%, #fb923c 100%)",
  neon: "linear-gradient(135deg, #1a0a2e 0%, #4c1d95 40%, #db2777 100%)",
};

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
  const [section, setSection] = useState<ShopItemType>("avatar");
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
  const handleEquip = (itemId: string) => {
    const item = getShopItemById(itemId);
    if (!item) return;
    // Disparar sonido en el click del usuario para evitar bloqueos de autoplay.
    playSound("equip", {
      packItemId: item.type === "soundPack" ? item.id : (equipped.soundPack ?? undefined),
    });
    equipItem(itemId);
  };

  const items = useMemo(() => getShopItemsByType(section), [section]);
  const sectionMeta = SHOP_NAV_SECTIONS.find((s) => s.type === section);
  const itemCountByType = useMemo(() => {
    const m = new Map<ShopItemType, number>();
    for (const s of SHOP_NAV_SECTIONS) {
      m.set(s.type, getShopItemsByType(s.type).length);
    }
    return m;
  }, []);

  const purchasedSorted = useMemo(() => {
    const order = SHOP_NAV_SECTIONS.map((s) => s.type);
    return [...purchased].sort((a, b) => {
      const ia = getShopItemById(a);
      const ib = getShopItemById(b);
      const oa = ia ? order.indexOf(ia.type) : 99;
      const ob = ib ? order.indexOf(ib.type) : 99;
      if (oa !== ob) return oa - ob;
      return a.localeCompare(b);
    });
  }, [purchased]);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Tienda</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Elegí una categoría abajo: iconos, temas, cursores, títulos, badges, sonidos, luces y bordes. Todo es permanente con MAD
        Coins; no afecta el gameplay.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800/50">
        <span className="text-lg font-semibold text-amber-600 dark:text-amber-400">
          {madCoins} <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">MAD Coins</span>
        </span>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Ganás monedas jugando, superando récords y subiendo de nivel.
        </p>
      </div>

      <nav className="mt-8 -mx-1 overflow-x-auto pb-1" aria-label="Categorías de la tienda">
        <div className="flex min-w-min flex-nowrap gap-2 px-1 sm:flex-wrap">
          {SHOP_NAV_SECTIONS.map((s) => {
            const count = itemCountByType.get(s.type) ?? 0;
            const active = section === s.type;
            return (
              <button
                key={s.type}
                type="button"
                onClick={() => setSection(s.type)}
                className={`shrink-0 rounded-xl border px-3 py-2 text-left text-sm font-medium transition ${
                  active
                    ? "border-red-500 bg-red-500/10 text-red-700 dark:border-red-400 dark:bg-red-500/15 dark:text-red-300"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:border-zinc-600"
                }`}
              >
                <span className="mr-1.5" aria-hidden>
                  {s.icon}
                </span>
                {s.shortLabel}
                <span className="ml-1 text-xs font-normal opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </nav>

      {sectionMeta && (
        <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800/40">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            <span className="mr-2" aria-hidden>
              {sectionMeta.icon}
            </span>
            {sectionMeta.label}
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{sectionMeta.description}</p>
        </div>
      )}

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
                {item.type === "theme" && THEME_PREVIEW[item.value] ? (
                  <span
                    className="h-12 w-12 shrink-0 rounded-lg border border-zinc-200 shadow-inner dark:border-zinc-600"
                    style={{ background: THEME_PREVIEW[item.value] }}
                    title={item.name}
                    aria-hidden
                  />
                ) : (
                  <span className="text-3xl" role="img" aria-hidden>
                    {item.icon ?? item.value}
                  </span>
                )}
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
                      onClick={() => handleEquip(item.id)}
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
            {purchasedSorted.map((id) => {
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
                      onClick={() => handleEquip(id)}
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

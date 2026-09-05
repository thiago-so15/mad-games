"use client";

import { useState } from "react";
import { StoreItem } from "@/apps/store/StoreItem";
import { STORE_CATALOG, STORE_CATEGORIES } from "@/data/store-catalog";
import { useOsStore } from "@/store/os-store";
import type { StoreCategory, StoreItemStatus } from "@/types/os";

export function StoreApp() {
  const [category, setCategory] = useState<StoreCategory>("wallpaper");
  const coins = useOsStore((s) => s.coins);
  const inventory = useOsStore((s) => s.inventory);
  const purchaseItem = useOsStore((s) => s.purchaseItem);
  const equipItem = useOsStore((s) => s.equipItem);

  const items = STORE_CATALOG.filter((item) => item.category === category);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-white">MAD Store</h2>
          <p className="text-[11px] text-zinc-500">Fictional Mad Coins only. No real money.</p>
        </div>
        <p className="rounded-full border border-red-500/30 bg-red-600/15 px-3 py-1 text-xs text-red-200">
          {coins} MC
        </p>
      </div>
      <div className="flex gap-1 overflow-x-auto border-b border-white/10 px-3 py-2">
        {STORE_CATEGORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCategory(item.id)}
            className={`shrink-0 rounded-md px-2 py-1 text-xs ${category === item.id ? "bg-red-600 text-white" : "text-zinc-300 hover:bg-white/5"}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-auto p-3 sm:grid-cols-2">
        {items.map((item) => {
          const owned = inventory.purchasedItemIds.includes(item.id);
          const equipped = inventory.equipped[item.category] === item.id;
          const status: StoreItemStatus = equipped ? "equipped" : owned ? "purchased" : "available";
          return (
            <StoreItem
              key={item.id}
              item={item}
              status={status}
              onBuy={() => purchaseItem(item.id)}
              onEquip={() => equipItem(item.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

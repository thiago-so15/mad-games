"use client";

import { Button } from "@/components/ui/Button";
import type { StoreCatalogItem, StoreItemStatus } from "@/types/os";

interface StoreItemProps {
  item: StoreCatalogItem;
  status: StoreItemStatus;
  onBuy: () => void;
  onEquip: () => void;
}

export function StoreItem({ item, status, onBuy, onEquip }: StoreItemProps) {
  return (
    <article className="flex flex-col rounded-xl border border-white/10 bg-black/25 p-3">
      <div className="flex items-start justify-between gap-2">
        <span className="text-lg" aria-hidden>
          {item.icon}
        </span>
        <StatusBadge status={status} />
      </div>
      <h3 className="mt-2 text-sm font-semibold text-white">{item.name}</h3>
      <p className="mt-1 flex-1 text-xs text-zinc-400">{item.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-zinc-300">{item.price === 0 ? "Included" : `${item.price} MC`}</p>
        {status === "available" ? (
          <Button variant="primary" onClick={onBuy}>
            Buy
          </Button>
        ) : status === "purchased" ? (
          <Button onClick={onEquip}>Equip</Button>
        ) : (
          <Button disabled>Equipped</Button>
        )}
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: StoreItemStatus }) {
  const label = status === "available" ? "Available" : status === "purchased" ? "Purchased" : "Equipped";
  const cls =
    status === "equipped"
      ? "bg-red-600/20 text-red-200"
      : status === "purchased"
        ? "bg-white/10 text-zinc-200"
        : "bg-zinc-800 text-zinc-400";
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${cls}`}>{label}</span>;
}

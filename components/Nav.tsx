"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useStore, getXpToNextLevel } from "@/lib/store";
import { getShopItemById } from "@/lib/shop";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/games", label: "Juegos" },
  { href: "/shop", label: "Tienda" },
  { href: "/profile", label: "Perfil" },
  { href: "/settings", label: "Ajustes" },
];

export function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const profile = useStore((s) => s.profile);
  const inventory = useStore((s) => s.inventory);
  const wallet = useStore((s) => s.wallet);
  const totalXp = useStore((s) => s.progression.totalXp);
  const { level } = getXpToNextLevel(totalXp);

  const equippedAvatarId = inventory?.equipped?.avatar ?? null;
  const equippedBorderId = inventory?.equipped?.border ?? null;
  const equippedTitleId = inventory?.equipped?.title ?? null;
  const equippedBadgeId = inventory?.equipped?.badge ?? null;
  const displayAvatar = equippedAvatarId
    ? (getShopItemById(equippedAvatarId)?.value ?? profile.avatar)
    : profile.avatar;
  const displayTitle = equippedTitleId ? getShopItemById(equippedTitleId)?.value : null;
  const displayBadge = equippedBadgeId ? getShopItemById(equippedBadgeId)?.value : null;
  const borderValue = equippedBorderId ? getShopItemById(equippedBorderId)?.value : null;
  const borderClass =
    borderValue === "gold"
      ? "border-amber-400 bg-amber-500/20 dark:border-amber-400/70"
      : borderValue === "emerald"
        ? "border-emerald-400/70 bg-emerald-500/10 dark:border-emerald-400/50"
        : borderValue === "amber"
          ? "border-amber-400/70 bg-amber-500/10 dark:border-amber-500/30"
          : borderValue === "red"
            ? "border-red-400/60 bg-red-500/10 dark:border-red-500/50"
            : level >= 3
              ? "border-red-400/60 bg-red-500/10 dark:border-red-500/50 dark:bg-red-500/10"
              : "border-zinc-300 bg-zinc-200/80 dark:border-zinc-600 dark:bg-zinc-800/80";
  const madCoins = wallet?.madCoins ?? 0;

  const isInGame = pathname.startsWith("/games/") && pathname !== "/games";

  return (
    <nav
      className="border-b border-zinc-200 bg-white/95 dark:border-zinc-700 dark:bg-zinc-800/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-zinc-800/80"
      role="navigation"
    >
      <div className="mx-auto max-w-6xl px-3 pb-2 pt-2 sm:px-6 sm:pb-0 sm:pt-0">
        <div className="flex h-11 items-center justify-between sm:h-14">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900 transition-arcade hover-lift dark:text-white"
            aria-label="MAD GAMES - Inicio"
          >
            <Image
              src="/mad-games-logo-tr.png"
              alt=""
              width={40}
              height={40}
              className="h-8 w-8 rounded object-contain sm:h-9 sm:w-9"
            />
            <span className="hidden text-zinc-900 dark:text-white sm:inline"><span className="text-red-500 dark:text-red-400">MAD</span> GAMES</span>
          </Link>

          <ul className="hidden items-center gap-2 sm:flex">
            {links.map(({ href, label }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <li key={href} className="shrink-0">
                  <Link
                    href={href}
                    className={`block rounded-md px-3 py-1.5 text-sm font-medium transition-arcade ${
                      isActive
                        ? "bg-red-500/15 text-red-600 dark:bg-zinc-700 dark:text-red-400"
                        : "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              href="/shop"
              className="flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 transition-arcade hover:bg-amber-500/20 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20 sm:text-sm"
            >
              <span aria-hidden>🪙</span>
              <span>{madCoins}</span>
            </Link>
            <div className={`flex items-center gap-1 rounded-full border px-2 py-1 transition-arcade ${borderClass}`}>
              <span className="text-base" aria-hidden>{displayAvatar}</span>
              <span className="hidden items-center gap-1 sm:flex">
                {displayBadge && <span className="text-xs" aria-hidden>{displayBadge}</span>}
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Nv.{level}
                  {displayTitle ? ` · ${displayTitle}` : ""}
                </span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="rounded-md border border-zinc-300 px-2 py-1 text-xs text-zinc-700 dark:border-zinc-600 dark:text-zinc-200 sm:hidden"
              aria-label="Abrir menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <ul className="mt-2 space-y-1 sm:hidden">
            {links.map(({ href, label }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block rounded-md px-3 py-2 text-sm font-medium transition-arcade ${
                      isActive
                        ? "bg-red-500/15 text-red-600 dark:bg-zinc-700 dark:text-red-400"
                        : "text-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {isInGame && (
        <div className="border-t border-zinc-200 bg-red-500/10 dark:border-zinc-800 dark:bg-red-500/10">
          <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-1.5 text-sm text-red-800 dark:text-red-200">
            <span>Jugando</span>
            <Link
              href="/games"
              className="font-medium underline underline-offset-2 hover:no-underline"
            >
              Volver al catálogo
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

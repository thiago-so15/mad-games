"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore, getXpToNextLevel } from "@/lib/store";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/games", label: "Juegos" },
  { href: "/profile", label: "Perfil" },
  { href: "/settings", label: "Ajustes" },
];

export function Nav() {
  const pathname = usePathname();
  const profile = useStore((s) => s.profile);
  const totalXp = useStore((s) => s.progression.totalXp);
  const { level } = getXpToNextLevel(totalXp);

  const isInGame = pathname.startsWith("/games/") && pathname !== "/games";

  return (
    <nav
      className="border-b border-zinc-200 bg-zinc-100/95 dark:border-zinc-800 dark:bg-zinc-900/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-100/80 dark:supports-[backdrop-filter]:bg-zinc-900/80"
      role="navigation"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900 transition-arcade hover-lift dark:text-white"
        >
          <span className="text-red-500 dark:text-red-400" aria-hidden>◆</span>
          <span className="text-zinc-900 dark:text-white"><span className="text-red-500 dark:text-red-400">MAD</span> GAMES</span>
        </Link>
        <ul className="flex items-center gap-1 sm:gap-2">
          {links.map(({ href, label }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-arcade sm:px-4 ${
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
          <li className="ml-2 flex items-center gap-1.5 rounded-full border border-zinc-300 bg-zinc-200/80 px-2.5 py-1 dark:border-zinc-600 dark:bg-zinc-800/80">
            <span className="text-lg" aria-hidden>{profile.avatar}</span>
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Nv.{level}
            </span>
          </li>
        </ul>
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

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/games", label: "Juegos" },
  { href: "/profile", label: "Perfil" },
  { href: "/settings", label: "Ajustes" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav
      className="border-b border-zinc-800 bg-zinc-900/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/80"
      role="navigation"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-white transition hover:text-amber-400"
        >
          Mad Games
        </Link>
        <ul className="flex items-center gap-1 sm:gap-2">
          {links.map(({ href, label }) => {
            const isActive =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition sm:px-4 ${
                    isActive
                      ? "bg-zinc-700 text-amber-400"
                      : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { Nav } from "@/components/Nav";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CursorProvider } from "@/components/CursorProvider";

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isShell = pathname === "/" || pathname === "/os" || pathname.startsWith("/os/");

  if (isShell) {
    return <>{children}</>;
  }

  return (
    <>
      <ThemeProvider />
      <CursorProvider />
      <Nav />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </>
  );
}

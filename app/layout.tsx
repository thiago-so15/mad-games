import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/Nav";
import { StoreHydration } from "@/components/StoreHydration";
import { ThemeProvider } from "@/components/ThemeProvider";
import { UnlockReveal } from "@/components/UnlockReveal";
import { UnlockMessage } from "@/components/UnlockMessage";
import { SessionReset } from "@/components/SessionReset";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MAD GAMES v4 — Arcade",
  description: "Arcade moderno. Múltiples juegos, una plataforma. XP, niveles, logros. Sin backend.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 transition-colors duration-200`}
      >
        <StoreHydration />
        <ThemeProvider />
        <SessionReset />
        <UnlockReveal />
        <UnlockMessage />
        <Nav />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          {children}
        </main>
      </body>
    </html>
  );
}

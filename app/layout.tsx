import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/Nav";
import { StoreHydration } from "@/components/StoreHydration";
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
  title: "Mad Games — Plataforma de juegos",
  description: "Juegos online en un solo lugar. Snake y más.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased bg-zinc-950 text-zinc-100`}
      >
        <StoreHydration />
        <Nav />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          {children}
        </main>
      </body>
    </html>
  );
}

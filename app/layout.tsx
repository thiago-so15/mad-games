import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { StoreHydration } from "@/components/StoreHydration";
import { UnlockReveal } from "@/components/UnlockReveal";
import { UnlockMessage } from "@/components/UnlockMessage";
import { SessionReset } from "@/components/SessionReset";
import { EffectsProvider } from "@/components/EffectsProvider";
import { VisualEffectsProvider } from "@/components/VisualEffectsProvider";
import { AppFrame } from "@/components/AppFrame";
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
  title: "MAD",
  description: "MAD GAMES y MAD OS. Arcade y sistema operativo local, sin backend.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200`}
      >
        <StoreHydration />
        <VisualEffectsProvider />
        <SessionReset />
        <EffectsProvider>
          <UnlockReveal />
          <UnlockMessage />
          <AppFrame>{children}</AppFrame>
        </EffectsProvider>
        <Analytics />
      </body>
    </html>
  );
}

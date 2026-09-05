"use client";

import type { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <section className="space-y-3">
      <header>
        <h3 className="text-sm font-semibold tracking-wide text-zinc-100 uppercase">{title}</h3>
        {description ? <p className="mt-1 text-xs text-zinc-400">{description}</p> : null}
      </header>
      <div className="rounded-xl border border-white/10 bg-white/5 p-3">{children}</div>
    </section>
  );
}

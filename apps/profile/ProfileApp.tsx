"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { OS_ACHIEVEMENTS } from "@/data/achievements";
import { useStore, getXpToNextLevel } from "@/lib/store";
import { useOsStore } from "@/store/os-store";

export function ProfileApp() {
  const user = useOsStore((s) => s.user);
  const coins = useOsStore((s) => s.coins);
  const achievements = useOsStore((s) => s.achievements);
  const installedAt = useOsStore((s) => s.system.installedAt);
  const setUsername = useOsStore((s) => s.setUsername);
  const totalGames = useStore((s) => s.getGlobalStats().totalGames);
  const totalXp = useStore((s) => s.progression.totalXp);
  const [name, setName] = useState(user.displayName);

  const level = getXpToNextLevel(totalXp).level || 1;
  const avatar = useMemo(() => buildAvatar(user.avatarSeed || user.displayName), [user.avatarSeed, user.displayName]);
  const completed = Math.max(0, Math.floor(totalGames / 3));

  return (
    <div className="h-full overflow-auto p-4">
      <div className="flex items-center gap-4">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-semibold text-white"
          style={{ background: avatar.background }}
          aria-hidden
        >
          {avatar.initials}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-zinc-500">MAD OS user</p>
          <p className="truncate text-lg font-semibold text-white">{user.displayName}</p>
          <p className="text-xs text-zinc-400">Level {level}</p>
        </div>
      </div>

      <label className="mt-5 block text-xs text-zinc-400" htmlFor="os-username">
        Display name
      </label>
      <div className="mt-1 flex gap-2">
        <input
          id="os-username"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="min-w-0 flex-1 rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-red-500"
        />
        <Button variant="primary" onClick={() => setUsername(name)}>
          Save
        </Button>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-2 text-sm">
        <Stat label="Mad Coins" value={`${coins}`} />
        <Stat label="Games played" value={`${totalGames}`} />
        <Stat label="Games completed" value={`${completed}`} />
        <Stat label="Installed" value={new Date(installedAt).toLocaleDateString()} />
      </dl>

      <h3 className="mt-6 text-xs font-semibold tracking-wide text-zinc-400 uppercase">Achievements</h3>
      <ul className="mt-2 space-y-2">
        {OS_ACHIEVEMENTS.map((item) => {
          const unlocked = achievements.includes(item.id);
          return (
            <li
              key={item.id}
              className={`rounded-lg border px-3 py-2 ${unlocked ? "border-red-500/40 bg-red-600/10" : "border-white/10 opacity-60"}`}
            >
              <p className="text-sm text-white">
                {item.icon} {item.name}
              </p>
              <p className="text-xs text-zinc-400">{item.description}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
      <dt className="text-[11px] text-zinc-500">{label}</dt>
      <dd className="text-sm text-zinc-100">{value}</dd>
    </div>
  );
}

function buildAvatar(seed: string): { initials: string; background: string } {
  const parts = seed.trim().split(/[\s.]+/).filter(Boolean);
  const initials = ((parts[0]?.[0] ?? "M") + (parts[1]?.[0] ?? "O")).toUpperCase();
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return {
    initials,
    background: `linear-gradient(135deg, hsl(${hue}, 55%, 28%), hsl(0, 72%, 38%))`,
  };
}

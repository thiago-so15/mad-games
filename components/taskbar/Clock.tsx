"use client";

import { useClock } from "@/hooks/useClock";
import { useOsStore } from "@/store/os-store";

export function Clock() {
  const now = useClock();
  const open = useOsStore((s) => s.clockOpen);
  const setClockOpen = useOsStore((s) => s.setClockOpen);
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const date = now.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`Clock ${time}. Show date`}
        aria-expanded={open}
        onClick={(event) => {
          event.stopPropagation();
          setClockOpen(!open);
        }}
        className="rounded-md px-2 py-1 font-mono text-xs hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      >
        {time}
      </button>
      {open ? (
        <div className="os-panel absolute right-0 bottom-11 w-56 rounded-lg border p-3 text-sm shadow-xl">
          <p className="font-mono text-2xl">{time}</p>
          <p className="mt-1 text-xs text-zinc-400">{date}</p>
        </div>
      ) : null}
    </div>
  );
}

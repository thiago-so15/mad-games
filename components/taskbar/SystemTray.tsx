"use client";

import { useBattery } from "@/hooks/useBattery";

export function BatteryIndicator() {
  const level = useBattery();
  const chargingLook = level > 20;
  return (
    <div
      className="flex items-center gap-1 rounded-md px-1.5 py-1"
      title="Simulated battery"
      aria-label={`Battery ${level} percent`}
    >
      <span className="relative block h-3 w-5 rounded-[2px] border border-current">
        <span
          className={`absolute inset-0.5 ${chargingLook ? "bg-current opacity-80" : "bg-red-500"}`}
          style={{ width: `${Math.max(12, level)}%` }}
        />
      </span>
      <span className="hidden font-mono text-[10px] sm:inline">{level}%</span>
    </div>
  );
}

export function NetworkIndicator() {
  return (
    <div className="flex items-center rounded-md px-1.5 py-1" aria-label="Connected" title="Simulated connection">
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
        <path
          d="M2 10.5 8 4.5l6 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path d="M5 11.5 8 8.5l3 3" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="8" cy="13" r="0.8" fill="currentColor" />
      </svg>
    </div>
  );
}

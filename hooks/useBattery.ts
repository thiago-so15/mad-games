"use client";

import { useEffect, useState } from "react";

export function useBattery(start = 87): number {
  const [level, setLevel] = useState(start);
  useEffect(() => {
    const id = window.setInterval(() => {
      setLevel((current) => Math.max(8, current - 1));
    }, 48_000);
    return () => window.clearInterval(id);
  }, []);
  return level;
}

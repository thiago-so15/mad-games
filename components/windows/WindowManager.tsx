"use client";

import { Window } from "@/components/windows/Window";
import { useOsStore } from "@/store/os-store";

export function WindowManager() {
  const windows = useOsStore((s) => s.windows);
  return (
    <div className="pointer-events-none absolute inset-0 z-20 [&>*]:pointer-events-auto">
      {windows.map((win) => (
        <Window key={win.id} win={win} />
      ))}
    </div>
  );
}

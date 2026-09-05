"use client";

import { useEffect } from "react";
import { BootScreen } from "@/components/os/BootScreen";
import { ThemeApplier } from "@/components/os/ThemeApplier";
import { Desktop } from "@/components/desktop/Desktop";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useOsStore } from "@/store/os-store";

export function MadOS() {
  const hydrated = useOsStore((s) => s.hydrated);
  const hasBooted = useOsStore((s) => s.system.hasBooted);
  const theme = useOsStore((s) => s.settings.theme);
  const setHydrated = useOsStore((s) => s.setHydrated);

  useEffect(() => {
    const finish = () => setHydrated(true);
    const unsub = useOsStore.persist.onFinishHydration(finish);
    useOsStore.persist.rehydrate();
    if (useOsStore.persist.hasHydrated()) finish();
    return unsub;
  }, [setHydrated]);

  useKeyboardShortcuts();

  if (!hydrated) {
    return <div className="h-full w-full bg-black" />;
  }

  return (
    <div className="mad-os h-full w-full overflow-hidden" data-os-theme={theme}>
      <ThemeApplier />
      {hasBooted ? <Desktop /> : <BootScreen />}
    </div>
  );
}

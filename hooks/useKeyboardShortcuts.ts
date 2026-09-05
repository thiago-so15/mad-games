"use client";

import { useEffect } from "react";
import { useOsStore } from "@/store/os-store";

export function useKeyboardShortcuts() {
  const openApp = useOsStore((s) => s.openApp);
  const closeActiveWindow = useOsStore((s) => s.closeActiveWindow);
  const modal = useOsStore((s) => s.modal);
  const setModal = useOsStore((s) => s.setModal);
  const setStartMenuOpen = useOsStore((s) => s.setStartMenuOpen);
  const setClockOpen = useOsStore((s) => s.setClockOpen);
  const setTrayOpen = useOsStore((s) => s.setTrayOpen);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (event.key === "Escape") {
        if (modal) {
          setModal(null);
          return;
        }
        setStartMenuOpen(false);
        setClockOpen(false);
        setTrayOpen(false);
        return;
      }

      if (event.altKey && event.key === "F4") {
        event.preventDefault();
        closeActiveWindow();
        return;
      }

      if (event.ctrlKey && event.altKey && key === "t") {
        event.preventDefault();
        openApp("terminal");
        return;
      }

      if (event.ctrlKey && event.shiftKey && key === "s") {
        event.preventDefault();
        openApp("settings");
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeActiveWindow, modal, openApp, setClockOpen, setModal, setStartMenuOpen, setTrayOpen]);
}

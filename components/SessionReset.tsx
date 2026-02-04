"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

export function SessionReset() {
  const pathname = usePathname();
  const resetSessionConsecutivePlays = useStore((s) => s.resetSessionConsecutivePlays);

  useEffect(() => {
    if (pathname === "/" || pathname === "/games") {
      resetSessionConsecutivePlays();
    }
  }, [pathname, resetSessionConsecutivePlays]);

  return null;
}

"use client";

import { VersionPicker } from "@/components/ui/VersionPicker";

export function VersionsApp() {
  return (
    <div className="h-full overflow-auto">
      <VersionPicker variant="app" />
    </div>
  );
}

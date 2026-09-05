"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { APP_DEFINITIONS } from "@/data/apps";
import { useOsStore } from "@/store/os-store";

export function DesktopIcons() {
  const openApp = useOsStore((s) => s.openApp);
  const pack = useOsStore((s) => s.settings.iconPack);
  const trashCount = useOsStore((s) => s.trash.length);

  return (
    <div className="relative z-10 flex h-[calc(100%-48px)] flex-col justify-between p-3 sm:p-4">
      <div className="grid grid-cols-3 content-start gap-2 sm:flex sm:flex-col">
        {APP_DEFINITIONS.filter((app) => app.desktop).map((app) => (
          <AppIcon key={app.id} name={app.id} label={app.name} pack={pack} onOpen={() => openApp(app.id)} />
        ))}
      </div>
      <div className="self-end">
        <AppIcon
          name="trash"
          label={trashCount > 0 ? `Trash (${trashCount})` : "Trash"}
          pack={pack}
          onOpen={() => openApp("trash")}
        />
      </div>
    </div>
  );
}

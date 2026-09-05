"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { SettingsSection } from "@/components/ui/SettingsSection";
import { Toggle } from "@/components/ui/Toggle";
import { APP_DEFINITIONS } from "@/data/apps";
import { WALLPAPERS } from "@/data/wallpapers";
import { OS_VERSION } from "@/types/os";
import { estimateStorageBytes, formatBytes } from "@/lib/file-system";
import { useOsStore } from "@/store/os-store";
import type { ThemeId, UiScale } from "@/types/os";

const SECTIONS = ["Appearance", "System", "Sounds", "Data"] as const;
type Section = (typeof SECTIONS)[number];

const THEME_OPTIONS: { id: ThemeId; swatch: string }[] = [
  { id: "dark", swatch: "#18181b" },
  { id: "light", swatch: "#f4f4f5" },
  { id: "midnight", swatch: "#1d4ed8" },
  { id: "carbon", swatch: "#000000" },
];

export function SettingsApp() {
  const [section, setSection] = useState<Section>("Appearance");
  const settings = useOsStore((s) => s.settings);
  const files = useOsStore((s) => s.files);
  const trash = useOsStore((s) => s.trash);
  const patchSettings = useOsStore((s) => s.patchSettings);
  const saveSettings = useOsStore((s) => s.saveSettings);
  const restoreSettings = useOsStore((s) => s.restoreSettings);
  const setModal = useOsStore((s) => s.setModal);

  return (
    <div className="flex h-full min-h-0">
      <nav className="w-32 shrink-0 border-r border-white/10 p-2 sm:w-40" aria-label="Settings sections">
        {SECTIONS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setSection(item)}
            className={`mb-1 w-full rounded-md px-2 py-2 text-left text-xs ${section === item ? "bg-red-600/20 text-red-200" : "text-zinc-300 hover:bg-white/5"}`}
          >
            {item}
          </button>
        ))}
      </nav>
      <div className="min-w-0 flex-1 overflow-auto p-4">
        {section === "Appearance" ? (
          <div className="space-y-4">
            <SettingsSection title="Wallpaper">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {WALLPAPERS.map((paper) => (
                  <button
                    key={paper.id}
                    type="button"
                    onClick={() => patchSettings({ wallpaper: paper.id })}
                    className={`overflow-hidden rounded-lg border ${settings.wallpaper === paper.id ? "border-red-500" : "border-white/10"}`}
                    aria-pressed={settings.wallpaper === paper.id}
                    aria-label={paper.name}
                  >
                    <div className={`${paper.className} h-16 w-full`} />
                    <span className="block px-2 py-1 text-[11px]">{paper.name}</span>
                  </button>
                ))}
              </div>
            </SettingsSection>
            <SettingsSection title="Theme">
              <div className="flex flex-wrap gap-2">
                {THEME_OPTIONS.map((theme) => {
                  const active = settings.theme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => patchSettings({ theme: theme.id })}
                      className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium capitalize ${
                        active ? "os-accent-fill border-transparent" : "border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                      }`}
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-white/30"
                        style={{ background: theme.swatch }}
                        aria-hidden
                      />
                      {theme.id}
                    </button>
                  );
                })}
              </div>
            </SettingsSection>
            <SettingsSection title="Interface size">
              <div className="flex flex-wrap gap-2">
                {(["small", "medium", "large"] as UiScale[]).map((uiScale) => (
                  <Button
                    key={uiScale}
                    variant={settings.uiScale === uiScale ? "primary" : "secondary"}
                    onClick={() => patchSettings({ uiScale })}
                  >
                    {uiScale}
                  </Button>
                ))}
              </div>
            </SettingsSection>
            <SettingsSection title="Motion">
              <Toggle
                checked={settings.animations}
                onChange={(animations) => patchSettings({ animations })}
                label="Interface animations"
                description="Window motion, notifications, and hover effects."
              />
            </SettingsSection>
          </div>
        ) : null}

        {section === "System" ? (
          <div className="space-y-3 text-sm text-zinc-300">
            <p>
              <span className="text-zinc-500">Version</span> MAD OS {OS_VERSION}
            </p>
            <p>
              <span className="text-zinc-500">Storage used</span>{" "}
              {formatBytes(estimateStorageBytes(files, trash.length))}
            </p>
            <p>
              <span className="text-zinc-500">Applications</span> {APP_DEFINITIONS.length}
            </p>
            <p>
              <span className="text-zinc-500">Processor</span> MAD Core (simulated)
            </p>
            <p>
              <span className="text-zinc-500">Memory</span> 16 GB virtual
            </p>
            <p>
              <span className="text-zinc-500">Runtime</span> Browser local session
            </p>
          </div>
        ) : null}

        {section === "Sounds" ? (
          <div className="space-y-2">
            <Toggle
              checked={settings.uiSounds}
              onChange={(uiSounds) => patchSettings({ uiSounds })}
              label="Interface sounds"
            />
            <Toggle
              checked={settings.notificationSounds}
              onChange={(notificationSounds) => patchSettings({ notificationSounds })}
              label="Notification sounds"
            />
          </div>
        ) : null}

        {section === "Data" ? (
          <div className="space-y-3">
            <Button variant="primary" onClick={saveSettings}>
              Save settings
            </Button>
            <Button onClick={restoreSettings}>Restore settings</Button>
            <Button
              variant="danger"
              onClick={() =>
                setModal({
                  title: "Delete all data?",
                  body: ["This will erase local MAD OS files, inventory, and settings.", "This action cannot be undone."],
                  confirmLabel: "Delete",
                  cancelLabel: "Cancel",
                  danger: true,
                  action: "delete-data",
                })
              }
            >
              Delete all data
            </Button>
            <Button
              variant="danger"
              onClick={() =>
                setModal({
                  title: "Reset MAD OS?",
                  body: [
                    "This will delete your local MAD OS data.",
                    "This action cannot be undone.",
                  ],
                  confirmLabel: "Reset",
                  cancelLabel: "Cancel",
                  danger: true,
                  action: "reset-os",
                })
              }
            >
              Reset MAD OS
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

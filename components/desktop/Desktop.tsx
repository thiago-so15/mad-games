"use client";

import { DesktopIcons } from "@/components/desktop/DesktopIcons";
import { StartMenu } from "@/components/desktop/StartMenu";
import { Wallpaper } from "@/components/desktop/Wallpaper";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { Taskbar } from "@/components/taskbar/Taskbar";
import { WindowManager } from "@/components/windows/WindowManager";
import { Modal } from "@/components/ui/Modal";
import { useOsStore } from "@/store/os-store";

export function Desktop() {
  const wallpaper = useOsStore((s) => s.settings.wallpaper);
  const modal = useOsStore((s) => s.modal);
  const setModal = useOsStore((s) => s.setModal);
  const confirmModal = useOsStore((s) => s.confirmModal);
  const setStartMenuOpen = useOsStore((s) => s.setStartMenuOpen);

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      onClick={() => setStartMenuOpen(false)}
    >
      <Wallpaper wallpaperId={wallpaper} />
      <DesktopIcons />
      <WindowManager />
      <NotificationCenter />
      <StartMenu />
      <Taskbar />
      {modal ? (
        <Modal
          title={modal.title}
          body={modal.body}
          confirmLabel={modal.confirmLabel}
          cancelLabel={modal.cancelLabel}
          danger={modal.danger}
          onCancel={() => setModal(null)}
          onConfirm={confirmModal}
        />
      ) : null}
    </div>
  );
}

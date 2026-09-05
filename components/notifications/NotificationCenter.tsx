"use client";

import { Notification } from "@/components/notifications/Notification";
import { useOsStore } from "@/store/os-store";

export function NotificationCenter() {
  const notifications = useOsStore((s) => s.notifications);
  const dismissNotification = useOsStore((s) => s.dismissNotification);

  return (
    <div className="pointer-events-none absolute right-3 bottom-16 z-[3000] flex max-w-[calc(100%-1.5rem)] flex-col gap-2 sm:top-3 sm:bottom-auto">
      {notifications.map((item) => (
        <div key={item.id} className="pointer-events-auto os-toast">
          <Notification
            title={item.title}
            message={item.message}
            onClose={() => dismissNotification(item.id)}
          />
        </div>
      ))}
    </div>
  );
}

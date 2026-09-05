"use client";

interface NotificationProps {
  title: string;
  message: string;
  onClose: () => void;
}

export function Notification({ title, message, onClose }: NotificationProps) {
  return (
    <div
      role="status"
      className="os-panel flex w-[min(18rem,calc(100vw-1.5rem))] items-start gap-3 rounded-xl border p-3 shadow-2xl shadow-black/50 backdrop-blur-xl"
    >
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold">{title}</p>
        <p className="os-muted mt-0.5 text-xs">{message}</p>
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={onClose}
        className="rounded-sm px-1 text-xs text-zinc-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      >
        ✕
      </button>
    </div>
  );
}

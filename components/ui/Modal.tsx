"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface ModalProps {
  title: string;
  body: string[];
  confirmLabel: string;
  cancelLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function Modal({ title, body, confirmLabel, cancelLabel, danger, onConfirm, onCancel }: ModalProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="absolute inset-0 z-[4000] flex items-center justify-center bg-black/60 p-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="os-modal-title"
        className="os-panel w-full max-w-md rounded-xl border p-5 shadow-2xl shadow-black/60"
      >
        <h2 id="os-modal-title" className="text-lg font-semibold">
          {title}
        </h2>
        <div className="os-muted mt-3 space-y-2 text-sm">
          {body.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button onClick={onCancel}>{cancelLabel}</Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

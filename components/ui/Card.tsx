"use client";

import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = "", onClick }: CardProps) {
  const interactive = Boolean(onClick);
  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      className={`rounded-xl border border-white/10 bg-black/30 p-4 shadow-lg shadow-black/20 ${interactive ? "cursor-pointer transition-colors hover:border-red-500/40 hover:bg-black/40" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

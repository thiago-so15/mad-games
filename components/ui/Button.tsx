"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-500 disabled:bg-red-600/40",
  secondary:
    "bg-white/5 text-zinc-100 border border-white/10 hover:bg-white/10 focus-visible:ring-zinc-400",
  ghost: "bg-transparent text-zinc-200 hover:bg-white/10 focus-visible:ring-zinc-400",
  danger: "bg-red-950 text-red-100 border border-red-800 hover:bg-red-900 focus-visible:ring-red-500",
};

export function Button({ variant = "secondary", className = "", children, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

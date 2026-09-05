import type { AppId } from "@/types/os";

const stroke = "currentColor";

export function AppGlyph({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  switch (name) {
    case "files":
      return (
        <svg {...common}>
          <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2h7.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z" />
        </svg>
      );
    case "games":
      return (
        <svg {...common}>
          <rect x="3" y="8" width="18" height="10" rx="3" />
          <path d="M8 13h2M9 12v2M15.2 12.2h.01M17.2 14.2h.01" />
        </svg>
      );
    case "store":
      return (
        <svg {...common}>
          <path d="M4 9h16l-1.2 9.2A2 2 0 0 1 16.82 20H7.18a2 2 0 0 1-1.98-1.8L4 9Z" />
          <path d="M8 9V7a4 4 0 0 1 8 0v2" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3.5v2.2M12 18.3V20.5M4.9 6.5l1.6 1.6M17.5 16l1.6 1.6M3.5 12h2.2M18.3 12H20.5M4.9 17.5l1.6-1.6M17.5 8l1.6-1.6" />
        </svg>
      );
    case "profile":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5 19c1.4-3.2 3.8-4.8 7-4.8S17.6 15.8 19 19" />
        </svg>
      );
    case "terminal":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m7 10 3 2-3 2M12 14h5" />
        </svg>
      );
    case "about":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 11v5M12 8h.01" />
        </svg>
      );
    case "trash":
      return (
        <svg {...common}>
          <path d="M5 7h14M9 7V5h6v2M8 7l.8 12h6.4L16 7" />
        </svg>
      );
    case "versions":
      return (
        <svg {...common}>
          <rect x="4" y="5" width="10" height="14" rx="1.5" />
          <rect x="10" y="8" width="10" height="14" rx="1.5" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="5" y="5" width="14" height="14" rx="2" />
        </svg>
      );
  }
}

export function glyphForApp(id: AppId | string): string {
  if (id === "game") return "games";
  return id;
}

"use client";

import { useEffect, useRef, useState } from "react";
import { APP_DEFINITIONS } from "@/data/apps";
import { GAMES_CATALOG } from "@/lib/games";
import { findByPath, formatPath } from "@/lib/file-system";
import { useOsStore } from "@/store/os-store";
import { OS_VERSION } from "@/types/os";

interface Line {
  kind: "in" | "out";
  text: string;
}

const HELP = [
  "Available commands:",
  "",
  "help",
  "clear",
  "about",
  "version",
  "whoami",
  "games",
  "files",
  "settings",
  "coins",
  "neofetch",
  "date",
  "echo",
];

export function TerminalApp() {
  const [lines, setLines] = useState<Line[]>([{ kind: "out", text: "MAD Terminal. Type help to begin." }]);
  const [value, setValue] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const files = useOsStore((s) => s.files);
  const coins = useOsStore((s) => s.coins);
  const user = useOsStore((s) => s.user);
  const settings = useOsStore((s) => s.settings);
  const openApp = useOsStore((s) => s.openApp);
  const recordTerminalCommand = useOsStore((s) => s.recordTerminalCommand);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [lines]);

  const run = (raw: string) => {
    const inputText = raw.trim();
    const next: Line[] = [...lines, { kind: "in", text: `C:\\MAD> ${raw}` }];
    if (!inputText) {
      setLines(next);
      return;
    }

    recordTerminalCommand();
    const [cmd, ...args] = inputText.split(/\s+/);
    const command = cmd.toLowerCase();
    const joined = args.join(" ");

    if (command === "clear") {
      setLines([]);
      return;
    }

    next.push({ kind: "out", text: execute(command, args, joined) });
    setLines(next);
  };

  const execute = (command: string, args: string[], joined: string): string => {
    switch (command) {
      case "help":
        return HELP.join("\n");
      case "about":
        return "MAD OS — a local operating system simulation running entirely in your browser.";
      case "version":
        return `MAD OS ${OS_VERSION}`;
      case "whoami":
        return user.displayName;
      case "games":
        return GAMES_CATALOG.map((game) => game.name).join("\n");
      case "files":
        return files
          .filter((item) => item.parentId === "mad-root" && !item.hidden)
          .map((item) => item.name)
          .join("\n") || formatPath(files, "mad-root");
      case "settings":
        openApp("settings");
        return "Opening Settings...";
      case "arcade":
        openApp("versions");
        return "Opening Versions...";
      case "coins":
        return `${coins} Mad Coins`;
      case "date":
        return new Date().toString();
      case "echo":
        return joined;
      case "neofetch":
        return [
          "  ███╗   ███╗ █████╗ ██████╗",
          "  ████╗ ████║██╔══██╗██╔══██╗",
          "  ██╔████╔██║███████║██║  ██║",
          "  ██║╚██╔╝██║██╔══██║██║  ██║",
          "  ██║ ╚═╝ ██║██║  ██║██████╔╝",
          "",
          `  user      ${user.displayName}`,
          `  os        MAD OS ${OS_VERSION}`,
          `  host      Browser`,
          `  theme     ${settings.theme}`,
          `  apps      ${APP_DEFINITIONS.length}`,
          `  coins     ${coins}`,
        ].join("\n");
      case "secret":
        return "The machine is listening.\nLook closer at System.";
      case "cat": {
        const node = findByPath(files, joined || args[0] || "");
        if (!node) return "File not found.";
        if (node.type === "folder") return "That's a folder.";
        return node.content ?? "";
      }
      case "ls": {
        const includeHidden = args.includes("-a");
        const pathArg = args.filter((item) => item !== "-a")[0];
        const node = pathArg ? findByPath(files, pathArg) : files.find((item) => item.id === "mad-root");
        if (!node || node.type !== "folder") return "Directory not found.";
        return files
          .filter((item) => item.parentId === node.id && (includeHidden || !item.hidden))
          .map((item) => item.name)
          .join("\n");
      }
      default:
        return `'${command}' is not recognized as a command. Type help.`;
    }
  };

  return (
    <div
      className="flex h-full flex-col bg-black p-3 font-mono text-[13px] text-zinc-200"
      onClick={() => input.current?.focus()}
    >
      <div ref={scroller} className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap">
        {lines.map((line, index) => (
          <p key={`${line.kind}-${index}`} className={line.kind === "in" ? "text-red-300" : "text-zinc-200"}>
            {line.text}
          </p>
        ))}
      </div>
      <form
        className="mt-2 flex items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          const inputEl = event.currentTarget.elements.namedItem("command");
          const command = inputEl instanceof HTMLInputElement ? inputEl.value : value;
          run(command);
          setValue("");
        }}
      >
        <label htmlFor="mad-terminal-input" className="text-red-400">
          C:\MAD&gt;
        </label>
        <input
          id="mad-terminal-input"
          name="command"
          ref={input}
          value={value}
          autoFocus
          aria-label="Terminal command"
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            run(event.currentTarget.value);
            setValue("");
          }}
          className="min-w-0 flex-1 bg-transparent outline-none"
        />
      </form>
    </div>
  );
}

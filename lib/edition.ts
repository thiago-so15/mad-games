export const EDITION_KEY = "mad-edition";

export type MadEdition = "games" | "os";

export function getEdition(): MadEdition | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(EDITION_KEY);
  return value === "games" || value === "os" ? value : null;
}

export function setEdition(edition: MadEdition): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(EDITION_KEY, edition);
}

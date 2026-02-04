/**
 * One-off: make black background of mad-games-logo.png transparent.
 * Run: node scripts/remove-logo-background.mjs
 */
import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const logoPath = join(__dirname, "..", "public", "mad-games-logo.png");

// Remove dark background: black and dark gray (luminance below this → transparent)
const LUMINANCE_THRESHOLD = 42;

const buffer = readFileSync(logoPath);
const { data, info } = await sharp(buffer)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
for (let i = 0; i < data.length; i += channels) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const luminance = (r + g + b) / 3;
  if (luminance < LUMINANCE_THRESHOLD) {
    data[i + 3] = 0;
  }
}

await sharp(data, { raw: { width, height, channels } })
  .png()
  .toFile(logoPath);

console.log("Logo background removed:", logoPath);

// Renders the PWA PNG icons from src/app/icon.svg. Run: node scripts/generate-icons.mjs
import { mkdir, readFile } from "node:fs/promises";
import sharp from "sharp";

const svg = await readFile(new URL("../src/app/icon.svg", import.meta.url));
const out = new URL("../public/icons/", import.meta.url);
await mkdir(out, { recursive: true });

for (const size of [192, 512]) {
  await sharp(svg).resize(size, size).png().toFile(new URL(`icon-${size}.png`, out).pathname);
}
// Maskable icons need the artwork inside the central safe zone.
const inner = await sharp(svg).resize(360, 360).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: "#050505" } })
  .composite([{ input: inner, gravity: "center" }])
  .png()
  .toFile(new URL("icon-maskable-512.png", out).pathname);
console.log("Icons written to public/icons");

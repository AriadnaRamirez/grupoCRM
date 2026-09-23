/**
 * Social share image 1200×630 (Facebook, WhatsApp, LinkedIn, X).
 * Usage: node scripts/make-og-image.mjs
 */
import sharp from "sharp";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "assets/img/og-crm.jpg");
const logoPath = join(root, "assets/img/logo-crm.png");

const type = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="18" height="630" fill="#D51A32"/>
  <text x="80" y="430" fill="#ffffff" font-size="36" font-family="Arial, Helvetica, sans-serif" font-weight="700">Extintores en CDMX y Estado de México</text>
  <text x="80" y="480" fill="#f3c4cb" font-size="24" font-family="Arial, Helvetica, sans-serif">Venta · Recarga · Instalación · WhatsApp 56 6748 1489</text>
</svg>`);

const logo = await sharp(logoPath)
  .resize({ width: 480, height: 120, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
  .png()
  .toBuffer();

const plate = await sharp({
  create: { width: 560, height: 168, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
})
  .composite([{ input: logo, gravity: "center" }])
  .png()
  .toBuffer();

await sharp({
  create: { width: 1200, height: 630, channels: 3, background: "#1a2031" },
})
  .composite([
    { input: plate, top: 168, left: 80 },
    { input: type, top: 0, left: 0 },
  ])
  .jpeg({ quality: 88 })
  .toFile(out);

console.log("wrote", out);

/**
 * Trim excess white/near-white margins on catalog PNGs/JPGs,
 * then re-center on a pure white square with a small pad.
 * Usage: node scripts/crop-catalog-white.mjs
 */
import sharp from "sharp";
import { existsSync, writeFileSync, statSync } from "fs";
import { join, resolve } from "path";

const root = resolve(import.meta.dirname, "..");
const catalogDir = join(root, "assets", "img", "catalog");
const SIZE = 1600;
const PAD = 0.06; // keep a slim white margin around product
const WHITE_THRESH = 248; // trim near-white

function isNearWhite(r, g, b, a = 255) {
  if (a < 8) return true;
  return r >= WHITE_THRESH && g >= WHITE_THRESH && b >= WHITE_THRESH;
}

async function contentBox(inputPath) {
  const { data, info } = await sharp(inputPath, { failOn: "none" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = channels > 3 ? data[i + 3] : 255;
      if (!isNearWhite(r, g, b, a)) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < 0) {
    return { left: 0, top: 0, width, height };
  }

  // small safety inset so we don't clip anti-alias
  const inset = 2;
  minX = Math.max(0, minX - inset);
  minY = Math.max(0, minY - inset);
  maxX = Math.min(width - 1, maxX + inset);
  maxY = Math.min(height - 1, maxY + inset);

  return {
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

async function processSku(sku) {
  const srcPng = join(catalogDir, `${sku}.png`);
  const srcJpg = join(catalogDir, `${sku}.jpg`);
  const input = existsSync(srcPng) ? srcPng : existsSync(srcJpg) ? srcJpg : null;
  if (!input) return { sku, ok: false, reason: "missing" };

  const box = await contentBox(input);
  const cropped = await sharp(input, { failOn: "none" })
    .extract(box)
    .flatten({ background: "#ffffff" })
    .png()
    .toBuffer();

  const inner = Math.round(SIZE * (1 - PAD * 2));
  const fitted = await sharp(cropped)
    .resize(inner, inner, { fit: "inside", withoutEnlargement: false, kernel: "lanczos3" })
    .png()
    .toBuffer();

  const meta = await sharp(fitted).metadata();
  const w = meta.width || inner;
  const h = meta.height || inner;
  const left = Math.floor((SIZE - w) / 2);
  const top = Math.floor((SIZE - h) / 2);

  const canvas = sharp({
    create: {
      width: SIZE,
      height: SIZE,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  }).composite([{ input: fitted, left, top }]);

  const outPng = join(catalogDir, `${sku}.png`);
  const outJpg = join(catalogDir, `${sku}.jpg`);
  await canvas.clone().png({ compressionLevel: 8, effort: 6 }).toFile(outPng);
  await canvas.clone().jpeg({ quality: 90, mozjpeg: true }).toFile(outJpg);

  return {
    sku,
    ok: true,
    box,
    pngKb: Math.round(statSync(outPng).size / 1024),
  };
}

const report = [];
for (let n = 1; n <= 55; n++) {
  const sku = `CRM-${String(n).padStart(4, "0")}`;
  const row = await processSku(sku);
  report.push(row);
  console.log(row.ok ? `OK ${sku} crop=${row.box.width}x${row.box.height}` : `MISS ${sku}`);
}

writeFileSync(join(catalogDir, "_crop-white-report.json"), JSON.stringify(report, null, 2));
console.log(`Done ${report.filter((r) => r.ok).length}/55`);

/**
 * Replace catalog photos from the numbered chat attachments.
 * Filename prefix (4-….png) maps to CRM-0004.
 */
import sharp from "sharp";
import { copyFileSync, existsSync, mkdirSync, readdirSync, renameSync, statSync, writeFileSync } from "fs";
import { basename, join, resolve } from "path";

const root = resolve(import.meta.dirname, "..");
const catalogDir = join(root, "assets", "img", "catalog");
const srcDir = resolve(
  "C:/Users/ariad/.cursor/projects/c-Users-ariad-Projects-grupo-crm-extintores/assets"
);
const backupDir = join(catalogDir, "_jpg-backup", `chat-update-${stamp()}`);
const SIZE = 1600;
const PAD = 0.08;

function stamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}

function collectSources() {
  const map = new Map();
  for (const name of readdirSync(srcDir)) {
    const m = name.match(/empty-window_images_(\d+)-/i);
    if (!m) continue;
    const n = Number(m[1]);
    if (n < 1 || n > 55) continue;
    map.set(n, join(srcDir, name));
  }
  return map;
}

async function toCatalogSquare(input, outJpg, outPng) {
  const inner = Math.round(SIZE * (1 - PAD * 2));
  const prepared = await sharp(input, { failOn: "none" })
    .rotate()
    .flatten({ background: "#ffffff" })
    .resize(inner, inner, { fit: "inside", withoutEnlargement: false, kernel: "lanczos3" })
    .png()
    .toBuffer();

  const meta = await sharp(prepared).metadata();
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
  }).composite([{ input: prepared, left, top }]);

  await canvas.clone().jpeg({ quality: 90, mozjpeg: true }).toFile(outJpg);
  await canvas.clone().png({ compressionLevel: 8, effort: 6 }).toFile(outPng);
}

mkdirSync(backupDir, { recursive: true });
const sources = collectSources();
const report = [];

for (const [n, source] of [...sources.entries()].sort((a, b) => a[0] - b[0])) {
  const sku = `CRM-${String(n).padStart(4, "0")}`;
  for (const kind of [".jpg", ".png"]) {
    const live = join(catalogDir, `${sku}${kind}`);
    if (existsSync(live)) {
      try {
        renameSync(live, join(backupDir, `${sku}${kind}`));
      } catch {
        copyFileSync(live, join(backupDir, `${sku}${kind}`));
      }
    }
  }
  const outJpg = join(catalogDir, `${sku}.jpg`);
  const outPng = join(catalogDir, `${sku}.png`);
  const t0 = Date.now();
  await toCatalogSquare(source, outJpg, outPng);
  report.push({
    sku,
    ok: true,
    src: basename(source),
    jpgKb: Math.round(statSync(outJpg).size / 1024),
    pngKb: Math.round(statSync(outPng).size / 1024),
    ms: Date.now() - t0,
  });
  console.log("OK", sku, basename(source));
}

writeFileSync(join(catalogDir, "_chat-update-report.json"), JSON.stringify(report, null, 2));
console.log(`\nUpdated ${report.length} photos. Backup: ${backupDir}`);

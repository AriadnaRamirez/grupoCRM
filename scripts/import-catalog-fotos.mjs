/**
 * Import numbered photos from Downloads into assets/img/catalog as CRM-0001…0055.
 * Usage: node scripts/import-catalog-fotos.mjs
 */
import sharp from "sharp";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  statSync,
  writeFileSync,
} from "fs";
import { join, resolve, extname } from "path";

const root = resolve(import.meta.dirname, "..");
const srcDir = resolve("C:/Users/ariad/Downloads/fotos catalogo");
const catalogDir = join(root, "assets", "img", "catalog");
const importSrcDir = join(catalogDir, "_src", "fotos-catalogo");
const backupDir = join(catalogDir, "_jpg-backup", `pre-import-${stamp()}`);
const SIZE = 1600;
const PAD = 0.08;

function stamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}

function findSource(n) {
  const base = String(n);
  const names = readdirSync(srcDir);
  const hit = names.find((f) => {
    const stem = f.replace(/\.[^.]+$/, "");
    return stem === base;
  });
  return hit ? join(srcDir, hit) : null;
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

  await canvas
    .clone()
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(outJpg);

  await canvas
    .clone()
    .png({ compressionLevel: 8, effort: 6 })
    .toFile(outPng);
}

mkdirSync(importSrcDir, { recursive: true });
mkdirSync(backupDir, { recursive: true });

const report = [];
let ok = 0;
let miss = 0;

for (let n = 1; n <= 55; n++) {
  const sku = `CRM-${String(n).padStart(4, "0")}`;
  const source = findSource(n);
  if (!source) {
    report.push({ sku, ok: false, reason: "missing source" });
    miss++;
    console.log("MISS", sku);
    continue;
  }

  const ext = extname(source).toLowerCase() || ".jpg";
  const staged = join(importSrcDir, `${sku}${ext}`);
  copyFileSync(source, staged);

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
  await toCatalogSquare(staged, outJpg, outPng);
  const jpgKb = Math.round(statSync(outJpg).size / 1024);
  const pngKb = Math.round(statSync(outPng).size / 1024);
  report.push({
    sku,
    ok: true,
    src: source,
    jpgKb,
    pngKb,
    ms: Date.now() - t0,
  });
  ok++;
  console.log("OK", sku, `${jpgKb}KB jpg / ${pngKb}KB png`);
}

writeFileSync(join(catalogDir, "_import-fotos-report.json"), JSON.stringify(report, null, 2));
console.log(`\nDone: ${ok} imported, ${miss} missing. Backup: ${backupDir}`);

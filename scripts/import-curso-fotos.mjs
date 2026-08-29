import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const srcDir = "C:/Users/ariad/.cursor/projects/c-Users-ariad-Projects-grupo-crm-extintores/assets";
const cropDir = "assets/img/crop";
const fullDir = "assets/img/full";
const keepDir = "assets/img/_src/cursos";
mkdirSync(cropDir, { recursive: true });
mkdirSync(fullDir, { recursive: true });
mkdirSync(keepDir, { recursive: true });

const wanted = [
  { match: "1-32354758", stem: "galeria-curso-instructivo" },
  { match: "2-bc7f0b56", stem: "galeria-curso-brigada" },
  { match: "3-78936e5d", stem: "galeria-curso-rescate" },
  { match: "4-6d4dd7c3", stem: "galeria-curso-primeros-auxilios" },
  { match: "5-1d871f2c", stem: "galeria-curso-combate" },
  { match: "6-29bcc20d", stem: "galeria-curso-co2" },
  { match: "16.26.31-893a7d5b", stem: "galeria-curso-comunidad" },
  { match: "16.26.312-e1753187", stem: "galeria-curso-campo" },
];

const files = readdirSync(srcDir);
const seen = new Set();

async function writeCrop(img, meta, dest) {
  const ratio = 4 / 3;
  let width = meta.width;
  let height = Math.round(width / ratio);
  if (height > meta.height) {
    height = meta.height;
    width = Math.round(height * ratio);
  }
  const left = Math.max(0, Math.round((meta.width - width) / 2));
  const slack = Math.max(0, meta.height - height);
  const top = slack ? Math.round(slack * 0.18) : 0;
  await img
    .extract({ left, top, width: Math.min(width, meta.width - left), height: Math.min(height, meta.height - top) })
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(dest);
}

async function writeFull(img, dest) {
  await img
    .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(dest);
}

for (const item of wanted) {
  const name = files.find((n) => n.includes(item.match));
  if (!name) {
    console.error("missing", item.match);
    continue;
  }
  const src = join(srcDir, name);
  const buf = readFileSync(src);
  const hash = createHash("sha1").update(buf).digest("hex").slice(0, 12);
  if (seen.has(hash)) {
    console.log("skip dup", item.stem);
    continue;
  }
  seen.add(hash);
  copyFileSync(src, join(keepDir, `${item.stem}.png`));
  const meta = await sharp(buf, { failOn: "none" }).rotate().metadata();
  await writeCrop(sharp(buf, { failOn: "none" }).rotate(), meta, join(cropDir, `${item.stem}.jpg`));
  await writeFull(sharp(buf, { failOn: "none" }).rotate(), join(fullDir, `${item.stem}.jpg`));
  console.log("wrote", item.stem, `${meta.width}x${meta.height}`);
}

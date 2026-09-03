import { readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

function walk(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) {
      if (name.name.startsWith("_") || name.name === "inspo") continue;
      walk(p, files);
    } else if (/\.(png|jpe?g|webp|gif|svg)$/i.test(name.name)) files.push(p);
  }
  return files;
}

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const mb = (n) => `${(n / 1024 / 1024).toFixed(2)} MB`;

const files = walk("assets/img");
const rows = files.map((p) => ({ p: p.replaceAll("\\", "/"), bytes: statSync(p).size }));
rows.sort((a, b) => b.bytes - a.bytes);

console.log("TOTAL files", rows.length);
console.log("TOTAL bytes", mb(rows.reduce((s, r) => s + r.bytes, 0)));
console.log("\n=== TOP 40 heaviest ===");
for (const r of rows.slice(0, 40)) {
  console.log(mb(r.bytes).padStart(8), kb(r.bytes).padStart(10), r.p);
}

const homeNeed = [
  "assets/img/logo-crm.png",
  "assets/img/logo-crm-flame.png",
  "assets/img/logo-crm-wordmark.png",
  "assets/img/favicon.png",
  "assets/img/mascot-inspector-extintor.png",
  "assets/img/mascot-inspector-ok.png",
  "assets/img/categoria-extintores.png",
  "assets/img/categoria-chalecos.png",
  "assets/img/categoria-senalamiento-vial.png",
  "assets/img/categoria-gabinetes-herrajes.png",
  "assets/img/categoria-botiquines.png",
  "assets/img/categoria-equipo-proteccion.png",
  "assets/img/full/galeria-evento.jpg",
  "assets/img/full/galeria-inventario.jpg",
  "assets/img/full/galeria-extintores-sitio.jpg",
  "assets/img/full/galeria-comercio.jpg",
  "assets/img/full/galeria-deportivo.jpg",
  "assets/img/full/galeria-restaurante.jpg",
  "assets/img/full/galeria-vapiano.jpg",
  "assets/img/full/galeria-automotriz.jpg",
  "assets/img/full/galeria-bodega.jpg",
];
const skus = [
  "CRM-0003", "CRM-0006", "CRM-0012", "CRM-0004",
  "CRM-0023", "CRM-0030", "CRM-0033", "CRM-0024",
  "CRM-0049", "CRM-0050", "CRM-0054", "CRM-0053",
];

console.log("\n=== HOME-CRITICAL with dimensions ===");
for (const p of [...homeNeed, ...skus.map((s) => `assets/img/catalog/${s}.png`)]) {
  if (!existsSync(p)) {
    console.log("MISSING", p);
    continue;
  }
  const st = statSync(p);
  try {
    const m = await sharp(p).metadata();
    console.log(kb(st.size).padStart(10), `${m.width}x${m.height}`.padStart(12), String(m.format || "").padEnd(5), p);
  } catch (e) {
    console.log(kb(st.size).padStart(10), "err", p, e.message);
  }
}

const cat = rows.filter((r) => r.p.includes("/catalog/") && r.p.endsWith(".png"));
console.log("\n=== CATALOG PNG summary ===");
console.log("count", cat.length, "total", mb(cat.reduce((s, r) => s + r.bytes, 0)));
console.log("avg", kb(cat.reduce((s, r) => s + r.bytes, 0) / Math.max(cat.length, 1)));
console.log("max", mb(Math.max(0, ...cat.map((r) => r.bytes))));

const full = rows.filter((r) => r.p.includes("/full/"));
console.log("\n=== FULL GALLERY ===");
console.log("full", full.length, mb(full.reduce((s, r) => s + r.bytes, 0)));

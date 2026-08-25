import sharp from "sharp";
import { readdirSync, statSync } from "fs";
import { join } from "path";

const dirs = [
  "assets/img/catalog",
  "assets/img/catalog/_src",
  "assets/img/catalog/_pdf",
];

async function inspect(dir, filter) {
  const files = readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f) && (!filter || filter(f)))
    .sort();
  const rows = [];
  for (const f of files) {
    const p = join(dir, f);
    const st = statSync(p);
    try {
      const m = await sharp(p, { failOn: "none" }).metadata();
      rows.push({
        file: f,
        w: m.width,
        h: m.height,
        kb: Math.round(st.size / 1024),
        format: m.format,
        alpha: Boolean(m.hasAlpha),
      });
    } catch (e) {
      rows.push({ file: f, error: String(e.message || e) });
    }
  }
  return rows;
}

const live = await inspect("assets/img/catalog", (f) => /^CRM-\d{4}\./i.test(f));
console.log("=== LIVE CRM ===");
for (const r of live) {
  console.log(
    `${r.file.padEnd(16)} ${String(r.w).padStart(5)}x${String(r.h).padEnd(5)} ${String(r.kb).padStart(5)}KB  ${r.format}${r.alpha ? " alpha" : ""}`
  );
}

const extras = await inspect("assets/img/catalog", (f) => !/^CRM-\d{4}\./i.test(f) && !f.startsWith("_"));
console.log("\n=== OTHER CATALOG ROOT ===");
for (const r of extras) {
  console.log(
    `${r.file.padEnd(22)} ${String(r.w).padStart(5)}x${String(r.h).padEnd(5)} ${String(r.kb).padStart(5)}KB`
  );
}

const src = await inspect("assets/img/catalog/_src");
console.log("\n=== _src ===");
for (const r of src) {
  console.log(
    `${r.file.padEnd(24)} ${String(r.w).padStart(5)}x${String(r.h).padEnd(5)} ${String(r.kb).padStart(5)}KB  ${r.format}${r.alpha ? " alpha" : ""}`
  );
}

const pdf = await inspect("assets/img/catalog/_pdf");
const pdfBig = pdf.filter((r) => r.w * r.h > 400 * 400).sort((a, b) => b.w * b.h - a.w * a.h);
console.log("\n=== _pdf largest ===");
for (const r of pdfBig.slice(0, 25)) {
  console.log(
    `${r.file.padEnd(20)} ${String(r.w).padStart(5)}x${String(r.h).padEnd(5)} ${String(r.kb).padStart(5)}KB`
  );
}
console.log(`pdf total: ${pdf.length}, >=400px: ${pdfBig.length}`);

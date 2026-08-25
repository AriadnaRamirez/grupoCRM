import sharp from "sharp";
import { mkdirSync, existsSync, writeFileSync } from "fs";
import { join } from "path";

const ua = "CRMCatalogBot/1.0 (Grupo CRM catalog)";
const srcDir = "assets/img/catalog/_src";
const outDir = "assets/img/catalog";
mkdirSync(srcDir, { recursive: true });

async function fetchFile(name, url) {
  const dest = join(srcDir, name);
  if (existsSync(dest)) {
    console.log("have", name);
    return dest;
  }
  const res = await fetch(url, { headers: { "User-Agent": ua } });
  if (!res.ok) {
    console.log("FAIL", name, res.status);
    return null;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 8000) {
    console.log("tiny", name, buf.length);
    return null;
  }
  writeFileSync(dest, buf);
  console.log("ok", name, buf.length);
  return dest;
}

const wiki = (file, w = 1200) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${w}`;

const downloads = [
  ["w-firstaid.jpg", wiki("Erste Hilfe Kasten mit Pflaster.jpg")],
  ["w-wetfloor-iso.jpg", wiki("Caution wet floor.jpg")],
  ["w-fog.jpg", wiki("Hohlstrahlrohr-Sprüh.JPG")],
  ["w-nozzle2.jpg", wiki("CM Strahlrohr.jpg")],
  ["w-cabinet-ru.jpg", wiki("Fire hose cabinet in Russia.jpg")],
  ["w-ehelp.png", wiki("Soft Cervical Collar.png")],
];

for (const [name, url] of downloads) {
  await fetchFile(name, url);
  await new Promise((r) => setTimeout(r, 4500));
}

async function toWhiteSquare(input, output, { darkToWhite = false, pad = 0.12, extraScale = 1 } = {}) {
  let img = sharp(input, { failOn: "none" }).rotate();
  const meta = await img.metadata();
  if (darkToWhite && (meta.hasAlpha || meta.space === "srgb")) {
    const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (r < 28 && g < 28 && b < 28) {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
        data[i + 3] = 255;
      }
    }
    img = sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } });
  }
  const size = 1200;
  const inner = Math.round(size * (1 - pad * 2) * extraScale);
  await img
    .flatten({ background: "#ffffff" })
    .resize(inner, inner, { fit: "inside", withoutEnlargement: false })
    .extend({
      top: Math.round((size - inner) / 2),
      bottom: Math.round((size - inner) / 2),
      left: Math.round((size - inner) / 2),
      right: Math.round((size - inner) / 2),
      background: "#ffffff",
    })
    .resize(size, size, { fit: "contain", background: "#ffffff" })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(output);
  console.log("wrote", output);
}

// Known good isolated sources
await toWhiteSquare(join(srcDir, "vest-yellow.jpg"), join(outDir, "CRM-0020.jpg"), { pad: 0.1 });
await toWhiteSquare(join(srcDir, "vest-orange.jpg"), join(outDir, "CRM-0021.jpg"), { pad: 0.1 });
await toWhiteSquare(join(srcDir, "cone-3d.png"), join(outDir, "CRM-0023.jpg"), { darkToWhite: true, pad: 0.18, extraScale: 0.85 });
await toWhiteSquare(join(srcDir, "cone-3d.png"), join(outDir, "CRM-0024.jpg"), { darkToWhite: true, pad: 0.08 });

if (existsSync(join(srcDir, "w-firstaid.jpg"))) {
  await toWhiteSquare(join(srcDir, "w-firstaid.jpg"), join(outDir, "CRM-0046.jpg"), { pad: 0.22 });
  await toWhiteSquare(join(srcDir, "w-firstaid.jpg"), join(outDir, "CRM-0047.jpg"), { pad: 0.14 });
  await toWhiteSquare(join(srcDir, "w-firstaid.jpg"), join(outDir, "CRM-0048.jpg"), { pad: 0.06 });
}
if (existsSync(join(srcDir, "w-wetfloor-iso.jpg"))) {
  await toWhiteSquare(join(srcDir, "w-wetfloor-iso.jpg"), join(outDir, "CRM-0033.jpg"), { pad: 0.1 });
}
console.log("done batch");

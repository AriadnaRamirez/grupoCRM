import { getDocument, OPS } from "pdfjs-dist/legacy/build/pdf.mjs";
import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import sharp from "sharp";

const pdfPath = "C:/Users/ariad/Downloads/crm/CATALOGO_CRM_EXTINTORES.pdf";
const outDir = "assets/img/catalog/_pdf";
mkdirSync(outDir, { recursive: true });

const data = new Uint8Array(readFileSync(pdfPath));
const doc = await getDocument({ data, verbosity: 0, isEvalSupported: false }).promise;
console.log("pages", doc.numPages);

let n = 0;
for (let p = 1; p <= doc.numPages; p++) {
  const page = await doc.getPage(p);
  const ops = await page.getOperatorList();
  const names = [];
  for (let i = 0; i < ops.fnArray.length; i++) {
    if (ops.fnArray[i] === OPS.paintImageXObject || ops.fnArray[i] === OPS.paintInlineImageXObject) {
      const name = ops.argsArray[i]?.[0];
      if (name && !names.includes(name)) names.push(name);
    }
  }
  for (const name of names) {
    let img;
    try {
      img = await page.objs.get(name);
    } catch {
      try {
        img = await page.commonObjs.get(name);
      } catch {
        continue;
      }
    }
    if (!img?.width || !img?.data) continue;
    if (img.width < 80 || img.height < 80) continue;
    n += 1;
    const file = join(outDir, `img-${String(n).padStart(3, "0")}-p${p}.jpg`);
    const channels = img.data.length / (img.width * img.height);
    try {
      await sharp(Buffer.from(img.data), {
        raw: { width: img.width, height: img.height, channels: Math.round(channels) || 3 },
      })
        .jpeg({ quality: 88 })
        .toFile(file);
      console.log(file, img.width + "x" + img.height);
    } catch (e) {
      writeFileSync(file.replace(".jpg", ".raw.json"), JSON.stringify({ w: img.width, h: img.height, len: img.data.length }));
      console.log("skip", name, img.width, img.height, e.message);
    }
  }
}
console.log("extracted", n);

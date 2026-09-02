import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const UA = "GrupoCRMBlog/1.0 (https://www.crmextintores.com; blog stock photos)";
const destDir = join(process.cwd(), "assets/img/full");

const files = [
  { stem: "blog-instalar", title: "File:Fire extinguisher with ID sign, call point and fire action sign.JPG" },
  { stem: "blog-casco", title: "File:HK Central Man Yiu Street Highways Department construction site office 06 Leighton May-2013 helmets.JPG" },
  { stem: "blog-nom-154", title: "File:Umschrank mit Hydrant und Schlauch, Feuerlöscher und Handfeuermelder.jpg" },
  { stem: "blog-tipos-fuego", title: "File:Campfire.jpg" },
  { stem: "blog-usar", title: "File:JMTG-U Fire Extinguisher Class (8558178).jpg" },
  { stem: "blog-cdmx", title: "File:Paseo de la Reforma Skyline Mexico City.jpg" },
  { stem: "blog-6kg", title: "File:Carbon dioxide fire extinguisher.jpg" },
  { stem: "blog-nom-002", title: "File:Emergency exit UK 015.jpg" },
  { stem: "blog-botiquin", title: "File:Ciintas first aid cabinet.JPG" },
  { stem: "blog-gabinete", title: "File:Jerusalem Fire hose cabinet.jpg" },
  { stem: "blog-manos", title: "File:JMTG-U Fire Extinguisher Class (8558172).jpg" },
];

mkdirSync(destDir, { recursive: true });

const params = new URLSearchParams({
  action: "query",
  titles: files.map((f) => f.title).join("|"),
  prop: "imageinfo",
  iiprop: "url|size|mime",
  iiurlwidth: "1600",
  format: "json",
});

const meta = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
  headers: { "User-Agent": UA },
});
const data = await meta.json();
const byTitle = new Map(Object.values(data.query.pages).map((page) => [page.title, page]));

for (const file of files) {
  const page = byTitle.get(file.title);
  const info = page?.imageinfo?.[0];
  if (!info) throw new Error(`Missing ${file.title}`);
  const url = info.thumburl || info.url;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${file.stem} ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(join(destDir, `${file.stem}.jpg`), buf);
  console.log("ok", file.stem, buf.length, `${info.thumbwidth || info.width}x${info.thumbheight || info.height}`);
}

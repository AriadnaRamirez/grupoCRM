import { existsSync, readdirSync } from "node:fs";
import { products, lookbook, clients } from "../js/data.js";

const missing = [];
const disk = (p) => String(p || "").replace(/^\//, "");
const check = (p) => {
  const file = disk(p);
  if (!existsSync(file)) missing.push(file);
};

for (const p of products) check(`assets/img/catalog/${p.sku}.png`);
for (const shot of lookbook) {
  check(shot.src);
  check(shot.full);
}
for (const c of clients) {
  for (const l of c.logos) check(l.src);
}

const extras = [
  "assets/img/logo-crm.png",
  "assets/img/logo-crm-flame.png",
  "assets/img/logo-crm-wordmark.png",
  "assets/img/favicon.png",
  "assets/img/mascot-inspector-crm.png",
  "css/main.css",
  "css/tokens.css",
  "js/main.js",
  "js/ui.js",
  "js/data.js",
  "js/seo.js",
  "js/base.js",
  "js/pages-base.js",
  "index.html",
  "nosotros.html",
  "productos.html",
  "producto.html",
  "galeria.html",
  "contacto.html",
  "aviso-privacidad.html",
  "mapa-sitio.html",
  "blog/index.html",
  "404.html",
  "netlify.toml",
  "_headers",
  "_redirects",
  ".htaccess",
];
for (const p of extras) check(p);

const catalogPng = readdirSync("assets/img/catalog").filter((f) => f.endsWith(".png") && f.startsWith("CRM-"));
const skus = new Set(products.map((p) => `${p.sku}.png`));
const orphan = catalogPng.filter((f) => !skus.has(f));
const missingSku = products.map((p) => `${p.sku}.png`).filter((f) => !catalogPng.includes(f));

console.log("products", products.length);
console.log("catalog CRM pngs", catalogPng.length);
console.log("missing files:");
console.log(missing.length ? missing.join("\n") : "none");
console.log("missing SKU pngs", missingSku.length ? missingSku.join(", ") : "none");
console.log("orphan CRM pngs", orphan.length ? orphan.join(", ") : "none");
if (missing.length || missingSku.length) process.exit(1);

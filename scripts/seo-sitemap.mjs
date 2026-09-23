import {
  SITE,
  company,
  products,
  lookbook,
  blogPosts,
  categories,
  seoServicePages,
  productAlt,
  lookAlt,
  brandAlt,
} from "../js/data.js";
import { sitemapUrls } from "../js/seo.js";
import { writeFileSync } from "node:fs";

const today = new Date().toISOString().slice(0, 10);
const origin = SITE.origin;
const brand = company.name;

function xml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function lookStem(item) {
  return String(item?.src || item?.full || "").match(/(?:galeria|foto|hero)-[^./]+/)?.[0] || "";
}

function img(loc, title, caption) {
  const path = loc.startsWith("http") ? loc : `${origin}${loc.startsWith("/") ? loc : `/${loc}`}`;
  return { loc: path, title, caption: caption || title };
}

function add(map, path, images) {
  if (!images?.length) return;
  const cur = map.get(path) || [];
  const seen = new Set(cur.map((i) => i.loc));
  for (const image of images) {
    if (!image?.loc || seen.has(image.loc)) continue;
    seen.add(image.loc);
    cur.push(image);
  }
  map.set(path, cur);
}

const logo = img("/assets/img/logo-crm.png", brand, `Logotipo de ${brand}`);

const inspectorImages = [
  img(company.inspector.image, "Inspector CRM", company.inspector.alt),
  img(company.inspector.imageExtintor, "Inspector CRM con extintor", company.inspector.altExtintor),
  img(company.inspector.imagePng, "Inspector CRM", `${company.inspector.alt}, archivo PNG`),
  img(company.inspector.imageExtintorPng, "Inspector CRM con extintor", `${company.inspector.altExtintor}, archivo PNG`),
];

const productImages = products.map((p) =>
  img(`/assets/img/opt/catalog/${p.sku}-800.webp`, p.title, productAlt(p, { detail: true }))
);

const lookImages = lookbook.map((item) => {
  const stem = lookStem(item);
  return img(
    stem ? `/assets/img/opt/full/${stem}-1400.webp` : item.src,
    `${item.title} — ${brand}`,
    lookAlt(item)
  );
});

const catFile = {
  extintores: "categoria-extintores",
  chalecos: "categoria-chalecos",
  "senalamiento-vial": "categoria-senalamiento-vial",
  "gabinetes-herrajes": "categoria-gabinetes-herrajes",
  botiquines: "categoria-botiquines",
  "equipo-proteccion": "categoria-equipo-proteccion",
};

const catImages = Object.fromEntries(
  categories.map((c) => [
    c.id,
    img(`/assets/img/opt/${catFile[c.id]}-960.webp`, `${c.name} ${brand}`, brandAlt(c.name)),
  ])
);

const pageImages = new Map();

add(pageImages, "/", [
  ...inspectorImages.slice(0, 2),
  logo,
  img(
    "/assets/img/hero/hero-desktop-640.webp",
    brandAlt("Extintores y equipo contra incendios listos para Protección Civil en CDMX"),
    brandAlt("Extintores listos para Protección Civil en CDMX")
  ),
  img(
    "/assets/img/hero/hero-linea-800.webp",
    brandAlt("Línea de extintores certificados para empresas"),
    brandAlt("Línea de extintores certificados para empresas")
  ),
  img(
    "/assets/img/hero/hero-fuego-800.webp",
    brandAlt("Equipo contra incendios para prevenir conatos en empresas"),
    brandAlt("Equipo contra incendios para prevenir conatos")
  ),
  img(
    "/assets/img/hero/hero-producto-800.webp",
    brandAlt("Técnico en visita de revisión de extintores sin costo"),
    brandAlt("Técnico en visita de revisión de extintores")
  ),
]);

add(pageImages, "/nosotros", [
  ...inspectorImages.slice(0, 2),
  img(
    "/assets/img/opt/full/hero-nosotros-800.webp",
    brandAlt("Equipo en servicio de instalación en CDMX"),
    brandAlt("Equipo en servicio de instalación en CDMX")
  ),
]);

add(pageImages, "/inspector-crm", inspectorImages);
add(pageImages, "/productos", [...Object.values(catImages), ...productImages]);
add(pageImages, "/galeria", lookImages);
add(pageImages, "/blog", [
  img(
    "/assets/img/opt/full/blog-portada-800.webp",
    brandAlt("Extintores y gabinete contra incendio en un pasillo"),
    brandAlt("Extintores y gabinete contra incendio en un pasillo")
  ),
  ...blogPosts.map((post) => img(post.image, post.heading || post.title, post.imageAlt)),
]);

for (const c of categories) {
  add(pageImages, `/productos?cat=${c.id}`, [
    catImages[c.id],
    ...products
      .filter((p) => p.cat === c.id)
      .map((p) => img(`/assets/img/opt/catalog/${p.sku}-800.webp`, p.title, productAlt(p, { detail: true }))),
  ]);
}

for (const p of products) {
  add(pageImages, `/producto?sku=${p.sku}`, [
    img(`/assets/img/opt/catalog/${p.sku}-800.webp`, p.title, productAlt(p, { detail: true })),
  ]);
}

for (const post of blogPosts) {
  add(pageImages, post.path, [img(post.image, post.heading || post.title, post.imageAlt)]);
}

const serviceImage = {
  "/venta-extintores": catImages.extintores,
  "/recarga-extintores": img(
    "/assets/img/opt/full/blog-recarga-1400.webp",
    brandAlt("Recarga de extintores"),
    brandAlt("Técnico revisando un extintor en taller de recarga")
  ),
  "/mantenimiento-extintores": img(
    "/assets/img/opt/full/blog-recarga-1400.webp",
    brandAlt("Mantenimiento de extintores"),
    brandAlt("Técnico revisando un extintor en taller de recarga")
  ),
  "/instalacion-extintores": img(
    "/assets/img/opt/full/blog-instalar-1400.webp",
    brandAlt("Instalación de extintores"),
    brandAlt("Extintor instalado con señalamiento EXTINTOR")
  ),
  "/senalizacion": catImages["senalamiento-vial"],
};

for (const s of seoServicePages) {
  if (serviceImage[s.path]) add(pageImages, s.path, [serviceImage[s.path]]);
}

function imageXml(images) {
  return images
    .map(
      (entry) => `    <image:image>
      <image:loc>${xml(entry.loc)}</image:loc>
      <image:title>${xml(entry.title)}</image:title>
      <image:caption>${xml(entry.caption)}</image:caption>
    </image:image>`
    )
    .join("\n");
}

const urls = sitemapUrls();
let imageCount = 0;
const xmlDoc = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map((path) => {
    const loc = `${origin}${path}`.replace(/&/g, "&amp;");
    const isLegal =
      path.includes("aviso") ||
      path.includes("mapa") ||
      path.includes("politica") ||
      path.includes("fuentes");
    const priority =
      path === "/"
        ? "1.0"
        : path === "/extintores-cuajimalpa"
          ? "0.9"
          : path === "/inspector-crm"
            ? "0.8"
            : path === "/blog/recarga-extintores-cuajimalpa"
              ? "0.8"
              : path.startsWith("/producto?")
                ? "0.6"
                : path.startsWith("/productos")
                  ? "0.8"
                  : isLegal
                    ? "0.3"
                    : "0.7";
    const images = pageImages.get(path) || [];
    imageCount += images.length;
    const imageBlock = images.length ? `\n${imageXml(images)}` : "";
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${isLegal ? "monthly" : "weekly"}</changefreq>
    <priority>${priority}</priority>${imageBlock}
  </url>`;
  })
  .join("\n")}
</urlset>
`;

writeFileSync(new URL("../sitemap.xml", import.meta.url), xmlDoc);
console.log(`sitemap.xml: ${urls.length} URLs, ${imageCount} images`);

/**
 * Inject visible publish/update dates into blog articles and key marketing pages.
 * Usage: node scripts/inject-content-dates.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { blogPosts, SITE } from "../js/data.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

function formatEs(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} de ${MONTHS[m - 1]} de ${y}`;
}

function articleMeta(published, modified) {
  const pub = published;
  const mod = modified || published;
  const pubLabel = formatEs(pub);
  let html = `<p class="content-dates">
          <span>Publicado el <time datetime="${pub}">${pubLabel}</time></span>`;
  if (mod !== pub) {
    html += `
          <span class="content-dates__sep" aria-hidden="true">·</span>
          <span>Actualizado el <time datetime="${mod}">${formatEs(mod)}</time></span>`;
  }
  html += `
        </p>`;
  return html;
}

function pageMeta(published, modified) {
  const pub = published || SITE.contentPublished;
  const mod = modified || SITE.contentModified;
  return `<p class="content-dates content-dates--page">
          <span>Publicado el <time datetime="${pub}">${formatEs(pub)}</time></span>
          <span class="content-dates__sep" aria-hidden="true">·</span>
          <span>Actualizado el <time datetime="${mod}">${formatEs(mod)}</time></span>
        </p>`;
}

const metaBlockRe =
  /<p class="content-dates(?:\s+content-dates--page)?">[\s\S]*?<\/p>\s*/g;

let n = 0;

for (const post of blogPosts) {
  const file = join(root, "blog", `${post.slug}.html`);
  let html = readFileSync(file, "utf8");
  html = html.replace(metaBlockRe, "");
  const block = articleMeta(post.datePublished, post.dateModified);
  const next = html.replace(
    /(<p class="article-dek">[\s\S]*?<\/p>)\s*(<\/header>)/,
    `$1\n        ${block}\n      $2`
  );
  if (next === html) {
    console.warn("skip article (no article-dek)", post.slug);
    continue;
  }
  writeFileSync(file, next);
  n++;
}

/** Main marketing pages: insert after first h1 lead / shop-hero lead / zona head. */
const pages = [
  {
    file: "index.html",
    re: /(<p class="lead">Acompañamos a condominios, restaurantes y oficinas\. La primera visita o levantamiento no tiene costo\.<\/p>)/,
    published: SITE.contentPublished,
    modified: SITE.contentModified,
  },
  {
    file: "nosotros.html",
    re: /(<p class="lead">Empresa mexicana de venta[\s\S]*?<\/p>)/,
    published: SITE.contentPublished,
    modified: SITE.contentModified,
  },
  {
    file: "productos.html",
    re: /(<p class="lead">Extintores, señalamientos, gabinetes y protección para su empresa[\s\S]*?<\/p>)/,
    published: SITE.contentPublished,
    modified: SITE.contentModified,
  },
  {
    file: "contacto.html",
    re: /(<p class="contact-page__lead">[\s\S]*?<\/p>)/,
    published: SITE.contentPublished,
    modified: SITE.contentModified,
  },
  {
    file: "galeria.html",
    re: /(<h1>[\s\S]*?<\/h1>)/,
    published: SITE.contentPublished,
    modified: SITE.contentModified,
  },
  {
    file: "venta-extintores.html",
    re: /(<p class="lead">Grupo CRM Extintores vende extintores[\s\S]*?<\/p>)/,
    published: SITE.contentPublished,
    modified: SITE.contentModified,
  },
  {
    file: "recarga-extintores.html",
    re: /(<p class="lead">[\s\S]*?<\/p>)/,
    published: SITE.contentPublished,
    modified: SITE.contentModified,
  },
  {
    file: "mantenimiento-extintores.html",
    re: /(<p class="lead">[\s\S]*?<\/p>)/,
    published: SITE.contentPublished,
    modified: SITE.contentModified,
  },
  {
    file: "instalacion-extintores.html",
    re: /(<p class="lead">[\s\S]*?<\/p>)/,
    published: SITE.contentPublished,
    modified: SITE.contentModified,
  },
  {
    file: "senalizacion.html",
    re: /(<p class="lead">[\s\S]*?<\/p>)/,
    published: SITE.contentPublished,
    modified: SITE.contentModified,
  },
  {
    file: "blog/index.html",
    re: /(<h1>[\s\S]*?<\/h1>)/,
    published: SITE.contentPublished,
    modified: SITE.contentModified,
  },
];

for (const page of pages) {
  const file = join(root, page.file);
  let html = readFileSync(file, "utf8");
  html = html.replace(metaBlockRe, "");
  const block = pageMeta(page.published, page.modified);
  if (!page.re.test(html)) {
    console.warn("skip page (pattern)", page.file);
    continue;
  }
  html = html.replace(page.re, (m) => `${m}\n        ${block}`);
  writeFileSync(file, html);
  n++;
}

// Zona / hub pages: after first .lead in zona-page__head
for (const name of readdirSync(root)) {
  if (!/^extintores-.*\.html$/.test(name)) continue;
  const file = join(root, name);
  let html = readFileSync(file, "utf8");
  if (!html.includes("zona-page__head")) continue;
  html = html.replace(metaBlockRe, "");
  const block = pageMeta(SITE.contentPublished, SITE.contentModified);
  const next = html.replace(
    /(<header class="zona-page__head">[\s\S]*?<p class="lead">[\s\S]*?<\/p>)/,
    `$1\n        ${block}`
  );
  if (next === html) {
    console.warn("skip zona", name);
    continue;
  }
  writeFileSync(file, next);
  n++;
}

console.log(`content dates injected in ${n} files`);

/**
 * Inject visible publish/update dates into blog articles and key marketing pages.
 * Page dates sit at the bottom of <main> (discreet). Article dates stay under the dek.
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
  return `<p class="content-dates content-dates--foot">
          <span>Publicado el <time datetime="${pub}">${formatEs(pub)}</time></span>
          <span class="content-dates__sep" aria-hidden="true">·</span>
          <span>Actualizado el <time datetime="${mod}">${formatEs(mod)}</time></span>
        </p>`;
}

const metaBlockRe =
  /<p class="content-dates(?:\s+content-dates--(?:page|foot))?">[\s\S]*?<\/p>\s*/g;

function injectFoot(html, block) {
  const cleaned = html.replace(metaBlockRe, "");
  if (!/<\/main>/i.test(cleaned)) return null;
  return cleaned.replace(
    /<\/main>/i,
    `  <div class="wrap content-dates-wrap">${block}\n  </div>\n  </main>`
  );
}

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

/** Marketing / local pages: dates at end of main (not in hero). */
const pages = [
  "index.html",
  "nosotros.html",
  "productos.html",
  "contacto.html",
  "galeria.html",
  "venta-extintores.html",
  "recarga-extintores.html",
  "mantenimiento-extintores.html",
  "instalacion-extintores.html",
  "senalizacion.html",
  "blog/index.html",
  "politica-de-servicio.html",
  "fuentes-y-normatividad.html",
  "caso-agencia-automotriz.html",
  "aviso-privacidad.html",
  "mapa-sitio.html",
];

for (const rel of pages) {
  const file = join(root, rel);
  let html;
  try {
    html = readFileSync(file, "utf8");
  } catch {
    console.warn("skip missing", rel);
    continue;
  }
  const block = pageMeta(SITE.contentPublished, SITE.contentModified);
  const next = injectFoot(html, block);
  if (!next) {
    console.warn("skip page (no main)", rel);
    continue;
  }
  writeFileSync(file, next);
  n++;
}

for (const name of readdirSync(root)) {
  if (!/^extintores-.*\.html$/.test(name)) continue;
  const file = join(root, name);
  let html = readFileSync(file, "utf8");
  const block = pageMeta(SITE.contentPublished, SITE.contentModified);
  const next = injectFoot(html, block);
  if (!next) {
    console.warn("skip zona", name);
    continue;
  }
  writeFileSync(file, next);
  n++;
}

console.log(`content dates injected in ${n} files`);

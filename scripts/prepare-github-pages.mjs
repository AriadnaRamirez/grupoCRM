/**
 * Build a GitHub Pages copy with a repo base path and folder indexes
 * so /nosotros and /css/main.css work at usuario.github.io/grupoCRM/.
 */
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const root = process.cwd();
const out = join(root, "dist-pages");
const base = (process.env.PAGES_BASE || "/grupoCRM").replace(/\/$/, "") || "";

const skip = new Set([
  "dist-pages",
  "node_modules",
  ".git",
  ".tmp-verify",
  "wordpress-export",
]);

const pageNames = [
  "aviso-privacidad",
  "contacto",
  "galeria",
  "mapa-sitio",
  "nosotros",
  "producto",
  "productos",
  "servicios",
];

const prefixes = [
  "assets",
  "css",
  "js",
  "blog",
  "productos",
  "producto",
  "nosotros",
  "galeria",
  "contacto",
  "aviso-privacidad",
  "mapa-sitio",
  "servicios",
  "404",
];

function copyTree(from, to) {
  for (const name of readdirSync(from)) {
    if (skip.has(name) || name === "dist-pages") continue;
    const src = join(from, name);
    const dest = join(to, name);
    const st = statSync(src);
    if (st.isDirectory()) {
      mkdirSync(dest, { recursive: true });
      copyTree(src, dest);
    } else {
      mkdirSync(dirname(dest), { recursive: true });
      cpSync(src, dest);
    }
  }
}

function withBase(text) {
  if (!base) return text;
  const alt = prefixes.join("|");
  const pages = "productos|producto|nosotros|galeria|contacto|aviso-privacidad|mapa-sitio|servicios|index";
  return text
    .replace(new RegExp(`([\\"'=(])/(${alt})(?=/|[\\"'?#)\\s]|$)`, "g"), `$1${base}/$2`)
    .replace(new RegExp(`(\`)/(${alt})(?=/|[\\\`?#]|$)`, "g"), `$1${base}/$2`)
    .replace(/href="\/"/g, `href="${base}/"`)
    .replace(/href='\/'/g, `href='${base}/'`)
    .replace(/path: "\/"/g, `path: "${base}/"`)
    .replace(/((?:href|src|data-bg|data-src)=["'])(?!\/|#|https?:|data:|mailto:|tel:|javascript:)((?:assets|css|js)\/)/g, `$1${base}/$2`)
    .replace(/(url\(["']?)(?!\/|https?:|data:)((?:assets|css|js)\/)/g, `$1${base}/$2`)
    .replace(new RegExp(`\\b(href|action)=(["'])(?:\\./)?(${pages})\\.html`, "g"), (_, attr, quote, page) => {
      const dest = page === "index" ? `${base}/` : `${base}/${page}`;
      return `${attr}=${quote}${dest}`;
    })
    .replace(new RegExp(`${base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/(${pages})\\.html`, "g"), (_, page) => (
      page === "index" ? `${base}/` : `${base}/${page}`
    ))
    .replace(new RegExp(`\\b(href|action)=(["'])(?:\\./)?blog/([\\w-]+)\\.html`, "g"), `$1=$2${base}/blog/$3`)
    .replace(new RegExp(`${base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/blog/([\\w-]+)\\.html`, "g"), `${base}/blog/$1`);
}

function rewriteFiles(dir) {
  for (const name of readdirSync(dir)) {
    const file = join(dir, name);
    if (statSync(file).isDirectory()) {
      rewriteFiles(file);
      continue;
    }
    if (!/\.(html|js|css|xml|txt|mjs)$/i.test(name)) continue;
    const before = readFileSync(file, "utf8");
    const after = withBase(before);
    if (after !== before) writeFileSync(file, after);
  }
}

function prettyPage(htmlName, destDir) {
  const src = join(out, `${htmlName}.html`);
  if (!existsSync(src)) return;
  mkdirSync(join(out, destDir), { recursive: true });
  cpSync(src, join(out, destDir, "index.html"));
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
copyTree(root, out);
writeFileSync(join(out, ".nojekyll"), "");

for (const name of pageNames) {
  prettyPage(name, name);
  const dup = join(out, `${name}.html`);
  if (existsSync(dup)) rmSync(dup);
}

const blogDir = join(out, "blog");
if (existsSync(blogDir)) {
  for (const name of readdirSync(blogDir)) {
    if (!name.endsWith(".html") || name === "index.html") continue;
    const slug = name.replace(/\.html$/i, "");
    prettyPage(`blog/${slug}`, join("blog", slug));
    rmSync(join(out, "blog", name));
  }
}

rewriteFiles(out);

const rel = relative(root, out) || "dist-pages";
console.log(`GitHub Pages bundle in ${rel} (base ${base || "/"})`);

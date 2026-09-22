/**
 * Ensure complete Open Graph tags across static HTML pages.
 * Adds og:image dimensions/alt/type and twitter:image when missing.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const skip = new Set(["dist-pages", "node_modules", ".git", ".tmp-verify"]);
const OG_IMAGE = "https://www.crmextintores.com.mx/assets/img/logo-crm.png";

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (skip.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, files);
    else if (name.endsWith(".html")) files.push(path);
  }
  return files;
}

function ensurePrefix(html) {
  return html.replace(/<html\s+lang="es-MX"(?![^>]*prefix=)/i, '<html lang="es-MX" prefix="og: https://ogp.me/ns#"');
}

function ensureOgExtras(html) {
  if (!/property="og:image"/i.test(html)) return html;
  if (!/property="og:image:alt"/i.test(html)) {
    html = html.replace(
      /(<meta property="og:image" content="[^"]*">\s*)/i,
      `$1<meta property="og:image:alt" content="Logotipo de Grupo CRM Extintores">\n  `
    );
  }
  if (!/property="og:image:width"/i.test(html)) {
    html = html.replace(
      /(<meta property="og:image(?::alt)?" content="[^"]*">\s*)+/i,
      (block) =>
        `${block}<meta property="og:image:width" content="720">\n  <meta property="og:image:height" content="154">\n  <meta property="og:image:type" content="image/png">\n  `
    );
  }
  if (/name="twitter:card"/i.test(html) && !/name="twitter:image"/i.test(html)) {
    html = html.replace(
      /(<meta name="twitter:description" content="[^"]*">\s*)/i,
      `$1<meta name="twitter:image" content="${OG_IMAGE}">\n  `
    );
  }
  return html;
}

let n = 0;
for (const file of walk(root)) {
  let html = readFileSync(file, "utf8");
  const before = html;
  html = ensurePrefix(html);
  html = ensureOgExtras(html);
  if (html !== before) {
    writeFileSync(file, html);
    n += 1;
  }
}
console.log(`updated OG extras on ${n} pages`);

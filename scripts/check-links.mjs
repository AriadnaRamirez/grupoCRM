import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const skip = new Set(["node_modules", ".git", "assets", "dist-pages", ".tmp-verify"]);
const htmlFiles = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (skip.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (name.endsWith(".html")) htmlFiles.push(p);
  }
}

walk(root);

const hrefRe = /href\s*=\s*("([^"]+)"|'([^']+)')/gi;
const locals = new Set();
const broken = [];

for (const file of htmlFiles) {
  const rel = relative(root, file).replaceAll("\\", "/");
  locals.add("/" + rel.replace(/index\.html$/i, "").replace(/\.html$/i, "").replace(/\/$/, "") || "/");
  if (rel === "index.html") locals.add("/");
  if (rel.endsWith("/index.html")) {
    locals.add("/" + rel.replace(/\/index\.html$/i, ""));
  }
}

function resolveLocal(fromFile, href) {
  if (!href || /^(https?:|mailto:|tel:|javascript:|data:|#)/i.test(href)) return null;
  const clean = href.split("#")[0].split("?")[0];
  if (!clean) return null;
  let path;
  if (clean.startsWith("/")) {
    path = clean.replace(/\/index\.html$/i, "").replace(/\.html$/i, "").replace(/\/$/, "") || "/";
  } else {
    const baseDir = relative(root, join(fromFile, "..")).replaceAll("\\", "/");
    const joined = join(baseDir || ".", clean).replaceAll("\\", "/");
    path = ("/" + joined.replace(/\/index\.html$/i, "").replace(/\.html$/i, "").replace(/\/$/, "")).replace(/\/+/g, "/") || "/";
  }
  if (path === "/index") path = "/";
  return path;
}

for (const file of htmlFiles) {
  const text = readFileSync(file, "utf8");
  let m;
  while ((m = hrefRe.exec(text))) {
    const href = m[2] ?? m[3] ?? "";
    const path = resolveLocal(file, href);
    if (!path) continue;
    // Skip asset and query-like routes we don't materialize as files
    if (path.startsWith("/assets") || path.startsWith("/css") || path.startsWith("/js")) continue;
    if (path.startsWith("/productos") || path.startsWith("/producto")) continue;
    if (!locals.has(path) && !locals.has(path + "/")) {
      broken.push(`${relative(root, file).replaceAll("\\", "/")}: ${href} → ${path}`);
    }
  }
}

if (broken.length) {
  console.error(`Enlaces internos posiblemente rotos: ${broken.length}`);
  broken.slice(0, 80).forEach((line) => console.error(line));
  process.exitCode = 1;
} else {
  console.log(`OK: ${htmlFiles.length} HTML, sin enlaces internos rotos detectados.`);
}

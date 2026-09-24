import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { faIcon } from "../js/fa-svg.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const faLoader = /<script>\s*\(function \(\) \{\s*function loadFa\(\)[\s\S]*?<\/script>\s*<noscript><link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.5\.2\/css\/all\.min\.css"[^>]*><\/noscript>\s*/g;
const dns = /\s*<link rel="dns-prefetch" href="https:\/\/cdnjs\.cloudflare\.com">\s*/g;
const icon = /<i class="([^"]*fa-[a-z0-9-]+[^"]*)"(?:\s+aria-hidden="true")?\s*><\/i>/g;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".git" || name === "interno") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith(".html")) out.push(p);
  }
  return out;
}

let files = 0;
let icons = 0;
const missing = new Set();
for (const file of walk(root)) {
  let text = readFileSync(file, "utf8");
  const next = text
    .replace(dns, "\n")
    .replace(faLoader, "")
    .replace(icon, (_, cls) => {
      const svg = faIcon(cls);
      if (svg.startsWith("<i")) missing.add(cls);
      else icons += 1;
      return svg;
    });
  if (next !== text) {
    writeFileSync(file, next);
    files += 1;
  }
}
console.log(`updated ${files} html, ${icons} icons`);
if (missing.size) console.log("unmapped", [...missing]);

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const skip = new Set(["dist-pages", "node_modules", ".git", ".tmp-verify"]);

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (skip.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, files);
    else if (name.endsWith(".html")) files.push(path);
  }
  return files;
}

let n = 0;
for (const file of walk(root)) {
  let html = readFileSync(file, "utf8");
  const next = html.replace(/\s*<link rel="alternate" hreflang="[^"]+" href="[^"]+"\s*\/?>\s*/gi, "\n  ");
  if (next !== html) {
    writeFileSync(file, next.replace(/\n{3,}/g, "\n\n"));
    n += 1;
  }
}
console.log(`removed hreflang from ${n} pages`);

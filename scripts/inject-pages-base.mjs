import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const skip = new Set(["dist-pages", "node_modules", ".git", ".tmp-verify", "wordpress-export"]);
const boot = readFileSync(join(root, "js", "pages-base.js"), "utf8").trim();
const snippet = `  <script>\n  /* pages-base */\n${boot
  .split("\n")
  .map((line) => `  ${line}`)
  .join("\n")}\n  </script>\n`;
const block = /\n\s*<script>\s*\/\* pages-base \*\/[\s\S]*?<\/script>\n/;

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (skip.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, files);
    else if (name.endsWith(".html")) files.push(path);
  }
  return files;
}

let changed = 0;
for (const file of walk(root)) {
  let html = readFileSync(file, "utf8");
  html = html.replace(block, "\n");
  if (!/<meta charset="UTF-8">/i.test(html)) {
    console.warn("skip (no charset)", file);
    continue;
  }
  html = html.replace(/(<meta charset="UTF-8">\s*\n)/i, `$1${snippet}`);
  writeFileSync(file, html);
  changed += 1;
}
console.log(`injected pages-base into ${changed} html files`);

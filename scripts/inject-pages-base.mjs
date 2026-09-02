import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const skip = new Set(["dist-pages", "node_modules", ".git", ".tmp-verify"]);
const boot = readFileSync(join(root, "js", "pages-base.js"), "utf8").trim();
const snippet = `  <script>\n  /* pages-base */\n${boot
  .split("\n")
  .map((line) => `  ${line}`)
  .join("\n")}\n  </script>\n`;
const block = /<script>\s*\/\* pages-base \*\/[\s\S]*?<\/script>\s*/g;
const cssBoot = `  <style id="css-boot">
  /* css-boot: hide until local CSS + header are ready */
  html:not(.is-booted) { visibility: hidden; background: #fff; }
  </style>
  <noscript><style>html { visibility: visible !important; }</style></noscript>
  <script>setTimeout(function () { document.documentElement.classList.add("is-booted"); }, 4000);</script>
`;
const cssBootBlock = /<style id="css-boot">[\s\S]*?<\/style>\s*<noscript><style>html \{ visibility: visible !important; \}<\/style><\/noscript>\s*<script>setTimeout\(function \(\) \{ document\.documentElement\.classList\.add\("is-booted"\); \}, 4000\);<\/script>\s*/g;

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
  html = html.replace(cssBootBlock, "\n");
  html = html.replace(block, "\n");
  if (!/<meta charset="UTF-8">/i.test(html)) {
    console.warn("skip (no charset)", file);
    continue;
  }
  html = html.replace(/(<meta charset="UTF-8">\s*\r?\n)/i, `$1${snippet}`);
  if (/css\/(?:tokens|main)\.css/.test(html)) {
    html = html.replace(/(<script>\s*\/\* pages-base \*\/[\s\S]*?<\/script>\s*)/, `$1${cssBoot}`);
  }
  writeFileSync(file, html);
  changed += 1;
}
console.log(`injected pages-base into ${changed} html files`);

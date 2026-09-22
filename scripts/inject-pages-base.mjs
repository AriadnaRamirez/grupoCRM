import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const skip = new Set(["dist-pages", "node_modules", ".git", ".tmp-verify"]);
/** Load pages-base only on GitHub Pages (prod skips the request). */
const snippet = `  <script>!function(){if(!/\\.github\\.io$/i.test(location.hostname))return;var s=document.createElement("script");s.src="/js/pages-base.js";document.head.appendChild(s)}();</script>\n`;
const block = /<script>\s*\/\* pages-base \*\/[\s\S]*?<\/script>\s*/g;
const externalBlock = /<script(?: src="\/js\/pages-base\.js"><\/script>|[^>]*>!function\(\)\{if\(!\/\\.github\\.io\$\/i\.test\(location\.hostname\)\)return;[\s\S]*?<\/script>)\s*/g;
const cssBoot = `  <style id="css-boot">
  /* Sync main.css — never override hero/slide layout from main.css */
  html { background: #fff; }
  </style>
`;
const cssBootBlock = /<style id="css-boot">[\s\S]*?<\/style>\s*(?:<noscript><style>html \{ visibility: visible !important; \}<\/style><\/noscript>\s*)?(?:<script>setTimeout\(function \(\) \{ document\.documentElement\.classList\.add\("is-booted"\); \}, 4000\);<\/script>\s*)?/g;

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
  html = html.replace(externalBlock, "\n");
  if (!/<meta charset="UTF-8">/i.test(html)) {
    console.warn("skip (no charset)", file);
    continue;
  }
  html = html.replace(/(<meta charset="UTF-8">\s*\r?\n)/i, `$1${snippet}`);
  if (/css\/(?:tokens|main)(?:\.min)?\.css/.test(html)) {
    // Insert critical CSS right after pages-base gate (or legacy sync script).
    if (!html.includes('id="css-boot"')) {
      html = html.replace(
        /(<script>!function\(\)\{if\(!\/\\.github\\.io\$\/i\.test\(location\.hostname\)\)return;[\s\S]*?<\/script>\s*)/,
        `$1${cssBoot}`
      );
      html = html.replace(/(<script src="\/js\/pages-base\.js"><\/script>\s*)/, `$1${cssBoot}`);
    }
  }
  writeFileSync(file, html);
  changed += 1;
}
console.log(`injected external pages-base into ${changed} html files`);

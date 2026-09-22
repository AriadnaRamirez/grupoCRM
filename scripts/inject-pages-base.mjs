import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const skip = new Set(["dist-pages", "node_modules", ".git", ".tmp-verify"]);
/** Load pages-base only on GitHub Pages (prod skips the request). */
const snippet = `  <script>!function(){if(!/\\.github\\.io$/i.test(location.hostname))return;var s=document.createElement("script");s.src="/js/pages-base.js";document.head.appendChild(s)}();</script>\n`;
const block = /<script>\s*\/\* pages-base \*\/[\s\S]*?<\/script>\s*/g;
const externalBlock = /<script(?: src="\/js\/pages-base\.js"><\/script>|[^>]*>!function\(\)\{if\(!\/\\.github\\.io\$\/i\.test\(location\.hostname\)\)return;[\s\S]*?<\/script>)\s*/g;
const cssBoot = `  <style id="css-boot">
  /* Mobile LCP: paint hero without waiting for main.min.css */
  html { background: #fff; }
  body { margin: 0; color: #202020; font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif; }
  img { max-width: 100%; height: auto; }
  .wrap { width: min(1120px, calc(100% - 40px)); margin-inline: auto; }
  .site-chrome { position: fixed; top: 0; left: 0; right: 0; z-index: 50; background: #fff; }
  .brand img { width: min(162px, 42vw); height: auto; display: block; }
  .hero-slider { position: relative; min-height: min(72vh, 560px); background: #1a2031; color: #fff; overflow: hidden; }
  .slide { display: none; }
  .slide.is-active { display: block; }
  .slide__photo { position: absolute; inset: 0; }
  .slide__photo img { width: 100%; height: 100%; object-fit: cover; object-position: center bottom; }
  .hero-copy { position: relative; z-index: 1; padding: 88px 0 40px; max-width: 36rem; }
  .hero-copy h1, .hero-copy h2 { margin: 0 0 14px; font-size: clamp(1.45rem, 5.2vw, 2rem); line-height: 1.18; letter-spacing: -0.03em; }
  .hero-copy .lead { margin: 12px 0 0; font-size: 1rem; line-height: 1.5; opacity: 0.92; }
  .hero-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
  .btn { display: inline-flex; align-items: center; gap: 8px; min-height: 48px; padding: 10px 18px; border-radius: 4px; font-weight: 700; text-decoration: none; color: #fff; }
  .btn-red { background: #d51a32; }
  .btn-wa { background: #1f8a4d; }
  .btn-ink { background: #202020; }
  .btn svg { width: 1.05em; height: 1.05em; flex: none; }
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

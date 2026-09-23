import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const skip = new Set(["dist-pages", "node_modules", ".git", ".tmp-verify"]);
/** Load pages-base only on GitHub Pages (prod skips the request). */
const snippet = `  <script>!function(){if(!/\\.github\\.io$/i.test(location.hostname))return;var s=document.createElement("script");s.src="/js/pages-base.js";document.head.appendChild(s)}();</script>\n`;
const block = /<script>\s*\/\* pages-base \*\/[\s\S]*?<\/script>\s*/g;
const externalBlock = /<script(?: src="\/js\/pages-base\.js"><\/script>|[^>]*>!function\(\)\{if\(!\/\\.github\\.io\$\/i\.test\(location\.hostname\)\)return;[\s\S]*?<\/script>)\s*/g;
const cssBoot = `  <style id="css-boot">
  /* Critical first paint: chrome + hero before async main.css (FOUC / CLS) */
  :root { --chrome-h: 108px; --photo-w: min(50%, 720px); }
  @media (min-width: 1024px) { :root { --chrome-h: 113px; } }
  html { background: #fff; }
  body { margin: 0; color: #202020; font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif; }
  .bot-nav {
    position: absolute !important; width: 1px !important; height: 1px !important;
    padding: 0 !important; margin: -1px !important; overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important; clip-path: inset(50%) !important;
    white-space: nowrap !important; border: 0 !important;
  }
  .site-chrome { position: fixed; top: 0; left: 0; right: 0; z-index: 60; background: #fff; }
  .header-skel { height: var(--chrome-h); max-height: var(--chrome-h); overflow: hidden; pointer-events: none; }
  .header-skel .brand { pointer-events: auto; }
  .header-skel .nav, .header-skel .header__cta, .header-skel__nav, .header-skel__cta { display: none !important; }
  body:has([data-header]:empty),
  body:has([data-header] .header-skel),
  body:has([data-header] .site-chrome) {
    padding-top: calc(var(--chrome-h) + env(safe-area-inset-top, 0px));
  }
  .brand img { display: block; width: auto; height: auto; max-height: 47px; aspect-ratio: 720 / 154; object-fit: contain; }
  .hero-slider { position: relative; isolation: isolate; min-height: min(72vh, 646px); overflow: hidden; background: #1a2031; }
  .slide { position: absolute; inset: 0; opacity: 0; visibility: hidden; pointer-events: none; color: #fff; background-color: #1a2031; }
  .slide.is-active { opacity: 1; visibility: visible; pointer-events: auto; z-index: 1; }
  .slide__photo {
    position: absolute; inset: 0 0 0 auto; width: var(--photo-w);
    background-color: #1a2031; background-repeat: no-repeat; background-size: cover; background-position: center bottom;
  }
  .slide__photo img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: center bottom; }
  .hero-slider .media-load:not(.is-ready) img { opacity: 0; }
  .hero-slider .slide__photo.media-load:not(.is-ready) { background-color: #1a2031; }
  .shop-grid { display: grid; }
  body[data-page="inicio"] .shop-home .shop-grid--4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  @media (max-width: 760px) {
    .hero-slider:not(.home-gallery) { min-height: min(78dvh, 660px); }
    :root { --photo-w: 100%; }
  }
  @media (max-width: 480px) {
    .hero-slider:not(.home-gallery) { min-height: min(74dvh, 600px); }
  }
  @media (max-width: 767px) {
    body[data-page="inicio"] .shop-home .shop-grid--4 { grid-template-columns: 1fr 1fr; }
  }
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
    html = html.replace(
      /(<script>!function\(\)\{if\(!\/\\.github\\.io\$\/i\.test\(location\.hostname\)\)return;[\s\S]*?<\/script>\s*)/,
      `$1${cssBoot}`
    );
    html = html.replace(/(<script src="\/js\/pages-base\.js"><\/script>\s*)/, `$1${cssBoot}`);
  }
  writeFileSync(file, html);
  changed += 1;
}
console.log(`injected external pages-base into ${changed} html files`);

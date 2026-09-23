/**
 * Lightweight CSS minify for production (no deps).
 * Usage: node scripts/minify-css.mjs
 *
 * Important: do NOT strip spaces around + / - inside calc()/clamp()/min()/max(),
 * or those declarations become invalid and silently fall back (e.g. hero type).
 *
 * Bundles tokens.css + main.css into one file to cut an HTTP request.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tokens = join(root, "css", "tokens.css");
const src = join(root, "css", "main.css");
const dest = join(root, "css", "main.min.css");

const held = [];
let css = `${readFileSync(tokens, "utf8")}\n${readFileSync(src, "utf8")}`;
css = css
  .replace(/\/\*[\s\S]*?\*\//g, "")
  // Preserve math functions so "1.5rem + 3.7vw" keeps required spaces around +/−
  .replace(
    /\b(?:calc|clamp|min|max)\([^;{}]*?\)/gi,
    (m) => {
      held.push(m.replace(/\s+/g, " ").trim());
      return `__CSSMATH${held.length - 1}__`;
    }
  )
  .replace(/\s+/g, " ")
  .replace(/\s*([{}:;,>~])\s*/g, "$1")
  .replace(/;}/g, "}")
  .replace(/__CSSMATH(\d+)__/g, (_, i) => held[Number(i)])
  .trim();

writeFileSync(dest, css);
console.log(`main.min.css ${(css.length / 1024).toFixed(1)} KiB (tokens+main bundled)`);

/**
 * Lightweight CSS minify for production (no deps).
 * Usage: node scripts/minify-css.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "css", "main.css");
const dest = join(root, "css", "main.min.css");

let css = readFileSync(src, "utf8");
css = css
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\s+/g, " ")
  .replace(/\s*([{}:;,>~+])\s*/g, "$1")
  .replace(/;}/g, "}")
  .trim();

writeFileSync(dest, css);
console.log(`main.min.css ${(css.length / 1024).toFixed(1)} KiB (from ${(readFileSync(src).length / 1024).toFixed(1)} KiB)`);

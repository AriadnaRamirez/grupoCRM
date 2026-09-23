import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const olds = [
  "footer-seo",
  "psi-mob",
  "cat-contrast",
  "hero-m-h",
  "perf2",
  "bot-a11y",
  "cls-m1",
  "trust-1",
  "dates-1",
  "proof-1",
  "h2-1",
  "img-1",
  "rb-1",
  "rb-2",
  "rb-3",
];
const neu = "rb-4";

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".git") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith(".html")) out.push(p);
  }
  return out;
}

let n = 0;
for (const f of walk(root)) {
  let t = readFileSync(f, "utf8");
  const o = t;
  for (const v of olds) {
    t = t.split(`main.min.css?v=${v}`).join(`main.min.css?v=${neu}`);
    t = t.split(`tokens.css?v=${v}`).join(`tokens.css?v=${neu}`);
    t = t.split(`app.min.js?v=${v}`).join(`app.min.js?v=${neu}`);
  }
  if (t !== o) {
    writeFileSync(f, t);
    n++;
  }
}
console.log(`updated ${n} html files to v=${neu}`);

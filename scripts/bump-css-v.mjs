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
  "rb-31",
  "rb-30",
  "rb-29",
  "rb-28",
  "rb-27",
  "rb-26",
  "rb-25",
  "rb-24",
  "rb-23",
  "rb-22",
  "rb-21",
  "rb-20",
  "rb-19",
  "rb-18",
  "rb-17",
  "rb-16",
  "rb-15",
  "rb-14",
  "rb-13",
  "rb-12",
  "rb-110",
  "rb-11",
  "rb-10",
  "rb-9",
  "rb-8",
  "rb-7",
  "rb-6",
  "rb-5",
  "rb-4",
  "rb-3",
  "rb-2",
  "rb-1",
];
const neu = "rb-32";

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".git") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith(".html")) out.push(p);
  }
  return out;
}

function bumpToken(text, from, to) {
  const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`(\\?v=)${escaped}(?!\\d)`, "g"), `$1${to}`);
}

let n = 0;
for (const f of walk(root)) {
  let t = readFileSync(f, "utf8");
  const o = t;
  for (const v of olds) t = bumpToken(t, v, neu);
  if (t !== o) {
    writeFileSync(f, t);
    n++;
  }
}
console.log(`updated ${n} html files to v=${neu}`);

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const skip = new Set(["node_modules", ".git", "assets"]);

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (skip.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (/\.(html|js)$/i.test(name)) acc.push(p);
  }
  return acc;
}

const files = walk(root);
const missingAlt = [];
const emptyAlt = [];
const missingDim = [];
const imgRe = /<img\b[^>]*>/gi;

for (const file of files) {
  const text = readFileSync(file, "utf8");
  let m;
  while ((m = imgRe.exec(text))) {
    const tag = m[0];
    const line = text.slice(0, m.index).split("\n").length;
    const rel = relative(root, file).replaceAll("\\", "/");
    const alt = /\balt\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(tag);
    const hasW = /\bwidth\s*=/i.test(tag);
    const hasH = /\bheight\s*=/i.test(tag);
    if (!alt) missingAlt.push(`${rel}:${line}`);
    else if ((alt[2] ?? alt[3] ?? alt[4] ?? "") === "") emptyAlt.push(`${rel}:${line}`);
    if (!hasW || !hasH) missingDim.push(`${rel}:${line}`);
  }
}

console.log(`NO_ALT ${missingAlt.length}`);
missingAlt.forEach((x) => console.log(x));
console.log(`EMPTY_ALT ${emptyAlt.length}`);
emptyAlt.forEach((x) => console.log(x));
console.log(`MISSING_DIM ${missingDim.length}`);
missingDim.forEach((x) => console.log(x));

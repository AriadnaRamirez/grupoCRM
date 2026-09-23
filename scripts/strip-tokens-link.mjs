/**
 * One-shot: drop separate tokens.css <link> (now bundled in main.min.css)
 * and align logo width/height with natural 720×154.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".git" || name === "assets") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith(".html")) out.push(p);
  }
  return out;
}

let n = 0;
for (const f of walk(".")) {
  let t = readFileSync(f, "utf8");
  const o = t;
  t = t.replace(/\s*<link[^>]*href=["'][^"']*tokens\.css[^"']*["'][^>]*>\s*/gi, "\n");
  t = t.replace(/width="243" height="52"/g, 'width="720" height="154"');
  t = t.replace(/aspect-ratio:\s*243\s*\/\s*52/g, "aspect-ratio: 720 / 154");
  if (t !== o) {
    writeFileSync(f, t);
    n += 1;
  }
}
console.log(`updated ${n} html files`);

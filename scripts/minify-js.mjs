/**
 * Bundle + minify JS entry for production (esbuild via npx, no lockfile dep).
 * Usage: node scripts/minify-js.mjs
 */
import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, statSync } from "node:fs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const entry = join(root, "js", "main.js");
const outfile = join(root, "js", "app.min.js");

const result = spawnSync(
  "npx",
  [
    "--yes",
    "esbuild@0.25.9",
    entry,
    "--bundle",
    "--minify",
    "--format=esm",
    "--target=es2020",
    `--outfile=${outfile}`,
    "--legal-comments=none",
  ],
  { cwd: root, stdio: "inherit", shell: true }
);

if (result.status !== 0) process.exit(result.status || 1);
if (!existsSync(outfile)) {
  console.error("app.min.js was not written");
  process.exit(1);
}
const kb = (statSync(outfile).size / 1024).toFixed(1);
console.log(`js/app.min.js ${kb} KiB`);

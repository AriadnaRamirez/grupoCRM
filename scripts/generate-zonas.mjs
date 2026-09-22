/**
 * Legacy entry: /zonas pages are now redirects to /extintores-*.
 * Prefer: npm run seo:local
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const r = spawnSync(process.execPath, [join(root, "scripts/generate-seo-local.mjs")], {
  stdio: "inherit",
  cwd: root,
});
process.exit(r.status ?? 1);

import { mkdirSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, parse } from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outRoot = join(root, "assets/img/opt");

function list(dir, ext) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => ext.test(name) && !name.startsWith("_"))
    .map((name) => join(dir, name));
}

async function writeWebp(input, output, { width, flatten } = {}) {
  mkdirSync(dirname(output), { recursive: true });
  if (existsSync(output) && statSync(output).mtimeMs >= statSync(input).mtimeMs) return "skip";
  let img = sharp(input, { failOn: "none" }).rotate();
  if (flatten) img = img.flatten({ background: "#ffffff" });
  if (width) img = img.resize({ width, withoutEnlargement: true });
  await img.webp({ quality: 74, effort: 4 }).toFile(output);
  return "ok";
}

const jobs = [];

for (const file of list(join(root, "assets/img/full"), /\.jpe?g$/i)) {
  const stem = parse(file).name;
  for (const width of [800, 1400, 1600]) {
    jobs.push([file, join(outRoot, "full", `${stem}-${width}.webp`), { width }]);
  }
}

for (const file of list(join(root, "assets/img/catalog"), /^CRM-\d{4}\.png$/i)) {
  const stem = parse(file).name;
  for (const width of [400, 800]) {
    jobs.push([file, join(outRoot, "catalog", `${stem}-${width}.webp`), { width, flatten: true }]);
  }
}

for (const file of list(join(root, "assets/img"), /^categoria-.*\.(png|jpe?g)$/i)) {
  const stem = parse(file).name;
  for (const width of [480, 960]) {
    jobs.push([file, join(outRoot, `${stem}-${width}.webp`), { width }]);
  }
}

for (const stem of [
  "mascot-inspector-extintor",
  "mascot-inspector-senala",
  "mascot-inspector-ok",
  "mascot-404-llama",
]) {
  const mascot = join(root, "assets/img", `${stem}.png`);
  if (existsSync(mascot)) {
    jobs.push([mascot, join(outRoot, `${stem}.webp`), { width: 640 }]);
  }
}

for (const file of list(join(root, "assets/img/clients"), /\.(png|jpe?g)$/i)) {
  const stem = parse(file).name;
  for (const width of [160, 320]) {
    jobs.push([file, join(outRoot, "clients", `${stem}-${width}.webp`), { width }]);
  }
}

let ok = 0;
let skip = 0;
for (const [input, output, opts] of jobs) {
  const status = await writeWebp(input, output, opts);
  if (status === "ok") ok += 1;
  else skip += 1;
}

console.log(`optimized ${ok}, skipped ${skip}, total ${jobs.length}`);

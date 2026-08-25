/**
 * Remove studio backgrounds and upscale CRM-0001…0055 to 4K (3840×3840).
 * Prefers imgly / rembg-class ONNX if present; otherwise edge-aware flood-fill.
 */
import sharp from "sharp";
import * as ort from "onnxruntime-node";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "fs";
import { join, resolve } from "path";

const root = resolve(import.meta.dirname, "..");
const catalogDir = join(root, "assets", "img", "catalog");
const backupDir = join(catalogDir, "_jpg-backup");
const previewDir = join(catalogDir, "_preview");
const CANVAS = 3840;
const INNER = Math.round(CANVAS * 0.88);
const SKUS = Array.from({ length: 55 }, (_, i) => `CRM-${String(i + 1).padStart(4, "0")}`);

/** Higher-res originals that are clearly the same isolated product photo. */
const SOURCE_UPGRADE = {
  "CRM-0020": join(catalogDir, "_src", "vest-yellow.jpg"),
  "CRM-0021": join(catalogDir, "_src", "vest-orange.jpg"),
  "CRM-0033": join(catalogDir, "_src", "w-wetfloor-iso.jpg"),
  "CRM-0048": join(catalogDir, "_src", "w-firstaid.jpg"),
};

function pickSource(sku) {
  const upgrade = SOURCE_UPGRADE[sku];
  if (upgrade && existsSync(upgrade)) return upgrade;
  const bak = join(backupDir, `${sku}.jpg`);
  if (existsSync(bak)) return bak;
  const live = join(catalogDir, `${sku}.jpg`);
  if (existsSync(live)) return live;
  return null;
}

const MODEL_PATH = join(root, "scripts", "models", "u2netp.onnx");
const U2_SIZE = 320;
const U2_MEAN = [0.485, 0.456, 0.406];
const U2_STD = [0.229, 0.224, 0.225];
let u2session;

async function getU2Session() {
  if (!u2session) {
    u2session = await ort.InferenceSession.create(MODEL_PATH);
  }
  return u2session;
}

async function u2netCutout(inputPath) {
  const orig = await sharp(inputPath, { failOn: "none" })
    .rotate()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = orig.info;

  const resized = await sharp(inputPath, { failOn: "none" })
    .rotate()
    .removeAlpha()
    .resize(U2_SIZE, U2_SIZE, { fit: "fill", kernel: "lanczos3" })
    .raw()
    .toBuffer();

  const hw = U2_SIZE * U2_SIZE;
  const tensor = new Float32Array(3 * hw);
  for (let i = 0; i < hw; i++) {
    tensor[i] = (resized[i * 3] / 255 - U2_MEAN[0]) / U2_STD[0];
    tensor[hw + i] = (resized[i * 3 + 1] / 255 - U2_MEAN[1]) / U2_STD[1];
    tensor[2 * hw + i] = (resized[i * 3 + 2] / 255 - U2_MEAN[2]) / U2_STD[2];
  }

  const sess = await getU2Session();
  const feeds = {
    [sess.inputNames[0]]: new ort.Tensor("float32", tensor, [1, 3, U2_SIZE, U2_SIZE]),
  };
  const results = await sess.run(feeds);
  const pred = results[sess.outputNames[0]].data;

  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < hw; i++) {
    const v = pred[i];
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const range = max - min || 1;
  const maskSmall = Buffer.alloc(hw);
  for (let i = 0; i < hw; i++) {
    let a = (pred[i] - min) / range;
    // Hard snap: kill studio halo, keep product body solid
    a = a < 0.48 ? 0 : a > 0.66 ? 1 : (a - 0.48) / 0.18;
    maskSmall[i] = Math.round(a * 255);
  }

  const maskFull = await sharp(maskSmall, {
    raw: { width: U2_SIZE, height: U2_SIZE, channels: 1 },
  })
    .resize(width, height, { kernel: "lanczos3" })
    .raw()
    .toBuffer();

  const bg = sampleBackground(orig.data, width, height);
  const out = Buffer.from(orig.data);
  const n = width * height;
  const alpha = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    let a = maskFull[i];
    if (a < 90) a = 0;
    else if (a > 170) a = 255;
    alpha[i] = a;
  }

  // Eat leftover studio white that still touches the transparent exterior
  const q = new Int32Array(n);
  let qh = 0;
  let qt = 0;
  const seen = new Uint8Array(n);
  const seed = (i) => {
    if (seen[i] || alpha[i] === 0) return;
    const p = i * 4;
    if (colorDist(out[p], out[p + 1], out[p + 2], bg[0], bg[1], bg[2]) > 36) return;
    if (alpha[i] > 200) return;
    seen[i] = 1;
    q[qt++] = i;
  };
  for (let i = 0; i < n; i++) {
    if (alpha[i] !== 0) continue;
    const x = i % width;
    const y = (i - x) / width;
    if (x > 0) seed(i - 1);
    if (x < width - 1) seed(i + 1);
    if (y > 0) seed(i - width);
    if (y < height - 1) seed(i + width);
  }
  while (qh < qt) {
    const i = q[qh++];
    alpha[i] = 0;
    const x = i % width;
    if (x > 0) seed(i - 1);
    if (x < width - 1) seed(i + 1);
    if (i >= width) seed(i - width);
    if (i < n - width) seed(i + width);
  }

  for (let i = 0; i < n; i++) {
    const p = i * 4;
    const a = alpha[i];
    if (a > 0 && a < 255) {
      const fa = a / 255;
      for (let c = 0; c < 3; c++) {
        const fg = (out[p + c] - (1 - fa) * bg[c]) / fa;
        out[p + c] = Math.max(0, Math.min(255, Math.round(fg)));
      }
    }
    out[p + 3] = a;
  }
  return { data: out, width, height };
}

function colorDist(r, g, b, br, bg, bb) {
  const dr = r - br;
  const dg = g - bg;
  const db = b - bb;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function sampleBackground(data, width, height) {
  const patch = 14;
  const corners = [
    [0, 0],
    [width - patch, 0],
    [0, height - patch],
    [width - patch, height - patch],
  ];
  const rs = [];
  const gs = [];
  const bs = [];
  for (const [sx, sy] of corners) {
    for (let y = sy; y < sy + patch; y++) {
      for (let x = sx; x < sx + patch; x++) {
        const i = (y * width + x) * 4;
        rs.push(data[i]);
        gs.push(data[i + 1]);
        bs.push(data[i + 2]);
      }
    }
  }
  const med = (arr) => {
    const s = arr.slice().sort((a, b) => a - b);
    return s[Math.floor(s.length / 2)];
  };
  return [med(rs), med(gs), med(bs)];
}

function sobelMag(data, width, height) {
  const mag = new Float32Array(width * height);
  const lum = (i) => 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const tl = lum(((y - 1) * width + (x - 1)) * 4);
      const tc = lum(((y - 1) * width + x) * 4);
      const tr = lum(((y - 1) * width + (x + 1)) * 4);
      const ml = lum((y * width + (x - 1)) * 4);
      const mr = lum((y * width + (x + 1)) * 4);
      const bl = lum(((y + 1) * width + (x - 1)) * 4);
      const bc = lum(((y + 1) * width + x) * 4);
      const br = lum(((y + 1) * width + (x + 1)) * 4);
      const gx = -tl + tr - 2 * ml + 2 * mr - bl + br;
      const gy = -tl - 2 * tc - tr + bl + 2 * bc + br;
      mag[y * width + x] = Math.hypot(gx, gy);
    }
  }
  return mag;
}

function floodAlpha(data, width, height, bg) {
  const n = width * height;
  const alpha = new Uint8Array(n);
  alpha.fill(255);
  const seen = new Uint8Array(n);
  const grad = sobelMag(data, width, height);
  const [br, bgc, bb] = bg;

  // Tight vs loose: stay on studio white, stop at product edges (incl. white cabinets).
  const tight = 28;
  const loose = 46;
  const edgeStop = 28;

  const q = new Int32Array(n);
  let qh = 0;
  let qt = 0;

  const trySeed = (x, y) => {
    const i = y * width + x;
    if (seen[i]) return;
    const p = i * 4;
    const d = colorDist(data[p], data[p + 1], data[p + 2], br, bgc, bb);
    if (d > loose) return;
    seen[i] = 1;
    q[qt++] = i;
  };

  for (let x = 0; x < width; x++) {
    trySeed(x, 0);
    trySeed(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    trySeed(0, y);
    trySeed(width - 1, y);
  }

  const neigh = [1, -1, width, -width];
  while (qh < qt) {
    const i = q[qh++];
    alpha[i] = 0;
    const x = i % width;
    const y = (i - x) / width;
    for (const dlt of neigh) {
      const j = i + dlt;
      if (j < 0 || j >= n || seen[j]) continue;
      const nx = j % width;
      const ny = (j - nx) / width;
      if (Math.abs(nx - x) + Math.abs(ny - y) !== 1) continue;
      const p = j * 4;
      const dist = colorDist(data[p], data[p + 1], data[p + 2], br, bgc, bb);
      if (dist <= tight) {
        seen[j] = 1;
        q[qt++] = j;
      } else if (dist <= loose && grad[j] < edgeStop) {
        seen[j] = 1;
        q[qt++] = j;
      }
    }
  }

  // Punch enclosed studio-white holes (spine-board grips, handle loops).
  const holeSeen = new Uint8Array(n);
  const maxHole = Math.floor(n * 0.045);
  for (let i = 0; i < n; i++) {
    if (alpha[i] === 0 || holeSeen[i]) continue;
    const p = i * 4;
    if (colorDist(data[p], data[p + 1], data[p + 2], br, bgc, bb) > 18) continue;
    const stack = [i];
    holeSeen[i] = 1;
    const cells = [];
    let abort = false;
    while (stack.length) {
      const k = stack.pop();
      cells.push(k);
      if (cells.length > maxHole) {
        abort = true;
        break;
      }
      const x = k % width;
      for (const dlt of neigh) {
        const j = k + dlt;
        if (j < 0 || j >= n || holeSeen[j] || alpha[j] === 0) continue;
        const nx = j % width;
        if (Math.abs(nx - x) + Math.abs(((j - nx) / width) - ((k - x) / width)) !== 1) continue;
        const qp = j * 4;
        if (colorDist(data[qp], data[qp + 1], data[qp + 2], br, bgc, bb) > 18) continue;
        holeSeen[j] = 1;
        stack.push(j);
      }
    }
    if (!abort && cells.length >= 40) {
      let varAcc = 0;
      for (const k of cells) {
        const qp = k * 4;
        varAcc += colorDist(data[qp], data[qp + 1], data[qp + 2], br, bgc, bb);
      }
      if (varAcc / cells.length < 12) {
        for (const k of cells) alpha[k] = 0;
      }
    }
  }

  // Soft edge + unfringe
  const out = Buffer.from(data);
  const band = 3;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const p = i * 4;
      if (alpha[i] === 0) {
        out[p + 3] = 0;
        continue;
      }
      let nearBg = false;
      for (let dy = -band; dy <= band && !nearBg; dy++) {
        for (let dx = -band; dx <= band; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          if (alpha[ny * width + nx] === 0) nearBg = true;
        }
      }
      let a = 255;
      if (nearBg) {
        const dist = colorDist(out[p], out[p + 1], out[p + 2], br, bgc, bb);
        a = Math.max(0, Math.min(255, Math.round(((dist - 10) / 36) * 255)));
        if (a < 8) a = 0;
      }
      if (a > 0 && a < 255) {
        const fa = a / 255;
        for (let c = 0; c < 3; c++) {
          const bgv = c === 0 ? br : c === 1 ? bgc : bb;
          const fg = (out[p + c] - (1 - fa) * bgv) / fa;
          out[p + c] = Math.max(0, Math.min(255, Math.round(fg)));
        }
      }
      out[p + 3] = a;
    }
  }
  return out;
}

async function tryU2Net(inputPath) {
  if (!existsSync(MODEL_PATH)) return null;
  try {
    return await u2netCutout(inputPath);
  } catch (err) {
    console.warn("u2net failed", err?.message || err);
    return null;
  }
}

function binarizeAlpha(buf, threshold = 140) {
  for (let i = 3; i < buf.length; i += 4) {
    buf[i] = buf[i] >= threshold ? 255 : 0;
  }
}

function opaqueRatio(buf, width, height) {
  let n = 0;
  for (let i = 3; i < buf.length; i += 4) if (buf[i] > 20) n += 1;
  return n / (width * height);
}

async function cutout(inputPath) {
  const neural = await tryU2Net(inputPath);
  if (neural) {
    const ratio = opaqueRatio(neural.data, neural.width, neural.height);
    if (ratio > 0.08 && ratio < 0.97) {
      return { ...neural, method: "u2netp", ratio };
    }
    console.warn("u2net ratio out of range", ratio?.toFixed?.(3) ?? ratio, "— falling back to flood");
  }

  const { data, info } = await sharp(inputPath, { failOn: "none" })
    .rotate()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const bg = sampleBackground(data, info.width, info.height);
  const out = floodAlpha(data, info.width, info.height, bg);
  const ratio = opaqueRatio(out, info.width, info.height);
  return {
    data: out,
    width: info.width,
    height: info.height,
    method: "flood",
    ratio,
    bg,
  };
}

async function toFourK(cut, outPng, outWebp, sku) {
  const trimmed = await sharp(cut.data, {
    raw: { width: cut.width, height: cut.height, channels: 4 },
  })
    .trim({ threshold: 8 })
    .png()
    .toBuffer();

  const resized = await sharp(trimmed)
    .resize(INNER, INNER, {
      fit: "inside",
      withoutEnlargement: false,
      kernel: sharp.kernel.lanczos3,
    })
    .png()
    .toBuffer();

  const meta = await sharp(resized).metadata();
  const padX = Math.max(0, CANVAS - (meta.width || INNER));
  const padY = Math.max(0, CANVAS - (meta.height || INNER));
  const left = Math.floor(padX / 2);
  const top = Math.floor(padY / 2);

  const canvas = sharp({
    create: {
      width: CANVAS,
      height: CANVAS,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  }).composite([{ input: resized, left, top }]);

  await canvas
    .clone()
    .png({ compressionLevel: 9, effort: 8, adaptiveFiltering: true })
    .toFile(outPng);

  const pngStat = statSync(outPng);
  if (pngStat.size > 3_200_000) {
    const tmp = `${outPng}.tmp.png`;
    await sharp(outPng)
      .png({ compressionLevel: 9, effort: 10, palette: true, quality: 90, dither: 0.6 })
      .toFile(tmp);
    const tmpStat = statSync(tmp);
    if (tmpStat.size < pngStat.size) {
      copyFileSync(tmp, outPng);
    }
    try {
      unlinkSync(tmp);
    } catch {
      /* ignore */
    }
  }

  if (process.argv.includes("--webp")) {
    await sharp(outPng)
      .webp({ quality: 82, alphaQuality: 100, effort: 4, smartSubsample: true })
      .toFile(outWebp);
  }

  await sharp(outPng)
    .resize(480, 480, { fit: "contain", background: { r: 36, g: 48, b: 66, alpha: 1 } })
    .flatten({ background: "#243042" })
    .jpeg({ quality: 82 })
    .toFile(join(previewDir, `${sku}-preview.jpg`));
}

function backupOriginals() {
  mkdirSync(backupDir, { recursive: true });
  let n = 0;
  for (const sku of SKUS) {
    const src = join(catalogDir, `${sku}.jpg`);
    const dest = join(backupDir, `${sku}.jpg`);
    if (existsSync(src) && !existsSync(dest)) {
      copyFileSync(src, dest);
      n += 1;
    }
  }
  return n;
}

const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const targets = only.length ? only : SKUS;

mkdirSync(previewDir, { recursive: true });
const backed = backupOriginals();
console.log(`backed up ${backed} jpgs → ${backupDir}`);

const report = [];
for (const sku of targets) {
  const src = pickSource(sku);
  if (!src) {
    console.log("MISSING", sku);
    report.push({ sku, ok: false, error: "missing source" });
    continue;
  }
  const t0 = Date.now();
  try {
    const srcMeta = await sharp(src, { failOn: "none" }).metadata();
    const cut = await cutout(src);
    binarizeAlpha(cut.data, 140);
    const pngPath = join(catalogDir, `${sku}.png`);
    const webpPath = join(catalogDir, `${sku}.webp`);
    await toFourK(cut, pngPath, webpPath, sku);
    const pngKb = Math.round(statSync(pngPath).size / 1024);
    const webpKb = existsSync(webpPath) ? Math.round(statSync(webpPath).size / 1024) : 0;
    const row = {
      sku,
      ok: true,
      method: cut.method,
      src: src.replace(root + "\\", ""),
      from: `${srcMeta.width}x${srcMeta.height}`,
      ratio: cut.ratio != null ? Number(cut.ratio.toFixed(3)) : undefined,
      pngKb,
      webpKb,
      ms: Date.now() - t0,
    };
    report.push(row);
    console.log(
      `${sku} ${row.method} ${row.from} → 3840 PNG ${pngKb}KB${webpKb ? ` WebP ${webpKb}KB` : ""}  ${row.ms}ms`
    );
  } catch (err) {
    console.error("FAIL", sku, err);
    report.push({ sku, ok: false, error: String(err?.message || err) });
  }
}

writeFileSync(join(catalogDir, "_process-report.json"), JSON.stringify(report, null, 2));
const ok = report.filter((r) => r.ok);
const fail = report.filter((r) => !r.ok);
console.log(`\ndone ${ok.length}/${report.length}  failures=${fail.length}`);
if (fail.length) console.log(fail);

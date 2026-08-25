import sharp from "sharp";
import { mkdirSync } from "fs";
import { join } from "path";

const srcDir = "assets/img";
const cropDir = "assets/img/crop";
const fullDir = "assets/img/full";
mkdirSync(cropDir, { recursive: true });
mkdirSync(fullDir, { recursive: true });

/** Crop as fractions of original: left, top, width, height */
const crops = {
  "galeria-alberca.png": [0.36, 0.46, 0.64, 0.54],
  "galeria-almacen.png": [0.16, 0.26, 0.62, 0.64],
  "galeria-automotriz.png": [0.0, 0.46, 1.0, 0.46],
  "galeria-bar.png": [0.0, 0.5, 0.62, 0.5],
  "galeria-bodega.png": [0.02, 0.4, 0.96, 0.58],
  "galeria-cafeteria.png": [0.16, 0.16, 0.6, 0.74],
  "galeria-camioneta.png": [0.0, 0.46, 1.0, 0.54],
  "galeria-campus.png": [0.0, 0.5, 0.7, 0.5],
  "galeria-clinica.png": [0.46, 0.5, 0.54, 0.5],
  "galeria-cocina.png": [0.1, 0.26, 0.68, 0.66],
  "galeria-comedor.png": [0.0, 0.46, 1.0, 0.54],
  "galeria-comercio.png": [0.04, 0.5, 0.92, 0.5],
  "galeria-deportivo.png": [0.3, 0.4, 0.7, 0.6],
  "galeria-entrega.png": [0.0, 0.18, 1.0, 0.82],
  "galeria-escuela-patio.png": [0.0, 0.16, 0.84, 0.84],
  "galeria-escuela.png": [0.04, 0.5, 0.92, 0.5],
  "galeria-estacionamiento.png": [0.0, 0.32, 0.58, 0.66],
  "galeria-evento.png": [0.0, 0.52, 1.0, 0.48],
  "galeria-extintores-sitio.png": [0.02, 0.4, 0.96, 0.6],
  "galeria-gabinetes-sitio.png": [0.0, 0.36, 1.0, 0.64],
  "galeria-inventario.png": [0.16, 0.36, 0.72, 0.62],
  "galeria-lavanderia.png": [0.2, 0.1, 0.46, 0.72],
  "galeria-local.png": [0.22, 0.52, 0.52, 0.48],
  "galeria-madereria.png": [0.06, 0.26, 0.82, 0.7],
  "galeria-obra.png": [0.0, 0.52, 1.0, 0.48],
  "galeria-panaderia.png": [0.4, 0.58, 0.6, 0.42],
  "galeria-parrilla.png": [0.0, 0.52, 0.56, 0.48],
  "galeria-restaurante.png": [0.0, 0.48, 1.0, 0.52],
  "galeria-salon-eventos.png": [0.02, 0.42, 0.96, 0.56],
  "galeria-showroom-muro.png": [0.0, 0.48, 0.56, 0.52],
  "galeria-showroom.png": [0.0, 0.46, 0.6, 0.54],
  "galeria-trailer.png": [0.0, 0.52, 0.52, 0.48],
  "galeria-transporte.png": [0.0, 0.58, 0.72, 0.42],
  "galeria-vapiano.png": [0.06, 0.5, 0.88, 0.5],
};

function box(meta, frac) {
  const [lf, tf, wf, hf] = frac;
  let left = Math.max(0, Math.round(meta.width * lf));
  let top = Math.max(0, Math.round(meta.height * tf));
  let width = Math.round(meta.width * wf);
  let height = Math.round(meta.height * hf);
  if (left + width > meta.width) width = meta.width - left;
  if (top + height > meta.height) height = meta.height - top;
  width = Math.max(8, width - (width % 2));
  height = Math.max(8, height - (height % 2));
  return { left, top, width, height };
}

async function enhance(pipeline, longEdge) {
  const meta = await pipeline.metadata();
  const longest = Math.max(meta.width, meta.height);
  const target = Math.max(longEdge, Math.round(longest * 1.7));
  return pipeline
    .resize({
      width: meta.width >= meta.height ? target : undefined,
      height: meta.height > meta.width ? target : undefined,
      fit: "inside",
      withoutEnlargement: false,
      kernel: sharp.kernel.lanczos3,
    })
    .modulate({ brightness: 1.06, saturation: 1.16 })
    .linear(1.14, -(128 * 0.14))
    .sharpen({ sigma: 1.15, m1: 1, m2: 2.4 })
    .jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: "4:4:4" });
}

const names = Object.keys(crops).sort();
for (const name of names) {
  const input = join(srcDir, name);
  const stem = name.replace(/\.png$/i, "");
  const base = sharp(input, { failOn: "none", unlimited: true }).rotate();
  const meta = await base.metadata();

  const fullPipe = await enhance(
    sharp(input, { failOn: "none", unlimited: true }).rotate(),
    2000
  );
  const fullOut = join(fullDir, `${stem}.jpg`);
  await fullPipe.toFile(fullOut);

  const region = box(meta, crops[name]);
  const cropPipe = await enhance(
    sharp(input, { failOn: "none", unlimited: true }).rotate().extract(region),
    1800
  );
  const cropOut = join(cropDir, `${stem}.jpg`);
  await cropPipe.toFile(cropOut);

  console.log(
    stem,
    `${meta.width}x${meta.height}`,
    "→ crop",
    `${region.width}x${region.height}`,
    "ok"
  );
}

console.log("done", names.length);

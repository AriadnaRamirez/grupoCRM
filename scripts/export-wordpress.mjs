import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "wordpress-export");
const imgOut = path.join(outDir, "imagenes");
const data = await import(pathToFileURL(path.join(root, "js", "data.js")).href);
const { products, categories, company, catName } = data;

const SITE = "https://TU-DOMINIO.com";
const IMG_BASE = `${SITE}/wp-content/uploads/crm`;

function csvCell(value) {
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function htmlDesc(p) {
  const rows = [
    ["Clave", p.sku],
    ["Línea", catName(p.cat)],
    ["Capacidad / medidas", p.cap],
    ["Agente / material", p.agent],
    ["Clases de fuego", p.classes],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`)
    .join("");
  return [
    `<h2>Descripción</h2>`,
    `<p>${p.desc}</p>`,
    `<h2>Uso recomendado</h2>`,
    `<p>${p.use}</p>`,
    `<table>${rows}</table>`,
    `<p>Solicite cotización y disponibilidad.</p>`,
  ].join("");
}

fs.mkdirSync(imgOut, { recursive: true });

let copied = 0;
for (const p of products) {
  const src = path.join(root, "assets", "img", "catalog", `${p.sku}.png`);
  if (!fs.existsSync(src)) {
    console.warn("Falta imagen", p.sku);
    continue;
  }
  fs.copyFileSync(src, path.join(imgOut, `${p.sku}.png`));
  copied += 1;
}

const csvHeader = [
  "Type",
  "SKU",
  "Name",
  "Published",
  "Is featured?",
  "Visibility in catalog",
  "Short description",
  "Description",
  "In stock?",
  "Stock",
  "Backorders allowed?",
  "Sold individually?",
  "Allow customer reviews?",
  "Regular price",
  "Sale price",
  "Categories",
  "Tags",
  "Images",
  "Attribute 1 name",
  "Attribute 1 value(s)",
  "Attribute 1 visible",
  "Attribute 1 global",
  "Attribute 2 name",
  "Attribute 2 value(s)",
  "Attribute 2 visible",
  "Attribute 2 global",
  "Attribute 3 name",
  "Attribute 3 value(s)",
  "Attribute 3 visible",
  "Attribute 3 global",
];

const csvRows = products.map((p) =>
  [
    "simple",
    p.sku,
    p.title,
    "1",
    "0",
    "visible",
    p.use,
    htmlDesc(p),
    "1",
    "",
    "0",
    "0",
    "0",
    "",
    "",
    catName(p.cat),
    "Catálogo CRM",
    `${IMG_BASE}/${p.sku}.png`,
    "Capacidad",
    p.cap,
    "1",
    "0",
    "Agente",
    p.agent,
    "1",
    "0",
    "Clases de fuego",
    p.classes,
    "1",
    "0",
  ].map(csvCell).join(",")
);

fs.writeFileSync(
  path.join(outDir, "woocommerce-productos.csv"),
  `\uFEFF${csvHeader.join(",")}\n${csvRows.join("\n")}\n`,
  "utf8"
);

const json = {
  empresa: {
    nombre: company.name,
    slogan: company.slogan,
    telefono: company.phone,
    whatsapp: company.whatsappShow,
    email: company.email,
    aviso: "Solicite cotización y disponibilidad.",
  },
  categorias: categories.map((c) => ({
    id: c.id,
    nombre: c.name,
    productos: products.filter((p) => p.cat === c.id).length,
  })),
  productos: products.map((p) => ({
    sku: p.sku,
    nombre: p.title,
    categoria: catName(p.cat),
    categoria_id: p.cat,
    capacidad: p.cap,
    agente: p.agent,
    clases: p.classes,
    descripcion: p.desc,
    uso_recomendado: p.use,
    imagen: `imagenes/${p.sku}.png`,
    imagen_wordpress: `${IMG_BASE}/${p.sku}.png`,
  })),
};

fs.writeFileSync(path.join(outDir, "productos.json"), JSON.stringify(json, null, 2), "utf8");

const htmlBlocks = categories
  .map((c) => {
    const items = products
      .filter((p) => p.cat === c.id)
      .map(
        (p) => `    <article class="crm-ficha" id="${p.sku}">
      <img src="imagenes/${p.sku}.png" alt="${p.title}">
      <div>
        <p class="sku">${p.sku}</p>
        <h3>${p.title}</h3>
        <h4>Descripción</h4>
        <p>${p.desc}</p>
        <h4>Uso recomendado</h4>
        <p>${p.use}</p>
        <ul>
          ${p.cap ? `<li><strong>Capacidad / medidas:</strong> ${p.cap}</li>` : ""}
          ${p.agent ? `<li><strong>Agente / material:</strong> ${p.agent}</li>` : ""}
          ${p.classes ? `<li><strong>Clases de fuego:</strong> ${p.classes}</li>` : ""}
        </ul>
      </div>
    </article>`
      )
      .join("\n");
    return `  <section>
    <h2>${c.name}</h2>
${items}
  </section>`;
  })
  .join("\n");

const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Catálogo · ${company.name}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #202020; max-width: 960px; margin: 0 auto; padding: 24px; }
    h1 { color: #c11234; }
    h2 { color: #1e2538; border-bottom: 2px solid #f7b000; padding-bottom: 6px; }
    h4 { color: #1e2538; margin: 12px 0 4px; text-transform: uppercase; font-size: 13px; letter-spacing: .08em; }
    .sku { color: #c11234; font-weight: 700; margin: 0; }
    .crm-ficha { display: grid; grid-template-columns: 220px 1fr; gap: 20px; border: 1px solid #dce3ee; border-radius: 12px; padding: 16px; margin: 16px 0; }
    .crm-ficha img { width: 100%; height: auto; object-fit: contain; background: #fff; }
    .aviso { background: #f8e9ec; padding: 12px 16px; border-radius: 8px; }
    @media (max-width: 700px) { .crm-ficha { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <h1>${company.name}</h1>
  <p>${company.tagline}. ${company.slogan}</p>
  <p class="aviso">Solicite cotización y disponibilidad.<br>
    Tel. ${company.phone} · WhatsApp ${company.whatsappShow} · ${company.email}</p>
${htmlBlocks}
</body>
</html>
`;

fs.writeFileSync(path.join(outDir, "catalogo-wordpress.html"), html, "utf8");

const readme = `Catálogo Grupo CRM Extintores — paquete para WordPress
======================================================

55 productos (CRM-0001 a CRM-0055), extraídos del catálogo oficial.
No incluye precios. El cliente solicita cotización.

Archivos
--------
- woocommerce-productos.csv  Importación de productos WooCommerce
- productos.json             Datos del catálogo (plugins, WP All Import, etc.)
- catalogo-wordpress.html    Página HTML lista para pegar o publicar
- imagenes/CRM-XXXX.png      Fotos 4K con fondo transparente (55 archivos)

Opción A — WooCommerce (catálogo de productos)
1. En WordPress instale WooCommerce.
2. Suba la carpeta imagenes/ a:
   wp-content/uploads/crm/
   (por FTP, el Administrador de archivos del hosting, o un plugin de carga masiva).
3. Abra woocommerce-productos.csv con un editor de texto y reemplace:
   TU-DOMINIO.com
   por el dominio real, por ejemplo tienda.grupocrm.mx
   Las imágenes quedarán así:
   https://tienda.grupocrm.mx/wp-content/uploads/crm/CRM-0001.png
4. En WordPress: Productos → Importar → seleccione el CSV.
5. Deje el precio vacío si no va a vender en línea.

Opción B — WP All Import (o similar)
1. Suba las imágenes a la Biblioteca de medios, o indique la carpeta imagenes/.
2. Importe productos.json o el CSV.
3. Asigne:
   sku → SKU
   nombre → Título
   descripcion → Descripción
   uso_recomendado → Descripción corta
   categoria → Categoría
   imagen → Imagen destacada

Opción C — Una sola página de catálogo
1. Cree una página en WordPress llamada Catálogo.
2. Suba las 55 fotos a Medios.
3. Abra catalogo-wordpress.html, copie el contenido y péguelo en un bloque HTML
   personalizado. Ajuste las rutas de las imágenes a las URLs de Medios,
   o suba imagenes/ junto al HTML por FTP.

Notas
-----
- Las fichas del sitio estático (producto.html?sku=CRM-0001) usan la misma
  información: descripción, uso recomendado, clave, línea, capacidad, agente
  y clases de fuego.
- WhatsApp de cotización: 55 5438 3241
- Teléfono: 56 5947 4605
- Correo: crm.extintores@gmail.com
`;

fs.writeFileSync(path.join(outDir, "LEEME.txt"), readme, "utf8");

console.log(`Exportados ${products.length} productos, ${copied} imágenes → wordpress-export/`);

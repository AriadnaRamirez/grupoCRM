/**
 * Inject a crawlable, visually-hidden link map + stable header/footer shells
 * so bots see links without causing CLS when JS hydrates the chrome.
 * Usage: node scripts/inject-bot-chrome.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const botNav = `<nav class="bot-nav" aria-label="Enlaces del sitio">
    <a href="/">Inicio</a>
    <a href="/productos">Productos</a>
    <a href="/nosotros">Nosotros</a>
    <a href="/grupo-crm-extintores">Grupo CRM Extintores</a>
    <a href="/extintores-chamixto">Extintores Chamixto</a>
    <a href="/inspector-crm">Inspector CRM</a>
    <a href="/venta-extintores">Venta de extintores</a>
    <a href="/recarga-extintores">Recarga</a>
    <a href="/mantenimiento-extintores">Mantenimiento</a>
    <a href="/instalacion-extintores">Instalación</a>
    <a href="/senalizacion">Señalización</a>
    <a href="/galeria">Galería</a>
    <a href="/blog">Blog</a>
    <a href="/contacto">Contacto</a>
    <a href="/extintores-cdmx">Extintores CDMX</a>
    <a href="/extintores-estado-de-mexico">Estado de México</a>
    <a href="/extintores-cuajimalpa">Extintores en Cuajimalpa</a>
    <a href="/extintores-naucalpan">Naucalpan</a>
    <a href="/extintores-huixquilucan">Huixquilucan</a>
    <a href="/mapa-sitio">Mapa de sitio</a>
    <a href="/aviso-privacidad">Aviso de privacidad</a>
    <a href="/politica-de-servicio">Política de servicio</a>
    <a href="/fuentes-y-normatividad">Fuentes y normatividad</a>
    <a href="tel:5667481489">56 6748 1489</a>
    <a href="mailto:crm.extintores@gmail.com">crm.extintores@gmail.com</a>
  </nav>`;

const botHeader = `<div data-header>
    <div class="site-chrome header-skel" aria-hidden="true">
      <div class="site-topbar"><div class="wrap topbar__inner"></div></div>
      <header class="site-header">
        <div class="wrap header__inner">
          <a class="brand" href="/"><picture><source type="image/webp" srcset="/assets/img/logo-crm.webp"><img src="/assets/img/logo-crm.png" alt="Grupo CRM Extintores" width="243" height="52" decoding="async"></picture></a>
          <span class="header-skel__nav" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></span>
          <span class="header-skel__cta" aria-hidden="true"></span>
        </div>
      </header>
    </div>
  </div>`;

const botFooter = `<div data-footer></div>`;

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if ([".git", "node_modules", "assets", "zonas"].includes(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (name.endsWith(".html")) acc.push(p);
  }
  return acc;
}

const headerRe = /<div data-header>[\s\S]*?<\/div>(?=\s*<main\b)/i;
const footerRe = /<div data-footer>[\s\S]*?<\/div>(?=\s*<script\b)/i;
const botNavRe = /<nav class="bot-nav"[\s\S]*?<\/nav>\s*/i;

let n = 0;
for (const file of walk(root)) {
  let t = readFileSync(file, "utf8");
  const before = t;

  t = t.replace(botNavRe, "");
  if (headerRe.test(t)) t = t.replace(headerRe, botHeader);
  if (footerRe.test(t)) t = t.replace(footerRe, botFooter);

  // Insert bot-nav after skip-link (outside data-header so JS never removes it)
  if (!t.includes('class="bot-nav"')) {
    t = t.replace(
      /(<a class="skip-link"[^>]*>[\s\S]*?<\/a>\s*)/i,
      `$1${botNav}\n  `
    );
  }

  if (t !== before) {
    writeFileSync(file, t);
    n++;
  }
}

console.log(`bot chrome stabilized in ${n} html files`);

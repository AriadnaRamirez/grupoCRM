/**
 * Local SEO pages: hubs, location pages (/extintores-*), service landings.
 * Content is generated from js/data.js coverage (confirmed zones only).
 * Location pages = service areas, not physical branches.
 *
 * Usage: node scripts/generate-seo-local.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  zonas,
  zonasCdmx,
  zonasEdomex,
  zonaBySlug,
  zonaRegionLabel,
  zonaTypeLabel,
  extintoresPath,
  extintoresHubPath,
  seoServicePages,
  seoServiceBySlug,
  company,
  SITE,
} from "../js/data.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = "rb-13";
const MONTHS_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];
function formatDateEs(iso) {
  const [y, m, d] = String(iso).split("-").map(Number);
  return `${d} de ${MONTHS_ES[m - 1]} de ${y}`;
}
function contentDatesHtml() {
  return `<p class="content-dates content-dates--page">
          <span>Publicado el <time datetime="${SITE.contentPublished}">${formatDateEs(SITE.contentPublished)}</time></span>
          <span class="content-dates__sep" aria-hidden="true">·</span>
          <span>Actualizado el <time datetime="${SITE.contentModified}">${formatDateEs(SITE.contentModified)}</time></span>
        </p>`;
}
const cssBoot = `  <style id="css-boot">
  /* Critical first paint: reserve chrome + hero before async main.css (CLS) */
  :root { --chrome-h: 108px; }
  @media (min-width: 1024px) { :root { --chrome-h: 113px; } }
  html { background: #fff; }
  body { margin: 0; color: #202020; font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif; }
  .bot-nav {
    position: absolute !important; width: 1px !important; height: 1px !important;
    padding: 0 !important; margin: -1px !important; overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important; clip-path: inset(50%) !important;
    white-space: nowrap !important; border: 0 !important;
  }
  .site-chrome { position: fixed; top: 0; left: 0; right: 0; z-index: 60; background: #fff; }
  .header-skel { height: var(--chrome-h); max-height: var(--chrome-h); overflow: hidden; pointer-events: none; }
  .header-skel .brand { pointer-events: auto; }
  .header-skel .nav, .header-skel .header__cta { display: none !important; }
  body:has([data-header]:empty),
  body:has([data-header] .header-skel),
  body:has([data-header] .site-chrome) {
    padding-top: calc(var(--chrome-h) + env(safe-area-inset-top, 0px));
  }
  .brand img { display: block; width: auto; height: auto; max-height: 47px; aspect-ratio: 720 / 154; object-fit: contain; }
  .hero-slider { position: relative; isolation: isolate; min-height: min(72vh, 646px); overflow: hidden; background: #1a2031; }
  @media (max-width: 760px) {
    .hero-slider:not(.home-gallery) { min-height: min(78dvh, 660px); }
  }
  @media (max-width: 480px) {
    .hero-slider:not(.home-gallery) { min-height: min(74dvh, 600px); }
  }
  .slide { position: absolute; inset: 0; opacity: 0; visibility: hidden; pointer-events: none; color: #fff; }
  .slide.is-active { opacity: 1; visibility: visible; pointer-events: auto; }
  .slide__photo { position: absolute; inset: 0 0 0 auto; width: min(50%, 720px); }
  .slide__photo img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: center bottom; }
  </style>
`;

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function waHref(text) {
  return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(text)}`;
}

function hashSlug(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}

function crumbItem(position, name, url) {
  return {
    "@type": "ListItem",
    position,
    name,
    item: { "@type": "WebPage", "@id": url, name },
  };
}

function breadcrumbList(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    name: items.map((item) => item.name).join(" › "),
    itemListElement: items.map((item, i) => crumbItem(i + 1, item.name, item.item)),
  };
}

function pageShell({ title, description, canonical, bodyAttrs, main, jsonLd = "" }) {
  const origin = SITE.origin;
  return `<!DOCTYPE html>
<html lang="es-MX" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
${cssBoot}
  <link rel="stylesheet" href="/css/main.min.css?v=${CACHE}">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="${SITE.themeColor}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_MX">
  <meta property="og:site_name" content="${escapeHtml(company.shortName)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${origin}/assets/img/og-crm.jpg">
  <meta property="og:image:alt" content="Grupo CRM Extintores en CDMX y Estado de México">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/jpeg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${origin}/assets/img/og-crm.jpg">
  <link rel="icon" type="image/png" href="/assets/img/favicon.png" sizes="192x192">
  <link rel="apple-touch-icon" href="/assets/img/favicon.png">
  <script>
  (function () {
    function loadFa() {
      if (document.getElementById("fa-css")) return;
      var link = document.createElement("link");
      link.id = "fa-css";
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css";
      link.crossOrigin = "anonymous";
      link.referrerPolicy = "no-referrer";
      document.head.appendChild(link);
    }
    if ("requestIdleCallback" in window) window.requestIdleCallback(loadFa, { timeout: 6000 });
    else window.addEventListener("load", function () { setTimeout(loadFa, 2500); }, { once: true });
  })();
  </script>
  <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer"></noscript>
  <script type="application/ld+json" id="seo-organization">{"@context":"https://schema.org","@type":"Organization","@id":"${origin}/#organization","name":"${escapeHtml(company.name)}","alternateName":["CRM Extintores","Grupo CRM","GRUPO CRM Extintores"],"url":"${origin}"}</script>
  <script type="application/ld+json" id="seo-website">{"@context":"https://schema.org","@type":"WebSite","@id":"${origin}/#website","name":"CRM Extintores","url":"${origin}"}</script>
${jsonLd}
</head>
<body ${bodyAttrs}>
  <a class="skip-link" href="#contenido">Saltar al contenido</a>
  <nav class="bot-nav" aria-label="Enlaces del sitio">
    <a href="/">Inicio</a>
    <a href="/productos">Productos</a>
    <a href="/nosotros">Nosotros</a>
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
    <a href="/extintores-cuajimalpa">Cuajimalpa</a>
    <a href="/extintores-naucalpan">Naucalpan</a>
    <a href="/extintores-huixquilucan">Huixquilucan</a>
    <a href="/mapa-sitio">Mapa de sitio</a>
    <a href="/aviso-privacidad">Aviso de privacidad</a>
    <a href="/politica-de-servicio">Política de servicio</a>
    <a href="/fuentes-y-normatividad">Fuentes y normatividad</a>
    <a href="tel:5667481489">56 6748 1489</a>
    <a href="mailto:crm.extintores@gmail.com">crm.extintores@gmail.com</a>
  </nav>
  <div data-header>
    <div class="site-chrome header-skel" aria-hidden="true">
      <div class="site-topbar"><div class="wrap topbar__inner"></div></div>
      <header class="site-header">
        <div class="wrap header__inner">
          <a class="brand" href="/"><picture><source type="image/webp" srcset="/assets/img/logo-crm.webp"><img src="/assets/img/logo-crm.png" alt="${escapeHtml(company.name)}" width="720" height="154" decoding="async"></picture></a>
          <span class="header-skel__nav" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></span>
          <span class="header-skel__cta" aria-hidden="true"></span>
        </div>
      </header>
    </div>
  </div>
  <main id="contenido">
${main}
  </main>
  <div data-footer></div>
  <script type="module" src="/js/app.min.js?v=${CACHE}" onerror="document.documentElement.classList.add('is-boot-error','is-booted')"></script>
</body>
</html>
`;
}

function ctaBlock(label, waText) {
  return `<p class="zona-page__cta">
          <a class="btn btn-wa" href="${waHref(waText)}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Contactar por WhatsApp</a>
          <a class="btn btn-red" href="tel:${company.phoneTel}" aria-label="Llamar al ${company.phone}"><i class="fa-solid fa-phone" aria-hidden="true"></i> Llamar ahora</a>
          <a class="btn btn-ink" href="/contacto">Solicita una cotización</a>
        </p>
        <p class="muted">También puede escribir a <a href="mailto:${company.email}">${company.email}</a>. Oficina: ${escapeHtml(company.address)}.</p>`;
}

function gridItems(list) {
  return list
    .map(
      (z) =>
        `<li>
            <a href="${extintoresPath(z)}">
              <span class="zona-grid__tag">${escapeHtml(zonaTypeLabel(z))}</span>
              <strong>${escapeHtml(z.name)}</strong>
              <span>Venta, recarga e instalación</span>
            </a>
          </li>`
    )
    .join("\n          ");
}

function serviceLinks() {
  return seoServicePages
    .map((s) => `<li><a href="${s.path}">${escapeHtml(s.h1)}</a></li>`)
    .join("\n            ");
}

const LOCAL_EXTRAS = {
  "alvaro-obregon": {
    colonias: [
      "San Ángel",
      "San Ángel Inn",
      "Florida",
      "Guadalupe Inn",
      "Las Águilas",
      "Olivar de los Padres",
      "Observatorio",
      "Santa Fe (lado Álvaro Obregón)",
      "Jalalpa",
      "Progreso Tizapán",
    ],
    extra:
      "Álvaro Obregón se atiende como zona de servicio desde Cuajimalpa, no como sucursal. El traslado a San Ángel, Observatorio y el lado AO de Santa Fe es corto: si agenda en la mañana, solemos visitar el mismo día hábil.",
    venta:
      "En torres y plazas de Santa Fe (lado AO) y San Ángel cotizamos PQS ABC de pasillo, CO₂ para cuartos eléctricos y tipo K si hay cocina o food court. La venta puede ir con instalación y señalamientos.",
    clients:
      "Corporativos y plazas de Santa Fe, oficinas en San Ángel, comercios de Insurgentes Sur, condominios de Las Águilas y restaurantes de la alcaldía.",
    faqs: [
      {
        q: "¿Van a Santa Fe si mi torre está en Álvaro Obregón?",
        a: "Sí. Santa Fe tiene predios en Álvaro Obregón y en Cuajimalpa. Visitamos ambos lados; el servicio se coordina desde Chamixto 131.",
      },
    ],
  },
  "benito-juarez": {
    colonias: ["Del Valle", "Nápoles", "Narvarte", "Portales", "Mixcoac", "Nochebuena", "Insurgentes Mixcoac", "Actipan"],
    extra:
      "Benito Juárez es zona de oficinas, plazas y edificios corporativos. Coordinamos visita en sitio desde Cuajimalpa; no hay sucursal en Del Valle ni Nápoles.",
    venta:
      "En Del Valle y Nápoles el pedido habitual es PQS ABC de 6 kg en pasillos y sótanos, más CO₂ junto a tableros. En plazas con food court evaluamos tipo K en cocina.",
    clients: "Oficinas, plazas, clínicas, restaurantes y condominios de Del Valle, Nápoles, Narvarte y Mixcoac.",
    faqs: [
      {
        q: "¿Atienden edificios de oficinas en Del Valle y Nápoles?",
        a: "Sí. Agendamos revisión o instalación en el inmueble. La oficina física está en Cuajimalpa.",
      },
    ],
  },
  "miguel-hidalgo": {
    colonias: ["Polanco", "Anzures", "Tacubaya", "Lomas de Chapultepec", "Granada", "Ampliación Granada", "Escandón", "Verónica Anzures"],
    extra:
      "Miguel Hidalgo concentra corporativos de Polanco y Lomas. El servicio sale de Cuajimalpa: visita en su predio, sin pedirle que traiga los equipos salvo que el caso lo requiera.",
    venta:
      "En Polanco y Lomas cotizamos equipos discretos y certificados: PQS ABC en rutas de evacuación, CO₂ en cuartos de cómputo y tipo K si hay cocina o comedor ejecutivo.",
    clients: "Corporativos de Polanco, residencias y oficinas de Lomas, comercios de Tacubaya y hoteles de la alcaldía.",
    faqs: [
      {
        q: "¿Instalan extintores en Polanco?",
        a: "Sí. Instalamos en el punto acordado y, si la cotización lo incluye, dejamos señalamientos. Coordinamos desde Cuajimalpa.",
      },
    ],
  },
  naucalpan: {
    colonias: ["Naucalpan Centro", "Satélite", "Industrial Alce Blanco", "Lomas Verdes", "Echegaray", "San Bartolo", "Buenavista"],
    extra:
      "Naucalpan combina industria, oficinas y comercio del poniente. Es municipio de servicio: no hay sucursal local. El traslado desde Cuajimalpa cubre Satélite, Lomas Verdes y parques industriales en horario hábil.",
    venta:
      "En naves y talleres de Naucalpan suele pedirse PQS ABC de mayor capacidad o unidad móvil; en oficinas de Satélite, equipos de pasillo y CO₂ para tableros.",
    clients: "Industria ligera, oficinas de Satélite, comercios de Lomas Verdes y naves de Alce Blanco.",
    faqs: [
      {
        q: "¿Atienden parques industriales en Naucalpan?",
        a: "Sí. Coordinamos visita en la nave o el patio. Recarga y venta se cotizan según agente, capacidad y estado de los cilindros.",
      },
    ],
  },
  huixquilucan: {
    colonias: ["Interlomas", "La Herradura", "Jesús del Monte", "Bosque Real", "Huixquilucan Centro", "Zacamulpa"],
    extra:
      "Huixquilucan es colindante con Cuajimalpa: Interlomas y La Herradura son rutas habituales. El servicio es en su inmueble; la oficina sigue en Loma del Padre.",
    venta:
      "En Interlomas y residenciales cotizamos PQS ABC para amenidades y sótanos, CO₂ en cuartos de máquinas y tipo K si hay cocina de club o restaurante.",
    clients: "Corporativos de Interlomas, condominios, residenciales, comercios de Jesús del Monte y oficinas de La Herradura.",
    faqs: [
      {
        q: "¿Queda cerca Interlomas de su oficina?",
        a: "Sí. Huixquilucan colinda con Cuajimalpa. Interlomas y La Herradura se atienden con visita en sitio desde Chamixto 131.",
      },
    ],
  },
  toluca: {
    colonias: ["Toluca Centro", "Universidad", "corredor industrial", "zona comercial de Tollocan", "colindancia con Metepec"],
    extra:
      "Toluca se atiende como municipio de servicio desde Cuajimalpa. No hay sucursal en la capital mexiquense. Coordinamos visita en oficinas, industria ligera y comercios del valle; el plazo queda por escrito en la cotización.",
    venta:
      "Para oficinas y comercios de Toluca partimos de PQS ABC de 6 kg y CO₂ en tableros. En naves del corredor industrial evaluamos capacidad mayor o unidad móvil.",
    clients: "Oficinas de gobierno y privadas, industria ligera, comercios de Tollocan y empresas que también operan en Metepec o Lerma.",
    faqs: [
      {
        q: "¿Cuánto tardan en ir a Toluca?",
        a: "Agendamos en horario hábil y confirmamos fecha al cotizar. No prometemos el mismo día salvo que la agenda y el traslado lo permitan.",
      },
    ],
  },
  "la-paz": {
    colonias: ["Los Reyes Acaquilpan", "La Magdalena Atlicpac", "Tecamachalco", "Ayotla", "San Sebastián Chimalpa"],
    extra:
      "Los Reyes La Paz se atiende desde Cuajimalpa como municipio de servicio, no como sucursal. Coordinamos visita en locales, condominios y puntos comerciales del oriente mexiquense; el traslado se confirma al cotizar.",
    venta:
      "En Los Reyes y Ayotla el pedido habitual es PQS ABC para locales y pasillos de condominio, más CO₂ si hay cuarto de tableros. La venta puede ir con instalación y señalamientos.",
    clients: "Locales, condominios, escuelas y puntos comerciales de Los Reyes Acaquilpan, Ayotla y colonias de La Paz.",
    faqs: [
      {
        q: "¿Atienden Los Reyes La Paz?",
        a: "Sí. La Paz (Los Reyes) es área de servicio. Visitamos el inmueble; la oficina física está en Cuajimalpa.",
      },
    ],
  },
  tlahuac: {
    colonias: ["Tláhuac Centro", "San Pedro Tláhuac", "San Andrés Mixquic", "Santa Catarina Yecahuitzotl", "Zapotitlán"],
    extra:
      "Tláhuac es alcaldía de servicio del suroriente. No hay sucursal local: la visita se coordina desde Loma del Padre para locales, escuelas y empresas de la zona.",
    venta:
      "En Tláhuac Centro y Mixquic partimos de PQS ABC de 6 kg para locales y escuelas. Si hay cocina o taller, evaluamos tipo K o capacidad mayor.",
    clients: "Locales, escuelas, comercios de Tláhuac Centro y empresas del suroriente capitalino.",
    faqs: [
      {
        q: "¿Van a Tláhuac Centro y Mixquic?",
        a: "Sí. Agendamos revisión o instalación en el inmueble. El servicio sale de Cuajimalpa.",
      },
    ],
  },
  iztacalco: {
    colonias: ["Agrícola Oriental", "Granjas México", "Viaducto Piedad", "Pantitlán", "Santa Anita", "Gabriel Ramos Millán"],
    extra:
      "Iztacalco concentra talleres, bodegas y condominios con requisitos de Protección Civil. Es alcaldía de servicio: visitamos Agrícola Oriental, Granjas México y Pantitlán desde Cuajimalpa.",
    venta:
      "En bodegas y talleres de Iztacalco suele pedirse PQS ABC de mayor capacidad; en condominios, equipos de pasillo y señalamientos. Cotizamos según el giro, no un paquete fijo.",
    clients: "Talleres, bodegas, condominios y comercios de Agrícola Oriental, Granjas México y Pantitlán.",
    faqs: [
      {
        q: "¿Atienden bodegas en Agrícola Oriental?",
        a: "Sí. Coordinamos visita en la bodega o el condominio. Recarga y venta se cotizan según agente y estado de los cilindros.",
      },
    ],
  },
  "gustavo-a-madero": {
    colonias: ["Lindavista", "Industrial Vallejo", "Aragón", "Cuautepec", "Tepeyac", "Martín Carrera"],
    extra:
      "Gustavo A. Madero cubre industria, escuelas y comercio del norte. No hay sucursal en Lindavista ni Vallejo: el servicio se agenda desde Cuajimalpa y se realiza en su predio.",
    venta:
      "En naves de Vallejo evaluamos PQS ABC de mayor capacidad o unidad móvil. En escuelas y comercios de Lindavista partimos de equipos de pasillo y CO₂ para tableros.",
    clients: "Industria ligera de Vallejo, escuelas, comercios de Lindavista y empresas de Aragón.",
    faqs: [
      {
        q: "¿Van a Lindavista o Vallejo?",
        a: "Sí. GAM es área de servicio. Confirmamos fecha al cotizar; la oficina física está en Cuajimalpa.",
      },
    ],
  },
  azcapotzalco: {
    colonias: ["Azcapotzalco Centro", "Clavería", "San Álvaro", "Nueva El Rosario", "Pro-Hogar", "Ferrería"],
    extra:
      "Azcapotzalco mezcla industria, bodegas y colonias comerciales del norte-poniente. Es alcaldía de servicio: Clavería, Ferrería y el centro se visitan desde Loma del Padre.",
    venta:
      "En bodegas y naves de Azcapotzalco cotizamos PQS ABC de mayor capacidad. En comercios de Clavería, equipos de pasillo y CO₂ si hay cuarto eléctrico.",
    clients: "Industrias, bodegas, comercios de Clavería y oficinas de Azcapotzalco Centro.",
    faqs: [
      {
        q: "¿Atienden naves en Azcapotzalco?",
        a: "Sí. Coordinamos visita en la nave o el local. No hay sucursal en la alcaldía; el servicio sale de Cuajimalpa.",
      },
    ],
  },
};

function locationCopy(zona) {
  const region = zonaRegionLabel(zona);
  const type = zonaTypeLabel(zona);
  const n = hashSlug(zona.slug);
  const isBase = zona.slug === "cuajimalpa";
  const intros = isBase
    ? [
        `CRM Extintores (Grupo CRM Extintores) tiene su única oficina en Loma del Padre, Cuajimalpa. Desde Chamixto 131 cotizamos, visitamos e instalamos extintores en la colonia y en el resto de la alcaldía —Santa Fe, Contadero, San José de los Cedros y Cuajimalpa Centro— y en CDMX y Estado de México.`,
      ]
    : [
        `Grupo CRM Extintores ofrece venta, recarga, mantenimiento e instalación de extintores en ${zona.name}, ${region}. Atendemos ${zona.focus}.`,
        `Si necesita equipos contra incendios en ${zona.name}, Grupo CRM Extintores coordina venta, recarga e instalación para empresas e inmuebles de la zona. Cobertura: ${zona.focus}.`,
        `En ${zona.name} acompañamos a negocios e inmuebles con extintores certificados, recarga bajo NOM-154-SCFI-2005 e instalación en sitio. Enfoque local: ${zona.focus}.`,
      ];
  const office = isBase
    ? `Nuestra sede está en Chamixto 131, Col. Loma del Padre, Cuajimalpa, C.P. ${company.postalCode}. Horario: ${company.hours}. Teléfono y WhatsApp: ${company.phone}.`
    : `${zona.name} es una zona de servicio: no tenemos sucursal física en ${zona.region === "edomex" ? "este" : "esta"} ${type.toLowerCase()}. El servicio se coordina desde nuestra oficina en Cuajimalpa y se realiza en su inmueble.`;
  const venta = isBase
    ? [
        `Vendemos extintores certificados en Cuajimalpa según el riesgo del inmueble: PQS ABC para pasillos y locales, CO₂ para tableros y cómputo, tipo K para cocinas. En corporativos de Santa Fe y en comercios de Contadero o Cuajimalpa Centro partimos de lo que suele pedir Protección Civil, no de un paquete genérico.`,
      ]
    : [
        `Vendemos extintores certificados adecuados al riesgo de su inmueble en ${zona.name}. Le orientamos sobre capacidad y tipo de agente antes de cotizar.`,
        `Para venta de extintores en ${zona.name} partimos del giro del negocio y de lo que suele pedir Protección Civil en ${region}.`,
      ];
  const recarga = isBase
    ? [
        `Recargamos extintores en Cuajimalpa con proceso alineado a la NOM-154-SCFI-2005. Coordinamos la visita desde Loma del Padre: revisamos presión, sello y etiqueta en su inmueble; si el cilindro requiere taller, acordamos recolección. Si está vencido, descargado o con sello roto, le decimos si conviene recargar o sustituir, con evidencia para inspección.`,
      ]
    : [
        `Recargamos extintores en ${zona.name} con proceso alineado a la NOM-154-SCFI-2005, para que el equipo quede operativo y con evidencia útil en inspección.`,
        `Si en ${zona.name} tiene extintores vencidos o descargados, evaluamos recarga o sustitución y le explicamos opciones con claridad.`,
      ];
  const mant = [
    `El mantenimiento en ${zona.name} se integra a la revisión y recarga: presión, sello, etiqueta y estado general del equipo.`,
    `Programamos mantenimiento de extintores para inmuebles en ${zona.name} cuando la revisión detecta equipos que requieren atención.`,
  ];
  const inst = [
    `Instalamos extintores en puntos visibles y accesibles de su local u oficina en ${zona.name}, con señalamientos cuando formen parte de la cotización.`,
    `La instalación en ${zona.name} puede incluir soporte y señal de equipo para dejar el punto listo ante una visita de Protección Civil.`,
  ];
  const clients = isBase
    ? "En Cuajimalpa atendemos corporativos y plazas de Santa Fe, comercios y residencias de Contadero, oficinas de Cuajimalpa Centro, condominios, restaurantes, escuelas y clínicas. Desde esta misma base visitamos el resto de CDMX y Estado de México."
    : "Empresas, oficinas, restaurantes, comercios, condominios, escuelas y clínicas. También atendemos otros giros cuando el inmueble requiere equipo contra incendios.";
  const areasNote = isBase
    ? "La cobertura es toda la alcaldía Cuajimalpa, no un listado cerrado. Atendemos de forma habitual Loma del Padre, Contadero, Santa Fe (lado Cuajimalpa), San José de los Cedros, Cuajimalpa Centro, José María Castorena, Memetla, San Mateo Tlaltenango, El Yaqui, La Venta, Palo Alto y colonias vecinas. Si su colonia no aparece, escríbanos."
    : `En ${zona.name} priorizamos inmuebles vinculados a: ${zona.focus}. Si su colonia no aparece en esa descripción, escríbanos: la cobertura es por ${type.toLowerCase()} de servicio, no por listado exhaustivo de colonias.`;
  const faqs = [
    {
      q: `¿Venden extintores en ${zona.name}?`,
      a: isBase
        ? "Sí. Vendemos extintores certificados desde nuestra oficina en Cuajimalpa (Chamixto 131, Col. Loma del Padre) y los entregamos o instalamos en su inmueble."
        : `Sí. Ofrecemos venta de extintores certificados para inmuebles en ${zona.name}, ${region}.`,
    },
    {
      q: `¿Realizan recarga de extintores en ${zona.name}?`,
      a: `Sí. Recargamos y damos mantenimiento alineado a la NOM-154-SCFI-2005. La primera visita de revisión es sin costo.`,
    },
    {
      q: "¿Qué tipos de extintores manejan?",
      a: "PQS, CO₂, tipo K y otras líneas del catálogo, según el riesgo de su inmueble. También señalamientos, gabinetes y botiquines.",
    },
    {
      q: `¿Tienen sucursal en ${zona.name}?`,
      a: isBase
        ? `Sí. Nuestra oficina está en Chamixto 131, Col. Loma del Padre, Cuajimalpa, C.P. ${company.postalCode}. Horario ${company.hours}.`
        : `No. ${zona.name} es área de servicio. La oficina física está en Cuajimalpa y el trabajo se realiza en su ubicación.`,
    },
    {
      q: "¿Atienden empresas, restaurantes y condominios?",
      a: "Sí. Esos giros forman parte de nuestra atención habitual, junto con oficinas, comercios, escuelas y clínicas.",
    },
  ];
  if (isBase) {
    faqs.unshift({
      q: "¿Hay extintores en Loma del Padre?",
      a: "Sí. CRM Extintores (Grupo CRM Extintores) tiene su oficina en Chamixto 131, Col. Loma del Padre, Cuajimalpa. Desde ahí vendemos, recargamos e instalamos extintores en la colonia y en toda la alcaldía.",
    });
    faqs.push(
      {
        q: "¿Atienden Santa Fe y Contadero?",
        a: "Sí. Santa Fe (lado Cuajimalpa), Contadero y el resto de la alcaldía son cobertura habitual desde Loma del Padre. Si su inmueble está del lado de Álvaro Obregón, también lo visitamos.",
      },
      {
        q: "¿La primera visita tiene costo en Cuajimalpa?",
        a: "No. La primera visita de revisión o levantamiento en Cuajimalpa no tiene costo. Recarga, venta o instalación se cotizan por escrito según lo encontrado.",
      },
      {
        q: "¿Atienden San José de los Cedros y Cuajimalpa Centro?",
        a: "Sí. San José de los Cedros, Cuajimalpa Centro, La Venta, Palo Alto y el resto de colonias de la alcaldía se atienden desde Chamixto 131.",
      }
    );
  }
  const extra = LOCAL_EXTRAS[zona.slug];
  if (extra?.faqs) faqs.push(...extra.faqs);
  return {
    intro: extra?.extra ? `${intros[n % intros.length]} ${extra.extra}` : intros[n % intros.length],
    office,
    venta: extra?.venta || venta[n % venta.length],
    recarga: recarga[(n + 1) % recarga.length],
    mant: mant[(n + 2) % mant.length],
    inst: inst[(n + 3) % inst.length],
    clients: extra?.clients || clients,
    areasNote,
    colonias: extra?.colonias || [],
    faqs,
    region,
    type,
    isBase,
  };
}

function locationJsonLd(zona, canonical) {
  const copy = locationCopy(zona);
  const regionLabel = zona.region === "edomex" ? "Estado de México" : "Ciudad de México";
  const crumbs = breadcrumbList([
    { name: "Inicio", item: `${SITE.origin}/` },
    { name: regionLabel, item: `${SITE.origin}${extintoresHubPath(zona.region)}` },
    { name: zona.name, item: canonical },
  ]);
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: copy.isBase
      ? `Extintores en Loma del Padre, Cuajimalpa`
      : `Extintores en ${zona.name}`,
    serviceType: "Venta, recarga, mantenimiento e instalación de extintores",
    provider: { "@id": `${SITE.origin}/#business` },
    areaServed: {
      "@type": "AdministrativeArea",
      name: `${zona.name}, ${zonaRegionLabel(zona)}`,
    },
    url: canonical,
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const professional = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE.origin}/#business`,
    name: company.name,
    legalName: company.legalName || company.name,
    alternateName: ["CRM Extintores", "Grupo CRM", "GRUPO CRM Extintores"],
    image: `${SITE.origin}/assets/img/logo-crm.png`,
    url: SITE.origin,
    telephone: `+52${company.phoneTel}`,
    email: company.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.streetAddress,
      addressLocality: company.addressLocality,
      addressRegion: company.addressRegion,
      postalCode: company.postalCode,
      addressCountry: company.addressCountry,
    },
    openingHours: "Mo-Fr 09:00-18:00",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    geo: company.geo
      ? {
          "@type": "GeoCoordinates",
          latitude: company.geo.latitude,
          longitude: company.geo.longitude,
        }
      : undefined,
    hasMap: company.mapsUrl,
    areaServed: copy.isBase
      ? [
          { "@type": "Place", name: "Loma del Padre, Cuajimalpa, Ciudad de México" },
          { "@type": "AdministrativeArea", name: "Cuajimalpa de Morelos, Ciudad de México" },
          { "@type": "Place", name: "Santa Fe, Ciudad de México" },
          { "@type": "Place", name: "Contadero, Cuajimalpa" },
        ]
      : [
          { "@type": "AdministrativeArea", name: `${zona.name}, ${zonaRegionLabel(zona)}` },
          ...(copy.colonias || []).map((name) => ({ "@type": "Place", name: `${name}, ${zona.name}` })),
        ],
    sameAs: [company.facebookUrl, company.instagramUrl, company.mapsUrl].filter(Boolean),
  };
  return [
    `  <script type="application/ld+json" id="seo-crumbs">${JSON.stringify(crumbs)}</script>`,
    `  <script type="application/ld+json" id="seo-business">${JSON.stringify(professional)}</script>`,
    `  <script type="application/ld+json">${JSON.stringify(service)}</script>`,
    `  <script type="application/ld+json">${JSON.stringify(faq)}</script>`,
  ].join("\n");
}

function locationHtml(zona) {
  const copy = locationCopy(zona);
  const region = copy.region;
  const hub = extintoresHubPath(zona.region);
  const hubLabel = zona.region === "edomex" ? "Estado de México" : "Ciudad de México";
  const title = copy.isBase
    ? "Extintores en Loma del Padre | CRM Extintores"
    : zona.region === "edomex"
      ? `Extintores en ${zona.name} | Venta y recarga`
      : `Extintores en ${zona.name} | Grupo CRM`;
  const description = copy.isBase
    ? `CRM Extintores en Loma del Padre, Cuajimalpa: oficina en Chamixto 131. Venta y recarga de extintores en Santa Fe, Contadero y toda la alcaldía. WhatsApp ${company.phone}.`
    : `Venta, recarga, mantenimiento e instalación de extintores en ${zona.name}, ${region}. Primera visita sin costo. Cotice con Grupo CRM Extintores.`;
  const canonical = `${SITE.origin}${extintoresPath(zona)}`;
  const h1 = copy.isBase
    ? "Extintores en Loma del Padre, Cuajimalpa"
    : `Venta y recarga de extintores en ${zona.name}`;
  const kicker = copy.isBase
    ? "CRM Extintores · oficina en Loma del Padre"
    : `${copy.type} · área de servicio · ${region}`;
  const nearbyTitle = zona.region === "edomex" ? "Municipios y zonas cercanas" : "Alcaldías y zonas cercanas";
  const nearby = (zona.nearby || [])
    .map((slug) => {
      const n = zonaBySlug(slug);
      if (!n) return "";
      return `<li><a href="${extintoresPath(n)}">Extintores en ${escapeHtml(n.name)}</a></li>`;
    })
    .filter(Boolean)
    .join("\n            ");
  const faqs = copy.faqs
    .map(
      (f) => `<details class="svc">
          <summary class="svc__sum">${escapeHtml(f.q)}</summary>
          <div class="svc__text"><p>${escapeHtml(f.a)}</p></div>
        </details>`
    )
    .join("\n        ");

  const officeBlock = copy.isBase
    ? `
        <h2>Oficina de CRM Extintores en Loma del Padre</h2>
        <p>CRM Extintores (Grupo CRM Extintores) opera desde <strong>Chamixto 131, Col. Loma del Padre, Cuajimalpa, C.P. 05020</strong>. Es la única sede física: aquí cotizamos, coordinamos visitas y documentamos el servicio para inmuebles de la colonia, de la alcaldía y del resto de la zona metropolitana.</p>
        <ul class="zona-page__points">
          <li>Dirección: ${escapeHtml(company.address)}</li>
          <li>Horario: ${escapeHtml(company.hours)}</li>
          <li>Teléfono / WhatsApp: <a href="tel:${company.phoneTel}">${escapeHtml(company.phone)}</a></li>
          <li><a href="${escapeHtml(company.mapsUrl)}" target="_blank" rel="noopener noreferrer">Ver ubicación en Google Maps</a></li>
        </ul>
        <h2>Cómo trabajamos desde Loma del Padre</h2>
        <p>No pedimos que traiga los extintores a la oficina salvo que el caso lo requiera. El flujo habitual en Cuajimalpa es visita en su inmueble, revisión de presión, sello y etiqueta, cotización por escrito y recarga, venta o instalación según lo encontrado. Si el cilindro necesita taller, acordamos recolección y regreso.</p>
        <ul class="zona-page__points">
          <li>Primera visita de revisión o levantamiento sin costo</li>
          <li>Recarga y mantenimiento alineados a la NOM-154-SCFI-2005</li>
          <li>Verificación de MCD cuando corresponde al proceso</li>
          <li>Entrega o instalación en corporativos, locales y condominios de la alcaldía</li>
        </ul>
        <h2>Santa Fe, Contadero y Cuajimalpa Centro</h2>
        <p>Santa Fe tiene predios en Cuajimalpa y en <a href="/extintores-alvaro-obregon">Álvaro Obregón</a>. Si su torre, plaza o restaurante está del lado Cuajimalpa, lo atendemos como cobertura de sede. Contadero, San José de los Cedros y Cuajimalpa Centro son rutas habituales desde Chamixto 131: el traslado es corto y la visita se agenda en horario hábil.</p>
        <p>Guía de recarga local: <a href="/blog/recarga-extintores-cuajimalpa">recarga de extintores en Cuajimalpa</a>.</p>
        <h2>Protección Civil en la alcaldía Cuajimalpa</h2>
        <p>En inspección suelen pedir equipos visibles, manómetro en rango, sello, etiqueta con fecha y quién hizo el servicio, y a menudo señalamientos. Revisamos eso en sitio y le decimos qué falta. No somos autoridad: le dejamos el inmueble listo para que usted cumpla.</p>`
    : "";

  const coloniasBlock = copy.isBase
    ? `
        <h2>Colonias de Cuajimalpa donde ofrecemos servicio</h2>
        <p>${escapeHtml(copy.areasNote)}</p>
        <ul class="zona-nearby zona-nearby--wrap">
            <li>Loma del Padre (sede)</li>
            <li>Contadero</li>
            <li>Santa Fe (lado Cuajimalpa)</li>
            <li>San José de los Cedros</li>
            <li>Cuajimalpa Centro</li>
            <li>José María Castorena</li>
            <li>Memetla</li>
            <li>San Mateo Tlaltenango</li>
            <li>El Yaqui</li>
            <li>La Venta</li>
            <li>Palo Alto</li>
            <li>Cruz Blanca</li>
            <li>Zarca</li>
            <li>San Lorenzo Acopilco</li>
            <li>San Pablo Chimalpa</li>
            <li>Resto de la alcaldía Cuajimalpa</li>
        </ul>`
    : `
        <h2>Zonas de ${escapeHtml(zona.name)} donde ofrecemos servicio</h2>
        <p>${escapeHtml(copy.areasNote)}</p>${
          copy.colonias?.length
            ? `
        <ul class="zona-nearby zona-nearby--wrap">
            ${copy.colonias.map((c) => `<li>${escapeHtml(c)}</li>`).join("\n            ")}
        </ul>`
            : ""
        }`;

  const main = `  <section class="section zona-page">
    <div class="wrap zona-page__layout">
      <header class="zona-page__head">
        <nav class="article-crumb" aria-label="Miga de pan">
          <a href="/">Inicio</a> · <a href="${hub}">${escapeHtml(hubLabel)}</a> · <span>${escapeHtml(zona.name)}</span>
        </nav>
        <p class="kicker">${escapeHtml(kicker)}</p>
        <h1>${escapeHtml(h1)}</h1>
        <hr class="rule rule-left" aria-hidden="true">
        <p class="lead">${escapeHtml(copy.intro)}</p>
        ${contentDatesHtml()}
        <p class="muted">${escapeHtml(copy.office)}</p>
        <p class="zona-page__cta zona-page__cta--head">
          <a class="btn btn-wa" href="${waHref(`Hola, quiero cotizar extintores en ${zona.name}, ${region}.`)}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> WhatsApp</a>
          <a class="btn btn-red" href="tel:${company.phoneTel}" aria-label="Llamar al ${company.phone}"><i class="fa-solid fa-phone" aria-hidden="true"></i> Llamar ${escapeHtml(company.phone)}</a>
        </p>
      </header>
      <div class="zona-page__body">
        ${officeBlock}

        <h2>Venta de extintores en ${escapeHtml(zona.name)}</h2>
        <p>${escapeHtml(copy.venta)}</p>
        <p>Ver también: <a href="/venta-extintores">venta de extintores</a> y el <a href="/productos">catálogo</a>.</p>

        <h2>Recarga de extintores en ${escapeHtml(zona.name)}</h2>
        <p>${escapeHtml(copy.recarga)}</p>
        <p>Detalle del servicio: <a href="/recarga-extintores">recarga de extintores</a>.${
          copy.isBase
            ? ` Cómo pedimos el servicio en la alcaldía: <a href="/blog/recarga-extintores-cuajimalpa">recarga de extintores en Cuajimalpa</a>.`
            : ""
        } Rangos de referencia: <a href="/blog/precio-recarga-extintores-cdmx">precio de recarga en CDMX</a>.</p>

        <h2>Mantenimiento de extintores en ${escapeHtml(zona.name)}</h2>
        <p>${escapeHtml(copy.mant)}</p>
        <p>Más información: <a href="/mantenimiento-extintores">mantenimiento de extintores</a>.</p>

        <h2>Instalación de extintores</h2>
        <p>${escapeHtml(copy.inst)}</p>
        <p>Proceso general: <a href="/instalacion-extintores">instalación de extintores</a> y <a href="/senalizacion">señalización</a>.</p>

        <h2>¿A quién atendemos?</h2>
        <p>${escapeHtml(copy.clients)}</p>

        ${coloniasBlock}

        <h2>Preguntas frecuentes</h2>
        <div class="svc-list" data-faqs>
        ${faqs}
        </div>

        <h2>Solicita una cotización</h2>
        <p>Indique ${copy.type.toLowerCase()}, giro y si ya tiene extintores. Respondemos en horario hábil por WhatsApp o teléfono (${escapeHtml(company.phone)}).</p>
        ${ctaBlock(zona.name, `Hola, quiero cotizar extintores en ${zona.name}, ${region}.`)}

        <h2>${nearbyTitle}</h2>
        <ul class="zona-nearby">
            ${nearby}
            <li><a href="${hub}">Ver todas las zonas de ${escapeHtml(hubLabel)}</a></li>
            <li><a href="${zona.region === "edomex" ? "/extintores-cdmx" : "/extintores-estado-de-mexico"}">Ver ${zona.region === "edomex" ? "Ciudad de México" : "Estado de México"}</a></li>
        </ul>
      </div>
    </div>
  </section>`;

  return pageShell({
    title,
    description,
    canonical,
    bodyAttrs: `data-page="zona" data-zona="${zona.slug}"`,
    main,
    jsonLd: locationJsonLd(zona, canonical),
  });
}

function hubCdmx() {
  const title = "Extintores en CDMX | Venta, Recarga y Mantenimiento";
  const description =
    "Extintores en Ciudad de México: venta, recarga, mantenimiento e instalación. Cobertura en las 16 alcaldías desde Cuajimalpa. Cotice con Grupo CRM Extintores.";
  const canonical = `${SITE.origin}/extintores-cdmx`;
  const crumbs = breadcrumbList([
    { name: "Inicio", item: `${SITE.origin}/` },
    { name: "Extintores en CDMX", item: canonical },
  ]);
  const hubFaqs = [
    {
      q: "¿Tienen sucursal en todas las alcaldías?",
      a: "No. La oficina de Grupo CRM Extintores está en Chamixto 131, Col. Loma del Padre, Cuajimalpa. El resto de la CDMX son áreas de servicio: vamos a su inmueble.",
    },
    {
      q: "¿La primera visita tiene costo?",
      a: "No. La primera visita de revisión o levantamiento no tiene costo. Recarga, venta o instalación se cotizan según lo encontrado.",
    },
    {
      q: "¿Recargan bajo la NOM-154?",
      a: "Sí. La recarga y el mantenimiento se alinean a la NOM-154-SCFI-2005, con verificación de MCD cuando corresponde al proceso.",
    },
    {
      q: "¿Publican precios de recarga?",
      a: "Publicamos rangos de referencia de mercado en la guía de precio de recarga. La cifra de Grupo CRM Extintores se confirma por escrito después de revisar sus equipos.",
    },
  ];
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: hubFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const faqsHtml = hubFaqs
    .map(
      (f) => `<details class="svc">
          <summary class="svc__sum">${escapeHtml(f.q)}</summary>
          <div class="svc__text"><p>${escapeHtml(f.a)}</p></div>
        </details>`
    )
    .join("\n        ");
  const main = `  <section class="section zona-page zona-page--hub">
    <div class="wrap">
      <header class="zona-hub__head">
        <nav class="article-crumb" aria-label="Miga de pan"><a href="/">Inicio</a> · <span>Ciudad de México</span></nav>
        <p class="kicker">Cobertura CDMX</p>
        <h1>Extintores en Ciudad de México</h1>
        <hr class="rule rule-left" aria-hidden="true">
        <p class="lead">Grupo CRM Extintores ofrece venta, recarga, mantenimiento e instalación de extintores y equipo contra incendios en la Ciudad de México. Atendemos empresas, oficinas, restaurantes, comercios, condominios, escuelas y clínicas.</p>
        ${contentDatesHtml()}
      </header>

      <h2>Servicios en CDMX</h2>
      <p>Desde nuestra oficina en Cuajimalpa coordinamos el servicio en las alcaldías de la capital. La primera visita de revisión no tiene costo.</p>
      <ul class="zona-page__points">
        <li><a href="/venta-extintores">Venta de extintores</a> certificados según el riesgo del inmueble</li>
        <li><a href="/recarga-extintores">Recarga</a> y <a href="/mantenimiento-extintores">mantenimiento</a> alineados a NOM-154-SCFI-2005</li>
        <li><a href="/instalacion-extintores">Instalación</a> en sitio y <a href="/senalizacion">señalización</a></li>
      </ul>
      <p>En una inspección suelen pedir tres cosas: que el extintor exista, que se vea y que esté servido. Por eso no separamos el catálogo de la recarga: le decimos qué comprar, qué recargar y qué ya no conviene dejar en el muro.</p>
      <p>Rangos de referencia (no lista cerrada): <a href="/blog/precio-recarga-extintores-cdmx">precio de recarga de extintores en CDMX</a>. Norma del servicio: <a href="/blog/nom-154-scfi-2005">NOM-154-SCFI-2005</a>. Catálogo oficial: <a href="/productos">crmextintores.com.mx/productos</a>.</p>

      <h2>Cómo trabajamos</h2>
      <ul class="zona-page__points">
        <li>WhatsApp o llamada: alcaldía, giro y, si puede, fotos de sus equipos.</li>
        <li>Primera visita de revisión sin costo en su inmueble.</li>
        <li>Cotización por escrito: recarga, venta, instalación o el combo.</li>
        <li>Servicio en sitio y evidencia útil para inspección cuando recargamos.</li>
      </ul>

      <h2>Tipos de clientes</h2>
      <p>Trabajamos con empresas e inmuebles que deben cumplir con Protección Civil: corporativos, plazas, locales, condominios y centros educativos, entre otros. También con quien recibió una observación y necesita dejar los puntos en regla sin inventar sucursal en cada colonia.</p>

      <h2>Datos de Grupo CRM Extintores</h2>
      <ul class="zona-page__points">
        <li>Nombre: Grupo CRM Extintores (en Facebook: GRUPO CRM Extintores)</li>
        <li>Oficina: Chamixto 131, Col. Loma del Padre, Alcaldía Cuajimalpa, CDMX, C.P. 05020</li>
        <li>Horario: lunes a viernes, 9:00 a 18:00</li>
        <li>Teléfono / WhatsApp: <a href="tel:${company.phoneTel}">${escapeHtml(company.phone)}</a> y <a href="tel:${company.phoneAltTel}">${escapeHtml(company.phoneAlt)}</a></li>
        <li>Correo: <a href="mailto:${company.email}">${escapeHtml(company.email)}</a></li>
        <li>Sitio: <a href="${SITE.origin}">${escapeHtml(company.website)}</a></li>
      </ul>

      <h2>¿Cómo solicitar cotización?</h2>
      <p>Indique alcaldía, giro y si ya cuenta con extintores. Le respondemos por WhatsApp (${escapeHtml(company.phone)}) o en el <a href="/contacto">formulario de contacto</a>.</p>
      ${ctaBlock("CDMX", "Hola, quiero cotizar extintores en Ciudad de México.")}

      <h2>Preguntas frecuentes</h2>
      <div class="svc-list" data-faqs>
        ${faqsHtml}
      </div>

      <h2>Alcaldías donde ofrecemos servicio</h2>
      <p>Cobertura confirmada en el sitio para las ${zonasCdmx.length} alcaldías de la Ciudad de México. Nuestra <a href="/extintores-cuajimalpa">oficina está en Cuajimalpa</a>; el resto son áreas de servicio.</p>
      <ul class="zona-grid">
          ${gridItems([zonasCdmx.find((z) => z.slug === "cuajimalpa"), ...zonasCdmx.filter((z) => z.slug !== "cuajimalpa")].filter(Boolean))}
      </ul>

      <p class="zona-page__more muted">También atendemos el <a href="/extintores-estado-de-mexico">Estado de México</a>. Catálogo: <a href="/productos">productos</a>. Guía: <a href="/blog/extintores-cdmx">extintores en CDMX</a>.</p>
    </div>
  </section>`;
  return pageShell({
    title,
    description,
    canonical,
    bodyAttrs: 'data-page="zonas" data-hub="cdmx"',
    main,
    jsonLd: `  <script type="application/ld+json" id="seo-crumbs">${JSON.stringify(crumbs)}</script>
  <script type="application/ld+json">${JSON.stringify(faqLd)}</script>`,
  });
}

function hubEdomex() {
  const title = "Extintores en Estado de México | Venta, Recarga y Mantenimiento";
  const description =
    "Extintores en Estado de México: venta, recarga, mantenimiento e instalación en municipios del Valle de México y zona Toluca. Cotice con Grupo CRM Extintores.";
  const canonical = `${SITE.origin}/extintores-estado-de-mexico`;
  const crumbs = breadcrumbList([
    { name: "Inicio", item: `${SITE.origin}/` },
    { name: "Estado de México", item: canonical },
  ]);
  const main = `  <section class="section zona-page zona-page--hub">
    <div class="wrap">
      <header class="zona-hub__head">
        <nav class="article-crumb" aria-label="Miga de pan"><a href="/">Inicio</a> · <span>Estado de México</span></nav>
        <p class="kicker">Cobertura Estado de México</p>
        <h1>Extintores en Estado de México</h1>
        <hr class="rule rule-left" aria-hidden="true">
        <p class="lead">Grupo CRM Extintores atiende municipios del Estado de México con venta, recarga, mantenimiento e instalación de extintores. El servicio se coordina desde Cuajimalpa, CDMX.</p>
        ${contentDatesHtml()}
      </header>

      <h2>Servicios</h2>
      <ul class="zona-page__points">
        <li><a href="/venta-extintores">Venta de extintores</a></li>
        <li><a href="/recarga-extintores">Recarga</a> y <a href="/mantenimiento-extintores">mantenimiento</a></li>
        <li><a href="/instalacion-extintores">Instalación</a> y <a href="/senalizacion">señalización</a></li>
      </ul>

      <h2>Clientes</h2>
      <p>Empresas, oficinas, comercios, condominios, escuelas y clínicas en municipios del Valle de México y la zona Toluca incluidos en nuestra cobertura publicada.</p>

      <h2>Proceso de cotización</h2>
      <p>Comparta municipio, giro y estado de sus equipos. Cotizamos por WhatsApp o teléfono y, si aplica, agendamos la primera visita de revisión sin costo.</p>
      ${ctaBlock("EdoMex", "Hola, quiero cotizar extintores en Estado de México.")}

      <h2>Municipios donde ofrecemos servicio</h2>
      <p>${zonasEdomex.length} municipios publicados en este sitio como áreas de servicio.</p>
      <ul class="zona-grid">
          ${gridItems(zonasEdomex)}
      </ul>

      <p class="zona-page__more muted">Ver también <a href="/extintores-cdmx">extintores en Ciudad de México</a>, el <a href="/productos">catálogo</a> y <a href="/blog/precio-recarga-extintores-cdmx">precio de recarga</a>.</p>
    </div>
  </section>`;
  return pageShell({
    title,
    description,
    canonical,
    bodyAttrs: 'data-page="zonas" data-hub="edomex"',
    main,
    jsonLd: `  <script type="application/ld+json" id="seo-crumbs">${JSON.stringify(crumbs)}</script>`,
  });
}

function serviceHtml(svc) {
  const canonical = `${SITE.origin}${svc.path}`;
  const related = (svc.related || [])
    .map((slug) => seoServiceBySlug(slug))
    .filter(Boolean)
    .map((s) => `<li><a href="${s.path}">${escapeHtml(s.h1)}</a></li>`)
    .join("\n            ");
  const featuredBase = zonasCdmx.find((z) => z.slug === "cuajimalpa");
  const featured = [
    featuredBase,
    ...zonasCdmx.filter((z) => z.slug !== "cuajimalpa").slice(0, 7),
    ...zonasEdomex.slice(0, 6),
  ].filter(Boolean);
  const crumbs = breadcrumbList([
    { name: "Inicio", item: `${SITE.origin}/` },
    { name: "Servicios", item: `${SITE.origin}/venta-extintores` },
    { name: svc.h1, item: canonical },
  ]);
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: svc.h1,
    description: svc.description,
    provider: { "@id": `${SITE.origin}/#business` },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Ciudad de México" },
      { "@type": "AdministrativeArea", name: "Estado de México" },
    ],
    url: canonical,
  };
  const body = svc.body.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n        ");
  const process = svc.process.map((p) => `<li>${escapeHtml(p)}</li>`).join("\n          ");
  const includes = svc.includes?.length
    ? `<h2>Qué incluye</h2>
        <ul class="zona-page__points">
          ${svc.includes.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n          ")}
        </ul>`
    : "";
  const logistics = svc.logistics?.length
    ? `<h2>Visita, plazos y domicilio</h2>
        ${svc.logistics.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n        ")}`
    : "";
  const clients = `<h2>Tipos de clientes</h2>
        <p>${escapeHtml(
          svc.clients ||
            "Empresas, oficinas, restaurantes, comercios, condominios, escuelas y clínicas en CDMX y Estado de México."
        )}</p>`;
  const faqsHtml = svc.faqs?.length
    ? `<h2>Preguntas frecuentes</h2>
        <div class="svc-list" data-faqs>
        ${svc.faqs
          .map(
            (f) => `<details class="svc">
          <summary class="svc__sum">${escapeHtml(f.q)}</summary>
          <div class="svc__text"><p>${escapeHtml(f.a)}</p></div>
        </details>`
          )
          .join("\n        ")}
        </div>`
    : "";
  const recargaNote =
    svc.slug === "recarga-extintores"
      ? `<p>La recarga se alinea a la <a href="/blog/nom-154-scfi-2005">NOM-154-SCFI-2005</a>, con verificación de <a href="${escapeHtml(company.mcdUrl)}" target="_blank" rel="noopener noreferrer">MCD</a> cuando corresponde al proceso. Rangos de referencia: <a href="/blog/precio-recarga-extintores-cdmx">precio de recarga de extintores en CDMX</a>.</p>`
      : svc.slug === "venta-extintores"
        ? `<p>Catálogo oficial en este sitio: <a href="/productos">productos</a>. Guía para elegir: <a href="/blog/tipos-de-fuego">tipos de fuego</a>.</p>`
        : svc.slug === "instalacion-extintores"
          ? `<p>Guía práctica: <a href="/blog/como-instalar-mi-extintor">cómo instalar un extintor</a>.</p>`
          : svc.slug === "mantenimiento-extintores"
            ? `<p>Norma del servicio: <a href="/blog/nom-154-scfi-2005">NOM-154-SCFI-2005</a>. Rangos de referencia de recarga: <a href="/blog/precio-recarga-extintores-cdmx">precio de recarga en CDMX</a>.</p>`
            : "";
  const faqLd = svc.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: svc.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;
  const main = `  <section class="section zona-page">
    <div class="wrap zona-page__layout">
      <header class="zona-page__head">
        <nav class="article-crumb" aria-label="Miga de pan">
          <a href="/">Inicio</a> · <a href="/venta-extintores">Servicios</a> · <span>${escapeHtml(svc.h1)}</span>
        </nav>
        <p class="kicker">${escapeHtml(svc.kicker)}</p>
        <h1>${escapeHtml(svc.h1)}</h1>
        <hr class="rule rule-left" aria-hidden="true">
        <p class="lead">${escapeHtml(svc.lead)}</p>
        ${contentDatesHtml()}
      </header>
      <div class="zona-page__body">
        ${body}
        ${recargaNote}
        ${includes}
        <h2>Proceso</h2>
        <ol class="zona-page__points">
          ${process}
        </ol>
        ${logistics}
        ${
          svc.slug === "recarga-extintores"
            ? `<p>Guía local: <a href="/blog/recarga-extintores-cuajimalpa">recarga de extintores en Cuajimalpa</a>.</p>`
            : ""
        }
        ${clients}
        ${faqsHtml}
        <h2>¿Dónde ofrecemos este servicio?</h2>
        <p>Oficina de Grupo CRM Extintores en <a href="/extintores-cuajimalpa">Cuajimalpa</a> (Chamixto 131, Col. Loma del Padre, C.P. 05020). También atendemos las zonas publicadas de <a href="/extintores-cdmx">Ciudad de México</a> y <a href="/extintores-estado-de-mexico">Estado de México</a>.</p>
        <ul class="zona-nearby">
            ${featured.map((z) => `<li><a href="${extintoresPath(z)}">${escapeHtml(svc.h1)} en ${escapeHtml(z.name)}</a></li>`).join("\n            ")}
        </ul>
        <h2>Servicios relacionados</h2>
        <ul class="zona-nearby">
            ${related}
        </ul>
        <h2>Solicita una cotización</h2>
        ${ctaBlock(svc.h1, `Hola, quiero cotizar: ${svc.h1}.`)}
      </div>
    </div>
  </section>`;
  return pageShell({
    title: svc.title,
    description: svc.description,
    canonical,
    bodyAttrs: `data-page="servicio" data-servicio="${svc.slug}"`,
    main,
    jsonLd: `  <script type="application/ld+json" id="seo-crumbs">${JSON.stringify(crumbs)}</script>
  <script type="application/ld+json">${JSON.stringify(serviceLd)}</script>${
    faqLd ? `\n  <script type="application/ld+json">${JSON.stringify(faqLd)}</script>` : ""
  }`,
  });
}

function redirectHtml(toPath, label) {
  const to = `${SITE.origin}${toPath}`;
  return `<!DOCTYPE html>
<html lang="es-MX">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=${toPath}">
  <link rel="canonical" href="${to}">
  <meta name="robots" content="noindex, follow">
  <title>Redirección a ${escapeHtml(label)}</title>
  <script>location.replace(${JSON.stringify(toPath)}+location.search+location.hash);</script>
</head>
<body>
  <p>Esta página se movió a <a href="${toPath}">${escapeHtml(label)}</a>.</p>
</body>
</html>
`;
}

// --- write outputs ---
const hubCdmxPath = join(root, "extintores-cdmx.html");
const hubEdoPath = join(root, "extintores-estado-de-mexico.html");
writeFileSync(hubCdmxPath, hubCdmx());
writeFileSync(hubEdoPath, hubEdomex());

for (const z of zonas) {
  writeFileSync(join(root, `extintores-${z.slug}.html`), locationHtml(z));
}

for (const svc of seoServicePages) {
  writeFileSync(join(root, `${svc.slug}.html`), serviceHtml(svc));
}

// Keep /zonas/* as redirect stubs for old links
const zonasDir = join(root, "zonas");
mkdirSync(zonasDir, { recursive: true });
writeFileSync(join(zonasDir, "index.html"), redirectHtml("/extintores-cdmx", "Extintores en CDMX"));
for (const z of zonas) {
  writeFileSync(
    join(zonasDir, `${z.slug}.html`),
    redirectHtml(extintoresPath(z), `Extintores en ${z.name}`)
  );
}

console.log(
  `seo-local: hubs 2 + locations ${zonas.length} + services ${seoServicePages.length} (+ /zonas redirects)`
);

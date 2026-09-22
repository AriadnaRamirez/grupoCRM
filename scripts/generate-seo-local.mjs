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
const CACHE = "perf2-dots";
const pagesBaseSnippet = `  <script>!function(){if(!/\\.github\\.io$/i.test(location.hostname))return;var s=document.createElement("script");s.src="/js/pages-base.js";document.head.appendChild(s)}();</script>\n`;
const cssBoot = `  <style id="css-boot">
  /* Minimal first paint — never override hero/slide rules from main.css */
  html { background: #fff; }
  body { margin: 0; color: #202020; font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif; }
  .site-chrome { position: fixed; top: 0; left: 0; right: 0; z-index: 50; background: #fff; }
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

function pageShell({ title, description, canonical, bodyAttrs, main, jsonLd = "" }) {
  const origin = SITE.origin;
  return `<!DOCTYPE html>
<html lang="es-MX" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
${pagesBaseSnippet}${cssBoot}
  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2" media="(min-width: 761px)" crossorigin>
  <link rel="stylesheet" href="/css/tokens.css?v=${CACHE}">
  <link rel="preload" as="style" href="/css/main.min.css?v=${CACHE}" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/css/main.min.css?v=${CACHE}"></noscript>
  <script>!function(){var l=document.querySelector('link[rel="preload"][as="style"]');if(l&&!l.sheet){l.addEventListener("load",function(){this.onload=null;this.rel="stylesheet"});if(l.relList&&!l.relList.supports("preload"))l.rel="stylesheet"}}();</script>
  <script>document.documentElement.classList.add("is-css");</script>
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="${SITE.themeColor}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_MX">
  <meta property="og:site_name" content="Grupo CRM Extintores">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${origin}/assets/img/logo-crm.png">
  <meta property="og:image:alt" content="Logotipo de Grupo CRM Extintores">
  <meta property="og:image:width" content="720">
  <meta property="og:image:height" content="154">
  <meta property="og:image:type" content="image/png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${origin}/assets/img/logo-crm.png">
  <link rel="icon" type="image/png" href="/assets/img/favicon.png" sizes="192x192">
  <link rel="apple-touch-icon" href="/assets/img/favicon.png">
  <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" media="print" onload="this.media='all'" crossorigin="anonymous" referrerpolicy="no-referrer">
  <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer"></noscript>
${jsonLd}
</head>
<body ${bodyAttrs}>
  <a class="skip-link" href="#contenido">Saltar al contenido</a>
  <div data-header></div>
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

function locationCopy(zona) {
  const region = zonaRegionLabel(zona);
  const type = zonaTypeLabel(zona);
  const n = hashSlug(zona.slug);
  const isBase = zona.slug === "cuajimalpa";
  const intros = isBase
    ? [
        `Grupo CRM Extintores tiene su oficina en Cuajimalpa, Ciudad de México. Desde Chamixto 131, Col. Loma del Padre, ofrecemos venta, recarga, mantenimiento e instalación de extintores para empresas e inmuebles de la alcaldía y el resto de CDMX y Estado de México.`,
      ]
    : [
        `Grupo CRM Extintores ofrece venta, recarga, mantenimiento e instalación de extintores en ${zona.name}, ${region}. Atendemos ${zona.focus}.`,
        `Si necesita equipos contra incendios en ${zona.name}, Grupo CRM Extintores coordina venta, recarga e instalación para empresas e inmuebles de la zona. Cobertura: ${zona.focus}.`,
        `En ${zona.name} acompañamos a negocios e inmuebles con extintores certificados, recarga bajo NOM-154-SCFI-2005 e instalación en sitio. Enfoque local: ${zona.focus}.`,
      ];
  const office = isBase
    ? `Nuestra sede está en Chamixto 131, Col. Loma del Padre, Cuajimalpa, C.P. ${company.postalCode}. Horario: ${company.hours}. Teléfono y WhatsApp: ${company.phone}.`
    : `${zona.name} es una zona de servicio: no tenemos sucursal física en esta ${type.toLowerCase()}. El servicio se coordina desde nuestra oficina en Cuajimalpa y se realiza en su inmueble.`;
  const venta = isBase
    ? [
        `Vendemos extintores certificados en Cuajimalpa con asesoría según el riesgo del inmueble y lo que suele pedir Protección Civil. Puede cotizar PQS, CO₂, tipo K y el resto del catálogo, con opción de entrega o instalación en sitio.`,
      ]
    : [
        `Vendemos extintores certificados adecuados al riesgo de su inmueble en ${zona.name}. Le orientamos sobre capacidad y tipo de agente antes de cotizar.`,
        `Para venta de extintores en ${zona.name} partimos del giro del negocio y de lo que suele pedir Protección Civil en ${region}.`,
      ];
  const recarga = isBase
    ? [
        `Recargamos extintores en Cuajimalpa con proceso alineado a la NOM-154-SCFI-2005. Si sus equipos están vencidos, descargados o con sello roto, evaluamos recarga o sustitución y le dejamos evidencia útil para inspección.`,
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
    ? "En Cuajimalpa atendemos corporativos de Santa Fe y Contadero, condominios, oficinas, restaurantes, comercios, escuelas y clínicas. También visitamos el resto de CDMX y Estado de México desde esta base."
    : "Empresas, oficinas, restaurantes, comercios, condominios, escuelas y clínicas. También atendemos otros giros cuando el inmueble requiere equipo contra incendios.";
  const areasNote = isBase
    ? "En Cuajimalpa damos servicio de forma habitual en Loma del Padre (sede), Contadero, Santa Fe, José María Castorena, Memetla, San Mateo Tlaltenango, El Yaqui y demás colonias de la alcaldía. Si su colonia no aparece en la lista, escríbanos: la cobertura es toda Cuajimalpa."
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
    faqs.push({
      q: "¿Atienden Santa Fe y Contadero?",
      a: "Sí. Santa Fe, Contadero y el resto de Cuajimalpa forman parte de nuestra cobertura habitual desde la sede en Loma del Padre.",
    });
  }
  return {
    intro: intros[n % intros.length],
    office,
    venta: venta[n % venta.length],
    recarga: recarga[(n + 1) % recarga.length],
    mant: mant[(n + 2) % mant.length],
    inst: inst[(n + 3) % inst.length],
    clients,
    areasNote,
    faqs,
    region,
    type,
    isBase,
  };
}

function locationJsonLd(zona, canonical) {
  const copy = locationCopy(zona);
  const regionLabel = zona.region === "edomex" ? "Estado de México" : "Ciudad de México";
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE.origin}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: regionLabel,
        item: `${SITE.origin}${extintoresHubPath(zona.region)}`,
      },
      { "@type": "ListItem", position: 3, name: zona.name, item: canonical },
    ],
  };
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: copy.isBase
      ? `Venta y recarga de extintores en Cuajimalpa`
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
    areaServed: [{ "@type": "AdministrativeArea", name: zona.name }],
    sameAs: [company.facebookUrl, company.instagramUrl].filter(Boolean),
  };
  return [
    `  <script type="application/ld+json">${JSON.stringify(crumbs)}</script>`,
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
    ? "Venta y recarga de extintores en Cuajimalpa | Grupo CRM"
    : zona.region === "edomex"
      ? `Venta y recarga de extintores en ${zona.name}, Edo. Méx. | Grupo CRM`
      : `Venta y recarga de extintores en ${zona.name}, CDMX | Grupo CRM`;
  const description = copy.isBase
    ? `Venta y recarga de extintores en Cuajimalpa desde nuestra oficina en Chamixto 131, Loma del Padre. Mantenimiento e instalación. Primera visita sin costo. WhatsApp ${company.phone}.`
    : `Venta, recarga, mantenimiento e instalación de extintores en ${zona.name}, ${region}. Primera visita sin costo. Cotice con Grupo CRM Extintores.`;
  const canonical = `${SITE.origin}${extintoresPath(zona)}`;
  const h1 = copy.isBase
    ? "Venta y recarga de extintores en Cuajimalpa"
    : `Venta y recarga de extintores en ${zona.name}`;
  const kicker = copy.isBase
    ? "Oficina · Alcaldía Cuajimalpa · Ciudad de México"
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
        <h2>Oficina en Cuajimalpa</h2>
        <p>Grupo CRM Extintores opera desde <strong>Chamixto 131, Col. Loma del Padre, Cuajimalpa</strong>. Aquí cotizamos, coordinamos visitas y atendemos a empresas de la alcaldía y del resto de la zona metropolitana.</p>
        <ul class="zona-page__points">
          <li>Dirección: ${escapeHtml(company.address)}</li>
          <li>Horario: ${escapeHtml(company.hours)}</li>
          <li>Teléfono / WhatsApp: <a href="tel:${company.phoneTel}">${escapeHtml(company.phone)}</a></li>
          <li><a href="${escapeHtml(company.mapsUrl)}" target="_blank" rel="noopener noreferrer">Ver ubicación en Google Maps</a></li>
        </ul>`
    : "";

  const coloniasBlock = copy.isBase
    ? `
        <h2>Colonias de Cuajimalpa donde ofrecemos servicio</h2>
        <p>${escapeHtml(copy.areasNote)}</p>
        <ul class="zona-nearby zona-nearby--wrap">
            <li>Loma del Padre (sede)</li>
            <li>Contadero</li>
            <li>Santa Fe</li>
            <li>José María Castorena</li>
            <li>Memetla</li>
            <li>San Mateo Tlaltenango</li>
            <li>El Yaqui</li>
            <li>Cruz Blanca</li>
            <li>Zarca</li>
            <li>Resto de la alcaldía Cuajimalpa</li>
        </ul>`
    : `
        <h2>Zonas de ${escapeHtml(zona.name)} donde ofrecemos servicio</h2>
        <p>${escapeHtml(copy.areasNote)}</p>`;

  const main = `  <section class="section zona-page">
    <div class="wrap zona-page__layout">
      <header class="zona-page__head">
        <nav class="article-crumb" aria-label="Miga de pan">
          <a href="/">Inicio</a> · <a href="${hub}">${escapeHtml(hubLabel)}</a> · ${escapeHtml(zona.name)}
        </nav>
        <p class="kicker">${escapeHtml(kicker)}</p>
        <h1>${escapeHtml(h1)}</h1>
        <hr class="rule rule-left" aria-hidden="true">
        <p class="lead">${escapeHtml(copy.intro)}</p>
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
        <p>Detalle del servicio: <a href="/recarga-extintores">recarga de extintores</a>.</p>

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
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE.origin}/` },
      { "@type": "ListItem", position: 2, name: "Extintores en CDMX", item: canonical },
    ],
  };
  const main = `  <section class="section zona-page zona-page--hub">
    <div class="wrap">
      <header class="zona-hub__head">
        <nav class="article-crumb" aria-label="Miga de pan"><a href="/">Inicio</a> · Ciudad de México</nav>
        <p class="kicker">Cobertura CDMX</p>
        <h1>Extintores en Ciudad de México</h1>
        <hr class="rule rule-left" aria-hidden="true">
        <p class="lead">Grupo CRM Extintores ofrece venta, recarga, mantenimiento e instalación de extintores y equipo contra incendios en la Ciudad de México. Atendemos empresas, oficinas, restaurantes, comercios, condominios, escuelas y clínicas.</p>
      </header>

      <h2>Servicios en CDMX</h2>
      <p>Desde nuestra oficina en Cuajimalpa coordinamos el servicio en las alcaldías de la capital. La primera visita de revisión no tiene costo.</p>
      <ul class="zona-page__points">
        <li><a href="/venta-extintores">Venta de extintores</a> certificados según el riesgo del inmueble</li>
        <li><a href="/recarga-extintores">Recarga</a> y <a href="/mantenimiento-extintores">mantenimiento</a> alineados a NOM-154-SCFI-2005</li>
        <li><a href="/instalacion-extintores">Instalación</a> en sitio y <a href="/senalizacion">señalización</a></li>
      </ul>

      <h2>Tipos de clientes</h2>
      <p>Trabajamos con empresas e inmuebles que deben cumplir con Protección Civil: corporativos, plazas, locales, condominios y centros educativos, entre otros.</p>

      <h2>Cómo solicitar cotización</h2>
      <p>Indique alcaldía, giro y si ya cuenta con extintores. Le respondemos por WhatsApp (${escapeHtml(company.phone)}) o en el <a href="/contacto">formulario de contacto</a>.</p>
      ${ctaBlock("CDMX", "Hola, quiero cotizar extintores en Ciudad de México.")}

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
    jsonLd: `  <script type="application/ld+json">${JSON.stringify(crumbs)}</script>`,
  });
}

function hubEdomex() {
  const title = "Extintores en Estado de México | Venta, Recarga y Mantenimiento";
  const description =
    "Extintores en Estado de México: venta, recarga, mantenimiento e instalación en municipios del Valle de México y zona Toluca. Cotice con Grupo CRM Extintores.";
  const canonical = `${SITE.origin}/extintores-estado-de-mexico`;
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE.origin}/` },
      { "@type": "ListItem", position: 2, name: "Estado de México", item: canonical },
    ],
  };
  const main = `  <section class="section zona-page zona-page--hub">
    <div class="wrap">
      <header class="zona-hub__head">
        <nav class="article-crumb" aria-label="Miga de pan"><a href="/">Inicio</a> · Estado de México</nav>
        <p class="kicker">Cobertura Estado de México</p>
        <h1>Extintores en Estado de México</h1>
        <hr class="rule rule-left" aria-hidden="true">
        <p class="lead">Grupo CRM Extintores atiende municipios del Estado de México con venta, recarga, mantenimiento e instalación de extintores. El servicio se coordina desde Cuajimalpa, CDMX.</p>
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

      <p class="zona-page__more muted">Ver también <a href="/extintores-cdmx">extintores en Ciudad de México</a> y el <a href="/productos">catálogo</a>.</p>
    </div>
  </section>`;
  return pageShell({
    title,
    description,
    canonical,
    bodyAttrs: 'data-page="zonas" data-hub="edomex"',
    main,
    jsonLd: `  <script type="application/ld+json">${JSON.stringify(crumbs)}</script>`,
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
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE.origin}/` },
      { "@type": "ListItem", position: 2, name: "Servicios", item: `${SITE.origin}/venta-extintores` },
      { "@type": "ListItem", position: 3, name: svc.h1, item: canonical },
    ],
  };
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
  const main = `  <section class="section zona-page">
    <div class="wrap zona-page__layout">
      <header class="zona-page__head">
        <nav class="article-crumb" aria-label="Miga de pan">
          <a href="/">Inicio</a> · <a href="/venta-extintores">Servicios</a> · ${escapeHtml(svc.h1)}
        </nav>
        <p class="kicker">${escapeHtml(svc.kicker)}</p>
        <h1>${escapeHtml(svc.h1)}</h1>
        <hr class="rule rule-left" aria-hidden="true">
        <p class="lead">${escapeHtml(svc.lead)}</p>
      </header>
      <div class="zona-page__body">
        ${body}
        <h2>Proceso</h2>
        <ol class="zona-page__points">
          ${process}
        </ol>
        <h2>Tipos de clientes</h2>
        <p>Empresas, oficinas, restaurantes, comercios, condominios, escuelas y clínicas en CDMX y Estado de México.</p>
        <h2>¿Dónde ofrecemos este servicio?</h2>
        <p>Oficina en <a href="/extintores-cuajimalpa">Cuajimalpa</a> (Chamixto 131, Loma del Padre). También atendemos las zonas publicadas de <a href="/extintores-cdmx">Ciudad de México</a> y <a href="/extintores-estado-de-mexico">Estado de México</a>.</p>
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
    jsonLd: `  <script type="application/ld+json">${JSON.stringify(crumbs)}</script>
  <script type="application/ld+json">${JSON.stringify(serviceLd)}</script>`,
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

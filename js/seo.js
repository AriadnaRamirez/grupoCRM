import {
  company,
  categories,
  products,
  SITE,
  pageSeo,
  catSeo,
  catName,
  productBySku,
  productImg,
  productAlt,
  productPath,
  productSeoTitle,
  productMetaDescription,
  catPath,
  catSeoTitle,
  lookbook,
  lookAlt,
  readSku,
  readCat,
  blogPosts,
  blogPostBySlug,
  zonasCdmx,
  zonasEdomex,
  zonas,
  zonaBySlug,
  zonaRegionLabel,
  seoServicePages,
  extintoresPath,
  extintoresHubPath,
  faqs,
} from "./data.js";
import { basePath } from "./base.js";

function abs(path) {
  if (!path) return SITE.origin;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE.origin}${path.startsWith("/") ? path : `/${path}`}`;
}

function ensure(selector, create) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el;
}

function setMeta(name, content, attr = "name") {
  if (!content) return;
  const el = ensure(`meta[${attr}="${name}"]`, () => {
    const meta = document.createElement("meta");
    meta.setAttribute(attr, name);
    return meta;
  });
  el.setAttribute("content", content);
}

function setLink(rel, href, extra = {}) {
  const extraKey = extra.hreflang ? `[hreflang="${extra.hreflang}"]` : "";
  const el = ensure(`link[rel="${rel}"]${extraKey}`, () => {
    const link = document.createElement("link");
    link.rel = rel;
    return link;
  });
  el.href = href;
  Object.entries(extra).forEach(([key, value]) => el.setAttribute(key, value));
}

function setJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function clipDesc(text, max = 160) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const sentence = cut.lastIndexOf(".");
  if (sentence > 90) return cut.slice(0, sentence + 1).trim();
  const at = cut.lastIndexOf(" ");
  const clipped = (at > 80 ? cut.slice(0, at) : cut).trim().replace(/[,;:\s]+$/, "");
  return `${clipped}…`;
}

function firstSentence(text) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  const match = clean.match(/^[^.!?]+[.!?]/);
  return match ? match[0].trim() : clean;
}

function stripHtml(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function defaultAreaServed() {
  return [
    { "@type": "Place", name: "Loma del Padre, Cuajimalpa, Ciudad de México" },
    { "@type": "AdministrativeArea", name: "Ciudad de México" },
    { "@type": "AdministrativeArea", name: "Estado de México" },
    ...zonasCdmx.map((z) => ({
      "@type": "AdministrativeArea",
      name: z.name,
    })),
    ...zonasEdomex.map((z) => ({
      "@type": "AdministrativeArea",
      name: z.name,
    })),
  ];
}

function professionalService({ areaServed } = {}) {
  const logoUrl = abs(SITE.ogImage);
  const phonePrimary = `+52${company.phoneTel}`;
  const phoneAlt = `+52${company.phoneAltTel}`;
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE.origin}/#business`,
    name: company.name,
    alternateName: ["CRM Extintores", "Grupo CRM", "GRUPO CRM Extintores"],
    legalName: company.legalName || company.name,
    brand: { "@type": "Brand", name: "CRM Extintores", alternateName: [company.name, "Grupo CRM", "GRUPO CRM Extintores"] },
    description: company.about,
    url: SITE.origin,
    image: [
      logoUrl,
      abs(company.inspector.image),
      abs(company.inspector.imageExtintor),
      abs("/assets/img/opt/categoria-extintores-960.webp"),
    ],
    logo: {
      "@type": "ImageObject",
      url: logoUrl,
      name: company.name,
      caption: `Logotipo de ${company.name}`,
    },
    email: company.email,
    telephone: phonePrimary,
    priceRange: "$$",
    currenciesAccepted: "MXN",
    paymentAccepted: "Cash, Credit Card",
    address: {
      "@type": "PostalAddress",
      streetAddress: company.streetAddress,
      addressLocality: company.addressLocality,
      addressRegion: company.addressRegion,
      postalCode: company.postalCode,
      addressCountry: company.addressCountry,
    },
    geo: company.geo
      ? {
          "@type": "GeoCoordinates",
          latitude: company.geo.latitude,
          longitude: company.geo.longitude,
        }
      : undefined,
    hasMap: company.mapsUrl,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: phonePrimary,
        email: company.email,
        areaServed: ["MX-CMX", "MX-MEX"],
        availableLanguage: ["es-MX", "es"],
      },
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: phoneAlt,
        areaServed: ["MX-CMX", "MX-MEX"],
        availableLanguage: ["es-MX", "es"],
      },
    ],
    areaServed: areaServed || defaultAreaServed(),
    openingHours: "Mo-Fr 09:00-18:00",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    sameAs: [
      company.facebookUrl,
      company.facebookReviewsUrl,
      company.instagramUrl,
      company.mapsUrl,
    ].filter(Boolean),
    knowsAbout: [
      "CRM Extintores",
      "Extintores en Loma del Padre",
      "Extintores",
      "Recarga de extintores",
      "Instalación de extintores",
      company.nom,
      "Protección Civil",
      "Equipo contra incendios",
      "Señalamientos",
      company.mcd,
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Catálogo de extintores y equipo contra incendio",
      itemListElement: categories.map((cat, i) => ({
        "@type": "OfferCatalog",
        position: i + 1,
        name: cat.name,
        url: abs(catPath(cat.id)),
      })),
    },
  };
}

function faqPage(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: stripHtml(f.q),
      acceptedAnswer: {
        "@type": "Answer",
        text: stripHtml(f.a),
      },
    })),
  };
}

function organizationNode() {
  const logoUrl = abs(SITE.ogImage);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.origin}/#organization`,
    name: company.name,
    legalName: company.legalName || company.name,
    alternateName: ["CRM Extintores", "Grupo CRM", "GRUPO CRM Extintores"],
    url: SITE.origin,
    logo: {
      "@type": "ImageObject",
      url: logoUrl,
      name: company.name,
      caption: `Logotipo de ${company.name}`,
    },
    image: [
      logoUrl,
      abs(company.inspector.image),
      abs(company.inspector.imageExtintor),
      abs("/assets/img/opt/categoria-extintores-960.webp"),
    ],
    email: company.email,
    telephone: `+52${company.phoneTel}`,
    sameAs: [company.facebookUrl, company.instagramUrl].filter(Boolean),
  };
}

function websiteNode() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.origin}/#website`,
    name: "CRM Extintores",
    alternateName: [company.name, "Grupo CRM", "GRUPO CRM Extintores"],
    url: SITE.origin,
    inLanguage: "es-MX",
    publisher: { "@id": `${SITE.origin}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.origin}/productos?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

function articleNode(post, url) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.heading || post.title,
    description: post.description,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    inLanguage: "es-MX",
    image: {
      "@type": "ImageObject",
      url: abs(post.image || SITE.ogImage),
      name: post.heading || post.title,
      caption: post.imageAlt || `${post.heading || post.title} — ${company.name}`,
    },
    author: { "@type": "Organization", name: company.name, url: SITE.origin },
    publisher: {
      "@type": "Organization",
      name: company.name,
      logo: { "@type": "ImageObject", url: abs(SITE.ogImage) },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };
}

function productNode(p, url) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    sku: p.sku,
    description: clipDesc(`${p.desc} ${p.use}`, 240),
    image: {
      "@type": "ImageObject",
      url: abs(`/assets/img/opt/catalog/${p.sku}-800.webp`),
      contentUrl: abs(productImg(p)),
      name: productAlt(p, { detail: true }),
      caption: productAlt(p, { detail: true }),
    },
    brand: { "@type": "Brand", name: "CRM Extintores", alternateName: [company.name, "Grupo CRM", "GRUPO CRM Extintores"] },
    category: catName(p.cat),
    url,
  };
}

function breadcrumbs(items) {
  const named = items.filter((item) => item?.name && item.path);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    name: named.map((item) => item.name).join(" › "),
    itemListElement: named.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: {
        "@type": "WebPage",
        "@id": abs(item.path),
        name: item.name,
      },
    })),
  };
}

function resolvePage(page) {
  const base = pageSeo[page] || pageSeo.inicio;
  const params = new URLSearchParams(location.search);
  if (page === "productos") {
    const q = (params.get("q") || "").trim();
    const cat = params.get("cat");
    if (q) {
      return {
        ...base,
        title: `Búsqueda: ${q} | ${company.name}`,
        description: clipDesc(`Resultados de “${q}”. Cotice extintores y equipo contra incendio con ${company.name}.`),
        path: "/productos",
        robots: "noindex, follow",
      };
    }
    const fromPath = readCat();
    if ((cat && categories.some((c) => c.id === cat)) || fromPath) {
      const id = categories.some((c) => c.id === cat) ? cat : fromPath;
      const name = catName(id);
      return {
        ...base,
        title: catSeoTitle(id),
        description: catSeo[id] || `Línea de ${name.toLowerCase()} de ${company.name}. Cotice en CDMX y Estado de México.`,
        path: catPath(id),
      };
    }
  }
  if (page === "producto") {
    const p = productBySku(readSku());
    if (!p) {
      return {
        ...pageSeo.error,
        title: `Artículo no encontrado | ${company.name}`,
        path: "/producto",
        robots: "noindex, follow",
      };
    }
    return {
      path: productPath(p.sku),
      title: productSeoTitle(p),
      description: productMetaDescription(p),
      type: "product",
      product: p,
    };
  }
  if (page === "articulo") {
    const slug =
      document.body.dataset.article ||
      location.pathname
        .replace(new RegExp(`^${basePath() || ""}`), "")
        .replace(/^\/blog\/?/, "")
        .replace(/\/index\.html$/i, "")
        .replace(/\.html$/i, "")
        .replace(/\/$/, "");
    const post = blogPostBySlug(slug);
    if (!post) return { ...pageSeo.articulo };
    return {
      ...post,
      type: "article",
      article: post,
    };
  }
  if (page === "zonas") {
    const hub = document.body.dataset.hub === "edomex" ? "/extintores-estado-de-mexico" : "/extintores-cdmx";
    return {
      path: hub,
      title:
        document.body.dataset.hub === "edomex"
          ? "Extintores en Estado de México | Venta y recarga"
          : "Extintores en CDMX | Venta y recarga",
      description:
        document.body.dataset.hub === "edomex"
          ? "Extintores en Estado de México: venta, recarga, mantenimiento e instalación. Cotice con Grupo CRM Extintores."
          : "Extintores en Ciudad de México: venta, recarga, mantenimiento e instalación. Cotice con Grupo CRM Extintores.",
    };
  }
  if (page === "servicio") {
    const slug = document.body.dataset.servicio;
    const svc = seoServicePages.find((s) => s.slug === slug);
    if (svc) {
      return {
        path: svc.path,
        title: svc.title,
        description: svc.description,
        type: "servicio",
        servicio: svc,
      };
    }
  }
  if (page === "zona") {
    const raw =
      document.body.dataset.zona ||
      location.pathname
        .replace(new RegExp(`^${basePath() || ""}`), "")
        .replace(/^\/(?:zonas\/|extintores-)/, "")
        .replace(/\/index\.html$/i, "")
        .replace(/\.html$/i, "")
        .replace(/\/$/, "");
    const zona = zonaBySlug(raw);
    if (!zona) {
      return {
        path: "/extintores-cdmx",
        title: `Extintores en CDMX | ${company.name}`,
        description:
          "Extintores en Ciudad de México: venta, recarga, mantenimiento e instalación. Cotice con Grupo CRM Extintores.",
      };
    }
    const region = zonaRegionLabel(zona);
    const isBase = zona.slug === "cuajimalpa";
    return {
      path: extintoresPath(zona),
      title: isBase
        ? "Extintores en Loma del Padre | CRM Extintores"
        : zona.region === "edomex"
          ? `Extintores en ${zona.name} | Venta y recarga`
          : `Extintores en ${zona.name} | Grupo CRM`,
      description: isBase
        ? `Venta y recarga de extintores en Cuajimalpa: oficina en Chamixto 131, Loma del Padre. Santa Fe, Contadero y toda la alcaldía. Primera visita sin costo. WhatsApp ${company.phone}.`
        : clipDesc(
            `Venta, recarga, mantenimiento e instalación de extintores en ${zona.name}, ${region}. Primera visita sin costo. Cotice con Grupo CRM Extintores.`
          ),
      type: "zona",
      zona,
    };
  }
  return { ...base };
}

export function applySeo(page) {
  const seo = resolvePage(page);
  const url = abs(seo.path);
  const image = seo.product
    ? abs(productImg(seo.product))
    : seo.article?.image
      ? abs(seo.article.image)
      : seo.image
        ? abs(seo.image)
        : abs(SITE.ogImage);
  const robots = seo.robots || "index, follow";

  document.documentElement.lang = "es-MX";
  document.documentElement.setAttribute("prefix", "og: https://ogp.me/ns#");
  document.title = seo.title;
  setMeta("description", seo.description);
  setMeta("robots", robots);
  setMeta("author", company.name);
  setMeta("theme-color", SITE.themeColor);
  setLink("canonical", url);
  setMeta("og:type", seo.type === "product" ? "product" : seo.type === "article" ? "article" : "website", "property");
  setMeta("og:locale", SITE.locale, "property");
  setMeta("og:site_name", company.shortName, "property");
  setMeta("og:title", seo.title, "property");
  setMeta("og:description", seo.description, "property");
  setMeta("og:url", url, "property");
  setMeta("og:image", image, "property");
  setMeta(
    "og:image:alt",
    seo.product
      ? productAlt(seo.product, { detail: true })
      : seo.article?.imageAlt || seo.imageAlt || `Grupo CRM Extintores en CDMX y Estado de México`,
    "property"
  );
  if (seo.product || seo.article) {
    /* product/article set their own image size in page markup */
  } else if (seo.imageWidth && seo.imageHeight) {
    setMeta("og:image:width", String(seo.imageWidth), "property");
    setMeta("og:image:height", String(seo.imageHeight), "property");
    setMeta("og:image:type", "image/webp", "property");
  } else {
    setMeta("og:image:width", "1200", "property");
    setMeta("og:image:height", "630", "property");
    setMeta("og:image:type", "image/jpeg", "property");
  }
  setMeta("twitter:card", "summary_large_image");
  setMeta("twitter:title", seo.title);
  setMeta("twitter:description", seo.description);
  setMeta("twitter:image", image);

  if (seo.article) {
    setMeta("article:published_time", seo.article.datePublished, "property");
    setMeta(
      "article:modified_time",
      seo.article.dateModified || seo.article.datePublished,
      "property"
    );
  } else if (SITE.contentPublished && SITE.contentModified) {
    setMeta("article:published_time", SITE.contentPublished, "property");
    setMeta("article:modified_time", SITE.contentModified, "property");
  }

  setJsonLd("seo-webpage", {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: seo.title,
    description: seo.description,
    inLanguage: "es-MX",
    isPartOf: { "@type": "WebSite", "@id": `${SITE.origin}/#website`, name: company.shortName, url: SITE.origin },
    datePublished: seo.article?.datePublished || SITE.contentPublished,
    dateModified:
      seo.article?.dateModified ||
      seo.article?.datePublished ||
      SITE.contentModified ||
      SITE.contentPublished,
  });

  const businessArea = seo.zona
    ? [{ "@type": "AdministrativeArea", name: seo.zona.name }]
    : undefined;
  setJsonLd("seo-organization", organizationNode());
  setJsonLd("seo-business", professionalService({ areaServed: businessArea }));
  setJsonLd("seo-website", websiteNode());

  if (page === "inicio") {
    setJsonLd("seo-faq", faqPage(faqs));
  } else if (seo.servicio?.faqs?.length) {
    setJsonLd("seo-faq", faqPage(seo.servicio.faqs));
  } else if (seo.article?.faqs?.length) {
    setJsonLd("seo-faq", faqPage(seo.article.faqs));
  }

  if (page === "nosotros") {
    setJsonLd(
      "seo-crumbs",
      breadcrumbs([
        { name: "Inicio", path: "/" },
        { name: "Nosotros", path: "/nosotros" },
      ])
    );
  } else if (page === "contacto") {
    setJsonLd(
      "seo-crumbs",
      breadcrumbs([
        { name: "Inicio", path: "/" },
        { name: "Contacto", path: "/contacto" },
      ])
    );
  } else if (page === "blog") {
    setJsonLd(
      "seo-crumbs",
      breadcrumbs([
        { name: "Inicio", path: "/" },
        { name: "Blog", path: "/blog" },
      ])
    );
  } else if (seo.article) {
    setJsonLd("seo-article", articleNode(seo.article, url));
    setJsonLd(
      "seo-crumbs",
      breadcrumbs([
        { name: "Inicio", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: seo.article.heading || seo.article.title, path: seo.path },
      ])
    );
  } else if (page === "productos") {
    const cat = new URLSearchParams(location.search).get("cat");
    const crumbs = [{ name: "Inicio", path: "/" }, { name: "Catálogo", path: "/productos" }];
    if (cat && categories.some((c) => c.id === cat)) crumbs.push({ name: catName(cat), path: catPath(cat) });
    else if (readCat()) crumbs.push({ name: catName(readCat()), path: catPath(readCat()) });
    setJsonLd("seo-crumbs", breadcrumbs(crumbs));
  } else if (seo.product) {
    setJsonLd("seo-product", productNode(seo.product, url));
    setJsonLd(
      "seo-crumbs",
      breadcrumbs([
        { name: "Inicio", path: "/" },
        { name: "Catálogo", path: "/productos" },
        { name: catName(seo.product.cat), path: catPath(seo.product.cat) },
        { name: seo.product.sku, path: seo.path },
      ])
    );
  } else if (page === "zonas") {
    const hub = document.body.dataset.hub === "edomex" ? "/extintores-estado-de-mexico" : "/extintores-cdmx";
    const hubName = document.body.dataset.hub === "edomex" ? "Estado de México" : "Ciudad de México";
    setJsonLd(
      "seo-crumbs",
      breadcrumbs([
        { name: "Inicio", path: "/" },
        { name: hubName, path: hub },
      ])
    );
  } else if (page === "servicio") {
    const slug = document.body.dataset.servicio;
    const svc = seoServicePages.find((s) => s.slug === slug);
    if (svc) {
      setJsonLd(
        "seo-crumbs",
        breadcrumbs([
          { name: "Inicio", path: "/" },
          { name: "Servicios", path: "/venta-extintores" },
          { name: svc.h1, path: svc.path },
        ])
      );
    }
  } else if (seo.zona) {
    setJsonLd(
      "seo-crumbs",
      breadcrumbs([
        { name: "Inicio", path: "/" },
        {
          name: seo.zona.region === "edomex" ? "Estado de México" : "Ciudad de México",
          path: extintoresHubPath(seo.zona.region),
        },
        { name: seo.zona.name, path: seo.path },
      ])
    );
    setJsonLd("seo-service-area", {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Extintores y equipo contra incendios en ${seo.zona.name}`,
      provider: { "@id": `${SITE.origin}/#business` },
      areaServed: {
        "@type": "AdministrativeArea",
        name: `${seo.zona.name}, ${zonaRegionLabel(seo.zona)}`,
      },
      url,
    });
  } else if (page === "galeria") {
    setJsonLd(
      "seo-crumbs",
      breadcrumbs([
        { name: "Inicio", path: "/" },
        { name: "Galería", path: "/galeria" },
      ])
    );
    setJsonLd("seo-gallery", {
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      name: `Galería de instalaciones ${company.name}`,
      description: seo.description,
      url,
      associatedMedia: lookbook.map((item) => {
        const stem = String(item.src || "").match(/(?:galeria|foto|hero)-[^./]+/)?.[0];
        return {
          "@type": "ImageObject",
          name: `${item.title} — ${company.name}`,
          caption: lookAlt(item),
          contentUrl: abs(stem ? `/assets/img/opt/full/${stem}-1400.webp` : item.src),
        };
      }),
    });
  } else if (page === "inspector" && company.inspector) {
    const ins = company.inspector;
    setJsonLd(
      "seo-crumbs",
      breadcrumbs([
        { name: "Inicio", path: "/" },
        { name: "Nosotros", path: "/nosotros" },
        { name: ins.name, path: ins.path },
      ])
    );
    setJsonLd("seo-inspector", {
      "@context": "https://schema.org",
      "@type": "Person",
      name: ins.name,
      alternateName: ["El Inspector CRM", "Inspector de Grupo CRM Extintores"],
      description: seo.description,
      image: [abs(ins.image), abs(ins.imageExtintor), abs(ins.imagePng), abs(ins.imageExtintorPng)],
      jobTitle: "Mascota e inspector de extintores de Grupo CRM",
      worksFor: { "@id": `${SITE.origin}/#organization` },
      url,
    });
    setJsonLd("seo-inspector-images", {
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      name: "Ilustraciones oficiales del Inspector CRM",
      url,
      associatedMedia: [
        {
          "@type": "ImageObject",
          name: "Inspector CRM",
          contentUrl: abs(ins.image),
          url: abs(ins.imagePng),
          caption: ins.alt,
          width: ins.imageWidth,
          height: ins.imageHeight,
        },
        {
          "@type": "ImageObject",
          name: "Inspector CRM con extintor",
          contentUrl: abs(ins.imageExtintor),
          url: abs(ins.imageExtintorPng),
          caption: ins.altExtintor,
          width: ins.imageWidth,
          height: ins.imageHeight,
        },
      ],
    });
  }

  return seo;
}

export function sitemapUrls() {
  return [
    "/",
    "/nosotros",
    "/productos",
    "/galeria",
    "/contacto",
    "/aviso-privacidad",
    "/politica-de-servicio",
    "/fuentes-y-normatividad",
    "/inspector-crm",
    "/mapa-sitio",
    "/blog",
    "/extintores-cdmx",
    "/extintores-estado-de-mexico",
    ...seoServicePages.map((s) => s.path),
    ...zonas.map((z) => extintoresPath(z)),
    ...blogPosts.map((post) => post.path),
    ...categories.map((c) => catPath(c.id)),
    ...products.map((p) => productPath(p.sku)),
  ];
}

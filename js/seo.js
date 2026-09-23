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
  readSku,
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

function productMetaDescription(p) {
  const lead = firstSentence(p.desc) || p.title;
  const parts = [lead];
  if (p.cap && lead.length < 110) parts.push(`Capacidad ${p.cap}.`);
  if (lead.length < 130) parts.push("Cotice en CDMX y Estado de México.");
  return clipDesc(parts.join(" "));
}

function stripHtml(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function defaultAreaServed() {
  return [
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
    alternateName: ["CRM Extintores", "Grupo CRM"],
    legalName: company.name,
    description: company.about,
    url: SITE.origin,
    image: logoUrl,
    logo: {
      "@type": "ImageObject",
      url: logoUrl,
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
        url: abs(`/productos?cat=${cat.id}`),
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

function websiteNode() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: company.name,
    url: SITE.origin,
    inLanguage: "es-MX",
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
    image: abs(post.image || SITE.ogImage),
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
    image: abs(productImg(p)),
    brand: { "@type": "Brand", name: company.name },
    category: catName(p.cat),
    url,
  };
}

function breadcrumbs(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
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
        title: `Búsqueda: ${q} | Grupo CRM Extintores`,
        description: clipDesc(`Resultados de “${q}”. Cotice extintores y equipo contra incendio con Grupo CRM Extintores.`),
        path: "/productos",
        robots: "noindex, follow",
      };
    }
    if (cat && categories.some((c) => c.id === cat)) {
      const name = catName(cat);
      return {
        ...base,
        title: `${name} | Catálogo Grupo CRM Extintores`,
        description: catSeo[cat] || `Línea de ${name.toLowerCase()} de Grupo CRM Extintores. Cotice en CDMX y Estado de México.`,
        path: `/productos?cat=${cat}`,
      };
    }
  }
  if (page === "producto") {
    const p = productBySku(readSku());
    if (!p) {
      return {
        ...pageSeo.error,
        title: "Artículo no encontrado | Grupo CRM Extintores",
        path: "/producto",
      };
    }
    return {
      path: `/producto?sku=${p.sku}`,
      title: `${p.title} · ${p.sku} | Grupo CRM Extintores`,
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
          ? "Extintores en Estado de México | Venta, Recarga y Mantenimiento"
          : "Extintores en CDMX | Venta, Recarga y Mantenimiento",
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
        title: "Extintores en CDMX | Venta, Recarga y Mantenimiento",
        description:
          "Extintores en Ciudad de México: venta, recarga, mantenimiento e instalación. Cotice con Grupo CRM Extintores.",
      };
    }
    const region = zonaRegionLabel(zona);
    return {
      path: extintoresPath(zona),
      title:
        zona.region === "edomex"
          ? `Extintores en ${zona.name}, Estado de México | Grupo CRM Extintores`
          : `Extintores en ${zona.name}, CDMX | Venta y Recarga`,
      description: clipDesc(
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
  setMeta("og:site_name", company.name, "property");
  setMeta("og:title", seo.title, "property");
  setMeta("og:description", seo.description, "property");
  setMeta("og:url", url, "property");
  setMeta("og:image", image, "property");
  setMeta(
    "og:image:alt",
    seo.product
      ? productAlt(seo.product, { detail: true })
      : seo.article?.imageAlt || `Logotipo de ${company.name}`,
    "property"
  );
  if (!seo.product && !seo.article) {
    setMeta("og:image:width", "720", "property");
    setMeta("og:image:height", "154", "property");
    setMeta("og:image:type", "image/png", "property");
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
    isPartOf: { "@type": "WebSite", "@id": `${SITE.origin}/#website`, name: company.name, url: SITE.origin },
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
  setJsonLd("seo-business", professionalService({ areaServed: businessArea }));
  setJsonLd("seo-website", websiteNode());

  if (page === "inicio") {
    setJsonLd("seo-faq", faqPage(faqs));
  }

  if (page === "blog") {
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
    if (cat && categories.some((c) => c.id === cat)) crumbs.push({ name: catName(cat), path: `/productos?cat=${cat}` });
    setJsonLd("seo-crumbs", breadcrumbs(crumbs));
  } else if (seo.product) {
    setJsonLd("seo-product", productNode(seo.product, url));
    setJsonLd(
      "seo-crumbs",
      breadcrumbs([
        { name: "Inicio", path: "/" },
        { name: "Catálogo", path: "/productos" },
        { name: catName(seo.product.cat), path: `/productos?cat=${seo.product.cat}` },
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
    "/caso-agencia-automotriz",
    "/mapa-sitio",
    "/blog",
    "/extintores-cdmx",
    "/extintores-estado-de-mexico",
    ...seoServicePages.map((s) => s.path),
    ...zonas.map((z) => extintoresPath(z)),
    ...blogPosts.map((post) => post.path),
    ...categories.map((c) => `/productos?cat=${c.id}`),
    ...products.map((p) => `/producto?sku=${p.sku}`),
  ];
}

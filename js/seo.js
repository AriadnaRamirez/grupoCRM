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
} from "./data.js";

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

function localBusiness() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Organization"],
    name: company.name,
    description: company.about,
    url: SITE.origin,
    image: abs(SITE.ogImage),
    logo: abs(SITE.ogImage),
    email: company.email,
    telephone: [`+52${company.phoneTel}`, `+52${company.phoneAltTel}`],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Chamixto 131, Col. Loma del Padre",
      addressLocality: "Cuajimalpa",
      addressRegion: "Ciudad de México",
      addressCountry: "MX",
    },
    areaServed: ["Ciudad de México", "Estado de México"],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    sameAs: [company.facebookUrl, company.instagramUrl],
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
      location.pathname.replace(/^\/blog\/?/, "").replace(/\.html$/i, "");
    const post = blogPostBySlug(slug);
    if (!post) return { ...pageSeo.articulo };
    return {
      ...post,
      type: "article",
      article: post,
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
  document.title = seo.title;
  setMeta("description", seo.description);
  setMeta("robots", robots);
  setMeta("author", company.name);
  setMeta("theme-color", SITE.themeColor);
  setLink("canonical", url);
  setLink("alternate", url, { hreflang: "es-MX" });
  setLink("alternate", url, { hreflang: "x-default" });
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
  setMeta("twitter:card", "summary_large_image");
  setMeta("twitter:title", seo.title);
  setMeta("twitter:description", seo.description);
  setMeta("twitter:image", image);

  setJsonLd("seo-business", localBusiness());
  setJsonLd("seo-website", websiteNode());

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
    "/mapa-sitio",
    "/blog",
    ...blogPosts.map((post) => post.path),
    ...categories.map((c) => `/productos?cat=${c.id}`),
    ...products.map((p) => `/producto?sku=${p.sku}`),
  ];
}

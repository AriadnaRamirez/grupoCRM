import { company, categories, products, services, courses, sectors, faqs, reviews, clients, waUrl, safeDecode, catName, catCount, productBySku, productImg, productAlt, productUrl, readSku, relatedProducts, lookbook, lookAlt, lookFull, venues, carePoints, readyChecks, condo } from "./data.js?v=audit-fix";
import { applySeo } from "./seo.js";
import { rebaseDocument, rebaseSrcset, withBase } from "./base.js";

const fa = (cls) => `<i class="${cls}" aria-hidden="true"></i>`;
const WA_ICON = fa("fa-brands fa-whatsapp wa-icon");
const FB_ICON = fa("fa-brands fa-facebook-f social-icon");
const IG_ICON = fa("fa-brands fa-instagram social-icon");
const PHONE_ICON = fa("fa-solid fa-phone phone-icon");
const MAIL_ICON = fa("fa-solid fa-envelope mail-icon");
const SEARCH_ICON = fa("fa-solid fa-magnifying-glass");
const CHEV_DOWN = fa("fa-solid fa-chevron-down nav-drop__chevron");

function topIcon(name, faClass) {
  return fa(`${faClass} topbar__icon topbar__icon--${name}`);
}
const TOPBAR_PHONE = topIcon("phone", "fa-solid fa-phone");
const TOPBAR_WA = topIcon("whatsapp", "fa-brands fa-whatsapp");
const TOPBAR_MAIL = topIcon("mail", "fa-solid fa-envelope");
const TOPBAR_PIN = topIcon("pin", "fa-solid fa-location-dot");
const TOPBAR_FB = topIcon("facebook", "fa-brands fa-facebook-f");
const TOPBAR_IG = topIcon("instagram", "fa-brands fa-instagram");

function escapeAttr(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function reviewInitials(name) {
  const skip = new Set(["de", "del", "la", "las", "los", "y", "sa", "cv"]);
  const parts = String(name || "")
    .split(/\s+/)
    .filter((part) => part && !skip.has(part.toLowerCase().replace(/\./g, "")));
  const first = parts[0]?.[0] || "";
  const second = parts[1]?.[0] || parts[0]?.[1] || "";
  return (first + second).toUpperCase();
}

export function mountShell(page) {
  const header = document.querySelector("[data-header]");
  const footer = document.querySelector("[data-footer]");
  if (header) header.innerHTML = headerHTML(page);
  if (footer) footer.innerHTML = footerHTML();
  rebaseDocument();
  bindChrome();
  bindBackTop();
}

const HOME_VALUE_ICONS = [
  "fa-handshake",
  "fa-shield-halved",
  "fa-award",
  "fa-heart",
  "fa-people-group",
];

const CAT_COVER = {
  extintores: { src: "/assets/img/categoria-extintores.png", alt: "Extintor Grupo CRM de polvo químico seco ABC", photo: true },
  chalecos: { src: "/assets/img/categoria-chalecos.png", alt: "Chaleco de malla para brigadas Grupo CRM", photo: true },
  "senalamiento-vial": { src: "/assets/img/categoria-senalamiento-vial.png", alt: "Cono vial flexible Grupo CRM", photo: true },
  "gabinetes-herrajes": { src: "/assets/img/categoria-gabinetes-herrajes.png", alt: "Gabinete para extintor Grupo CRM", photo: true },
  botiquines: { src: "/assets/img/categoria-botiquines.png", alt: "Botiquín metálico de pared Grupo CRM", photo: true },
  "equipo-proteccion": { src: "/assets/img/categoria-equipo-proteccion.png", alt: "Casco de seguridad Grupo CRM", photo: true },
};

function absAsset(src) {
  if (!src || /^https?:\/\//i.test(src)) return src;
  return withBase(src.startsWith("/") ? src : `/${src}`);
}

function lookStem(item) {
  const src = String(item?.src || item?.full || "");
  const match = src.match(/(?:galeria|foto|hero)-[^./]+/);
  return match ? match[0] : "";
}

function srcsetOf(prefix, stem, widths) {
  return widths.map((w) => `${absAsset(`${prefix}${stem}-${w}.webp`)} ${w}w`).join(", ");
}

function fullSrcset(stem) {
  return srcsetOf("/assets/img/opt/full/", stem, [800, 1400, 1600]);
}

function catalogSrcset(sku) {
  return srcsetOf("/assets/img/opt/catalog/", sku, [400, 800]);
}

function lookThumbSrc(item) {
  const stem = lookStem(item);
  if (!stem) return absAsset(item?.src || lookFull(item));
  return absAsset(`/assets/img/opt/full/${stem}-800.webp`);
}

function lookFullOpt(item) {
  const stem = lookStem(item);
  return stem ? absAsset(`/assets/img/opt/full/${stem}-1400.webp`) : absAsset(lookFull(item));
}

function catFile(cover) {
  return String(cover?.src || "").split("/").pop().replace(/\.(png|jpe?g|webp)$/i, "");
}

function catSku(cover) {
  const match = String(cover?.src || "").match(/CRM-\d{4}/i);
  return match ? match[0].toUpperCase() : "";
}

function isCatalogCover(cover) {
  return /\/catalog\/CRM-\d{4}/i.test(String(cover?.src || ""));
}

function catImg(cover, width = 480) {
  if (isCatalogCover(cover)) {
    const sku = catSku(cover);
    return sku ? catalogImg(sku, width <= 400 ? 400 : 800) : absAsset(cover?.src);
  }
  const file = catFile(cover);
  return file ? absAsset(`/assets/img/opt/${file}-${width}.webp`) : absAsset(cover?.src);
}

function catSrcset(cover) {
  if (isCatalogCover(cover)) {
    const sku = catSku(cover);
    return sku ? catalogSrcset(sku) : "";
  }
  const file = catFile(cover);
  if (!file) return "";
  return [480, 960].map((w) => `${absAsset(`/assets/img/opt/${file}-${w}.webp`)} ${w}w`).join(", ");
}

function catalogImg(sku, width = 400) {
  return absAsset(`/assets/img/opt/catalog/${sku}-${width}.webp`);
}

function clientFile(src) {
  return String(src || "").split("/").pop().replace(/\.(png|jpe?g|webp)$/i, "");
}

function clientSrcset(src) {
  const file = clientFile(src);
  if (!file) return "";
  return [160, 320].map((w) => `${absAsset(`/assets/img/opt/clients/${file}-${w}.webp`)} ${w}w`).join(", ");
}

function clientPicture(logo, { alt = "", extra = "", lazy = false } = {}) {
  const file = clientFile(logo.src);
  const src = file ? absAsset(`/assets/img/opt/clients/${file}-160.webp`) : absAsset(logo.src);
  const srcset = clientSrcset(logo.src);
  const loading = imgLoadAttrs({ lazy });
  return `<picture>
    <source type="image/webp" srcset="${srcset}" sizes="80px">
    <img${extra} src="${src}" alt="${alt}" width="160" height="72"${loading}>
  </picture>`;
}

function imgLoadAttrs({ lazy = true, priority = false } = {}) {
  if (priority) return ' fetchpriority="high" decoding="async"';
  if (lazy) return ' loading="lazy" decoding="async"';
  return ' decoding="async"';
}

function lookPicture(item, { sizes, lazy = true, priority = false, width = 480, height, alt = "", extra = "" } = {}) {
  const loading = imgLoadAttrs({ lazy: lazy && !priority, priority });
  const stem = lookStem(item);
  const srcset = fullSrcset(stem);
  const src = lookThumbSrc(item);
  const dims = height ? ` width="${width}" height="${height}"` : ` width="${width}"`;
  return `<picture>
    <source type="image/webp" srcset="${srcset}" sizes="${sizes}">
    <img src="${src}" alt="${escapeAttr(alt)}"${dims}${loading}${extra}>
  </picture>`;
}

function catCover(c) {
  const cover = CAT_COVER[c.id];
  if (cover && typeof cover === "object" && cover.src) {
    return { src: absAsset(cover.src), alt: cover.alt || c.name, photo: !!cover.photo };
  }
  const product = productBySku(cover) || products.find((p) => p.cat === c.id);
  if (!product) return null;
  return { src: absAsset(productImg(product)), alt: "", photo: false };
}

function applyLazySrc(img) {
  if (!img) return;
  const src = img.dataset.src;
  if (src && img.getAttribute("src") !== src) {
    img.src = /^https?:/i.test(src) ? src : withBase(src);
    img.removeAttribute("data-src");
  }
  if (img.dataset.srcset) {
    img.srcset = rebaseSrcset(img.dataset.srcset);
    img.removeAttribute("data-srcset");
  }
  img.closest("picture")?.querySelectorAll("source[data-srcset]").forEach((source) => {
    source.srcset = rebaseSrcset(source.dataset.srcset);
    source.removeAttribute("data-srcset");
  });
}

function bindBgMediaLoad(el, src) {
  if (!el || el.dataset.loadBound === "1") return;
  el.dataset.loadBound = "1";
  el.classList.add("media-load");
  const ready = () => el.classList.add("is-ready");
  if (!src) {
    ready();
    return;
  }
  const probe = new Image();
  probe.addEventListener("load", ready, { once: true });
  probe.addEventListener("error", () => {
    el.classList.add("is-error");
    ready();
  }, { once: true });
  probe.src = src;
  if (probe.complete && probe.naturalWidth) ready();
}

function applyLazyBg(el) {
  if (!el) return;
  if (el.dataset.bg) el.dataset.bg = withBase(el.dataset.bg);
  const photo = el.querySelector(".slide__photo") || el;
  const img = photo.querySelector("img");
  if (img) {
    applyLazySrc(img);
    bindMediaLoad(el);
    return;
  }
  const src = el.dataset.bg;
  if (!src) return;
  if (el.dataset.bgReady !== "1") {
    el.dataset.bgReady = "1";
    const url = `url("${src}")`;
    if (photo !== el) photo.style.backgroundImage = url;
    else el.style.backgroundImage = url;
  }
  bindBgMediaLoad(photo, src);
}

function hydrateLazy(root = document) {
  if (!root) return;
  root.querySelectorAll("[data-bg]").forEach(applyLazyBg);
  root.querySelectorAll("img[data-src]").forEach(applyLazySrc);
  bindMediaLoad(root);
}

let lazyIo;
function bindLazyHydrate(scope = document) {
  const targets = [...scope.querySelectorAll(".slide:not(.is-active)[data-bg], img[data-src]")];
  if (!targets.length) return;
  const hydrate = (el) => {
    if (el.matches?.("[data-bg]")) applyLazyBg(el);
    else applyLazySrc(el.tagName === "IMG" ? el : el.querySelector?.("img[data-src]"));
    bindMediaLoad(el.closest?.(".slide") || el.parentElement || document);
  };
  if (!("IntersectionObserver" in window)) {
    targets.forEach(hydrate);
    return;
  }
  if (!lazyIo) {
    lazyIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          lazyIo.unobserve(entry.target);
          hydrate(entry.target);
        });
      },
      { rootMargin: "720px 0px", threshold: 0.01 }
    );
  }
  targets.forEach((el) => lazyIo.observe(el));
}

function catalogExtendInner(defer = false) {
  const cards = categories
    .map((c) => {
      const cover = catCover(c);
      const n = catCount(c.id);
      const webp = cover ? catSrcset(cover) : "";
      const fallback = cover ? catImg(cover) : "";
      const img = cover
        ? defer
          ? `<picture><source type="image/webp" data-srcset="${webp}" sizes="(min-width: 1024px) 72px, 40px"><img data-src="${fallback}" alt="${escapeAttr(cover.alt)}" decoding="async"></picture>`
          : `<picture><source type="image/webp" srcset="${webp}" sizes="(min-width: 1024px) 72px, 40px"><img src="${fallback}" alt="${escapeAttr(cover.alt)}" loading="lazy" decoding="async"></picture>`
        : "";
      return `<li>
        <a class="shop-dept" data-cat="${c.id}" href="${withBase(`/productos?cat=${c.id}#${c.id}`)}">
          <span class="shop-dept__media${cover?.photo ? " shop-dept__media--photo" : " shop-dept__media--sku"}">
            ${img}
          </span>
          <span class="shop-dept__body">
            <span class="shop-dept__rule" aria-hidden="true"></span>
            <strong>${c.name}</strong>
            <span class="shop-dept__n">${n} producto${n === 1 ? "" : "s"}</span>
          </span>
        </a>
      </li>`;
    })
    .join("");
  return `<ul class="shop-depts">${cards}</ul>`;
}

function catalogCatFromUrl() {
  const params = new URLSearchParams(location.search);
  const fromHash = safeDecode((location.hash || "").replace(/^#/, ""));
  let cat = params.get("cat") || fromHash || "all";
  if (cat !== "all" && !categories.some((c) => c.id === cat)) cat = "all";
  return cat;
}

function catalogPickerInner(current = "all") {
  const mosaic = categories
    .map((c) => {
      const cover = catCover(c);
      const webp = cover ? catSrcset(cover) : "";
      const fallback = cover ? catImg(cover) : "";
      return cover
        ? `<picture><source type="image/webp" srcset="${webp}" sizes="80px"><img src="${fallback}" alt="" aria-hidden="true" loading="lazy" decoding="async"></picture>`
        : "";
    })
    .join("");
  const allCard = `<li>
    <a class="shop-dept shop-dept--all${current === "all" ? " is-active" : ""}" data-cat="all" href="${withBase("/productos")}" aria-current="${current === "all" ? "page" : "false"}">
      <span class="shop-dept__media shop-dept__media--mosaic shop-dept__media--photo">${mosaic}</span>
          <span class="shop-dept__body">
            <span class="shop-dept__rule" aria-hidden="true"></span>
            <strong>Todos<span class="shop-dept__paren"> (${products.length})</span></strong>
            <span class="shop-dept__n">${products.length} productos</span>
          </span>
    </a>
  </li>`;
  const cards = categories
    .map((c) => {
      const cover = catCover(c);
      const n = catCount(c.id);
      const active = current === c.id;
      const webp = cover ? catSrcset(cover) : "";
      const fallback = cover ? catImg(cover) : "";
      const img = cover
        ? `<picture><source type="image/webp" srcset="${webp}" sizes="(min-width: 900px) 160px, 30vw"><img src="${fallback}" alt="${escapeAttr(cover.alt)}" loading="lazy" decoding="async"></picture>`
        : "";
      return `<li>
        <a class="shop-dept${active ? " is-active" : ""}" data-cat="${c.id}" href="${withBase(`/productos?cat=${c.id}#${c.id}`)}" aria-current="${active ? "page" : "false"}">
          <span class="shop-dept__media${cover?.photo ? " shop-dept__media--photo" : " shop-dept__media--sku"}">
            ${img}
          </span>
          <span class="shop-dept__body">
            <span class="shop-dept__rule" aria-hidden="true"></span>
            <strong>${c.name}<span class="shop-dept__paren"> (${n})</span></strong>
            <span class="shop-dept__n">${n} producto${n === 1 ? "" : "s"}</span>
          </span>
        </a>
      </li>`;
    })
    .join("");
  return `<p class="catalog-picker__label" id="catalog-filter">Filtrar por categoría</p>
    <ul class="shop-depts catalog-picker__grid" aria-labelledby="catalog-filter">${allCard}${cards}</ul>`;
}

function syncCatalogPicker(root, current) {
  if (!root) return;
  root.classList.toggle("is-all-active", current === "all");
  root.querySelectorAll(".shop-dept[data-cat]").forEach((link) => {
    const on = link.dataset.cat === current;
    link.classList.toggle("is-active", on);
    link.setAttribute("aria-current", on ? "page" : "false");
  });
}

export function renderCatalogExtend() {
  document.querySelectorAll("[data-catalog-extend]").forEach((root) => {
    const isProductos = document.body.dataset.page === "productos";
    const inner = isProductos ? catalogPickerInner(catalogCatFromUrl()) : catalogExtendInner();
    root.classList.toggle("catalog-picker", isProductos);
    if (isProductos) root.classList.toggle("is-all-active", catalogCatFromUrl() === "all");
    root.innerHTML = `<div class="wrap mega__inner">${inner}</div>`;
    root.setAttribute("aria-busy", "false");
    bindMediaLoad(root);
  });
}

function headerHTML(page) {
  const item = (href, id, label) => {
    const active =
      page === id ||
      (id === "productos" && page === "producto") ||
      (id === "nosotros" && page === "servicios") ||
      (id === "blog" && page === "articulo");
    return `<a class="${active ? "is-active" : ""}" href="${withBase(href)}">${label}</a>`;
  };
  const catalogOpen = page === "productos" || page === "producto";
  return `
    <div class="site-chrome">
      <div class="site-topbar">
        <div class="wrap topbar__inner">
          <div class="topbar__left">
            <a class="topbar__tel" href="tel:${company.phoneTel}" aria-label="Llámenos al ${company.phone}">${TOPBAR_PHONE}<span>${company.phone}</span></a>
            <a class="topbar__tel" href="${waUrl()}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp ${company.whatsappShow}">${TOPBAR_WA}<span>${company.whatsappShow}</span></a>
            <a class="topbar__tel" href="mailto:${company.email}">${TOPBAR_MAIL}<span class="topbar__full">${company.email}</span><span class="topbar__short">Correo</span></a>
          </div>
          <div class="topbar__right">
            <p class="topbar__place">${TOPBAR_PIN}<span class="topbar__full">${company.location}</span><span class="topbar__short">CDMX y Edo. Mex</span></p>
            <p class="topbar__social">
              <a href="${company.facebookUrl}" target="_blank" rel="noopener noreferrer" aria-label="Facebook, se abre en una ventana nueva">${TOPBAR_FB}</a>
              <a href="${company.instagramUrl}" target="_blank" rel="noopener noreferrer" aria-label="Instagram, se abre en una ventana nueva">${TOPBAR_IG}</a>
            </p>
          </div>
        </div>
      </div>
      <header class="site-header">
        <div class="wrap header__inner">
          <a class="brand" href="${withBase("/")}"><img src="${withBase("/assets/img/logo-crm.png")}" alt="Grupo CRM Extintores" width="243" height="52"></a>
          <nav class="nav" id="menu">
            ${item("/", "inicio", "Inicio")}
            ${item("/nosotros", "nosotros", "Nosotros")}
            <div class="nav-drop">
              <a class="nav-drop__link ${catalogOpen ? "is-active" : ""}" href="${withBase("/productos")}">Catálogo</a>
              <button type="button" class="nav-drop__toggle" aria-expanded="false" aria-haspopup="true" aria-controls="nav-catalogo" aria-label="Ver categorías del catálogo">
                ${CHEV_DOWN}
              </button>
              <div class="nav-drop__menu" id="nav-catalogo">
                <div class="wrap mega__inner">
                  ${catalogExtendInner(true)}
                  <p class="nav-drop__all"><a class="btn btn-red" href="${withBase("/productos")}">Ver todo el catálogo</a></p>
                </div>
              </div>
            </div>
            ${item("/galeria", "galeria", "Galería")}
            ${item("/blog", "blog", "Blog")}
            ${item("/contacto", "contacto", "Contacto")}
          </nav>
          <form class="nav-search" action="${withBase("/productos")}" method="get" role="search">
            <div class="nav-search__field">
              <label class="sr-only" for="nav-search-q">Buscar equipo</label>
              <input id="nav-search-q" type="search" name="q" placeholder="Buscar equipo" autocomplete="off" data-nav-search>
              <button type="submit" aria-label="Buscar">
                ${SEARCH_ICON}
                <span class="nav-search__label">Buscar</span>
              </button>
            </div>
          </form>
          <div class="header__end">
            <button type="button" class="nav-toggle" data-nav-toggle aria-expanded="false" aria-controls="menu">
              <span class="sr-only">Abrir menú</span>
              <span class="nav-toggle__icon" aria-hidden="true"><span></span><span></span><span></span></span>
            </button>
            <a class="header__cta" href="${waUrl()}" target="_blank" rel="noopener noreferrer" aria-label="Cotizar por WhatsApp">${WA_ICON} <span>Cotizar</span></a>
          </div>
        </div>
      </header>
    </div>`;
}

function footerHTML() {
  const catLinks = categories.map((c) => `<li><a href="${withBase(`/productos?cat=${c.id}#${c.id}`)}">${c.name}</a></li>`).join("");
  return `
    <footer class="site-footer">
      <div class="wrap footer-grid">
        <div class="footer-brand">
          <a class="footer-mark" href="${withBase("/")}">
            <img class="footer-mark__flame" src="${withBase("/assets/img/logo-crm-flame.png")}" alt="Grupo CRM Extintores" width="112" height="154" loading="lazy" decoding="async">
            <img class="footer-mark__crm" src="${withBase("/assets/img/logo-crm-wordmark.png")}" alt="" width="286" height="87" loading="lazy" decoding="async">
          </a>
          <p class="footer-brand__about">${company.about} ${company.slogan}</p>
          <p class="footer-social">
            <a href="${company.facebookUrl}" target="_blank" rel="noopener noreferrer" aria-label="Facebook ${company.facebook}, se abre en una ventana nueva">${FB_ICON}</a>
            <a href="${company.instagramUrl}" target="_blank" rel="noopener noreferrer" aria-label="Instagram ${company.instagram}, se abre en una ventana nueva">${IG_ICON}</a>
          </p>
        </div>
        <nav aria-label="Productos">
          <h3>Productos</h3>
          <ul>
            <li><a href="${withBase("/productos")}">Ver equipos</a></li>
            ${catLinks}
          </ul>
        </nav>
        <nav aria-label="Empresa">
          <h3>Empresa</h3>
          <ul>
            <li><a href="${withBase("/")}">Inicio</a></li>
            <li><a href="${withBase("/nosotros")}">Nosotros</a></li>
            <li><a href="${withBase("/nosotros#servicios")}">Servicios</a></li>
            <li><a href="${withBase("/nosotros#cursos")}">Cursos</a></li>
            <li><a href="${withBase("/#resenas")}">Reseñas</a></li>
            <li><a href="${withBase("/galeria")}">Galería</a></li>
            <li><a href="${withBase("/blog")}">Blog</a></li>
            <li><a href="${withBase("/contacto")}">Contacto</a></li>
            <li><a href="${withBase("/aviso-privacidad")}">Aviso de privacidad</a></li>
            <li><a href="${withBase("/mapa-sitio")}">Mapa de sitio</a></li>
          </ul>
        </nav>
        <nav aria-label="Contacto">
          <h3>Contacto</h3>
          <ul>
            <li><a href="${company.mapsUrl}" target="_blank" rel="noopener noreferrer">${fa("fa-solid fa-location-dot")} ${company.address}</a></li>
            <li><a href="tel:${company.phoneTel}">${PHONE_ICON} ${company.phone}</a></li>
            <li><a href="tel:${company.phoneAltTel}">${PHONE_ICON} ${company.phoneAlt}</a></li>
            <li><a href="${waUrl()}" target="_blank" rel="noopener noreferrer">${WA_ICON} ${company.whatsappShow}</a></li>
            <li class="footer-hide-sm"><a href="${company.websiteUrl}" target="_blank" rel="noopener noreferrer">${fa("fa-solid fa-globe")} ${company.website}</a></li>
            <li><a href="mailto:${company.email}">${MAIL_ICON} ${company.email}</a></li>
            <li class="footer-hide-sm">${company.hours}</li>
          </ul>
        </nav>
      </div>
      <div class="wrap footer-legal">
        <p class="copy">© ${new Date().getFullYear()} Grupo CRM Extintores. Todos los derechos reservados.</p>
        <p class="copy"><a href="${withBase("/aviso-privacidad")}">Aviso de privacidad</a> · ${company.coverage}</p>
      </div>
    </footer>
    <div class="page-floats">
      <button type="button" class="back-top" data-back-top aria-label="Volver arriba">
        ${fa("fa-solid fa-chevron-up")}
      </button>
      <a class="wa-float" href="${waUrl()}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp ${company.whatsappShow}, se abre en una ventana nueva">${WA_ICON}<span>Escríbanos</span></a>
    </div>`;
}

function bindBackTop() {
  const btn = document.querySelector("[data-back-top]");
  if (!btn || btn.dataset.bound === "1") return;
  btn.dataset.bound = "1";
  const update = () => {
    const on = window.scrollY > 360;
    btn.classList.toggle("is-on", on);
    btn.setAttribute("aria-hidden", on ? "false" : "true");
    btn.tabIndex = on ? 0 : -1;
  };
  btn.addEventListener("click", () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, left: 0, behavior: reduce ? "auto" : "smooth" });
  });
  update();
  window.addEventListener("scroll", update, { passive: true });
}

const NAV_DESKTOP_MQ = "(min-width: 1024px)";

function bindChrome() {
  const chrome = document.querySelector(".site-chrome");
  if (!chrome) return;
  const navToggle = chrome.querySelector("[data-nav-toggle]");
  const menu = chrome.querySelector("#menu");
  const drops = [...chrome.querySelectorAll(".nav-drop")];
  const sync = () => {
    chrome.classList.toggle("is-scrolled", window.scrollY > 16);
    document.body.style.paddingTop = `${chrome.offsetHeight}px`;
    document.documentElement.style.setProperty("--chrome-h", `${chrome.offsetHeight}px`);
  };
  const closeDrops = (except) => {
    drops.forEach((drop) => {
      if (drop === except) return;
      drop.classList.remove("is-open");
      drop.querySelector(".nav-drop__toggle")?.setAttribute("aria-expanded", "false");
    });
  };
  const setMenu = (open) => {
    chrome.classList.toggle("is-nav-open", open);
    document.body.classList.toggle("is-nav-open", open);
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      const label = navToggle.querySelector(".sr-only");
      if (label) label.textContent = open ? "Cerrar menú" : "Abrir menú";
    }
    if (!open) closeDrops();
    if (open) hydrateLazy(menu);
    sync();
  };
  const setDrop = (drop, open) => {
    const dropToggle = drop?.querySelector(".nav-drop__toggle");
    if (!drop || !dropToggle) return;
    if (open) closeDrops(drop);
    drop.classList.toggle("is-open", open);
    dropToggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) hydrateLazy(drop);
  };
  sync();
  window.addEventListener("scroll", sync, { passive: true });
  window.addEventListener("resize", () => {
    if (window.matchMedia(NAV_DESKTOP_MQ).matches) setMenu(false);
    sync();
  });
  navToggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    setMenu(!chrome.classList.contains("is-nav-open"));
  });
  drops.forEach((drop) => {
    const dropToggle = drop.querySelector(".nav-drop__toggle");
    dropToggle?.addEventListener("click", (e) => {
      e.stopPropagation();
      setDrop(drop, !drop.classList.contains("is-open"));
    });
    const syncDropBridge = () => {
      const panel = drop.querySelector(".nav-drop__menu");
      const header = drop.closest(".site-header");
      if (!panel || !header) return;
      const hr = header.getBoundingClientRect();
      const dr = drop.getBoundingClientRect();
      panel.style.setProperty("--drop-bridge-left", `${Math.max(0, dr.left - hr.left)}px`);
      panel.style.setProperty("--drop-bridge-width", `${dr.width}px`);
      panel.style.setProperty("--drop-bridge-height", `${Math.max(8, hr.bottom - dr.bottom + 4)}px`);
    };
    const lockHover = () => drop.classList.add("is-hover-locked");
    const unlockHover = () => drop.classList.remove("is-hover-locked");
    const preload = () => hydrateLazy(drop);
    drop.querySelector(".nav-drop__link")?.addEventListener("click", () => {
      if (!window.matchMedia(NAV_DESKTOP_MQ).matches) return;
      try {
        sessionStorage.setItem("crm-nav-drop-lock", "1");
      } catch {
        /* ignore */
      }
      setDrop(drop, false);
      lockHover();
      drop.querySelector(".nav-drop__link")?.blur();
    });
    try {
      if (sessionStorage.getItem("crm-nav-drop-lock") === "1") {
        sessionStorage.removeItem("crm-nav-drop-lock");
        if (window.matchMedia(NAV_DESKTOP_MQ).matches) {
          lockHover();
          setDrop(drop, false);
        }
      }
    } catch {
      /* ignore */
    }
    drop.addEventListener("mouseenter", () => {
      preload();
      if (!window.matchMedia(NAV_DESKTOP_MQ).matches) return;
      if (drop.classList.contains("is-hover-locked")) return;
      syncDropBridge();
      setDrop(drop, true);
    });
    drop.addEventListener("mouseleave", () => {
      unlockHover();
      if (window.matchMedia(NAV_DESKTOP_MQ).matches) setDrop(drop, false);
    });
    window.addEventListener("resize", () => {
      if (window.matchMedia(NAV_DESKTOP_MQ).matches && drop.classList.contains("is-open")) syncDropBridge();
    });
    drop.addEventListener("focusin", preload);
    dropToggle?.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowDown") return;
      e.preventDefault();
      setDrop(drop, true);
      drop.querySelector(".nav-drop__menu a")?.focus();
    });
  });
  document.addEventListener("click", (e) => {
    if (!drops.some((drop) => drop.contains(e.target))) closeDrops();
    if (chrome.classList.contains("is-nav-open") && !chrome.contains(e.target)) setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (chrome.classList.contains("is-nav-open")) setMenu(false);
    else closeDrops();
  });
  menu?.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link) setMenu(false);
  });
  bindNavSearch(setMenu);
}

function bindNavSearch(closeMenu) {
  const form = document.querySelector("form.nav-search");
  if (!form || form.dataset.bound === "1") return;
  form.dataset.bound = "1";
  const input = form.querySelector("[data-nav-search]");

  const goCatalogSearch = (raw) => {
    const q = String(raw || "").trim();
    const onProductos = document.body.dataset.page === "productos";
    if (onProductos) {
      const pageSearch = document.querySelector("[data-search]");
      if (pageSearch) {
        pageSearch.value = q;
        pageSearch.dispatchEvent(new Event("input", { bubbles: true }));
      }
      const url = new URL(location.href);
      if (q) url.searchParams.set("q", q);
      else url.searchParams.delete("q");
      history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
      document.querySelector("[data-products]")?.scrollIntoView({ behavior: "smooth", block: "start" });
      closeMenu?.(false);
      return;
    }
    const url = new URL(withBase("/productos"), location.origin);
    if (q) url.searchParams.set("q", q);
    location.assign(`${url.pathname}${url.search}`);
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    goCatalogSearch(input?.value);
  });
}

const REVEAL_SEL = [
  ".hook",
  ".about-teaser",
  ".about-head__media",
  ".svc-home__intro",
  ".cursos-home__head",
  ".cursos-home__photo",
  ".shop-block",
  ".trust--logos .trust__head",
  ".reviews__head",
  ".cat-band__head",
  ".home-contact__peek-head",
  ".shop-hero__copy",
  ".peek-rail",
  ".section-intro",
  ".blog-card",
  ".article-page .article-measure",
].join(",");

let revealIo;

const MEDIA_WRAP = [
  ".shop-item__media",
  ".ficha__photo",
  ".gallery-tile",
  ".lookbook__hero",
  ".lookbook__thumb",
  ".shop-dept__media",
  ".cat-tile__media",
  ".client-tile__media",
  ".photo-frame",
  ".about-teaser__mascot",
  ".about-head__media",
  ".about-field__grid figure",
  ".about-mosaic__shot",
  ".about-train__photo",
  ".about-mv-band__figure",
  ".home-contact__photo",
  ".peek-rail__card",
  ".cursos-home__photo",
  ".svc-showcase__photo",
  ".slide__photo",
  ".shop-hero__photo",
  ".work-slide",
  ".error-page__figure",
  ".blog-card__media",
  ".article-hero",
  ".review__avatar",
  ".article-figure",
  ".hook__photo",
].join(",");

const MEDIA_SKIP = ".brand, .footer-mark, .contact-cta-row, .nav-toggle, .slide-btn, .peek-rail__btn, .client-rail, .lightbox";

function bindMediaLoad(scope = document) {
  scope.querySelectorAll("img").forEach((img) => {
    if (img.dataset.loadBound === "1") return;
    if (img.closest(MEDIA_SKIP)) return;
    if (img.dataset.src && !img.getAttribute("src")) return;
    img.dataset.loadBound = "1";
    const found = img.closest(MEDIA_WRAP);
    const wrap = found && found !== img ? found : null;
    const isLcp =
      img.getAttribute("fetchpriority") === "high" ||
      img.closest(".shop-hero__photo, .ficha__photo, .slide.is-active .slide__photo");
    if (wrap) wrap.classList.add("media-load");
    else img.classList.add("media-load");
    if (isLcp) {
      wrap?.classList.add("media-load--live", "is-ready");
      img.classList.add("is-ready");
    }
    const ready = () => {
      img.classList.add("is-ready");
      wrap?.classList.add("is-ready");
    };
    const markBroken = () => {
      img.classList.add("is-error");
      wrap?.classList.add("is-error");
      const host = wrap || img.parentElement;
      if (host && !host.querySelector(".media-fallback")) {
        const tip = document.createElement("span");
        tip.className = "media-fallback";
        tip.setAttribute("aria-hidden", "true");
        tip.textContent = "Imagen no disponible";
        host.appendChild(tip);
      }
      ready();
    };
    if (img.complete) {
      if (img.naturalWidth) ready();
      else markBroken();
      return;
    }
    img.addEventListener("load", ready, { once: true });
    img.addEventListener("error", markBroken, { once: true });
  });
}

export function bindMotion() {
  bindMediaLoad();
  bindLazyHydrate();
  document.querySelectorAll(".slide[data-bg]").forEach((slide) => {
    const src = slide.dataset.bg;
    const photo = slide.querySelector(".slide__photo") || slide;
    if (photo.style.backgroundImage || slide.dataset.bgReady === "1") bindBgMediaLoad(photo, src);
  });
  if (!revealIo) {
    revealIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          revealIo.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
  }

  const groups = new Map();
  const pending = [];
  document.querySelectorAll(REVEAL_SEL).forEach((el) => {
    if (el.dataset.motion === "1") return;
    el.dataset.motion = "1";
    el.classList.add("reveal");
    const parent = el.parentElement;
    const i = groups.get(parent) || 0;
    groups.set(parent, i + 1);
    el.style.setProperty("--d", String(Math.min(i, 6)));
    const rect = el.getBoundingClientRect();
    const visible = rect.top < window.innerHeight * 0.94 && rect.bottom > 24;
    if (visible) pending.push(el);
    revealIo.observe(el);
  });

  const arm = () => {
    document.documentElement.classList.add("motion-ready");
    pending.forEach((el) => el.classList.add("is-in"));
  };
  requestAnimationFrame(() => requestAnimationFrame(arm));
  window.setTimeout(arm, 120);
}

function quoteUrl(p) {
  const bits = [`Hola, quiero cotizar ${p.sku} — ${p.title}.`, `Línea: ${catName(p.cat)}.`];
  if (p.cap) bits.push(`Capacidad: ${p.cap}.`);
  if (p.agent) bits.push(p.agent.endsWith(".") ? p.agent : `${p.agent}.`);
  return waUrl(bits.join(" "));
}

export function productCard(p, { quote = false, eager = false } = {}) {
  const href = productUrl(p.sku);
  const remember = `try{sessionStorage.setItem('crm-sku','${p.sku}')}catch(e){}`;
  const meta = [p.cap, p.agent].filter(Boolean).join(" · ");
  const classes = (p.classes || "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  const classLine = classes.length ? `Clase ${classes.join(" · ")}` : "";
  const quoteBtn = `<a class="shop-item__quote${quote ? "" : " shop-item__quote--wa"}" href="${quoteUrl(p)}" target="_blank" rel="noopener noreferrer">${WA_ICON} Cotizar</a>`;
  const detail = `<a class="shop-item__more" href="${href}" onclick="${remember}"><i class="fa-solid fa-eye" aria-hidden="true"></i> Ver detalle</a>`;
  return `
    <article class="shop-item shop-item--quote" data-cat="${p.cat}">
      <a class="shop-item__link" href="${href}" onclick="${remember}">
        <span class="shop-item__media">
          <picture>
            <source type="image/webp" srcset="${catalogSrcset(p.sku)}" sizes="(min-width: 1024px) 220px, 45vw">
            <img src="${catalogImg(p.sku)}" alt="${escapeAttr(productAlt(p))}" width="400" height="400"${imgLoadAttrs({ lazy: !eager })}>
          </picture>
          <span class="shop-item__go" aria-hidden="true">Ver detalle</span>
        </span>
        <span class="shop-item__info">
          <span class="shop-item__sku"><i class="shop-item__swatch" aria-hidden="true"></i>${p.sku}</span>
          <h3>${p.title}</h3>
          <span class="shop-item__copy">
            ${meta ? `<span class="shop-item__meta">${meta}</span>` : ""}
            ${classLine ? `<span class="shop-item__class">${classLine}</span>` : ""}
          </span>
        </span>
      </a>
      <span class="shop-item__actions">
        ${detail}
        ${quoteBtn}
      </span>
    </article>`;
}

function normalize(text) {
  const sub = "₀₁₂₃₄₅₆₇₈₉";
  const sup = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (ch) => String(sub.indexOf(ch)))
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (ch) => String(sup.indexOf(ch)));
}

export function filterProducts({ cat = "all", fireClass = "all", query = "" } = {}) {
  const q = normalize(query.trim());
  const tokens = q ? q.split(/\s+/).filter(Boolean) : [];
  return products.filter((p) => {
    if (cat && cat !== "all" && p.cat !== cat) return false;
    if (fireClass && fireClass !== "all") {
      const classes = (p.classes || "").split(",").map((c) => c.trim().toUpperCase());
      if (!classes.includes(fireClass.toUpperCase())) return false;
    }
    if (!tokens.length) return true;
    const hay = normalize([p.sku, p.title, p.desc, p.use, p.agent, p.cap, catName(p.cat)].join(" "));
    return tokens.every((token) => hay.includes(token));
  });
}

export function renderCatalog(root, { limit = 0, cat = "all", fireClass = "all", query = "" } = {}) {
  if (!root) return;
  let list = filterProducts({ cat, fireClass, query });
  if (limit) list = list.slice(0, limit);
  root.className = "shop-grid";
  root.innerHTML = list.map((p, i) => productCard(p, { eager: i < 6 })).join("") || `<p class="shop-empty">No encontramos ese equipo en el catálogo. <a href="${waUrl("Hola, no encontré el equipo que busco y quiero orientación.")}" target="_blank" rel="noopener noreferrer">Escríbanos</a> y con gusto le ayudamos a elegir el adecuado.</p>`;
  const count = document.querySelector("[data-count]");
  if (count) {
    count.textContent = list.length
      ? `${list.length} producto${list.length === 1 ? "" : "s"}`
      : "Sin coincidencias por ahora";
  }
}

export function renderCategoryFilters(root, current = "all") {
  if (!root) return;
  const items = [
    { id: "all", name: "Todos", count: products.length },
    ...categories.map((c) => ({ ...c, count: catCount(c.id) })),
  ];
  root.innerHTML = items
    .map(
      (c) => `<button type="button" class="shop-chip shop-chip--cat ${current === c.id ? "is-active" : ""}" data-cat="${c.id}" aria-pressed="${current === c.id ? "true" : "false"}">
        <span class="shop-chip__dot" aria-hidden="true"></span>
        <span class="shop-chip__label">${c.name}</span>
        <span class="shop-chip__n">${c.count}</span>
      </button>`
    )
    .join("");
}

export function renderCategoryCards(root, current = "all") {
  if (!root) return;
  root.className = "shop-nav";
  const items = [{ id: "all", name: "Todos", count: products.length }, ...categories.map((c) => ({ ...c, count: catCount(c.id) }))];
  root.innerHTML = items
    .map(
      (c) => `<button type="button" class="shop-nav__btn ${current === c.id ? "is-active" : ""}" data-cat="${c.id}" aria-pressed="${current === c.id ? "true" : "false"}">
        <span class="shop-nav__dot" aria-hidden="true"></span>
        <span class="shop-nav__name">${c.name}</span>
        <span class="shop-nav__n">${c.count}</span>
      </button>`
    )
    .join("");
}

export function bindCatalog(defaultCat = "all") {
  const params = new URLSearchParams(location.search);
  const fromHash = safeDecode((location.hash || "").replace(/^#/, ""));
  let cat = params.get("cat") || fromHash || defaultCat;
  if (cat !== "all" && !categories.some((c) => c.id === cat)) cat = "all";
  let fireClass = "all";
  let query = params.get("q") || "";
  const cards = document.querySelector("[data-cat-cards]");
  const catalogPicker = document.querySelector("[data-catalog-extend].catalog-picker");
  const grid = document.querySelector("[data-products]");
  const search = document.querySelector("[data-search]");
  const navSearch = document.querySelector("[data-nav-search]");
  if (search && query) search.value = query;
  if (navSearch && query) navSearch.value = query;
  const classRoot = document.querySelector("[data-class-filters]");
  const classPanel = document.querySelector("[data-class-panel]");
  const classSelect = document.querySelector("[data-class-select]");
  const classDetail = document.querySelector("[data-class-detail]");
  const catalogLayout = document.querySelector("[data-catalog-layout]");
  const classes = [
    { id: "all", label: "Todas", hint: "" },
    { id: "A", label: "Sólidos", hint: "Papel, madera, cartón y textiles" },
    { id: "B", label: "Líquidos inflamables", hint: "Gasolina, solventes, pinturas y aceites" },
    { id: "C", label: "Equipo eléctrico", hint: "Cortocircuito y equipos energizados" },
    { id: "K", label: "Cocinas", hint: "Aceites y grasas de origen animal o vegetal" },
  ];
  if (classRoot) {
    classRoot.innerHTML = classes
      .map((item) => {
        const hint = item.hint
          ? `<span class="shop-chip__hint">${item.hint}</span>`
          : "";
        const copy = `<span class="shop-chip__copy"><span class="shop-chip__name">${item.label}</span>${hint}</span>`;
        const aria = item.hint ? ` aria-label="Clase ${item.id}: ${item.label}. ${item.hint}"` : "";
        return `<button type="button" class="shop-chip" data-class="${item.id}" aria-pressed="false"${aria}>
          ${item.id === "all" ? "" : `<span class="shop-chip__letter">${item.id}</span>`}
          ${copy}
        </button>`;
      })
      .join("");
  }
  if (classSelect) {
    classSelect.innerHTML = classes
      .map((item) => {
        const label = item.id === "all" ? item.label : `Clase ${item.id} · ${item.label}`;
        return `<option value="${item.id}">${label}</option>`;
      })
      .join("");
  }
  const setCat = (next) => {
    cat = next;
    const url = new URL(location.href);
    if (cat === "all") {
      url.searchParams.delete("cat");
      url.hash = "";
    } else {
      url.searchParams.set("cat", cat);
      url.hash = cat;
    }
    history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    paint();
  };
  const paint = () => {
    const showClasses = cat === "all" || cat === "extintores";
    if (!showClasses) fireClass = "all";
    if (classRoot) classRoot.hidden = !showClasses;
    if (classPanel) classPanel.hidden = !showClasses;
    catalogLayout?.classList.toggle("shop-catalog-layout--filtered", showClasses);
    renderCategoryCards(cards, cat);
    syncCatalogPicker(catalogPicker, cat);
    classRoot?.querySelectorAll(".shop-chip").forEach((btn) => {
      const on = btn.dataset.class === fireClass;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    if (classSelect) classSelect.value = fireClass;
    if (classDetail) {
      const item = classes.find((entry) => entry.id === fireClass);
      if (showClasses && item && item.id !== "all" && item.hint) {
        classDetail.hidden = false;
        classDetail.innerHTML = `<strong>Clase ${item.id} · ${item.label}.</strong> ${item.hint}`;
      } else {
        classDetail.hidden = true;
        classDetail.textContent = "";
      }
    }
    if (grid) grid.setAttribute("aria-busy", "true");
    renderCatalog(grid, { cat, fireClass, query });
    if (grid) grid.setAttribute("aria-busy", "false");
    applySeo("productos");
    bindMotion();
  };
  cards?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    setCat(btn.dataset.cat);
  });
  catalogPicker?.addEventListener("click", (e) => {
    const link = e.target.closest(".shop-dept[data-cat]");
    if (!link) return;
    e.preventDefault();
    setCat(link.dataset.cat);
  });
  classPanel?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-class]");
    if (!btn || !classPanel.contains(btn)) return;
    fireClass = btn.dataset.class;
    paint();
  });
  classSelect?.addEventListener("change", () => {
    fireClass = classSelect.value;
    paint();
  });
  let timer;
  const syncQuery = (value) => {
    grid?.setAttribute("aria-busy", "true");
    clearTimeout(timer);
    timer = setTimeout(() => {
      query = value;
      const url = new URL(location.href);
      const trimmed = String(value || "").trim();
      if (trimmed) url.searchParams.set("q", trimmed);
      else url.searchParams.delete("q");
      history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
      if (navSearch && navSearch !== document.activeElement) navSearch.value = value;
      paint();
    }, 160);
  };
  search?.addEventListener("input", () => {
    syncQuery(search.value);
    if (navSearch) navSearch.value = search.value;
  });
  navSearch?.addEventListener("input", () => {
    if (search) search.value = navSearch.value;
    syncQuery(navSearch.value);
  });
  paint();
  bindMotion();
}

const HOME_BEST_CATS = ["extintores", "senalamiento-vial", "equipo-proteccion"];

export function renderHomeCats() {
  const root = document.querySelector("[data-home-cats]");
  if (!root) return;
  root.innerHTML = categories
    .map((c) => {
      const cover = catCover(c);
      const media = cover
        ? `<span class="cat-tile__media${cover.photo ? "" : " cat-tile__media--sku"}"><picture><source type="image/webp" srcset="${catSrcset(cover)}" sizes="(min-width: 900px) 180px, 45vw"><img src="${catImg(cover)}" alt="${escapeAttr(cover.alt)}" width="480" height="320" loading="lazy" decoding="async"></picture></span>`
        : "";
      const go = `Ver catálogo de ${String(c.name || "").toLowerCase()}`;
      return `<li>
        <a class="cat-tile" data-cat="${c.id}" href="${withBase(`/productos?cat=${c.id}#${c.id}`)}" aria-label="${escapeAttr(go)}">
          ${media}
          <span class="cat-tile__go">${go}</span>
          <span class="cat-tile__body">
            <span class="cat-tile__rule" aria-hidden="true"></span>
            <strong>${c.name}</strong>
          </span>
        </a>
      </li>`;
    })
    .join("");
  bindMediaLoad(root);
}

const HOME_BEST = {
  extintores: ["CRM-0003", "CRM-0006", "CRM-0012", "CRM-0004"],
  "senalamiento-vial": ["CRM-0023", "CRM-0030", "CRM-0033", "CRM-0024"],
  "equipo-proteccion": ["CRM-0049", "CRM-0050", "CRM-0054", "CRM-0053"],
};

function homeCategoryItems(catId, limit = 4) {
  const seen = new Set();
  const items = [];
  const push = (p) => {
    if (!p || seen.has(p.sku) || items.length >= limit) return;
    seen.add(p.sku);
    items.push(p);
  };
  (HOME_BEST[catId] || []).forEach((sku) => push(productBySku(sku)));
  products.forEach((p) => {
    if (p.cat === catId) push(p);
  });
  return items;
}

export function renderHomeCatalog() {
  const root = document.querySelector("[data-home-catalog]");
  if (!root) return;
  root.innerHTML = categories
    .filter((c) => HOME_BEST_CATS.includes(c.id))
    .map((c) => {
      const items = homeCategoryItems(c.id, 4);
      if (!items.length) return "";
      return `
        <section class="shop-block" data-cat="${c.id}">
          <header class="shop-block__head">
            <h3>${c.name}</h3>
            <a class="shop-more" href="${withBase(`/productos?cat=${c.id}#${c.id}`)}"><i class="fa-solid fa-table-cells" aria-hidden="true"></i> ${c.seeAll}</a>
          </header>
          <div class="shop-grid shop-grid--4">${items.map((p, i) => productCard(p, { quote: true, eager: i < 2 })).join("")}</div>
        </section>`;
    })
    .join("");
  root.setAttribute("aria-busy", "false");
  bindMediaLoad(root);
}

function bindSlider(root) {
  if (!root || root.dataset.sliderBound === "1") return;
  const allSlides = [...root.querySelectorAll(".slide, [data-slide]")];
  const dotsWrap = root.querySelector("[data-dots]");
  if (!allSlides.length) return;
  root.dataset.sliderBound = "1";
  const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduceMotion = reduceMq.matches;
  const isHero = root.classList.contains("hero-slider");
  const intervalMs = isHero ? 5500 : 6500;
  let index = 0;
  let timer;
  let paused = false;
  let startX = 0;
  let startY = 0;
  const slides = () => allSlides;
  const paintDots = () => {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = slides()
      .map((_, i) => `<button type="button" class="dot${i === 0 ? " is-active" : ""}" data-dot="${i}" aria-label="Ir a la diapositiva ${i + 1}" aria-current="${i === 0 ? "true" : "false"}"></button>`)
      .join("");
  };
  paintDots();
  const wake = (i) => {
    const list = slides();
    const slide = list[(i + list.length) % list.length];
    if (!slide) return;
    applyLazyBg(slide);
    slide.querySelectorAll("img[data-src]").forEach(applyLazySrc);
    bindMediaLoad(slide);
  };
  const show = (n) => {
    const list = slides();
    if (!list.length) return;
    index = (n + list.length) % list.length;
    wake(index);
    allSlides.forEach((slide) => {
      const on = slide === list[index];
      if (on) slide.removeAttribute("inert");
      slide.classList.toggle("is-active", on);
      slide.setAttribute("aria-hidden", on ? "false" : "true");
      if (!on) slide.setAttribute("inert", "");
    });
    root.querySelectorAll("[data-dot]").forEach((dot, i) => {
      const on = i === index;
      dot.classList.toggle("is-active", on);
      dot.setAttribute("aria-current", on ? "true" : "false");
    });
  };
  const prefetchNext = () => wake(index + 1);
  const stop = () => {
    window.clearInterval(timer);
    window.clearTimeout(timer);
    timer = null;
    delete root.dataset.sliderPlaying;
  };
  const play = () => {
    stop();
    if (paused) return;
    if (document.prerendering) return;
    if (!isHero) {
      if (document.visibilityState !== "visible") return;
      if (reduceMotion) return;
    }
    const hold = Number(slides()[index]?.dataset.duration) || intervalMs;
    root.dataset.sliderPlaying = "1";
    timer = window.setInterval(() => {
      try {
        prefetchNext();
        show(index + 1);
      } catch (err) {
        console.error(err);
      }
    }, hold);
  };
  const pause = () => {
    paused = true;
    stop();
  };
  const resume = () => {
    paused = false;
    play();
  };
  const go = (n) => {
    const list = slides();
    if (!list.length) return;
    wake((n + list.length) % list.length);
    show(n);
    if (!paused) play();
  };
  root.querySelector("[data-prev]")?.addEventListener("click", () => go(index - 1));
  root.querySelector("[data-next]")?.addEventListener("click", () => go(index + 1));
  dotsWrap?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-dot]");
    if (!btn) return;
    go(Number(btn.dataset.dot));
  });
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0);
    } else if (e.key === "End") {
      e.preventDefault();
      go(slides().length - 1);
    }
  });
  root.addEventListener("touchstart", (e) => {
    startX = e.changedTouches[0].clientX;
    startY = e.changedTouches[0].clientY;
  }, { passive: true });
  root.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1));
  }, { passive: true });
  // Hero keeps autoplay while the cursor is over the banner; other sliders pause on hover.
  if (!isHero) {
    root.addEventListener("mouseenter", pause);
    root.addEventListener("mouseleave", resume);
  }
  root.addEventListener("focusin", (e) => {
    if (isHero) return;
    if (e.target.closest("a, button, input, textarea, select")) pause();
  });
  root.addEventListener("focusout", (e) => {
    if (!root.contains(e.relatedTarget)) resume();
  });
  const kick = () => {
    if (!paused) play();
  };
  document.addEventListener("visibilitychange", () => {
    if (isHero) {
      if (document.visibilityState === "visible") kick();
      return;
    }
    if (document.visibilityState !== "visible") stop();
    else kick();
  });
  window.addEventListener("pageshow", kick);
  document.addEventListener("prerenderingchange", kick);
  document.addEventListener("resume", kick);
  window.addEventListener("focus", kick);
  const onMotion = (e) => {
    reduceMotion = e.matches;
    if (!paused) play();
  };
  if (reduceMq.addEventListener) reduceMq.addEventListener("change", onMotion);
  else reduceMq.addListener(onMotion);
  show(0);
  const schedulePrefetch = () => {
    const run = () => prefetchNext();
    if ("requestIdleCallback" in window) window.requestIdleCallback(run, { timeout: 2800 });
    else window.setTimeout(run, 1400);
  };
  schedulePrefetch();
  kick();
}

export function bindHeroSlider() {
  document.querySelectorAll("[data-slider]").forEach(bindSlider);
}

export function bindLookbook() {
  const root = document.querySelector("[data-lookbook]");
  if (!root) return;
  if (!lookbook.length) {
    root.innerHTML = `<p class="shop-empty">No hay fotografías por ahora.</p>`;
    root.setAttribute("aria-busy", "false");
    return;
  }
  let index = 0;
  let timer;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pad = (n) => String(n).padStart(2, "0");
  const thumbCount = Math.min(6, lookbook.length);
  const paint = () => {
    const item = lookbook[index];
    let start = Math.max(0, index - 2);
    if (start + thumbCount > lookbook.length) start = lookbook.length - thumbCount;
    const thumbs = lookbook.slice(start, start + thumbCount);
    root.innerHTML = `
      <figure class="lookbook__hero">
        <button type="button" class="lookbook__open" data-lb-open aria-label="Ver ${escapeAttr(item.title)} en grande">
          ${lookPicture(item, { sizes: "(min-width: 900px) 640px, 100vw", width: 800, height: 600, alt: lookAlt(item), lazy: false })}
        </button>
        <figcaption>
          <p class="lookbook__count">${pad(index + 1)} / ${pad(lookbook.length)}</p>
          <p class="kicker">${item.kicker}</p>
          <h3>${item.title}</h3>
        </figcaption>
      </figure>
      <div class="lookbook__bar">
        <button type="button" class="lookbook__arrow" data-lb-prev aria-label="Imagen anterior">${fa("fa-solid fa-chevron-left")}</button>
        <div class="lookbook__thumbs" role="group" aria-label="Galería en campo">
          ${thumbs
            .map(
              (thumb, i) => `
            <button type="button" class="lookbook__thumb${start + i === index ? " is-active" : ""}" data-lb-goto="${start + i}" aria-label="${escapeAttr(thumb.title)}" aria-current="${start + i === index ? "true" : "false"}">
              <img src="${lookThumbSrc(thumb)}" alt="" loading="lazy" decoding="async">
            </button>`
            )
            .join("")}
        </div>
        <button type="button" class="lookbook__arrow" data-lb-next aria-label="Imagen siguiente">${fa("fa-solid fa-chevron-right")}</button>
      </div>`;
    bindMediaLoad(root);
    root.setAttribute("aria-busy", "false");
  };
  const show = (n) => {
    index = (n + lookbook.length) % lookbook.length;
    paint();
  };
  const play = () => {
    clearInterval(timer);
    if (reduceMotion) return;
    timer = setInterval(() => show(index + 1), 6200);
  };
  root.addEventListener("click", (e) => {
    if (e.target.closest("[data-lb-prev]")) {
      show(index - 1);
      play();
      return;
    }
    if (e.target.closest("[data-lb-next]")) {
      show(index + 1);
      play();
      return;
    }
    const goto = e.target.closest("[data-lb-goto]");
    if (goto) {
      show(Number(goto.dataset.lbGoto));
      play();
      return;
    }
    if (e.target.closest("[data-lb-open]")) {
      openLightbox(lookbook, index);
    }
  });
  root.addEventListener("mouseenter", () => clearInterval(timer));
  root.addEventListener("mouseleave", play);
  paint();
  play();
}

function clientTile(c) {
  const logos = (c.logos || [])
    .map((logo) => clientPicture(logo, { alt: escapeAttr(logo.alt), lazy: true }))
    .join("");
  const media = `<span class="client-tile__media${c.ink ? " is-ink" : ""}${ (c.logos || []).length > 1 ? " is-pair" : ""}">${logos}</span>`;
  const body = `<span class="client-tile__body"><strong>${c.name}</strong></span>`;
  if (c.url) {
    return `<a class="client-tile" href="${c.url}" target="_blank" rel="noopener noreferrer" aria-label="${escapeAttr(`${c.name} (se abre en una ventana nueva)`)}">
      ${media}${body}
    </a>`;
  }
  return `<article class="client-tile">${media}${body}</article>`;
}

function clientRailCard(c, { inert = false } = {}) {
  const pair = (c.logos || []).length > 1;
  const logos = (c.logos || [])
    .map((logo) => {
      const round = c.round && !pair ? ' class="is-round"' : "";
      const alt = inert ? "" : escapeAttr(logo.alt);
      return clientPicture(logo, { alt, extra: round });
    })
    .join("");
  const cls = [
    "client-rail__card",
    c.ink ? "is-ink" : "",
    pair ? "is-pair" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const inner = `<span class="client-rail__media">${logos}</span>`;
  if (c.url) {
    const label = inert ? "" : ` aria-label="${escapeAttr(`${c.name} (se abre en una ventana nueva)`)}"`;
    const extra = inert ? ' tabindex="-1" aria-hidden="true"' : ' target="_blank" rel="noopener noreferrer"';
    return `<a class="${cls}" href="${c.url}"${label}${extra}>${inner}</a>`;
  }
  return `<article class="${cls}"${inert ? ' aria-hidden="true"' : ""}>${inner}</article>`;
}

function bindInfiniteRail(root, {
  itemCount,
  cardsHtml,
  cardSelector,
  duration,
  prevLabel,
  nextLabel,
  extraClass = "",
  duplicate = true,
  respectReducedMotion = false,
} = {}) {
  if (!root || !itemCount) return;
  root.classList.add("peek-rail");
  if (extraClass) root.classList.add(extraClass);
  root.style.setProperty("--peek-duration", duration);
  const trackHtml = duplicate ? `${cardsHtml}${cardsHtml}` : cardsHtml;
  root.innerHTML = `
    <button type="button" class="peek-rail__btn peek-rail__btn--prev" aria-label="${escapeAttr(prevLabel)}">${fa("fa-solid fa-chevron-left")}</button>
    <div class="peek-rail__viewport">
      <div class="peek-rail__track">${trackHtml}</div>
    </div>
    <button type="button" class="peek-rail__btn peek-rail__btn--next" aria-label="${escapeAttr(nextLabel)}">${fa("fa-solid fa-chevron-right")}</button>`;
  const track = root.querySelector(".peek-rail__track");
  const prev = root.querySelector(".peek-rail__btn--prev");
  const next = root.querySelector(".peek-rail__btn--next");
  const mqManual = window.matchMedia("(max-width: 980px)");
  const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let index = 0;
  let busy = false;
  let unlock;

  function isManual() {
    return mqManual.matches || (respectReducedMotion && mqReduce.matches);
  }

  function gapOf(card) {
    const row = card.parentElement === track ? track : card.parentElement;
    return parseFloat(getComputedStyle(row).columnGap || getComputedStyle(row).gap) || 16;
  }

  function offsetAt(i) {
    const cards = track.querySelectorAll(cardSelector);
    let x = 0;
    for (let n = 0; n < i; n += 1) {
      const card = cards[n];
      if (!card) break;
      x += card.getBoundingClientRect().width + gapOf(card);
    }
    return x;
  }

  function paint(animate) {
    track.style.transition = animate ? "transform 0.45s ease" : "none";
    track.style.transform = `translateX(${-offsetAt(index)}px)`;
  }

  function finishMove() {
    if (index >= itemCount) {
      index -= itemCount;
      paint(false);
    } else if (index < 0) {
      index += itemCount;
      paint(false);
    }
    busy = false;
    window.clearTimeout(unlock);
  }

  function go(dir) {
    if (!isManual() || busy) return;
    busy = true;
    window.clearTimeout(unlock);
    unlock = window.setTimeout(finishMove, 520);
    if (dir < 0 && index === 0) {
      index = itemCount;
      paint(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          index = itemCount - 1;
          paint(true);
        });
      });
      return;
    }
    index += dir;
    paint(true);
  }

  track.addEventListener("transitionend", (event) => {
    if (event.target !== track) return;
    if (event.propertyName && event.propertyName !== "transform") return;
    finishMove();
  });

  function setMode() {
    const manual = isManual();
    root.classList.toggle("is-manual", manual);
    root.classList.toggle("is-auto", !manual);
    prev.hidden = !manual;
    next.hidden = !manual;
    busy = false;
    if (manual) {
      paint(false);
      return;
    }
    index = 0;
    track.style.transition = "none";
    track.style.transform = "";
  }

  prev.addEventListener("click", () => go(-1));
  next.addEventListener("click", () => go(1));

  const viewport = root.querySelector(".peek-rail__viewport");
  let touchX = 0;
  let touchY = 0;
  let swiped = false;
  viewport?.addEventListener("touchstart", (e) => {
    if (!isManual() || !e.changedTouches?.[0]) return;
    touchX = e.changedTouches[0].clientX;
    touchY = e.changedTouches[0].clientY;
    swiped = false;
  }, { passive: true });
  viewport?.addEventListener("touchend", (e) => {
    if (!isManual() || !e.changedTouches?.[0]) return;
    const dx = e.changedTouches[0].clientX - touchX;
    const dy = e.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy)) return;
    swiped = true;
    go(dx < 0 ? 1 : -1);
  }, { passive: true });
  root.addEventListener("click", (e) => {
    if (!swiped) return;
    e.preventDefault();
    e.stopPropagation();
    swiped = false;
  }, true);

  mqManual.addEventListener("change", setMode);
  if (respectReducedMotion) mqReduce.addEventListener("change", setMode);
  window.addEventListener("resize", () => {
    if (isManual()) paint(false);
  });
  setMode();
}

function bindClientRail(root) {
  if (!root || !clients.length) return;
  if (typeof root._clientRailStop === "function") root._clientRailStop();
  const liveCards = clients.map((c) => clientRailCard(c)).join("");
  const ghostCards = clients.map((c) => clientRailCard(c, { inert: true })).join("");
  const loop = `<div class="client-rail__loop" aria-hidden="true">${ghostCards}</div>`;
  root.className = "client-rail";
  root.setAttribute("aria-label", root.getAttribute("aria-label") || "Clientes");
  root.innerHTML = `<div class="client-rail__viewport">
      <div class="client-rail__track">
        <div class="client-rail__group">${liveCards}${loop}</div>
        <div class="client-rail__group" aria-hidden="true">${ghostCards}${loop}</div>
      </div>
    </div>`;
  const viewport = root.querySelector(".client-rail__viewport");
  const groups = [...root.querySelectorAll(".client-rail__group")];
  const mqCollage = window.matchMedia("(max-width: 699px)");
  const pxPerSec = 42;

  function isCollage() {
    return mqCollage.matches;
  }

  function fillGroups() {
    groups.forEach((group) => {
      group.querySelectorAll(".client-rail__loop[data-fill]").forEach((el) => el.remove());
    });
    if (isCollage()) return;
    const viewW = viewport.getBoundingClientRect().width;
    let groupW = groups[0] ? groups[0].getBoundingClientRect().width : 0;
    let guard = 0;
    while (groupW > 1 && groupW < viewW && guard < 6) {
      groups.forEach((group) => {
        const extra = document.createElement("div");
        extra.className = "client-rail__loop";
        extra.setAttribute("aria-hidden", "true");
        extra.dataset.fill = "";
        extra.innerHTML = ghostCards;
        group.appendChild(extra);
      });
      const next = groups[0].getBoundingClientRect().width;
      if (next <= groupW) break;
      groupW = next;
      guard += 1;
    }
    if (groupW > 1) {
      root.style.setProperty("--client-marquee-duration", `${Math.max(28, groupW / pxPerSec).toFixed(1)}s`);
    }
  }

  function setMode() {
    const collage = isCollage();
    root.classList.toggle("is-collage", collage);
    root.classList.toggle("is-auto", !collage);
    if (collage) root.removeAttribute("aria-roledescription");
    else root.setAttribute("aria-roledescription", "carrusel");
    fillGroups();
  }

  const onResize = () => {
    if (!isCollage()) fillGroups();
  };

  mqCollage.addEventListener("change", setMode);
  window.addEventListener("resize", onResize);
  root.querySelectorAll("img").forEach((img) => {
    if (img.complete) return;
    img.addEventListener("load", onResize, { once: true });
    img.addEventListener("error", onResize, { once: true });
  });
  root._clientRailStop = () => {
    mqCollage.removeEventListener("change", setMode);
    window.removeEventListener("resize", onResize);
  };
  setMode();
}

export function renderClientLogos() {
  const root = document.querySelector("[data-client-logos]");
  if (!root || !clients.length) return;
  bindClientRail(root);
}

export function renderClients() {
  const root = document.querySelector("[data-clients]");
  if (!root || !clients.length) return;
  const items = clients.map(clientTile).join("");
  root.className = "client-marquee";
  root.innerHTML = `<div class="client-marquee__viewport">
      <div class="client-marquee__track">
        <div class="client-marquee__group">${items}</div>
        <div class="client-marquee__group" aria-hidden="true">${items}</div>
      </div>
    </div>`;
}

export function bindErrorReturn() {
  if (document.body.dataset.page !== "error") return;
  const line = document.querySelector("[data-error-return]");
  if (!line) return;
  let left = 10;
  const paint = () => {
    const unit = left === 1 ? "segundo" : "segundos";
    line.innerHTML = `Regresa al inicio en <span data-error-seconds>${left}</span> ${unit}`;
  };
  paint();
  const timer = window.setInterval(() => {
    left -= 1;
    if (left <= 0) {
      window.clearInterval(timer);
      location.assign(withBase("/"));
      return;
    }
    paint();
  }, 1000);
}

const HOME_GALLERY_USED = new Set([
  "galeria-vapiano",
  "galeria-inventario",
  "galeria-extintores-sitio",
]);

const HOME_CONTACT_GALLERY = [
  "galeria-deportivo",
  "galeria-restaurante",
  "galeria-campus",
  "galeria-automotriz",
  "galeria-bodega",
];

function homeGalleryPicks() {
  const available = lookbook.filter((item) => !HOME_GALLERY_USED.has(lookStem(item)));
  const picks = HOME_CONTACT_GALLERY.map((stem) => available.find((item) => lookStem(item) === stem)).filter(Boolean);
  if (picks.length >= 4) return picks;
  const seen = new Set(picks);
  available.forEach((item) => {
    if (picks.length >= 5 || seen.has(item)) return;
    picks.push(item);
    seen.add(item);
  });
  return picks;
}

function peekCard(item, i) {
  return `<button type="button" class="peek-rail__card" data-lb-open="${i}" aria-label="Ver ${escapeAttr(item.title)} en grande">
    ${lookPicture(item, { sizes: "(min-width: 1024px) 340px, 74vw", width: 640, height: 854, alt: lookAlt(item), lazy: i >= 2 })}
    <span class="peek-rail__cap"><strong>${item.title}</strong></span>
  </button>`;
}

function bindPeekRail(root, items) {
  if (!root || !items.length) return;
  const cards = items.map((item, i) => peekCard(item, i)).join("");
  bindInfiniteRail(root, {
    itemCount: items.length,
    cardsHtml: cards,
    cardSelector: ".peek-rail__card",
    duration: `${Math.max(28, items.length * 7)}s`,
    prevLabel: "Foto anterior",
    nextLabel: "Foto siguiente",
  });
  root.querySelectorAll("[data-lb-open]").forEach((btn) => {
    btn.addEventListener("click", () => openLightbox(items, Number(btn.dataset.lbOpen)));
  });
  bindMediaLoad(root);
}

export function renderHomeGallerySlider() {
  const root = document.querySelector("[data-home-gallery]");
  if (!root || !lookbook.length) return;
  bindPeekRail(root, homeGalleryPicks());
}

function reviewStars(count = 5) {
  const stars = Math.max(1, Math.min(5, Number(count) || 5));
  const icons = Array.from({ length: 5 }, (_, i) =>
    `<i class="fa-solid fa-star${i < stars ? "" : " review__star--off"}" aria-hidden="true"></i>`
  ).join("");
  return `<p class="review__stars" aria-label="${stars} de 5 estrellas">${icons}</p>`;
}

function reviewAvatar(item) {
  const photo = item.photo ? absAsset(item.photo) : "";
  if (!photo) {
    return `<span class="review__avatar" aria-hidden="true">${escapeHtml(reviewInitials(item.name))}</span>`;
  }
  return `<span class="review__avatar review__avatar--photo" aria-hidden="true"><img class="review__photo" src="${escapeAttr(photo)}" alt="" width="52" height="52" loading="lazy" decoding="async"></span>`;
}

export function renderReviews() {
  const root = document.querySelector("[data-reviews]");
  if (!root || !reviews.length) return;
  root.innerHTML = reviews
    .map((item) => {
      const name = escapeHtml(item.name);
      const text = escapeHtml(item.text);
      const date = escapeHtml(item.date);
      const iso = escapeAttr(item.iso);
      return `<li class="review">
        <header class="review__head">
          ${reviewAvatar(item)}
          <div class="review__meta">
            <p class="review__who"><strong>${name}</strong></p>
            ${reviewStars(item.stars)}
            <p class="review__date"><time datetime="${iso}">${date}</time> · <i class="fa-brands fa-facebook-f" aria-hidden="true"></i> Facebook</p>
          </div>
        </header>
        <blockquote class="review__text">${text}</blockquote>
      </li>`;
    })
    .join("");
  bindMediaLoad(root);
}

export function renderFaqs() {
  const root = document.querySelector("[data-faqs]");
  if (!root || !faqs.length) return;
  root.innerHTML = faqs
    .map(
      (item) => `<details class="faq">
        <summary>${item.q}</summary>
        <p>${item.a}</p>
      </details>`
    )
    .join("");
}

export function renderHome() {
  bindHeroSlider();
  renderHomeCats();
  renderHomeCatalog();
  paintServices();
  paintCursos();
  renderCarePoints();
  renderClientLogos();
  renderReviews();
  renderCompactSectors();
  renderHook();
  renderHomeGallerySlider();
  renderFaqs();
  renderNosotros();
}

export function renderProductos() {
  renderCatalogExtend();
  bindCatalog("all");
}

export function renderProducto() {
  const sku = readSku();
  const p = productBySku(sku);
  const root = document.querySelector("[data-product]");
  if (!root) return;
  if (!p) {
    document.title = "Artículo no encontrado | Grupo CRM Extintores";
    document.body.dataset.page = "error";
    root.innerHTML = `
      <section class="error-page">
        <div class="wrap error-page__box">
          <figure class="error-page__figure">
            <picture>
              <source type="image/webp" srcset="${withBase("/assets/img/opt/mascot-404-llama.webp?v=cutout")}">
              <img src="${withBase("/assets/img/opt/mascot-404-llama.webp?v=cutout")}" width="568" height="682" alt="Llama de Grupo CRM apagándose a sí misma con un extintor" loading="lazy" decoding="async">
            </picture>
          </figure>
          <div class="error-page__copy">
            <p class="kicker">Equipo</p>
            <p class="error-page__code">404</p>
            <h1>No encontramos ese equipo</h1>
            <hr class="rule rule-left">
            <p>Ese artículo ya no está en el catálogo, pero con gusto le mostramos el equipo equivalente.</p>
            <p class="error-page__actions">
              <a class="btn btn-red" href="${withBase("/productos")}">${fa("fa-solid fa-boxes-stacked")} Ver equipos</a>
              <a class="btn btn-wa" href="${waUrl("Hola, no encontré un producto y quiero cotizar.")}" target="_blank" rel="noopener noreferrer">${WA_ICON} Escríbanos por WhatsApp</a>
            </p>
          </div>
        </div>
      </section>`;
    root.setAttribute("aria-busy", "false");
    return;
  }
  document.title = `${p.title} · Grupo CRM Extintores`;
  const classLine = (p.classes || "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean)
    .join(" · ");
  const specs = [
    ["Clave", p.sku],
    ["Línea", catName(p.cat)],
    ["Capacidad / medidas", p.cap],
    ["Agente / material", p.agent],
    ["Clases de fuego", p.classes],
  ].filter(([, v]) => v);
  const related = relatedProducts(p.sku)
    .map(productCard)
    .join("");
  root.innerHTML = `
    <div class="wrap ficha-wrap">
      <p class="ficha-crumb"><a href="${withBase("/productos")}">Catálogo</a> · <a href="${withBase(`/productos?cat=${p.cat}`)}">${catName(p.cat)}</a></p>
      <article class="ficha" data-cat="${p.cat}">
        <div class="ficha__grid">
          <figure class="ficha__photo">
            <picture>
              <source type="image/webp" srcset="${catalogSrcset(p.sku)}" sizes="(min-width: 900px) 420px, 90vw">
              <img src="${catalogImg(p.sku, 800)}" alt="${escapeAttr(productAlt(p, { detail: true }))}" width="800" height="800" decoding="async" fetchpriority="high">
            </picture>
          </figure>
          <div class="ficha__copy">
            <p class="kicker">${catName(p.cat)}</p>
            <p class="ficha__sku">${p.sku}</p>
            <h1>${p.title}</h1>
            ${classLine ? `<p class="ficha__class">Clase ${classLine}</p>` : ""}
            <h2 class="ficha__h">Descripción</h2>
            <p class="ficha__desc">${p.desc}</p>
            <div class="ficha__use">
              <h2>Uso recomendado</h2>
              <p>${p.use}</p>
            </div>
            <table class="specs">${specs.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("")}</table>
            <div class="actions">
              <a class="btn btn-wa" href="${waUrl(`Hola, quiero cotizar ${p.sku} — ${p.title}`)}" target="_blank" rel="noopener noreferrer">${WA_ICON}<span>Cotizar por WhatsApp</span></a>
              <a class="btn btn-ink" href="tel:${company.phoneTel}" aria-label="Llámenos al ${company.phone}">${PHONE_ICON}<span>Llámenos</span></a>
            </div>
          </div>
        </div>
      </article>
    </div>
    ${related ? `<section class="section shop-related"><div class="wrap wrap-shop"><div class="shop-block__head"><h3>Esto también le puede servir</h3></div><div class="shop-grid">${related}</div></div></section>` : ""}`;
  root.setAttribute("aria-busy", "false");
}

export function renderCompactSectors() {
  document.querySelectorAll("[data-sectors-compact]").forEach((root) => {
    root.innerHTML = `<ul class="sectors-strip" aria-label="Sectores que atendemos">${sectors
      .map(
        (s) => `<li class="sectors-strip__item">
          <span class="sectors-strip__icon" aria-hidden="true">${fa(s.icon)}</span>
          <span class="sectors-strip__name">${s.name}</span>
        </li>`
      )
      .join("")}</ul>`;
  });
}

export function renderCarePoints() {
  document.querySelectorAll("[data-care]").forEach((root) => {
    const compact = root.classList.contains("care-compact") || root.classList.contains("svc-home__points");
    root.innerHTML = carePoints
      .map((s) =>
        compact
          ? `<li>${fa(s.icon)}<span>${s.title}</span></li>`
          : `<li>${fa(s.icon)}<strong>${s.title}</strong></li>`
      )
      .join("");
  });
}

export function renderSectors() {
  document.querySelectorAll("[data-sectors]").forEach((root) => {
    const cards = sectors
      .map(
        (s) => `<li class="sector-card">
          <span class="sector-card__icon" aria-hidden="true">${fa(s.icon)}</span>
          <span class="sector-card__rule" aria-hidden="true"></span>
          <h3>${s.name}</h3>
          <p>${s.text}</p>
        </li>`
      )
      .join("");
    root.innerHTML = `
      <header class="sectors__head">
        <p class="kicker">Sectores</p>
        <h2>Giros que atendemos</h2>
        <p>Condominios, restaurantes, oficinas, empresas, clínicas y escuelas. Si su giro no aparece, pregúntenos con confianza.</p>
      </header>
      <ul class="sectors__grid" aria-label="Sectores que atendemos">${cards}</ul>`;
  });
  renderCarePoints();
}

export function condominiosHTML() {
  const checks = readyChecks.map((item) => `<li>${fa("fa-solid fa-xmark")}<span>${item}</span></li>`).join("");
  return `
    <div class="wrap condos__inner">
      <div class="condos__intro">
        <p class="kicker">Protección Civil</p>
        <h2>${condo.title}</h2>
        <p class="condos__lead">${condo.lead}</p>
        <div class="condos__actions">
          <a class="btn btn-red" href="${waUrl("Hola, quiero agendar mi visita de revisión sin costo.")}" target="_blank" rel="noopener noreferrer">${WA_ICON} Agendar visita</a>
          <a class="btn btn-ghost" href="${waUrl()}" target="_blank" rel="noopener noreferrer">${WA_ICON} Pedir cotización</a>
        </div>
      </div>
      <div class="condos__panel">
        <p class="condos__ready-label">${condo.readyLabel}</p>
        <ul class="condos__checks">${checks}</ul>
        <p class="condos__warn">${condo.warning}</p>
      </div>
    </div>`;
}

export function renderCondominios() {
  document.querySelectorAll("[data-condominios]").forEach((root) => {
    root.innerHTML = condominiosHTML();
  });
}

export function hookRevisionHTML() {
  return `
    <div class="wrap hook__inner">
      <div class="hook__copy">
        <p class="kicker">Primera visita</p>
        <h2>Agende su visita de revisión,<span class="hook__cost">sin costo.</span></h2>
        <hr class="rule rule-left hook__rule" aria-hidden="true">
        <p>Con mucho gusto vamos a su negocio, revisamos sus extintores y le decimos con claridad qué le hace falta. Usted elige el día y la hora; nosotros llegamos puntuales, sin compromiso.</p>
      </div>
      <div class="hook__actions">
        <a class="btn btn-red" href="${waUrl("Hola, quiero agendar mi visita de revisión sin costo.")}" target="_blank" rel="noopener noreferrer">${WA_ICON} Agendar visita</a>
        <a class="btn btn-ghost-ink hook__phone" href="tel:${company.phoneTel}">${PHONE_ICON} Llamar ${company.phone}</a>
      </div>
    </div>`;
}

export function renderHook() {
  document.querySelectorAll("[data-hook]").forEach((root) => {
    root.innerHTML = hookRevisionHTML();
  });
}

function reserveSvcHeight(root) {
  const items = [...root.querySelectorAll(".svc-acc__item")];
  if (!items.length) return;
  let last = 0;
  const apply = () => {
    if (window.matchMedia("(max-width: 520px)").matches) {
      root.style.minHeight = "";
      last = 0;
      return;
    }
    const opened = items.filter((item) => item.open);
    items.forEach((item) => {
      item.open = false;
    });
    let max = root.offsetHeight;
    items.forEach((item) => {
      item.open = true;
      max = Math.max(max, root.offsetHeight);
      item.open = false;
    });
    opened.forEach((item) => {
      item.open = true;
    });
    if (max && max !== last) {
      last = max;
      root.style.minHeight = `${max + 2}px`;
    }
  };
  apply();
  if (root._svcResize) window.removeEventListener("resize", root._svcResize);
  root._svcResize = apply;
  window.addEventListener("resize", apply, { passive: true });
}

function bindSvcAccordion(root) {
  const items = [...root.querySelectorAll(".svc-acc__item")];
  if (!items.length) return;
  if (root._svcAbort) root._svcAbort.abort();
  root._svcAbort = new AbortController();
  const { signal } = root._svcAbort;
  items.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      items.forEach((other) => {
        if (other !== item && other.open) other.open = false;
      });
    }, { signal });
  });
  reserveSvcHeight(root);
}

function svcAccItem(s) {
  return `<li>
    <details class="svc-acc__item">
      <summary class="svc-acc__btn">
        ${fa(`${s.icon} svc-acc__icon`)}
        <span>${escapeHtml(s.title)}</span>
      </summary>
      <p class="svc-acc__text">${escapeHtml(s.text)}</p>
    </details>
  </li>`;
}

function svcStaticItem(s) {
  return `<li class="svc-static__item">
    ${fa(`${s.icon} svc-static__icon`)}
    <div>
      <h3>${escapeHtml(s.title)}</h3>
      <p>${escapeHtml(s.text)}</p>
    </div>
  </li>`;
}

const SERVICE_SHOTS = {
  "Venta e instalación de extintores": "foto-extintor-manos",
  "Recarga y mantenimiento": "galeria-inventario",
  "Señalamientos": "galeria-lavanderia",
  "Botiquines": "galeria-clinica",
  "Cursos y capacitación": "galeria-curso-brigada",
  "Revisión en sitio": "galeria-evento",
};

function serviceShot(service) {
  const stem = SERVICE_SHOTS[service?.title] || "foto-extintor-manos";
  const found = lookbook.find((item) => lookStem(item) === stem);
  if (found) return found;
  return {
    src: `/assets/img/full/${stem}.jpg`,
    full: `/assets/img/full/${stem}.jpg`,
    title: "Listos para instalar",
    note: "Extintor en el punto correcto de su negocio.",
  };
}

function servicePhoto(service) {
  const shot = serviceShot(service);
  if (!shot) return "";
  return `<span class="svc-showcase__shot is-in">${lookPicture(shot, {
    sizes: "(min-width: 700px) 38vw, 100vw",
    width: 800,
    height: 600,
    alt: lookAlt(shot),
    lazy: false,
  })}</span>
  <figcaption>
    <span>${escapeHtml(service.title)}</span>
    <strong>${escapeHtml(shot.title)}</strong>
  </figcaption>`;
}

function svcShowcaseItem(service) {
  return `<li class="svc-showcase__item">
      ${fa(`${service.icon} svc-showcase__icon`)}
      <span>${escapeHtml(service.title)}</span>
  </li>`;
}

function paintServiceShowcase() {
  document.querySelectorAll("[data-services-showcase]").forEach((root) => {
    const section = root.closest(".svc-home") || document;
    const photo = section.querySelector("[data-services-photo]");
    root.innerHTML = services.map(svcShowcaseItem).join("");
    if (!photo) return;
    photo.innerHTML = servicePhoto(services[0]);
    bindMediaLoad(photo);
  });
}

function paintServices() {
  paintServiceShowcase();
  document.querySelectorAll("[data-services]").forEach((root) => {
    if (root.classList.contains("svc-static")) {
      root.innerHTML = `<ul class="svc-static__grid">${services.map(svcStaticItem).join("")}</ul>`;
      return;
    }
    root.classList.add("svc-acc");
    root.innerHTML = `<ul class="svc-acc-list svc-acc-list--grid">${services.map(svcAccItem).join("")}</ul>`;
    bindSvcAccordion(root);
  });
}

function courseShot() {
  const cursos = lookbook.filter((item) => item.venue === "cursos");
  return cursos.find((item) => lookStem(item) === "galeria-curso-brigada") || cursos[0] || null;
}

function paintCursos() {
  document.querySelectorAll("[data-cursos-head]").forEach((root) => {
    root.innerHTML = `
      <p class="kicker">${courses.kicker}</p>
      <h2>${courses.title}</h2>
      <hr class="rule" aria-hidden="true">
      ${(courses.leads || []).map((p) => `<p class="cursos-home__lead">${p}</p>`).join("")}
    `;
  });
  document.querySelectorAll("[data-cursos-list-lead]").forEach((root) => {
    if (!courses.listLead) {
      root.textContent = "";
      root.hidden = true;
      return;
    }
    root.textContent = courses.listLead;
    root.hidden = false;
  });
  document.querySelectorAll("[data-cursos]").forEach((root) => {
    if (!courses?.items?.length) {
      root.innerHTML = "";
      return;
    }
    root.innerHTML = courses.items
      .map((item) => {
        const name = typeof item === "string" ? item : item.name;
        const icon = typeof item === "string" ? "fa-solid fa-check" : item.icon;
        return `<li class="cursos-home__item">${fa(icon)}<span>${escapeHtml(name)}</span></li>`;
      })
      .join("");
  });
  const shot = courseShot();
  document.querySelectorAll("[data-cursos-photo]").forEach((root) => {
    if (!shot) {
      root.innerHTML = "";
      return;
    }
    root.innerHTML = lookPicture(shot, {
      sizes: "(min-width: 700px) 380px, 100vw",
      width: 800,
      height: 600,
      alt: lookAlt(shot),
    });
    bindMediaLoad(root);
  });
}

export function renderServicios() {
  paintServices();
  paintCursos();
  renderCarePoints();
  renderCompactSectors();
  renderHook();
}

export function renderNosotros() {
  const m = document.querySelector("[data-mision]");
  const v = document.querySelector("[data-vision]");
  const val = document.querySelector("[data-values]");
  if (m) m.textContent = company.mision;
  if (v) v.textContent = company.vision;
  if (val) {
    val.innerHTML = company.valores
      .map(
        (x, i) => `<li class="value-card">
          <i class="fa-solid ${HOME_VALUE_ICONS[i] || "fa-star"}" aria-hidden="true"></i>
          <strong>${x}</strong>
        </li>`
      )
      .join("");
  }
  const inspectorVals = document.querySelector("[data-inspector-valores]");
  if (inspectorVals) {
    inspectorVals.innerHTML = company.valores.map((x) => `<li>${x}</li>`).join("");
  }
  paintServices();
  paintCursos();
  renderCarePoints();
  renderCompactSectors();
  renderClientLogos();
  renderAboutMiniGallery();
}

const ABOUT_GALLERY_LIMIT = 8;

function renderAboutMiniGallery() {
  const root = document.querySelector("[data-about-gallery]");
  if (!root || !lookbook.length) return;
  bindPeekRail(root, lookbook.slice(0, ABOUT_GALLERY_LIMIT));
}

function padLook(n) {
  return String(n).padStart(2, "0");
}

let lightbox;

function ensureLightbox() {
  if (lightbox) return lightbox;
  const el = document.createElement("div");
  el.className = "lightbox";
  el.hidden = true;
  el.innerHTML = `
    <div class="lightbox__scrim" data-lb-close></div>
    <div class="lightbox__dialog" role="dialog" aria-modal="true" aria-labelledby="lightbox-title">
      <button type="button" class="lightbox__close" data-lb-close aria-label="Cerrar">${fa("fa-solid fa-xmark")}</button>
      <button type="button" class="lightbox__nav lightbox__nav--prev" data-lb-step="-1" aria-label="Imagen anterior">${fa("fa-solid fa-chevron-left")}</button>
      <figure class="lightbox__stage">
        <span class="lightbox__spin" aria-hidden="true"></span>
        <img data-lb-img alt="">
        <p class="lightbox__fail" data-lb-fail hidden>No se pudo cargar esta imagen.</p>
        <figcaption class="lightbox__cap">
          <p class="lightbox__count" data-lb-count></p>
          <p class="kicker" data-lb-kicker></p>
          <h3 id="lightbox-title" data-lb-title></h3>
          <p data-lb-note></p>
        </figcaption>
      </figure>
      <button type="button" class="lightbox__nav lightbox__nav--next" data-lb-step="1" aria-label="Imagen siguiente">${fa("fa-solid fa-chevron-right")}</button>
    </div>`;
  document.body.appendChild(el);
  lightbox = { el, items: [], index: 0, lastFocus: null };

  const show = (n) => {
    if (!lightbox.items.length) return;
    lightbox.index = (n + lightbox.items.length) % lightbox.items.length;
    paintLightbox();
  };
  const close = () => closeLightbox();

  el.addEventListener("click", (e) => {
    if (e.target.closest("[data-lb-close]")) {
      close();
      return;
    }
    const step = e.target.closest("[data-lb-step]");
    if (step) show(lightbox.index + Number(step.dataset.lbStep));
  });
  document.addEventListener("keydown", (e) => {
    if (el.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      show(lightbox.index - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      show(lightbox.index + 1);
    }
    if (e.key === "Tab") {
      const nodes = [...el.querySelectorAll("button")].filter((node) => !node.disabled);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  return lightbox;
}

function paintLightbox() {
  if (!lightbox) return;
  const item = lightbox.items[lightbox.index];
  if (!item) return;
  const stage = lightbox.el.querySelector(".lightbox__stage");
  const img = lightbox.el.querySelector("[data-lb-img]");
  const src = lookFullOpt(item);
  let next = src;
  try {
    next = new URL(src, location.origin).href;
  } catch {
    next = src || "";
  }
  const fail = lightbox.el.querySelector("[data-lb-fail]");
  const token = `${lightbox.index}:${next}`;
  lightbox.token = token;
  stage.classList.add("is-loading");
  stage.classList.remove("is-ready", "is-error");
  img.classList.remove("is-ready");
  if (fail) fail.hidden = true;
  const done = (ok = true) => {
    if (lightbox.token !== token) return;
    stage.classList.remove("is-loading");
    stage.classList.toggle("is-error", !ok);
    stage.classList.toggle("is-ready", ok);
    img.classList.toggle("is-ready", ok);
    if (fail) fail.hidden = ok;
  };
  img.addEventListener("load", () => done(true), { once: true });
  img.addEventListener("error", () => done(false), { once: true });
  img.alt = lookAlt(item);
  if (!src) {
    done(false);
  } else if (img.src === next && img.complete) {
    done(Boolean(img.naturalWidth));
  } else {
    img.src = src;
  }
  lightbox.el.querySelector("[data-lb-count]").textContent = `${padLook(lightbox.index + 1)} / ${padLook(lightbox.items.length)}`;
  lightbox.el.querySelector("[data-lb-kicker]").textContent = item.kicker || "Instalación";
  lightbox.el.querySelector("[data-lb-title]").textContent = item.title;
  lightbox.el.querySelector("[data-lb-note]").textContent = item.note || "";
}

function openLightbox(items, index = 0) {
  const box = ensureLightbox();
  box.items = items;
  box.index = (index + items.length) % items.length;
  box.lastFocus = document.activeElement;
  paintLightbox();
  box.el.hidden = false;
  document.body.classList.add("is-lightbox");
  box.el.querySelector(".lightbox__close")?.focus();
}

function closeLightbox() {
  if (!lightbox || lightbox.el.hidden) return;
  lightbox.el.hidden = true;
  document.body.classList.remove("is-lightbox");
  lightbox.lastFocus?.focus?.();
}

const GALLERY_ALL_ORDER = [
  "galeria-showroom",
  "galeria-vapiano",
  "galeria-deportivo",
  "galeria-escuela",
  "galeria-restaurante",
  "galeria-showroom-muro",
  "galeria-salon-eventos",
  "galeria-bodega",
  "galeria-automotriz",
  "galeria-comercio",
  "galeria-bar",
  "galeria-extintores-sitio",
  "galeria-gabinetes-sitio",
  "galeria-comedor",
  "galeria-local",
  "galeria-cocina",
  "galeria-parrilla",
  "galeria-panaderia",
  "galeria-campus",
  "galeria-almacen",
  "galeria-clinica",
  "galeria-cafeteria",
  "galeria-obra",
  "galeria-transporte",
  "galeria-escuela-patio",
  "galeria-lavanderia",
  "galeria-madereria",
  "galeria-estacionamiento",
  "galeria-alberca",
  "galeria-trailer",
  "galeria-evento",
  "galeria-curso-brigada",
  "galeria-inventario",
  "galeria-curso-campo",
  "galeria-curso-primeros-auxilios",
  "galeria-curso-rescate",
  "galeria-entrega",
  "galeria-camioneta",
  "galeria-curso-instructivo",
  "galeria-curso-comunidad",
];

function galleryAllList() {
  const byStem = new Map(lookbook.map((item) => [lookStem(item), item]));
  const ordered = [];
  const used = new Set();
  GALLERY_ALL_ORDER.forEach((stem) => {
    const item = byStem.get(stem);
    if (!item) return;
    ordered.push(item);
    used.add(stem);
  });
  lookbook.forEach((item) => {
    const stem = lookStem(item);
    if (!used.has(stem)) ordered.push(item);
  });
  return ordered;
}

export function renderGaleria() {
  const mosaic = document.querySelector("[data-gallery]");
  if (!mosaic) return;
  if (!lookbook.length) {
    mosaic.innerHTML = `<p class="shop-empty">No hay fotografías por ahora.</p>`;
    mosaic.setAttribute("aria-busy", "false");
    return;
  }
  const filters = document.querySelector("[data-gallery-filters]");
  const count = document.querySelector("[data-gallery-count]");
  let venue = "all";
  let list = lookbook;

  const chips = [{ id: "all", name: "Todas" }, ...venues];
  if (filters) {
    filters.innerHTML = chips
      .map(
        (chip) => `<button type="button" class="shop-chip${chip.id === "all" ? " is-active" : ""}" data-venue="${chip.id}" aria-pressed="${chip.id === "all" ? "true" : "false"}">${chip.name}</button>`
      )
      .join("");
  }

  const paint = () => {
    list = venue === "all" ? galleryAllList() : lookbook.filter((item) => item.venue === venue);
    if (count) {
      count.textContent = list.length
        ? `${list.length} fotografía${list.length === 1 ? "" : "s"}`
        : "Aún no hay fotografías aquí";
    }
    mosaic.setAttribute("aria-busy", "true");
    mosaic.innerHTML = list.length
      ? list
          .map(
            (item, i) => `<button type="button" class="gallery-tile" data-lb="${i}" aria-label="Ver ${escapeAttr(item.title)} en grande">
              ${lookPicture(item, { sizes: "(min-width: 1100px) 25vw, (min-width: 760px) 30vw, 50vw", width: 800, height: 1000, alt: lookAlt(item), lazy: i >= 4 })}
              <span class="gallery-tile__cap">
                <span class="gallery-tile__idx">${String(i + 1).padStart(2, "0")}</span>
                <strong>${item.title}</strong>
              </span>
            </button>`
          )
          .join("")
      : `<p class="shop-empty">Todavía no tenemos fotografías de este giro. Con gusto le mostramos trabajos parecidos por WhatsApp.</p>`;
    mosaic.setAttribute("aria-busy", "false");
    bindMotion();
  };

  const requested = new URLSearchParams(location.search).get("giro")
    || (location.hash || "").replace(/^#/, "");
  if (requested && venues.some((chip) => chip.id === requested)) {
    venue = requested;
    filters?.querySelectorAll(".shop-chip").forEach((chip) => {
      const on = chip.dataset.venue === venue;
      chip.classList.toggle("is-active", on);
      chip.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  filters?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-venue]");
    if (!btn) return;
    venue = btn.dataset.venue;
    filters.querySelectorAll(".shop-chip").forEach((chip) => {
      const on = chip.dataset.venue === venue;
      chip.classList.toggle("is-active", on);
      chip.setAttribute("aria-pressed", on ? "true" : "false");
    });
    paint();
  });

  mosaic.addEventListener("click", (e) => {
    const tile = e.target.closest("[data-lb]");
    if (!tile) return;
    openLightbox(list, Number(tile.dataset.lb));
  });

  paint();
}

function formStatus(form, kind, html) {
  let status = form.querySelector("[data-form-status]");
  if (!status) {
    status = document.createElement("p");
    status.className = "form-status";
    status.dataset.formStatus = "";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    form.appendChild(status);
  }
  status.className = `form-status${kind ? ` is-${kind}` : ""}`;
  status.hidden = !html;
  status.innerHTML = html || "";
}

function resetSubmit(btn) {
  if (!btn) return;
  btn.disabled = false;
  btn.classList.remove("is-loading");
  btn.removeAttribute("aria-busy");
  if (btn.dataset.label) btn.innerHTML = btn.dataset.label;
}

export function bindContact() {
  const form = document.querySelector("[data-contact]");
  if (!form) return;
  form.setAttribute("novalidate", "");
  const params = new URLSearchParams(location.search);
  const sku = params.get("sku");
  const p = productBySku(sku);
  const prodField = form.elements.namedItem("producto");
  const msgField = form.elements.namedItem("mensaje");
  if (p && prodField instanceof HTMLSelectElement && !prodField.value) {
    prodField.value = p.cat;
  }
  if (p && msgField instanceof HTMLTextAreaElement && !msgField.value.trim()) {
    msgField.value = `Quiero cotizar ${p.sku} — ${p.title}.`;
  }
  form.querySelectorAll("a[href*='aviso-privacidad']").forEach((link) => {
    link.addEventListener("click", (e) => e.stopPropagation());
  });
  form.querySelectorAll("input, textarea, select").forEach((field) => {
    field.addEventListener("input", () => field.setCustomValidity(""));
    field.addEventListener("change", () => field.setCustomValidity(""));
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.querySelectorAll("input, textarea, select").forEach((field) => field.setCustomValidity(""));
    formStatus(form, "", "");
    const data = new FormData(form);
    if (String(data.get("website") || "").trim()) {
      formStatus(form, "ok", "Recibimos su solicitud. Gracias por escribirnos.");
      return;
    }
    const nombre = String(data.get("nombre") || "").trim();
    const empresa = String(data.get("empresa") || "").trim();
    const producto = String(data.get("producto") || "").trim();
    const mensaje = String(data.get("mensaje") || "").trim();
    const correo = String(data.get("correo") || "").trim();
    const telRaw = String(data.get("telefono") || "").trim();
    const digits = telRaw.replace(/\D/g, "");
    const nombreField = form.elements.namedItem("nombre");
    const correoField = form.elements.namedItem("correo");
    const telField = form.elements.namedItem("telefono");
    const privField = form.elements.namedItem("privacidad");
    if (nombreField instanceof HTMLInputElement) nombreField.value = nombre;
    if (correoField instanceof HTMLInputElement) correoField.value = correo;
    if (telField instanceof HTMLInputElement) telField.value = telRaw;
    if (msgField instanceof HTMLTextAreaElement) msgField.value = mensaje;
    if (nombre.length < 2) {
      if (nombreField instanceof HTMLInputElement) nombreField.setCustomValidity("Por favor, escriba su nombre.");
    }
    if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      if (correoField instanceof HTMLInputElement) correoField.setCustomValidity("Revise su correo, por favor, o déjelo vacío si prefiere.");
    }
    if (digits.length < 8 || digits.length > 15) {
      if (telField instanceof HTMLInputElement) telField.setCustomValidity("Escriba un teléfono de 8 a 15 dígitos, por favor. Es para poder responderle.");
    }
    if (mensaje.length < 8) {
      if (msgField instanceof HTMLTextAreaElement) msgField.setCustomValidity("Cuéntenos brevemente qué requiere.");
    }
    if (privField instanceof HTMLInputElement && !privField.checked) {
      privField.setCustomValidity("Acepte el aviso de privacidad para poder continuar.");
    }
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const linea = producto && producto !== "otro" ? catName(producto) : producto === "otro" ? "Otro / no lo sé" : "";
    const text = [
      `Hola, soy ${nombre}.`,
      empresa ? `Empresa o condominio: ${empresa}` : null,
      correo ? `Correo: ${correo}` : null,
      `Teléfono: ${telRaw}`,
      linea ? `Equipo de interés: ${linea}` : null,
      p ? `SKU: ${p.sku} — ${p.title}` : null,
      "",
      mensaje,
    ].filter((line) => line !== null).join("\n");
    const url = waUrl(text);
    const btn = form.querySelector('[type="submit"]');
    if (btn) {
      if (!btn.dataset.label) btn.dataset.label = btn.innerHTML;
      btn.disabled = true;
      btn.classList.add("is-loading");
      btn.setAttribute("aria-busy", "true");
      btn.innerHTML = `${fa("fa-solid fa-circle-notch fa-spin")} Abriendo WhatsApp…`;
    }
    let popup = null;
    try {
      popup = window.open(url, "_blank", "noopener");
    } catch {
      popup = null;
    }
    if (!popup) {
      formStatus(
        form,
        "error",
        `No pudimos abrir WhatsApp. <a href="${url}" target="_blank" rel="noopener noreferrer">Ábralo aquí</a> o márquenos al ${company.whatsappShow}; con gusto lo atendemos.`
      );
      resetSubmit(btn);
      return;
    }
    formStatus(form, "ok", "Listo, abrimos WhatsApp con su mensaje. En cuanto lo envíe, le respondemos.");
    window.setTimeout(() => resetSubmit(btn), 1200);
  });
}

export { company, waUrl };

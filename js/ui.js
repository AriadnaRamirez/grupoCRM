import { company, categories, products, services, sectors, faqs, clients, waUrl, safeDecode, catName, catCount, productBySku, productImg, productAlt, productUrl, readSku, relatedProducts, lookbook, lookAlt, lookFull, venues, carePoints, readyChecks, condo } from "./data.js";
import { applySeo } from "./seo.js";
import { rebaseDocument, withBase } from "./base.js";

const fa = (cls) => `<i class="${cls}" aria-hidden="true"></i>`;
const WA_ICON = fa("fa-brands fa-whatsapp wa-icon");
const FB_ICON = fa("fa-brands fa-facebook-f social-icon");
const IG_ICON = fa("fa-brands fa-instagram social-icon");
const PHONE_ICON = fa("fa-solid fa-phone phone-icon");
const MAIL_ICON = fa("fa-solid fa-envelope mail-icon");
const SEARCH_ICON = fa("fa-solid fa-magnifying-glass");
const CHEV_DOWN = fa("fa-solid fa-chevron-down nav-drop__chevron");
const LOC_ICON = fa("fa-solid fa-location-dot topbar__pin");

function escapeAttr(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

export function mountShell(page) {
  const header = document.querySelector("[data-header]");
  const footer = document.querySelector("[data-footer]");
  if (header) header.innerHTML = headerHTML(page);
  if (footer) footer.innerHTML = footerHTML();
  rebaseDocument();
  bindChrome();
}

const HOME_VALUE_ICONS = [
  "fa-handshake",
  "fa-shield-halved",
  "fa-award",
  "fa-heart",
  "fa-people-group",
];

const CAT_COVER = {
  extintores: { src: "/assets/img/categoria-extintores.png", alt: "Extintor montado en pared", photo: true },
  chalecos: { src: "/assets/img/categoria-chalecos.png", alt: "Brigada con chalecos de seguridad", photo: true },
  "senalamiento-vial": { src: "/assets/img/categoria-senalamiento-vial.png", alt: "Señalamientos viales", photo: true },
  "gabinetes-herrajes": { src: "/assets/img/categoria-gabinetes-herrajes.png", alt: "Gabinete para extintor", photo: true },
  botiquines: { src: "/assets/img/categoria-botiquines.png", alt: "Botiquín de emergencia", photo: true },
  "equipo-proteccion": { src: "/assets/img/categoria-equipo-proteccion.png", alt: "Equipo de protección personal", photo: true },
};

function absAsset(src) {
  if (!src || /^https?:\/\//i.test(src)) return src;
  return withBase(src.startsWith("/") ? src : `/${src}`);
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
  if (!src || img.getAttribute("src") === src) return;
  img.src = src;
  img.removeAttribute("data-src");
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
  const src = withBase(el.dataset.bg);
  if (!src) return;
  el.dataset.bg = src;
  const photo = el.querySelector(".slide__photo") || el;
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

function catalogExtendInner(defer = false) {
  const cards = categories
    .map((c) => {
      const cover = catCover(c);
      const n = catCount(c.id);
      const img = cover
        ? defer
          ? `<img data-src="${cover.src}" alt="${escapeAttr(cover.alt)}" decoding="async">`
          : `<img src="${cover.src}" alt="${escapeAttr(cover.alt)}" loading="lazy" decoding="async">`
        : "";
      return `<li>
        <a class="shop-dept" data-cat="${c.id}" href="${withBase(`/productos?cat=${c.id}#${c.id}`)}">
          <span class="shop-dept__media${cover?.photo ? " shop-dept__media--photo" : ""}">
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
      return cover ? `<img src="${cover.src}" alt="" aria-hidden="true" loading="lazy" decoding="async">` : "";
    })
    .join("");
  const allCard = `<li>
    <a class="shop-dept shop-dept--all${current === "all" ? " is-active" : ""}" data-cat="all" href="${withBase("/productos")}" aria-current="${current === "all" ? "page" : "false"}">
      <span class="shop-dept__media shop-dept__media--mosaic shop-dept__media--photo">${mosaic}</span>
      <span class="shop-dept__body">
        <span class="shop-dept__rule" aria-hidden="true"></span>
        <strong>Todos</strong>
        <span class="shop-dept__n">${products.length} productos</span>
      </span>
    </a>
  </li>`;
  const cards = categories
    .map((c) => {
      const cover = catCover(c);
      const n = catCount(c.id);
      const active = current === c.id;
      const img = cover
        ? `<img src="${cover.src}" alt="${escapeAttr(cover.alt)}" loading="lazy" decoding="async">`
        : "";
      return `<li>
        <a class="shop-dept${active ? " is-active" : ""}" data-cat="${c.id}" href="${withBase(`/productos?cat=${c.id}#${c.id}`)}" aria-current="${active ? "page" : "false"}">
          <span class="shop-dept__media${cover?.photo ? " shop-dept__media--photo" : ""}">
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
    const title = isProductos
      ? `<header class="catalog-head">
          <p class="kicker">Equipo contra incendio</p>
          <h1>Catálogo</h1>
          <hr class="rule" aria-hidden="true">
          <p class="catalog-head__lead">Extintores, señalamientos, gabinetes y protección.</p>
        </header>`
      : "";
    const inner = isProductos ? catalogPickerInner(catalogCatFromUrl()) : catalogExtendInner();
    root.classList.toggle("catalog-picker", isProductos);
    if (isProductos) root.classList.toggle("is-all-active", catalogCatFromUrl() === "all");
    root.innerHTML = `<div class="wrap mega__inner">${title}${inner}</div>`;
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
            <a class="topbar__tel" href="${waUrl()}" target="_blank" rel="noopener noreferrer">${WA_ICON}<span>${company.whatsappShow}</span></a>
            <a class="topbar__tel" href="mailto:${company.email}">${MAIL_ICON}<span class="topbar__full">${company.email}</span><span class="topbar__short">Correo</span></a>
          </div>
          <div class="topbar__right">
            <p class="topbar__place">${LOC_ICON}<span class="topbar__full">${company.location}</span><span class="topbar__short">CDMX y Edo. Mex</span></p>
            <p class="topbar__social">
              <a href="${company.facebookUrl}" target="_blank" rel="noopener noreferrer" aria-label="Facebook, se abre en una ventana nueva">${FB_ICON}</a>
              <a href="${company.instagramUrl}" target="_blank" rel="noopener noreferrer" aria-label="Instagram, se abre en una ventana nueva">${IG_ICON}</a>
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
                  <p class="nav-drop__all"><a class="btn btn-red" href="${withBase("/productos")}">Ver catálogo</a></p>
                </div>
              </div>
            </div>
            ${item("/galeria", "galeria", "Galería")}
            ${item("/blog", "blog", "Blog")}
            ${item("/contacto", "contacto", "Contacto")}
          </nav>
          <div class="header__end">
            <form class="nav-search" action="${withBase("/productos")}" method="get" role="search">
              <div class="nav-search__field">
                <label class="sr-only" for="nav-search-q">Buscar equipo</label>
                <input id="nav-search-q" type="search" name="q" placeholder="Buscar equipo o SKU" autocomplete="off" data-nav-search>
                <button type="submit" aria-label="Buscar">${SEARCH_ICON}</button>
              </div>
            </form>
            <a class="header__cta" href="${waUrl()}" target="_blank" rel="noopener noreferrer">${WA_ICON} Cotizar</a>
            <button type="button" class="nav-toggle" data-nav-toggle aria-expanded="false" aria-controls="menu">
              <span class="sr-only">Abrir menú</span>
              <span class="nav-toggle__icon" aria-hidden="true"><span></span><span></span><span></span></span>
            </button>
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
    <a class="wa-float" href="${waUrl()}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp ${company.whatsappShow}, se abre en una ventana nueva">${WA_ICON}<span>WhatsApp</span></a>`;
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
  ".feature-card",
  ".svc-home__intro",
  ".shop-block",
  ".trust--logos .trust__head",
  ".cat-band__head",
  ".home-contact__peek-head",
  ".home-contact__photo",
  ".home-contact__gallery-wrap",
  ".peek-rail",
  ".home-contact__form-col",
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
  ".about-origin__media",
  ".about-field__grid figure",
  ".about-mv-band__figure",
  ".home-contact__photo",
  ".peek-rail__card",
  ".work-slide",
  ".error-page__figure",
  ".blog-card__media",
  ".article-hero",
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
    if (wrap) wrap.classList.add("media-load");
    else img.classList.add("media-load");
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

export function productCard(p, { quote = false } = {}) {
  const href = productUrl(p.sku);
  const remember = `try{sessionStorage.setItem('crm-sku','${p.sku}')}catch(e){}`;
  const meta = [p.cap, p.agent].filter(Boolean).join(" · ");
  const classes = (p.classes || "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  const classLine = classes.length ? `Clase ${classes.join(" · ")}` : "";
  const quoteBtn = `<a class="shop-item__quote${quote ? "" : " shop-item__quote--wa"}" href="${quoteUrl(p)}" target="_blank" rel="noopener noreferrer">${WA_ICON} Cotizar</a>`;
  const detail = quote
    ? ""
    : `<span class="shop-item__more">Ver detalle <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>`;
  return `
    <article class="shop-item shop-item--quote" data-cat="${p.cat}">
      <a class="shop-item__link" href="${href}" onclick="${remember}">
        <span class="shop-item__media">
          <img src="${absAsset(productImg(p))}" alt="${escapeAttr(productAlt(p))}" width="3840" height="3840" loading="lazy" decoding="async">
        </span>
        <span class="shop-item__info">
          <span class="shop-item__sku"><i class="shop-item__swatch" aria-hidden="true"></i>${p.sku}</span>
          <h3>${p.title}</h3>
          ${meta ? `<span class="shop-item__meta">${meta}</span>` : ""}
          ${classLine ? `<span class="shop-item__class">${classLine}</span>` : ""}
          ${detail}
        </span>
      </a>
      ${quoteBtn}
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
  root.innerHTML = list.map(productCard).join("") || `<p class="shop-empty">No encontramos ese equipo. <a href="${waUrl("Hola, no encontré el equipo que busco y quiero orientación.")}" target="_blank" rel="noopener noreferrer">Escríbanos</a> y le ayudamos a elegir.</p>`;
  const count = document.querySelector("[data-count]");
  if (count) {
    count.textContent = list.length
      ? `${list.length} producto${list.length === 1 ? "" : "s"}`
      : "Sin resultados";
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
  const catalogLayout = document.querySelector("[data-catalog-layout]");
  if (classRoot) {
    const classes = [
      { id: "all", label: "Todas las clases" },
      { id: "A", label: "Sólidos (A)" },
      { id: "B", label: "Líquidos (B)" },
      { id: "C", label: "Eléctricos (C)" },
      { id: "K", label: "Cocinas (K)" },
    ];
    classRoot.innerHTML = classes
      .map(
        (item) => `<button type="button" class="shop-chip" data-class="${item.id}" aria-pressed="false">
          ${item.id === "all" ? "" : `<span class="shop-chip__letter">${item.id}</span>`}
          ${item.label}
        </button>`
      )
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
  classRoot?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-class]");
    if (!btn) return;
    fireClass = btn.dataset.class;
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
        ? `<span class="cat-tile__media"><img src="${cover.src}" alt="${escapeAttr(cover.alt)}" loading="lazy" decoding="async"></span>`
        : "";
      return `<li>
        <a class="cat-tile" data-cat="${c.id}" href="${withBase(`/productos?cat=${c.id}#${c.id}`)}">
          ${media}
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
            <a class="shop-more" href="${withBase(`/productos?cat=${c.id}#${c.id}`)}">${c.seeAll} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
          </header>
          <div class="shop-grid shop-grid--4">${items.map((p) => productCard(p, { quote: true })).join("")}</div>
        </section>`;
    })
    .join("");
  root.setAttribute("aria-busy", "false");
  bindMediaLoad(root);
}

function bindSlider(root) {
  if (!root || root.dataset.sliderBound === "1") return;
  const slides = [...root.querySelectorAll(".slide, [data-slide]")];
  const dotsWrap = root.querySelector("[data-dots]");
  if (!slides.length) return;
  root.dataset.sliderBound = "1";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isHero = root.classList.contains("hero-slider");
  const intervalMs = isHero ? 5500 : 6500;
  let index = 0;
  let timer;
  let paused = false;
  let startX = 0;
  let startY = 0;
  if (dotsWrap) {
    dotsWrap.innerHTML = slides
      .map((_, i) => `<button type="button" class="dot${i === 0 ? " is-active" : ""}" data-dot="${i}" aria-label="Ir a la diapositiva ${i + 1}" aria-current="${i === 0 ? "true" : "false"}"></button>`)
      .join("");
  }
  const wake = (i) => {
    const slide = slides[(i + slides.length) % slides.length];
    if (!slide) return;
    applyLazyBg(slide);
    slide.querySelectorAll("img[data-src]").forEach(applyLazySrc);
    bindMediaLoad(slide);
  };
  const show = (n) => {
    index = (n + slides.length) % slides.length;
    wake(index);
    wake(index + 1);
    slides.forEach((slide, i) => {
      const on = i === index;
      slide.classList.toggle("is-active", on);
      slide.setAttribute("aria-hidden", on ? "false" : "true");
      slide.toggleAttribute("inert", !on);
    });
    root.querySelectorAll("[data-dot]").forEach((dot, i) => {
      const on = i === index;
      dot.classList.toggle("is-active", on);
      dot.setAttribute("aria-current", on ? "true" : "false");
    });
  };
  const stop = () => {
    clearInterval(timer);
    timer = null;
  };
  const play = () => {
    stop();
    if (reduceMotion || paused || document.hidden) return;
    timer = setInterval(() => show(index + 1), intervalMs);
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
      go(slides.length - 1);
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
    if (e.target.closest("a, button, input, textarea, select")) pause();
  });
  root.addEventListener("focusout", (e) => {
    if (!root.contains(e.relatedTarget)) resume();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else if (!paused) play();
  });
  show(0);
  play();
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
          <img src="${absAsset(item.src)}" alt="${escapeAttr(lookAlt(item))}" loading="lazy" decoding="async">
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
              <img src="${absAsset(thumb.src)}" alt="" loading="lazy" decoding="async">
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
    .map(
      (logo) =>
        `<img src="${absAsset(logo.src)}" alt="${escapeAttr(logo.alt)}" loading="lazy" decoding="async">`
    )
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
      return `<img${round} src="${absAsset(logo.src)}" alt="${alt}" width="160" height="72" decoding="async">`;
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
  const live = clients.map((c) => clientRailCard(c)).join("");
  const ghost = clients.map((c) => clientRailCard(c, { inert: true })).join("");
  root.className = "client-rail is-auto";
  root.setAttribute("aria-label", root.getAttribute("aria-label") || "Clientes");
  root.innerHTML = `<div class="client-rail__viewport">
      <div class="client-rail__track">${live}${ghost}</div>
    </div>`;
  const track = root.querySelector(".client-rail__track");
  const mqCollage = window.matchMedia("(max-width: 980px)");
  const pxPerSec = 42;
  let offset = 0;
  let raf = 0;
  let last = 0;
  let paused = false;

  function isCollage() {
    return mqCollage.matches;
  }

  function stopAuto() {
    window.cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
  }

  function tick(ts) {
    if (isCollage()) {
      stopAuto();
      return;
    }
    if (paused) {
      last = ts;
      raf = window.requestAnimationFrame(tick);
      return;
    }
    const half = Math.max(track.scrollWidth, track.offsetWidth) / 2;
    if (half <= 1) {
      raf = window.requestAnimationFrame(tick);
      return;
    }
    if (!last) last = ts;
    const dt = Math.min(48, ts - last);
    last = ts;
    offset += (dt * pxPerSec) / 1000;
    if (offset >= half) offset -= half;
    track.style.transform = `translate3d(${-offset}px,0,0)`;
    raf = window.requestAnimationFrame(tick);
  }

  function startAuto() {
    stopAuto();
    offset = 0;
    track.style.transform = "translate3d(0,0,0)";
    raf = window.requestAnimationFrame(tick);
  }

  function setMode() {
    const collage = isCollage();
    root.classList.toggle("is-collage", collage);
    root.classList.toggle("is-auto", !collage);
    if (collage) root.removeAttribute("aria-roledescription");
    else root.setAttribute("aria-roledescription", "carrusel");
    stopAuto();
    track.style.transform = "";
    if (!collage) startAuto();
  }

  root.addEventListener("mouseenter", () => {
    paused = true;
  });
  root.addEventListener("mouseleave", () => {
    paused = false;
  });
  root.addEventListener("focusin", () => {
    paused = true;
  });
  root.addEventListener("focusout", (event) => {
    if (!root.contains(event.relatedTarget)) paused = false;
  });
  mqCollage.addEventListener("change", setMode);
  root._clientRailStop = stopAuto;
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
  "galeria-evento",
  "galeria-inventario",
  "galeria-extintores-sitio",
]);

const HOME_CONTACT_GALLERY = [
  "galeria-deportivo",
  "galeria-restaurante",
  "galeria-vapiano",
  "galeria-automotriz",
  "galeria-bodega",
];

function lookStem(item) {
  const src = lookFull(item) || item?.src || "";
  const match = String(src).match(/galeria-[^./]+/);
  return match ? match[0] : "";
}

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

function peekCard(item, i, { caption = false } = {}) {
  const src = absAsset(lookFull(item));
  return `<button type="button" class="peek-rail__card" data-lb-open="${i}" aria-label="Ver ${escapeAttr(item.title)} en grande">
    <img src="${src}" alt="${escapeAttr(lookAlt(item))}" width="480" height="600" loading="lazy" decoding="async">
    ${caption ? `<span class="peek-rail__cap"><strong>${item.title}</strong></span>` : ""}
  </button>`;
}

function bindPeekRail(root, items, { caption = false } = {}) {
  if (!root || !items.length) return;
  const cards = items.map((item, i) => peekCard(item, i, { caption })).join("");
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
  renderCarePoints();
  renderClientLogos();
  renderCompactSectors();
  renderHook();
  renderHomeGallerySlider();
  renderFaqs();
  renderNosotros();
  bindContact();
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
    root.innerHTML = `
      <section class="error-page">
        <div class="wrap error-page__box">
          <figure class="error-page__figure">
            <img src="${withBase("/assets/img/mascot-inspector-crm.png")}" width="283" height="379" alt="Inspector CRM, mascota de Grupo CRM Extintores" loading="lazy" decoding="async">
          </figure>
          <div class="error-page__copy">
            <p class="kicker">Equipo</p>
            <p class="error-page__code">404</p>
            <h1>No encontramos ese equipo</h1>
            <hr class="rule rule-left">
            <p>Ese artículo no está en el catálogo. Le proponemos el equivalente.</p>
            <p class="error-page__actions">
              <a class="btn btn-red" href="${withBase("/productos")}">${fa("fa-solid fa-boxes-stacked")} Ver equipos</a>
              <a class="btn btn-wa" href="${waUrl("Hola, no encontré un producto y quiero cotizar.")}" target="_blank" rel="noopener noreferrer">${WA_ICON} Cotizar</a>
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
            <img src="${absAsset(productImg(p))}" alt="${escapeAttr(productAlt(p, { detail: true }))}" width="3840" height="3840" decoding="async" fetchpriority="high">
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
              <a class="btn btn-wa" href="${waUrl(`Hola, quiero cotizar ${p.sku} — ${p.title}`)}" target="_blank" rel="noopener noreferrer">${WA_ICON}<span>Cotizar</span></a>
              <a class="btn btn-ink" href="${withBase(`/contacto?sku=${encodeURIComponent(p.sku)}`)}">${fa("fa-solid fa-envelope")}<span>Pedir cotización</span></a>
            </div>
          </div>
        </div>
      </article>
    </div>
    ${related ? `<section class="section shop-related"><div class="wrap wrap-shop"><div class="shop-block__head"><h3>También le puede interesar</h3></div><div class="shop-grid">${related}</div></div></section>` : ""}`;
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
        <p>Condominios, restaurantes, oficinas, empresas, clínicas y escuelas.</p>
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
          <a class="btn btn-red" href="${waUrl("Hola, quiero agendar mi inspección sin costo.")}" target="_blank" rel="noopener noreferrer">${WA_ICON} Agendar</a>
          <a class="btn btn-ghost" href="${waUrl()}" target="_blank" rel="noopener noreferrer">${WA_ICON} Cotizar</a>
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
        <h2>${company.hook}</h2>
        <hr class="rule rule-left hook__rule" aria-hidden="true">
        <p>Vamos a su sitio y le decimos qué falta.</p>
      </div>
      <div class="hook__actions">
        <a class="btn btn-red" href="${waUrl("Hola, quiero agendar mi inspección sin costo.")}" target="_blank" rel="noopener noreferrer">${WA_ICON} Agendar</a>
        <a class="btn btn-ghost hook__phone" href="tel:${company.phoneTel}">${PHONE_ICON} Llamar ${company.phone}</a>
      </div>
    </div>`;
}

export function renderHook() {
  document.querySelectorAll("[data-hook]").forEach((root) => {
    root.innerHTML = hookRevisionHTML();
  });
}

function paintServices() {
  document.querySelectorAll("[data-services]").forEach((root) => {
    root.innerHTML = services
      .map(
        (s) => `<li class="svc-card">
          ${fa(`${s.icon} svc-card__icon`)}
          <h3>${s.title}</h3>
        </li>`
      )
      .join("");
  });
}

export function renderServicios() {
  paintServices();
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
  renderCarePoints();
  renderCompactSectors();
  renderClientLogos();
  renderAboutMiniGallery();
}

const ABOUT_GALLERY_LIMIT = 8;

function renderAboutMiniGallery() {
  const root = document.querySelector("[data-about-gallery]");
  if (!root || !lookbook.length) return;
  bindPeekRail(root, lookbook.slice(0, ABOUT_GALLERY_LIMIT), { caption: true });
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
  const src = absAsset(lookFull(item));
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
    list = venue === "all" ? lookbook : lookbook.filter((item) => item.venue === venue);
    if (count) {
      count.textContent = list.length
        ? `${list.length} fotografía${list.length === 1 ? "" : "s"}`
        : "Sin resultados";
    }
    mosaic.setAttribute("aria-busy", "true");
    mosaic.innerHTML = list.length
      ? list
          .map(
            (item, i) => `<button type="button" class="gallery-tile" data-lb="${i}" aria-label="Ver ${escapeAttr(item.title)} en grande">
              <img src="${absAsset(lookFull(item))}" alt="${escapeAttr(lookAlt(item))}" loading="lazy" decoding="async" width="480" height="360">
              <span class="gallery-tile__cap">
                <strong>${item.title}</strong>
              </span>
            </button>`
          )
          .join("")
      : `<p class="shop-empty">No hay fotografías en esta categoría.</p>`;
    mosaic.setAttribute("aria-busy", "false");
    bindMotion();
  };

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
      formStatus(form, "ok", "Recibimos su solicitud.");
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
      if (nombreField instanceof HTMLInputElement) nombreField.setCustomValidity("Escriba su nombre.");
    }
    if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      if (correoField instanceof HTMLInputElement) correoField.setCustomValidity("Escriba un correo válido o déjelo vacío.");
    }
    if (digits.length < 8 || digits.length > 15) {
      if (telField instanceof HTMLInputElement) telField.setCustomValidity("Escriba un teléfono de 8 a 15 dígitos.");
    }
    if (mensaje.length < 8) {
      if (msgField instanceof HTMLTextAreaElement) msgField.setCustomValidity("Cuéntenos brevemente qué requiere.");
    }
    if (privField instanceof HTMLInputElement && !privField.checked) {
      privField.setCustomValidity("Acepte el aviso de privacidad para continuar.");
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
        `No se pudo abrir WhatsApp. <a href="${url}" target="_blank" rel="noopener noreferrer">Ábralo aquí</a> o marque ${company.whatsappShow}.`
      );
      resetSubmit(btn);
      return;
    }
    formStatus(form, "ok", "WhatsApp se abrió con su consulta.");
    window.setTimeout(() => resetSubmit(btn), 1200);
  });
}

export { company, waUrl };

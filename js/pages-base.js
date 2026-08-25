/* Sync into HTML with: node scripts/inject-pages-base.mjs */
(function () {
  if (typeof location === "undefined" || !/\.github\.io$/i.test(location.hostname)) return;
  var first = location.pathname.split("/").filter(Boolean)[0] || "grupoCRM";
  var base = "/" + first;
  var pages = /^(nosotros|productos|producto|galeria|contacto|aviso-privacidad|mapa-sitio|servicios|404)$/;
  function pageFile(pathname) {
    if (!pathname) return pathname;
    var rest = pathname;
    if (pathname === base || pathname.indexOf(base + "/") === 0) rest = pathname.slice(base.length) || "/";
    if (!rest || rest === "/") return pathname;
    if (/\.[a-z0-9]+$/i.test(rest)) return pathname;
    var segs = rest.split("/").filter(Boolean);
    var last = segs[segs.length - 1];
    if (pages.test(last) || (segs[0] === "blog" && segs.length === 2)) {
      return pathname.replace(/\/$/, "") + ".html";
    }
    return pathname;
  }
  function fix(value) {
    if (!value || /^(https?:|data:|mailto:|tel:|javascript:|#)/i.test(value)) return value;
    var hashIdx = value.indexOf("#");
    var hash = hashIdx === -1 ? "" : value.slice(hashIdx);
    var before = hashIdx === -1 ? value : value.slice(0, hashIdx);
    var qIdx = before.indexOf("?");
    var search = qIdx === -1 ? "" : before.slice(qIdx);
    var pathname = qIdx === -1 ? before : before.slice(0, qIdx);
    if (pathname === "/") pathname = base + "/";
    else if (pathname.charAt(0) === "/") {
      if (!(pathname === base || pathname.indexOf(base + "/") === 0)) pathname = base + pathname;
    } else {
      return value;
    }
    return pageFile(pathname) + search + hash;
  }
  function apply(el) {
    if (!el || !el.getAttribute) return;
    ["href", "src", "data-bg", "data-src", "action"].forEach(function (attr) {
      var current = el.getAttribute(attr);
      if (!current) return;
      var next = fix(current);
      if (next !== current) el.setAttribute(attr, next);
    });
    var style = el.getAttribute("style");
    if (style && style.indexOf("url(") !== -1) {
      el.setAttribute(
        "style",
        style.replace(/url\((['"]?)([^'")]+)\1\)/g, function (_, quote, url) {
          return "url(" + quote + fix(url) + quote + ")";
        })
      );
    }
  }
  if (!document.querySelector("base")) {
    var tag = document.createElement("base");
    tag.href = base + "/";
    var head = document.head || document.documentElement;
    head.insertBefore(tag, head.firstChild);
  }
  new MutationObserver(function (records) {
    records.forEach(function (record) {
      record.addedNodes.forEach(function (node) {
        if (node.nodeType !== 1) return;
        apply(node);
        if (node.querySelectorAll) {
          node.querySelectorAll("[href], [src], [data-bg], [data-src], [action], [style]").forEach(apply);
        }
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
})();

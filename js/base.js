const REPO = "grupoCRM";

export function basePath() {
  if (typeof location === "undefined") return "";
  if (/\.github\.io$/i.test(location.hostname)) {
    const first = location.pathname.split("/").filter(Boolean)[0];
    return first ? `/${first}` : `/${REPO}`;
  }
  return "";
}

export function withBase(path) {
  if (path == null || path === "") return path;
  const raw = String(path);
  if (/^(https?:|data:|mailto:|tel:|javascript:)/i.test(raw)) return raw;
  if (raw.startsWith("#")) return raw;

  const hashIdx = raw.indexOf("#");
  const hash = hashIdx === -1 ? "" : raw.slice(hashIdx);
  const beforeHash = hashIdx === -1 ? raw : raw.slice(0, hashIdx);
  const qIdx = beforeHash.indexOf("?");
  const search = qIdx === -1 ? "" : beforeHash.slice(qIdx);
  let pathname = qIdx === -1 ? beforeHash : beforeHash.slice(0, qIdx);

  const base = basePath();
  if (!base) {
    if (pathname.startsWith("/")) return `${pathname}${search}${hash}`;
    if (/^(assets|css|js)\//.test(pathname)) return `/${pathname}${search}${hash}`;
    return `${pathname}${search}${hash}`;
  }

  if (pathname === base || pathname.startsWith(`${base}/`)) return `${pathname}${search}${hash}`;
  if (pathname.startsWith("/")) return `${base}${pathname}${search}${hash}`;
  if (/^(assets|css|js)\//.test(pathname) || /^\.\//.test(pathname)) {
    return `${base}/${pathname.replace(/^\.\//, "")}${search}${hash}`;
  }
  return `${pathname}${search}${hash}`;
}

function rebaseValue(value) {
  if (!value) return value;
  const next = withBase(value);
  return next === value ? value : next;
}

export function rebaseDocument(root = document) {
  if (!basePath() || !root?.querySelectorAll) return;
  root.querySelectorAll("[href], [src], [data-bg], [data-src], [action]").forEach((el) => {
    ["href", "src", "data-bg", "data-src", "action"].forEach((attr) => {
      const current = el.getAttribute(attr);
      if (!current) return;
      const next = rebaseValue(current);
      if (next !== current) el.setAttribute(attr, next);
    });
    const style = el.getAttribute("style");
    if (style && style.includes("url(")) {
      el.setAttribute(
        "style",
        style.replace(/url\((['"]?)([^'")]+)\1\)/g, (_, quote, url) => `url(${quote}${rebaseValue(url)}${quote})`)
      );
    }
  });
}

import { company } from "./data.js";

/** Loads GA4 only when company.gaId is a real G-… id. */
export function loadAnalytics() {
  const id = String(company.gaId || "").trim();
  if (!/^G-[A-Z0-9]+$/i.test(id)) return;
  if (window.__crmGaLoaded) return;
  window.__crmGaLoaded = true;

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", id, { anonymize_ip: true });

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

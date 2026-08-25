import { writeFileSync } from "node:fs";
import { SITE } from "../js/data.js";
import { sitemapUrls } from "../js/seo.js";

const today = new Date().toISOString().slice(0, 10);
const urls = sitemapUrls();
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
    .map((path) => {
      const loc = `${SITE.origin}${path}`.replace(/&/g, "&amp;");
      const isLegal = path.includes("aviso") || path.includes("mapa");
      const priority = path === "/" ? "1.0" : path.startsWith("/producto?") ? "0.6" : path.startsWith("/productos") ? "0.8" : isLegal ? "0.3" : "0.7";
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${isLegal ? "monthly" : "weekly"}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("\n")}
</urlset>
`;

writeFileSync(new URL("../sitemap.xml", import.meta.url), xml);
console.log(`sitemap.xml: ${urls.length} URLs`);

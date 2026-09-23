/**
 * Replace Font Awesome print-media stylesheet (often flagged as render-blocking)
 * with the same idle deferred loader used on the homepage.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const FA_IDLE = `<script>
  (function () {
    function loadFa() {
      if (document.getElementById("fa-css")) return;
      var link = document.createElement("link");
      link.id = "fa-css";
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css";
      link.crossOrigin = "anonymous";
      link.referrerPolicy = "no-referrer";
      document.head.appendChild(link);
    }
    if ("requestIdleCallback" in window) window.requestIdleCallback(loadFa, { timeout: 6000 });
    else window.addEventListener("load", function () { setTimeout(loadFa, 2500); }, { once: true });
  })();
  </script>
  <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer"></noscript>`;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".git" || name === "assets") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith(".html")) out.push(p);
  }
  return out;
}

let n = 0;
for (const f of walk(".")) {
  let t = readFileSync(f, "utf8");
  const o = t;
  // Drop preconnect that only existed for early FA
  t = t.replace(/\s*<link rel="preconnect" href="https:\/\/cdnjs\.cloudflare\.com"[^>]*>\s*/gi, "\n");
  // Replace print/onload FA pair (+ optional noscript already present)
  t = t.replace(
    /\s*<link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.5\.2\/css\/all\.min\.css"[^>]*media="print"[^>]*>\s*(?:<noscript><link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.5\.2\/css\/all\.min\.css"[^>]*><\/noscript>\s*)?/gi,
    `\n${FA_IDLE}\n`
  );
  // Avoid duplicating if page already has idle loader
  const idleCount = (t.match(/id="fa-css"/g) || []).length;
  if (idleCount > 1) {
    // keep first idle block only: strip later duplicate script+noscript pairs for FA
    let seen = 0;
    t = t.replace(
      /<script>\s*\(function \(\) \{\s*function loadFa\(\)[\s\S]*?<\/script>\s*<noscript><link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.5\.2\/css\/all\.min\.css"[^>]*><\/noscript>/g,
      (m) => {
        seen += 1;
        return seen === 1 ? m : "";
      }
    );
  }
  if (t !== o) {
    writeFileSync(f, t);
    n += 1;
  }
}
console.log(`updated ${n} html files`);

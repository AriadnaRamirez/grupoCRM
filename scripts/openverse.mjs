const headers = { "User-Agent": "CRMCatalogBot/1.0" };
const qs = [
  "orange safety vest",
  "yellow safety vest",
  "traffic cone orange",
  "construction barrier post",
  "orange safety fence",
  "barricade light",
  "safety flag orange",
  "caution tape yellow",
  "danger tape red",
  "wet floor sign",
  "fire hose cabinet",
  "fire extinguisher cabinet",
  "fire hose nozzle",
  "fire hose",
  "hydrant valve",
  "first aid box",
  "smoke alarm",
  "emergency exit light",
  "spine board",
  "hard hat red",
  "hard hat white",
  "cut resistant gloves",
  "cervical collar",
];

const out = {};
for (const q of qs) {
  const url =
    "https://api.openverse.org/v1/images/?page_size=6&license_type=commercial&q=" +
    encodeURIComponent(q);
  const res = await fetch(url, { headers });
  if (!res.ok) {
    out[q] = `HTTP ${res.status}`;
    continue;
  }
  const data = await res.json();
  out[q] = (data.results || []).slice(0, 5).map((r) => ({
    title: (r.title || "").slice(0, 70),
    license: r.license,
    url: r.url,
    w: r.width,
    h: r.height,
    source: r.source,
  }));
  await new Promise((r) => setTimeout(r, 350));
}
console.log(JSON.stringify(out, null, 2));

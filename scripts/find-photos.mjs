const headers = { "User-Agent": "CRMCatalogBot/1.0 (Grupo CRM catalog; contact crm.extintores@gmail.com)" };

async function wikiFile(title) {
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&titles=" +
    encodeURIComponent(title) +
    "&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=1200&format=json";
  const res = await fetch(url, { headers });
  const text = await res.text();
  if (text.startsWith("You are")) return { title, error: text.slice(0, 80) };
  const data = JSON.parse(text);
  const page = Object.values(data.query?.pages || {})[0];
  const ii = page?.imageinfo?.[0];
  return { title, w: ii?.width, h: ii?.height, url: ii?.thumburl || ii?.url, mime: ii?.mime };
}

const files = [
  "File:Fire department connection.jpg",
  "File:Siamese connection.jpg",
  "File:FDC.jpg",
  "File:Fire Department Connection.jpg",
  "File:Standpipe siamese.jpg",
  "File:Hohlstrahlrohr.jpg",
  "File:Feuerwehr Strahlrohr.jpg",
  "File:Standrohrschlüssel.jpg",
  "File:Hydrantenschlüssel.jpg",
  "File:Eckventil.jpg",
  "File:Feuerlöschventil.jpg",
  "File:Extinguisher stand.jpg",
  "File:Fire extinguisher stand.jpg",
  "File:Portaextintor.jpg",
  "File:Safety fence.jpg",
  "File:Orange construction fence.jpg",
  "File:Plastic barrier fence.jpg",
  "File:Red hardhat.jpg",
  "File:White hard hat construction.jpg",
  "File:Casco blanco.jpg",
  "File:Casco rojo.jpg",
  "File:Armbinde.jpg",
  "File:Brass fire hose nozzle.jpg",
];
  "File:Warnweste gelb.jpg",
  "File:High-visibility vest.jpg",
  "File:Gilet jaune (bodywarmer) Croix-Rouge de Belgique - Secouriste (avant).png",
  "File:Orange traffic cone.jpg",
  "File:Verkehrsleitkegel.jpg",
  "File:Pylon orange.jpg",
  "File:Leitbake.jpg",
  "File:Absperrpfosten.jpg",
  "File:Warnleuchte.jpg",
  "File:Baustellenleuchte.jpg",
  "File:Absperrband.jpg",
  "File:Flatterband.jpg",
  "File:Schutzhelm gelb.jpg",
  "File:Bauhelm.jpg",
  "File:Schutzhelm.jpg",
  "File:Feuerlöschschrank.jpg",
  "File:Hydrantenschrank.jpg",
  "File:Wandhydrant.jpg",
  "File:Strahlrohr.jpg",
  "File:B-Sammelstück.jpg",
  "File:Sammelstück.jpg",
  "File:Verbandskasten.jpg",
  "File:Rauchmelder Kidde.jpg",
  "File:Rauchmelder.jpg",
  "File:Notleuchte.jpg",
  "File:Rettungsbrett.jpg",
  "File:Spineboard.jpg",
  "File:Arbeitshandschuhe.jpg",
  "File:Schnittschutzhandschuhe.jpg",
  "File:Warnweste orange.jpg",
  "File:Warnweste.jpg",
  "File:Feuerwehrschlauch gerollt.jpg",
  "File:Standrohr B.jpg",
  "File:Überflurhydrant.jpg",
  "File:Wet floor - English and Chinese.jpg",
  "File:Caution wet floor sign.jpg",
  "File:Safety gloves nitrile.jpg",
  "File:Hard hat white.jpg",
  "File:White hard hat.jpg",
  "File:Red hard hat.jpg",
];

const results = [];
for (const f of files) {
  results.push(await wikiFile(f));
  await new Promise((r) => setTimeout(r, 400));
}
console.log(JSON.stringify(results, null, 2));

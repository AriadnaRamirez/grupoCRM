import { mkdirSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const dir = "assets/img/catalog/_src";
mkdirSync(dir, { recursive: true });

const ua = "CRMCatalogBot/1.0 (Grupo CRM catalog; contact crm.extintores@gmail.com)";

const sources = {
  "vest-yellow.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Warnweste_gelb.jpg/960px-Warnweste_gelb.jpg",
  "vest-orange.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Warnweste_orange.jpg/960px-Warnweste_orange.jpg",
  "vest-redcross.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Gilet_jaune_%28bodywarmer%29_Croix-Rouge_de_Belgique_-_Secouriste_%28avant%29.png/800px-Gilet_jaune_%28bodywarmer%29_Croix-Rouge_de_Belgique_-_Secouriste_%28avant%29.png",
  "cone-3d.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Traffic_cone_construction_orange_white_front.png/960px-Traffic_cone_construction_orange_white_front.png",
  "cone-photo.jpg": "https://live.staticflickr.com/9/16485501_72fea54e6f_b.jpg",
  "wetfloor.jpg": "https://live.staticflickr.com/65535/47970966596_86905bbd9c_b.jpg",
  "wetfloor2.jpg": "https://live.staticflickr.com/858/42784271425_4193cfc3e6_b.jpg",
  "tape-yellow.jpg": "https://live.staticflickr.com/6/76138988_28394182ec_b.jpg",
  "tape-yellow2.jpg": "https://live.staticflickr.com/3259/5864824829_082f87f164_b.jpg",
  "tape-red.jpg": "https://live.staticflickr.com/4055/4686502774_edd4d15a68_b.jpg",
  "hose-cab.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Fire_hose_cabinet_on_wall.jpg/960px-Fire_hose_cabinet_on_wall.jpg",
  "hose.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Brandslange.jpg/800px-Brandslange.jpg",
  "hose2.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Fire_hose.jpg/960px-Fire_hose.jpg",
  "firstaid.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/British_Red_Cross_First_Aid_Kits.jpg/1280px-British_Red_Cross_First_Aid_Kits.jpg",
  "firstaid-box.jpg": "https://live.staticflickr.com/7398/9560183521_d1ec50d7ff_b.jpg",
  "helm.jpg": "https://upload.wikimedia.org/wikipedia/commons/8/88/Schutzhelm.jpg",
  "smoke.jpg": "https://live.staticflickr.com/7337/13997511714_205aeec0a0_b.jpg",
  "smoke2.jpg": "https://upload.wikimedia.org/wikipedia/commons/6/63/Smoke_detector.jpg",
  "spine.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Spineboard.jpg/800px-Spineboard.jpg",
  "collar.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Cervical_collar.jpg/800px-Cervical_collar.jpg",
  "glove.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Level_3A_glove.jpg/800px-Level_3A_glove.jpg",
  "e-light.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Sure-Lites_emergency_exit_light_2.jpg/960px-Sure-Lites_emergency_exit_light_2.jpg",
  "e-light2.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Sure-Lites_emergency_exit_light_1.jpg/960px-Sure-Lites_emergency_exit_light_1.jpg",
  "glove-cut.jpg": "https://live.staticflickr.com/3593/3551533456_9a43cc543c_b.jpg",
  "valve.jpg": "https://live.staticflickr.com/3578/3838379012_a32eeb857e_b.jpg",
};

async function get(name, url) {
  const dest = join(dir, name);
  if (existsSync(dest)) {
    console.log("have", name);
    return;
  }
  const res = await fetch(url, { headers: { "User-Agent": ua } });
  if (!res.ok) {
    console.log("FAIL", name, res.status, url);
    return;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buf);
  console.log("ok", name, buf.length);
}

for (const [name, url] of Object.entries(sources)) {
  await get(name, url);
  await new Promise((r) => setTimeout(r, 1200));
}

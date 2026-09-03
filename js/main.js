import { rebaseDocument } from "./base.js";
import { mountShell, renderHome, renderProductos, renderProducto, renderServicios, renderNosotros, renderGaleria, renderHook, bindContact, bindMotion, bindErrorReturn } from "./ui.js?v=mosaic-fit";
import { applySeo } from "./seo.js";

rebaseDocument();

function safe(fn) {
  try {
    fn();
  } catch (err) {
    console.error(err);
    document.documentElement.classList.add("is-boot-error");
  }
}

const page = document.body.dataset.page;
safe(() => {
  mountShell(page);
  rebaseDocument();
});

if (page === "inicio") safe(renderHome);
else if (page === "productos") safe(renderProductos);
else if (page === "producto") safe(renderProducto);
else if (page === "servicios") safe(renderServicios);
else if (page === "nosotros") safe(renderNosotros);
else if (page === "galeria") safe(renderGaleria);
else if (page === "contacto") {
  safe(bindContact);
  safe(renderHook);
} else if (page === "blog" || page === "articulo") {
  safe(renderHook);
} else if (page === "error") safe(bindErrorReturn);

safe(() => applySeo(page));
safe(bindMotion);
document.querySelectorAll("[aria-busy='true']").forEach((el) => {
  if (el.querySelector(".skel, .skel-card, .skel-tile, .skel-dept, .skel-ficha, .header-skel")) return;
  el.setAttribute("aria-busy", "false");
});
requestAnimationFrame(() => {
  document.documentElement.classList.add("is-booted");
});

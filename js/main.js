import { mountShell, renderHome, renderProductos, renderProducto, renderServicios, renderNosotros, renderGaleria, renderHook, bindContact, bindMotion, bindErrorReturn } from "./ui.js";
import { applySeo } from "./seo.js";

function safe(fn) {
  try {
    fn();
  } catch (err) {
    console.error(err);
    document.documentElement.classList.add("is-boot-error");
  }
}

const page = document.body.dataset.page;
safe(() => mountShell(page));

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
document.documentElement.classList.add("is-booted");

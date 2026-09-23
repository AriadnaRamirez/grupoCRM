import fs from "node:fs";

const shell = fs.readFileSync("aviso-privacidad.html", "utf8");

function makePage({ file, title, description, canonicalPath, bodyPage, h1, kicker, content }) {
  let html = shell;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = html.replace(/name="description" content="[^"]*"/g, `name="description" content="${description}"`);
  html = html.replace(/property="og:title" content="[^"]*"/, `property="og:title" content="${title}"`);
  html = html.replace(/property="og:description" content="[^"]*"/g, `property="og:description" content="${description}"`);
  html = html.replace(
    /property="og:url" content="[^"]*"/,
    `property="og:url" content="https://www.crmextintores.com.mx${canonicalPath}"`
  );
  html = html.replace(/name="twitter:title" content="[^"]*"/, `name="twitter:title" content="${title}"`);
  html = html.replace(/name="twitter:description" content="[^"]*"/g, `name="twitter:description" content="${description}"`);
  html = html.replace(
    /rel="canonical" href="[^"]*"/,
    `rel="canonical" href="https://www.crmextintores.com.mx${canonicalPath}"`
  );
  html = html.replace(/data-page="privacidad"/, `data-page="${bodyPage}"`);
  const main = `<main id="contenido">
  <article class="section legal-page">
    <div class="wrap">
      <p class="kicker">${kicker}</p>
      <h1>${h1}</h1>
      <hr class="rule rule-left">
${content}
    </div>
  </article>
  </main>`;
  html = html.replace(/<main id="contenido">[\s\S]*?<\/main>/, main);
  if (!html.includes("politica-de-servicio")) {
    html = html.replace(
      '<a href="/aviso-privacidad">Aviso de privacidad</a>',
      `<a href="/aviso-privacidad">Aviso de privacidad</a>
    <a href="/politica-de-servicio">Política de servicio</a>
    <a href="/fuentes-y-normatividad">Fuentes y normatividad</a>`
    );
  }
  fs.writeFileSync(file, html);
  console.log("wrote", file);
}

makePage({
  file: "politica-de-servicio.html",
  title: "Política de servicio y cotización | Grupo CRM Extintores",
  description:
    "Cómo cotizamos, visitamos y documentamos el servicio de extintores en CDMX y Estado de México. Horario, pagos y alcance claros.",
  canonicalPath: "/politica-de-servicio",
  bodyPage: "politica-servicio",
  kicker: "Políticas",
  h1: "Política de servicio y cotización",
  content: `      <p class="muted">Última actualización: 22 de septiembre de 2026.</p>

      <h2>Alcance</h2>
      <p>Esta política describe cómo Grupo CRM Extintores cotiza, visita y documenta la venta, recarga, mantenimiento e instalación de extintores y equipo relacionado en la Ciudad de México y el Estado de México. Complementa el <a href="/aviso-privacidad">aviso de privacidad</a> y las <a href="/fuentes-y-normatividad">fuentes técnicas</a>.</p>

      <h2>Cotización</h2>
      <ul>
        <li>Puede pedir cotización por WhatsApp, teléfono o el <a href="/contacto">formulario de contacto</a>.</li>
        <li>Le pedimos datos del inmueble, tipo de equipo y, si aplica, fotos de etiquetas o puntos de incendio para cotizar con precisión.</li>
        <li>La cotización no obliga a comprar. Los precios y plazos se confirman por escrito (WhatsApp o correo) antes de ejecutar el servicio.</li>
      </ul>

      <h2>Primera visita sin costo</h2>
      <p>La primera visita o levantamiento de revisión en sitio no tiene costo. Sirve para indicarle qué requiere atención y qué podemos hacer. El servicio de recarga, venta o instalación se cotiza por separado según lo encontrado.</p>

      <h2>Horario y cobertura</h2>
      <p>Atención de lunes a viernes, de 9:00 a 18:00. Oficina en Chamixto 131, Col. Loma del Padre, Alcaldía Cuajimalpa, CDMX. Cobertura de servicio: Ciudad de México y Estado de México. Mensajes fuera de horario se responden el siguiente día hábil.</p>

      <h2>Pagos</h2>
      <p>Aceptamos pagos con tarjeta de crédito y meses sin intereses, además de los medios que le indiquemos al confirmar la cotización. No solicitamos datos de tarjeta en este sitio web.</p>

      <h2>Documentación del servicio</h2>
      <p>En recarga y mantenimiento alineados a la NOM-154-SCFI-2005 procuramos dejar evidencia útil para inspección: etiqueta legible y constancia del trabajo realizado. El detalle del proceso y las fuentes oficiales están en <a href="/fuentes-y-normatividad">Fuentes y normatividad</a> y en la guía <a href="/blog/nom-154-scfi-2005">NOM-154-SCFI-2005</a>.</p>

      <h2>Lo que no incluye una cotización genérica</h2>
      <ul>
        <li>Obra civil, remodelaciones o permisos municipales ajenos al alcance acordado.</li>
        <li>Garantías de terceros sobre equipos de otras marcas fuera de lo que indique el fabricante o la cotización.</li>
        <li>Resultados de una inspección de Protección Civil: nosotros preparamos el equipo y la evidencia; la autoridad decide.</li>
      </ul>

      <h2>Contacto responsable</h2>
      <p>Grupo CRM Extintores · <a href="mailto:crm.extintores@gmail.com">crm.extintores@gmail.com</a> · <a href="tel:5667481489">56 6748 1489</a> · <a href="tel:5659474605">56 5947 4605</a>.</p>

      <p><a class="btn btn-ink" href="/contacto"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Pedir cotización</a></p>`,
});

makePage({
  file: "fuentes-y-normatividad.html",
  title: "Fuentes y normatividad | Grupo CRM Extintores",
  description:
    "Enlaces oficiales a la NOM-154-SCFI-2005, NOM-002-STPS-2010 y MCD. Fuentes técnicas que respaldan nuestro servicio de extintores.",
  canonicalPath: "/fuentes-y-normatividad",
  bodyPage: "fuentes-normatividad",
  kicker: "Transparencia",
  h1: "Fuentes y normatividad",
  content: `      <p class="muted">Última actualización: 22 de septiembre de 2026.</p>

      <p>Publicamos aquí las fuentes oficiales y de terceros que citamos en el sitio. Esta página no sustituye el texto íntegro de las normas ni un dictamen legal; es una guía de lectura para clientes y auditores.</p>

      <h2>NOM-154-SCFI-2005</h2>
      <p>Norma Oficial Mexicana sobre el servicio de mantenimiento y recarga de extintores (Secretaría de Economía).</p>
      <ul>
        <li><a href="https://www.dof.gob.mx/nota_detalle.php?codigo=2103192&amp;fecha=26/12/2005" target="_blank" rel="noopener noreferrer">Publicación en el Diario Oficial de la Federación (26/12/2005)</a></li>
        <li><a href="https://platiica.economia.gob.mx/normalizacion/nom-154-scfi-2005/" target="_blank" rel="noopener noreferrer">Ficha en el catálogo de normalización de Economía</a></li>
        <li><a href="https://platiica.economia.gob.mx/wp-content/uploads/sites/2/PDF_Normas_Publicas/154scfi05mod.pdf" target="_blank" rel="noopener noreferrer">Texto con modificación publicada el 12/07/2010 (PDF, Economía)</a></li>
        <li><a href="/blog/nom-154-scfi-2005">Nuestra guía práctica: qué pedir a quien recarga</a></li>
      </ul>

      <h2>NOM-002-STPS-2010</h2>
      <p>Condiciones de seguridad: prevención y protección contra incendios en los centros de trabajo (STPS). Complementa, no sustituye, la NOM-154 del lado del servicio al extintor.</p>
      <ul>
        <li><a href="https://www.dof.gob.mx/nota_detalle.php?codigo=5170410&amp;fecha=09/12/2010" target="_blank" rel="noopener noreferrer">Publicación en el Diario Oficial de la Federación (09/12/2010)</a></li>
        <li><a href="https://platiica.economia.gob.mx/normalizacion/nom-002-stps-2010/" target="_blank" rel="noopener noreferrer">Ficha en el catálogo de normalización</a></li>
        <li><a href="https://www.dof.gob.mx/normasOficiales/4228/stps/stps.htm" target="_blank" rel="noopener noreferrer">Texto completo en el DOF (normas oficiales)</a></li>
      </ul>

      <h2>MCD (Mexicana de Conformidad y Dictaminación)</h2>
      <p>Unidad de verificación referida en nuestro servicio de mantenimiento y recarga alineado a la NOM-154-SCFI-2005.</p>
      <ul>
        <li><a href="http://www.mcdmx.com/site/Casa.html" target="_blank" rel="noopener noreferrer">Sitio de MCD</a></li>
      </ul>

      <h2>Validación de clientes en la página</h2>
      <ul>
        <li><a href="https://www.facebook.com/people/GRUPO-CRM-Extintores/100075736857787/?sk=reviews" target="_blank" rel="noopener noreferrer">Reseñas públicas en Facebook</a> (recomendado por el 100&nbsp;% · 11 opiniones al momento de publicar esta página)</li>
        <li><a href="/#resenas">Bloque de opiniones en el inicio</a></li>
        <li><a href="/galeria">Galería de trabajos reales</a></li>
      </ul>

      <h2>Políticas del sitio</h2>
      <ul>
        <li><a href="/aviso-privacidad">Aviso de privacidad</a></li>
        <li><a href="/politica-de-servicio">Política de servicio y cotización</a></li>
        <li><a href="/nosotros#validacion">Validación externa en Nosotros</a></li>
      </ul>

      <p><a class="btn btn-ink" href="/contacto"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Pedir cotización</a></p>`,
});

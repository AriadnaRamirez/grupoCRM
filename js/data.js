import { withBase } from "./base.js";

export const company = {
  name: "Grupo CRM Extintores",
  tagline: "Extintores y equipos de seguridad",
  slogan: "Protección, prevención y respuesta.",
  about:
    "Lo acompañamos con venta, recarga e instalación en CDMX y Estado de México. MCD (Mexicana de Conformidad y Dictaminación), cumplimiento de la norma NOM-154-SCFI-2005.",
  mcd: "Mexicana de Conformidad y Dictaminación",
  mcdUrl: "http://www.mcdmx.com/site/Casa.html",
  nom: "NOM-154-SCFI-2005",
  nomUrl: "https://www.dof.gob.mx/nota_detalle.php?codigo=2103192&fecha=26/12/2005",
  nomCatalogUrl: "https://platiica.economia.gob.mx/normalizacion/nom-154-scfi-2005/",
  nomModPdfUrl: "https://platiica.economia.gob.mx/wp-content/uploads/sites/2/PDF_Normas_Publicas/154scfi05mod.pdf",
  nom002: "NOM-002-STPS-2010",
  nom002Url: "https://www.dof.gob.mx/nota_detalle.php?codigo=5170410&fecha=09/12/2010",
  phone: "56 6748 1489",
  phoneTel: "5667481489",
  phoneAlt: "56 5947 4605",
  phoneAltTel: "5659474605",
  whatsapp: "525667481489",
  whatsappShow: "56 6748 1489",
  whatsappAlt: "525659474605",
  whatsappAltShow: "56 5947 4605",
  email: "crm.extintores@gmail.com",
  facebook: "Grupo CRM Extintores",
  facebookUrl: "https://www.facebook.com/people/GRUPO-CRM-Extintores/100075736857787/",
  facebookReviewsUrl:
    "https://www.facebook.com/people/GRUPO-CRM-Extintores/100075736857787/?sk=reviews",
  facebookRecommend: "100 %",
  facebookReviewCount: 11,
  instagram: "@grupo_crm_extintores",
  instagramUrl: "https://www.instagram.com/grupo_crm_extintores/",
  hours: "Lunes a viernes 9:00–18:00",
  coverage: "Ciudad de México y Estado de México",
  /** GA4 Measurement ID (G-…). Vacío = no cargar gtag (evita inventar tracking). */
  gaId: "",
  location: "Atención en Ciudad de México y Estado de México",
  address: "Chamixto 131, Col. Loma del Padre, Alcaldía Cuajimalpa, CDMX",
  streetAddress: "Chamixto 131, Col. Loma del Padre",
  addressLocality: "Cuajimalpa",
  addressRegion: "CDMX",
  postalCode: "05020",
  addressCountry: "MX",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Chamixto+131+Col.+Loma+del+Padre+Cuajimalpa+Ciudad+de+M%C3%A9xico",
  website: "www.crmextintores.com.mx",
  websiteUrl: "https://www.crmextintores.com.mx",
  payments: "Aceptamos pagos con tarjeta de crédito y meses sin intereses.",
  hook: "Agende su visita de revisión, sin costo.",
  pitch: "Cumpla con Protección Civil y evite multas.",
  mision:
    "Abastecer extintores y equipo contra incendio de alta calidad, que satisfagan las necesidades de nuestros clientes, mientras fomentamos la seguridad, la integridad y la capacitación constante para nuestros clientes y colaboradores.",
  vision:
    "Ser la empresa líder en el mercado, reconocida por nuestra excelencia en el servicio y compromiso en el abastecimiento de extintores y de equipo contra incendios.",
  valores: ["Confianza", "Seguridad", "Calidad", "Lealtad", "Trabajo en equipo"],
};

/** Public service roles — accountability without inventing personal bios. */
export const serviceRoles = [
  {
    title: "Atención y cotización",
    text: "La misma línea de la empresa responde WhatsApp, teléfono y formulario. Le orientamos sobre el equipo, le cotizamos y agendamos la visita.",
  },
  {
    title: "Servicio técnico en sitio",
    text: "Quien va a su inmueble revisa presión, sello, etiqueta y puntos de incendio. Le deja claro qué se recarga, qué se sustituye y qué ya no conviene reparar.",
  },
  {
    title: "Norma y evidencia",
    text: "El servicio de recarga se alinea a la NOM-154-SCFI-2005, con verificación de MCD cuando corresponde al proceso. Usted se lleva etiqueta y constancia útiles en inspección.",
  },
];

export const SITE = {
  origin: "https://www.crmextintores.com.mx",
  locale: "es_MX",
  themeColor: "#D51A32",
  ogImage: "/assets/img/logo-crm.png",
  /** Visible freshness for main marketing pages (not legal boilerplate alone). */
  contentPublished: "2026-08-24",
  contentModified: "2026-09-22",
};

export const pageSeo = {
  inicio: {
    path: "/",
    title: "Extintores en CDMX y Estado de México | Grupo CRM Extintores",
    description:
      "Grupo CRM Extintores: venta, recarga e instalación de extintores en CDMX y Estado de México. Primera visita sin costo. WhatsApp 56 6748 1489.",
  },
  nosotros: {
    path: "/nosotros",
    title: "Nosotros | Grupo CRM Extintores",
    description:
      "Empresa 100% mexicana. Lo acompañamos para cumplir con Protección Civil: venta, recarga e instalación en CDMX y Estado de México. Con gusto lo atendemos.",
  },
  productos: {
    path: "/productos",
    title: "Catálogo de extintores y equipo contra incendio | Grupo CRM",
    description:
      "Más de 50 equipos: extintores, chalecos, señalamientos, gabinetes, botiquines y equipo de protección. Cotice con Grupo CRM en CDMX y Estado de México.",
  },
  producto: {
    path: "/producto",
    title: "Producto | Grupo CRM Extintores",
    description:
      "Vea este equipo y cotícelo por WhatsApp con Grupo CRM Extintores en CDMX y Estado de México.",
  },
  galeria: {
    path: "/galeria",
    title: "Galería de instalaciones | Grupo CRM Extintores",
    description:
      "Vea cómo quedan extintores e instalaciones en empresas de CDMX y Estado de México. ¿Quiere el mismo resultado? Cotice con Grupo CRM.",
  },
  contacto: {
    path: "/contacto",
    title: "Contacto y cotización por WhatsApp | Grupo CRM Extintores",
    description:
      "Pida su cotización por WhatsApp 56 6748 1489. Con gusto lo atendemos y la primera visita de revisión es sin costo. Chamixto 131, Cuajimalpa, CDMX.",
  },
  servicios: {
    path: "/servicios",
    title: "Venta, recarga e instalación de extintores | Grupo CRM",
    description:
      "Venta, recarga e instalación de extintores para que su empresa cumpla. Primera visita sin costo. WhatsApp 56 6748 1489.",
  },
  mapa: {
    path: "/mapa-sitio",
    title: "Mapa de sitio | Grupo CRM Extintores",
    description:
      "Encuentre equipos, servicios y contacto para cotizar extintores con Grupo CRM en CDMX y Estado de México.",
  },
  privacidad: {
    path: "/aviso-privacidad",
    title: "Aviso de privacidad | Grupo CRM Extintores",
    description:
      "Aviso de privacidad de Grupo CRM Extintores. Cómo tratamos sus datos de contacto para cotizar extintores en CDMX y Estado de México.",
  },
  "politica-servicio": {
    path: "/politica-de-servicio",
    title: "Política de servicio y cotización | Grupo CRM Extintores",
    description:
      "Cómo cotizamos, visitamos y documentamos el servicio de extintores en CDMX y Estado de México. Horario, pagos y alcance claros.",
  },
  "fuentes-normatividad": {
    path: "/fuentes-y-normatividad",
    title: "Fuentes y normatividad | Grupo CRM Extintores",
    description:
      "Enlaces oficiales a la NOM-154-SCFI-2005, NOM-002-STPS-2010 y MCD. Fuentes técnicas que respaldan nuestro servicio de extintores.",
  },
  caso: {
    path: "/caso-agencia-automotriz",
    title: "Caso: instalación en agencia automotriz | Grupo CRM",
    description:
      "Instalación de extintores PQS y CO₂ en agencia automotriz (showroom, acceso y taller). Trabajo documentado en la galería de Grupo CRM.",
  },
  blog: {
    path: "/blog",
    title: "Blog de extintores y equipo contra incendios | Grupo CRM",
    description:
      "Guías de extintores en CDMX y Estado de México: instalación, tipos de fuego, recarga NOM-154-SCFI-2005 y equipo de protección. Cotice con Grupo CRM.",
  },
  articulo: {
    path: "/blog",
    title: "Guía | Grupo CRM Extintores",
    description:
      "Guías prácticas de extintores y equipo contra incendios para empresas en CDMX y Estado de México.",
  },
  error: {
    path: "/404",
    title: "Página no encontrada | Grupo CRM Extintores",
    description:
      "Esta página no existe. Vuelva al inicio o cotice extintores por WhatsApp con Grupo CRM Extintores en CDMX.",
    robots: "noindex, nofollow",
  },
  zonas: {
    path: "/zonas",
    title: "Extintores en CDMX y Estado de México | Grupo CRM",
    description:
      "Venta, recarga e instalación de extintores en alcaldías de CDMX y municipios del Estado de México. Cotice con Grupo CRM Extintores.",
  },
};

/** Cobertura local SEO: alcaldías CDMX + municipios Edo. Mex. */
function zona(slug, name, region, nearby, focus) {
  return { slug, name, region, nearby, focus };
}

export const zonas = [
  // Ciudad de México
  zona("alvaro-obregon", "Álvaro Obregón", "cdmx", ["cuajimalpa", "miguel-hidalgo", "huixquilucan", "benito-juarez"], "oficinas, condominios y comercios en San Ángel, Observatorio y Contadero"),
  zona("azcapotzalco", "Azcapotzalco", "cdmx", ["miguel-hidalgo", "tlalnepantla", "naucalpan", "gustavo-a-madero"], "industrias, bodegas y colonias con alta actividad comercial"),
  zona("benito-juarez", "Benito Juárez", "cdmx", ["cuauhtemoc", "coyoacan", "alvaro-obregon", "iztacalco"], "oficinas, plazas y edificios corporativos en Del Valle y Nápoles"),
  zona("coyoacan", "Coyoacán", "cdmx", ["benito-juarez", "tlalpan", "iztapalapa", "xochimilco"], "universidades, clínicas, restaurantes y condominios"),
  zona(
    "cuajimalpa",
    "Cuajimalpa",
    "cdmx",
    ["alvaro-obregon", "huixquilucan", "miguel-hidalgo", "magdalena-contreras"],
    "oficina en Loma del Padre y servicio en Contadero, Santa Fe, José María Castorena, Memetla, San Mateo Tlaltenango y corporativos de la alcaldía"
  ),
  zona("cuauhtemoc", "Cuauhtémoc", "cdmx", ["miguel-hidalgo", "benito-juarez", "venustiano-carranza", "azcapotzalco"], "centro histórico, hoteles, oficinas y locales comerciales"),
  zona("gustavo-a-madero", "Gustavo A. Madero", "cdmx", ["ecatepec", "tlalnepantla", "venustiano-carranza", "azcapotzalco"], "industrias, escuelas y comercios del norte de la ciudad"),
  zona("iztacalco", "Iztacalco", "cdmx", ["iztapalapa", "nezahualcoyotl", "venustiano-carranza", "benito-juarez"], "talleres, bodegas y condominios con requisitos de Protección Civil"),
  zona("iztapalapa", "Iztapalapa", "cdmx", ["iztacalco", "nezahualcoyotl", "chalco", "tlahuac"], "empresas, plazas comerciales y centros educativos"),
  zona("magdalena-contreras", "Magdalena Contreras", "cdmx", ["alvaro-obregon", "tlalpan", "cuajimalpa", "coyoacan"], "condominios, escuelas y locales en zona residencial"),
  zona("miguel-hidalgo", "Miguel Hidalgo", "cdmx", ["cuauhtemoc", "naucalpan", "cuajimalpa", "alvaro-obregon"], "Polanco, Tacubaya y corporativos con alta exigencia normativa"),
  zona("milpa-alta", "Milpa Alta", "cdmx", ["xochimilco", "tlahuac", "tlalpan", "chalco"], "comercios, escuelas y establecimientos del suroriente"),
  zona("tlahuac", "Tláhuac", "cdmx", ["iztapalapa", "xochimilco", "milpa-alta", "chalco"], "locales, escuelas y empresas de la zona oriente-sur"),
  zona("tlalpan", "Tlalpan", "cdmx", ["coyoacan", "magdalena-contreras", "xochimilco", "huixquilucan"], "hospitales, universidades, condominios e industria ligera"),
  zona("venustiano-carranza", "Venustiano Carranza", "cdmx", ["cuauhtemoc", "iztacalco", "gustavo-a-madero", "nezahualcoyotl"], "aeropuerto, comercios y oficinas del oriente capitalino"),
  zona("xochimilco", "Xochimilco", "cdmx", ["tlalpan", "tlahuac", "milpa-alta", "coyoacan"], "turismo, comercios, escuelas y establecimientos locales"),
  // Estado de México
  zona("atizapan", "Atizapán de Zaragoza", "edomex", ["naucalpan", "tlalnepantla", "nicolas-romero", "cuautitlan-izcalli"], "residenciales, oficinas y comercios del norte poniente"),
  zona("chalco", "Chalco", "edomex", ["valle-de-chalco", "ixtapaluca", "iztapalapa", "tlahuac"], "comercios, escuelas y empresas del oriente del Valle"),
  zona("chicoloapan", "Chicoloapan", "edomex", ["texcoco", "la-paz", "ixtapaluca", "nezahualcoyotl"], "locales, condominios y establecimientos del oriente"),
  zona("chimalhuacan", "Chimalhuacán", "edomex", ["nezahualcoyotl", "la-paz", "texcoco", "iztapalapa"], "comercios, escuelas y puntos de venta del oriente"),
  zona("coacalco", "Coacalco", "edomex", ["ecatepec", "tultitlan", "tecamac", "tlalnepantla"], "plazas, condominios y empresas del norte"),
  zona("cuautitlan", "Cuautitlán", "edomex", ["cuautitlan-izcalli", "tultitlan", "tepotzotlan", "coacalco"], "industria, comercios y centros de trabajo del norte"),
  zona("cuautitlan-izcalli", "Cuautitlán Izcalli", "edomex", ["cuautitlan", "atizapan", "tultitlan", "tepotzotlan"], "parques industriales, oficinas y residenciales"),
  zona("ecatepec", "Ecatepec", "edomex", ["gustavo-a-madero", "coacalco", "tecamac", "tlalnepantla"], "empresas, plazas y condominios del norte oriente"),
  zona("huixquilucan", "Huixquilucan", "edomex", ["cuajimalpa", "naucalpan", "alvaro-obregon", "miguel-hidalgo"], "corporativos, residenciales e Interlomas"),
  zona("ixtapaluca", "Ixtapaluca", "edomex", ["chalco", "la-paz", "chicoloapan", "valle-de-chalco"], "comercios, escuelas y empresas del oriente"),
  zona("la-paz", "La Paz", "edomex", ["nezahualcoyotl", "chimalhuacan", "ixtapaluca", "chicoloapan"], "locales, condominios y puntos comerciales"),
  zona("lerma", "Lerma", "edomex", ["toluca", "metepec", "huixquilucan", "zinacantepec"], "industria, bodegas y empresas del corredor Toluca"),
  zona("metepec", "Metepec", "edomex", ["toluca", "lerma", "zinacantepec", "huixquilucan"], "oficinas, comercios y residenciales de la zona Toluca"),
  zona("naucalpan", "Naucalpan", "edomex", ["miguel-hidalgo", "azcapotzalco", "atizapan", "huixquilucan"], "industria, oficinas y comercios del poniente"),
  zona("nezahualcoyotl", "Nezahualcóyotl", "edomex", ["iztapalapa", "iztacalco", "chimalhuacan", "la-paz"], "comercios, escuelas y empresas del oriente metropolitano"),
  zona("nicolas-romero", "Nicolás Romero", "edomex", ["atizapan", "cuautitlan-izcalli", "tlalnepantla", "naucalpan"], "comercios, escuelas y establecimientos del norte poniente"),
  zona("tecamac", "Tecámac", "edomex", ["ecatepec", "coacalco", "zumpango", "tultitlan"], "desarrollos habitacionales, comercios y empresas"),
  zona("tepotzotlan", "Tepotzotlán", "edomex", ["cuautitlan-izcalli", "cuautitlan", "tultitlan", "zumpango"], "industria, turismo y centros de trabajo del norte"),
  zona("texcoco", "Texcoco", "edomex", ["chicoloapan", "chimalhuacan", "nezahualcoyotl", "ecatepec"], "comercios, universidades y empresas del oriente"),
  zona("tlalnepantla", "Tlalnepantla", "edomex", ["azcapotzalco", "naucalpan", "atizapan", "ecatepec"], "parques industriales, oficinas y comercios del norte"),
  zona("toluca", "Toluca", "edomex", ["metepec", "lerma", "zinacantepec", "huixquilucan"], "capital del Estado de México: oficinas, industria y comercios"),
  zona("tultitlan", "Tultitlán", "edomex", ["cuautitlan", "coacalco", "tlalnepantla", "cuautitlan-izcalli"], "industria, bodegas y comercios del norte"),
  zona("valle-de-chalco", "Valle de Chalco", "edomex", ["chalco", "ixtapaluca", "iztapalapa", "tlahuac"], "comercios, escuelas y establecimientos locales"),
  zona("zinacantepec", "Zinacantepec", "edomex", ["toluca", "metepec", "lerma", "huixquilucan"], "comercios, escuelas y empresas de la zona Toluca"),
  zona("zumpango", "Zumpango", "edomex", ["tecamac", "tepotzotlan", "cuautitlan", "ecatepec"], "comercios, escuelas y empresas del norte del Estado"),
];

export const zonasCdmx = zonas.filter((z) => z.region === "cdmx");
export const zonasEdomex = zonas.filter((z) => z.region === "edomex");

export function zonaBySlug(slug) {
  return zonas.find((z) => z.slug === slug);
}

export function zonaRegionLabel(zona) {
  return zona?.region === "edomex" ? "Estado de México" : "Ciudad de México";
}

export function zonaTypeLabel(zona) {
  return zona?.region === "edomex" ? "Municipio" : "Alcaldía";
}

/** Canonical local-SEO URL for a coverage area (service area, not a branch). */
export function extintoresPath(zonaOrSlug) {
  const slug = typeof zonaOrSlug === "string" ? zonaOrSlug : zonaOrSlug?.slug;
  return slug ? `/extintores-${slug}` : "/extintores-cdmx";
}

export function extintoresHubPath(region) {
  return region === "edomex" ? "/extintores-estado-de-mexico" : "/extintores-cdmx";
}

/**
 * Service landing pages for local SEO (confirmed against company.services).
 * Paths are clean URLs without query params.
 */
export const seoServicePages = [
  {
    slug: "venta-extintores",
    path: "/venta-extintores",
    title: "Venta de Extintores en CDMX y Estado de México | Grupo CRM",
    h1: "Venta de Extintores",
    description:
      "Venta de extintores certificados en CDMX y Estado de México. Asesoría para elegir el equipo adecuado y primera visita de revisión sin costo. Cotice con Grupo CRM Extintores.",
    kicker: "Servicio",
    lead:
      "Grupo CRM Extintores vende extintores nuevos y certificados para empresas, comercios, condominios y oficinas en la Ciudad de México y el Estado de México.",
    body: [
      "Le ayudamos a elegir el tipo y la capacidad correctos según el riesgo de su inmueble: polvo químico seco (PQS), CO₂, tipo K u otros agentes, de acuerdo con lo que requiera Protección Civil.",
      "La venta puede acompañarse de instalación en sitio, señalamientos y una revisión inicial para dejar su empresa lista ante inspección. La primera visita de revisión no tiene costo.",
    ],
    process: [
      "Cuéntenos el giro y la ubicación (alcaldía o municipio).",
      "Le orientamos sobre el equipo adecuado y le enviamos cotización.",
      "Coordinamos entrega o instalación en su inmueble.",
    ],
    related: ["recarga-extintores", "instalacion-extintores", "mantenimiento-extintores", "senalizacion"],
  },
  {
    slug: "recarga-extintores",
    path: "/recarga-extintores",
    title: "Recarga de Extintores en CDMX y Estado de México | CRM",
    h1: "Recarga de Extintores",
    description:
      "Recarga de extintores en CDMX y Estado de México bajo NOM-154-SCFI-2005. Mantenemos sus equipos listos para inspección. Cotice con Grupo CRM Extintores.",
    kicker: "Servicio",
    lead:
      "Recargamos extintores para que queden operativos y con evidencia útil para inspección, conforme a la NOM-154-SCFI-2005 y con verificación de MCD cuando corresponda al proceso de servicio.",
    body: [
      "Si sus extintores están vencidos, descargados o con sello roto, podemos evaluarlos y cotizar la recarga. También le indicamos si conviene sustituir alguna unidad.",
      "Atendemos empresas e inmuebles en CDMX y Estado de México desde nuestra base en Cuajimalpa. La primera visita de revisión es sin costo.",
    ],
    process: [
      "Agende revisión o envíe fotos y datos de sus equipos por WhatsApp.",
      "Le confirmamos qué se puede recargar y qué conviene reemplazar.",
      "Realizamos el servicio y le entregamos el equipo listo, con la documentación del proceso.",
    ],
    related: ["mantenimiento-extintores", "venta-extintores", "instalacion-extintores"],
  },
  {
    slug: "mantenimiento-extintores",
    path: "/mantenimiento-extintores",
    title: "Mantenimiento de Extintores en CDMX y Estado de México | CRM",
    h1: "Mantenimiento de Extintores",
    description:
      "Mantenimiento y recarga de extintores en CDMX y Estado de México. Revise sus equipos antes de una inspección de Protección Civil. Cotice con Grupo CRM.",
    kicker: "Servicio",
    lead:
      "El mantenimiento de extintores forma parte de nuestro servicio de recarga y revisión en sitio: dejamos sus equipos en condiciones adecuadas y disponibles cuando se necesiten.",
    body: [
      "Incluye revisión de presión, sello, etiqueta, estado físico y, cuando aplica, recarga bajo NOM-154-SCFI-2005. El objetivo es que su inmueble cumpla y que el equipo sirva en un conato real.",
      "Atendemos CDMX y Estado de México. No operamos como sucursal en cada alcaldía: el servicio se coordina desde Cuajimalpa y se realiza en su ubicación.",
    ],
    process: [
      "Solicite una visita de revisión (sin costo la primera).",
      "Reciba un diagnóstico claro de lo que requiere atención.",
      "Programamos mantenimiento o recarga y dejamos evidencia para inspección.",
    ],
    related: ["recarga-extintores", "venta-extintores", "instalacion-extintores"],
  },
  {
    slug: "instalacion-extintores",
    path: "/instalacion-extintores",
    title: "Instalación de Extintores en CDMX y Estado de México | CRM",
    h1: "Instalación de Extintores",
    description:
      "Instalación de extintores y señalamientos en CDMX y Estado de México. Colocamos equipos en los puntos adecuados de su inmueble. Cotice con Grupo CRM Extintores.",
    kicker: "Servicio",
    lead:
      "Instalamos extintores en los puntos correctos de su empresa, comercio o condominio, con la altura, visibilidad y acceso que suelen pedirse en revisiones de Protección Civil.",
    body: [
      "Podemos incluir soporte, señalamiento de equipo y orientación sobre rutas de evacuación cuando corresponda al alcance de su cotización.",
      "Trabajamos en Ciudad de México y Estado de México. La primera visita de revisión o levantamiento no tiene costo.",
    ],
    process: [
      "Levantamos o revisamos los puntos de instalación en su inmueble.",
      "Cotizamos equipos, instalación y señalamientos necesarios.",
      "Instalamos en la fecha acordada y dejamos el sitio listo para inspección.",
    ],
    related: ["venta-extintores", "senalizacion", "recarga-extintores"],
  },
  {
    slug: "senalizacion",
    path: "/senalizacion",
    title: "Señalización y Señalamientos en CDMX y Estado de México | CRM",
    h1: "Señalización contra incendios y vial",
    description:
      "Señalamientos de emergencia y vialidad en CDMX y Estado de México. Identifique equipos, rutas y áreas de riesgo. Cotice con Grupo CRM Extintores.",
    kicker: "Servicio",
    lead:
      "Ofrecemos señalamientos de emergencia y señalamiento vial para identificar extintores, rutas de evacuación y zonas de trabajo, como complemento del equipo contra incendios.",
    body: [
      "En el catálogo encontrará señales, cintas, conos y accesorios de obra. Le orientamos sobre lo que suele pedirse junto con los extintores en revisiones.",
      "Disponible para inmuebles en CDMX y Estado de México, con entrega o instalación según la cotización.",
    ],
    process: [
      "Indique el tipo de inmueble y si ya tiene plano o lista de señalamientos.",
      "Le proponemos el material adecuado del catálogo.",
      "Coordinamos suministro o instalación junto con sus extintores si lo requiere.",
    ],
    related: ["instalacion-extintores", "venta-extintores", "recarga-extintores"],
  },
];

export function seoServiceBySlug(slug) {
  return seoServicePages.find((s) => s.slug === slug);
}

export const blogPosts = [
  {
    slug: "como-instalar-mi-extintor",
    path: "/blog/como-instalar-mi-extintor",
    title: "¿Cómo instalar mi extintor en una empresa? | Grupo CRM",
    heading: "¿Cómo instalar mi extintor para que sí sea útil?",
    description:
      "Guía práctica para colocar un extintor: altura, visibilidad, acceso libre, señalamiento, soporte y cuándo pedir instalación profesional en CDMX y Estado de México.",
    kicker: "Instalación",
    excerpt: "Altura, ubicación, señalamiento y errores comunes. Deje el punto listo y cotice instalación con Grupo CRM.",
    datePublished: "2026-09-01",
    dateModified: "2026-09-01",
    image: "/assets/img/opt/full/blog-instalar-1400.webp",
    imageAlt: "Extintor Grupo CRM instalado con señalamiento EXTINTOR",
  },
  {
    slug: "tipos-de-fuego",
    path: "/blog/tipos-de-fuego",
    title: "Tipos de fuego y cómo elegir el extintor correcto | Grupo CRM",
    heading: "Tipos de fuego y cómo elegir el mejor extintor",
    description:
      "Clases de fuego A, B, C y K, y qué extintor le conviene: PQS ABC, CO₂, agua o tipo K. Guía para empresas en CDMX y Estado de México.",
    kicker: "Guía práctica",
    excerpt: "Qué cubre cada clase de fuego y cómo elegir PQS ABC, CO₂, agua o tipo K según su condominio, restaurante u oficina.",
    datePublished: "2026-08-27",
    dateModified: "2026-09-22",
    image: "/assets/img/opt/full/blog-tipos-fuego-1400.webp",
    imageAlt: "Guía de uso de extintores Grupo CRM según tipo de fuego",
  },
  {
    slug: "como-usar-un-extintor",
    path: "/blog/como-usar-un-extintor",
    title: "¿Cómo usar un extintor ante un conato de incendio? | Grupo CRM",
    heading: "¿Cómo usar un extintor ante un conato de incendio?",
    description:
      "Aprenda a usar un extintor, sus partes y qué contiene. Qué es un fuego incipiente y cuándo evacuar. Atención en CDMX y Estado de México.",
    kicker: "Guía práctica",
    excerpt: "Partes del extintor, qué contiene y cómo actuar solo si el fuego sigue en su etapa inicial.",
    datePublished: "2026-08-24",
    dateModified: "2026-08-24",
    image: "/assets/img/opt/full/blog-extintor-uso-1400.webp",
    imageAlt: "Uso de extintor de agente limpio Grupo CRM ante un conato eléctrico",
  },
  {
    slug: "extintores-cdmx",
    path: "/blog/extintores-cdmx",
    title: "Extintores en CDMX y Estado de México | Grupo CRM Extintores",
    heading: "Extintores en CDMX y Estado de México",
    description:
      "Venta, recarga e instalación de extintores y equipo contra incendios en la Ciudad de México y el Estado de México. Cotice con Grupo CRM.",
    kicker: "Cobertura",
    excerpt: "Empresa mexicana para condominios, restaurantes y oficinas en CDMX y Estado de México.",
    datePublished: "2026-08-24",
    dateModified: "2026-09-22",
    image: "/assets/img/opt/full/blog-extintores-cdmx-1400.webp",
    imageAlt: "Punto de extintor, salida de emergencia y botiquín en un inmueble de CDMX",
  },
  {
    slug: "extintor-6-kg",
    path: "/blog/extintor-6-kg",
    title: "Extintor de 6 kg: tipos, usos y cómo cotizar | Grupo CRM",
    heading: "Extintor de 6 kg: tipos, usos y cómo cotizar",
    description:
      "Guía del extintor de 6 kg: PQS ABC, CO₂, tipo K y agente limpio. Cotice con Grupo CRM en CDMX y Estado de México.",
    kicker: "Catálogo",
    excerpt: "PQS, CO₂, tipo K y agente limpio. Le ayudamos a elegir el que de verdad necesita.",
    datePublished: "2026-08-24",
    dateModified: "2026-08-24",
    image: "/assets/img/opt/full/blog-extintor-6kg-1400.webp",
    imageAlt: "Extintores Grupo CRM de 6 kg: PQS, tipo K y agente limpio",
  },
  {
    slug: "nom-154-scfi-2005",
    path: "/blog/nom-154-scfi-2005",
    title: "NOM-154-SCFI-2005: recarga y mantenimiento de extintores | Grupo CRM",
    heading: "NOM-154-SCFI-2005: recarga y mantenimiento de extintores",
    description:
      "Qué implica la NOM-154-SCFI-2005 para recargar y dar mantenimiento a extintores. Qué pedirle a quien le da servicio en CDMX y Estado de México.",
    kicker: "Normatividad",
    excerpt: "La norma del servicio de recarga: etiqueta, evidencia y un extintor que sí sirve en la inspección.",
    datePublished: "2026-09-01",
    dateModified: "2026-09-22",
    image: "/assets/img/opt/full/blog-recarga-1400.webp",
    imageAlt: "Técnico Grupo CRM revisando un extintor en taller de recarga",
  },
  {
    slug: "casco-seguridad-colores",
    path: "/blog/casco-seguridad-colores",
    title: "¿Qué casco de seguridad necesito: colores y características? | Grupo CRM",
    heading: "¿Qué casco de seguridad necesito: colores y características?",
    description:
      "Guía para elegir casco de seguridad por color, uso y características: tipo cachucha, ala ancha, ajuste de matraca y protección para obra, industria y brigadas.",
    kicker: "Equipo de protección",
    excerpt: "Colores de casco por rol y características para elegir el equipo correcto en obra, almacén, industria o brigada.",
    datePublished: "2026-09-01",
    dateModified: "2026-09-01",
    image: "/assets/img/opt/full/blog-cascos-1400.webp",
    imageAlt: "Cascos de seguridad por color y rol",
  },
];

export function blogPostBySlug(slug) {
  return blogPosts.find((post) => post.slug === slug);
}

export const catSeo = {
  extintores:
    "Extintores PQS, CO₂, tipo K y unidades móviles. Cotice venta y recarga con Grupo CRM en CDMX y Estado de México. WhatsApp 56 6748 1489.",
  chalecos:
    "Chalecos para sus brigadas: malla, reflejante y gabardina. Identifique a su personal y cotice con Grupo CRM en CDMX.",
  "senalamiento-vial":
    "Conos, cintas, postes y señales para obra y vialidad. Equipe su sitio y cotice con Grupo CRM en CDMX y Estado de México.",
  "gabinetes-herrajes":
    "Gabinetes, portaextintores, mangueras y herrajes. Deje su punto de incendio listo. Cotice con Grupo CRM.",
  botiquines:
    "Botiquines metálicos de pared en tres tamaños para empresas, escuelas y comercios. Cotice con Grupo CRM en CDMX.",
  "equipo-proteccion":
    "Detectores, lámparas, cascos, guantes y rescate. Proteja a su personal. Cotice con Grupo CRM en CDMX y Estado de México.",
};

export const categories = [
  { id: "extintores", name: "Extintores", seeAll: "Ver todos los extintores" },
  { id: "chalecos", name: "Chalecos", seeAll: "Ver todos los chalecos" },
  { id: "senalamiento-vial", name: "Señalamiento vial", seeAll: "Ver todo el señalamiento vial" },
  { id: "gabinetes-herrajes", name: "Gabinetes y herrajes", seeAll: "Ver todos los gabinetes y herrajes" },
  { id: "botiquines", name: "Botiquines", seeAll: "Ver todos los botiquines" },
  { id: "equipo-proteccion", name: "Equipo de protección", seeAll: "Ver todo el equipo de protección" },
];

export const venues = [
  { id: "gastronomia", name: "Gastronomía" },
  { id: "locales", name: "Locales" },
  { id: "educacion", name: "Educación" },
  { id: "automotriz", name: "Automotriz" },
  { id: "industria", name: "Industria" },
  { id: "transporte", name: "Transporte" },
  { id: "campo", name: "En sitio" },
  { id: "cursos", name: "Cursos" },
];

function shot(stem, title, note, venue, kicker = "Instalación") {
  return {
    src: `/assets/img/full/${stem}.jpg`,
    full: `/assets/img/full/${stem}.jpg`,
    fit: "cover",
    kicker,
    title,
    note,
    venue,
  };
}

export const lookbook = [
  shot("galeria-extintores-sitio", "Listos en su comercio", "Extintores instalados en una empresa.", "campo"),
  shot("galeria-salon-eventos", "Salón de eventos", "Protección en salón, restaurante y bar.", "gastronomia"),
  shot("galeria-bar", "Bar y terraza", "Extintores a la mano en la barra y la terraza.", "gastronomia"),
  shot("galeria-comercio", "Comercio e industria", "Suministro e instalación en almacén y punto de venta.", "locales"),
  shot("galeria-deportivo", "Instalación deportiva", "Extintores y gabinetes en un campo y academia de fútbol.", "campo"),
  shot("galeria-gabinetes-sitio", "Punto de incendio", "Gabinetes y portaextintores listos para instalar en su sitio.", "campo"),
  shot("galeria-automotriz", "Agencia automotriz", "Extintores PQS y CO₂ en agencia y taller.", "automotriz"),
  shot("galeria-parrilla", "Terraza y parrilla", "Extintores en cocina al aire libre y espacios de eventos.", "gastronomia"),
  shot("galeria-obra", "Obra en construcción", "Equipo en sitio para proteger a su cuadrilla.", "industria"),
  shot("galeria-local", "Local comercial", "Extintor en el acceso de un establecimiento de alimentos.", "locales"),
  shot("galeria-escuela", "Escuela", "Extintores en el patio de un colegio.", "educacion"),
  shot("galeria-escuela-patio", "Revisión en colegio", "Revisamos todos los equipos del plantel en una sola visita.", "educacion"),
  shot("galeria-showroom", "Sala de exhibición", "Extintores en una agencia, listos para instalar.", "automotriz"),
  shot("galeria-showroom-muro", "Agencia automotriz", "Punto de incendio junto al acceso de la sala de exhibición.", "automotriz"),
  shot("galeria-restaurante", "Restaurante", "Extintores discretos y bien colocados en el comedor y la barra.", "gastronomia"),
  shot("galeria-panaderia", "Panadería", "Extintores en un local de insumos y repostería.", "locales"),
  shot("galeria-cafeteria", "Cafetería", "Un café pequeño también puede estar en regla.", "gastronomia"),
  shot("galeria-clinica", "Clínica", "Extintor en el acceso de un consultorio.", "locales"),
  shot("galeria-transporte", "Flota de transporte", "Extintores en el patio de una empresa de transporte.", "transporte"),
  shot("galeria-vapiano", "Restaurante en plaza", "Extintores PQS y CO₂ en un restaurante de plaza comercial.", "gastronomia"),
  shot("galeria-almacen", "Almacén", "Extintores portátiles y unidad móvil en un almacén industrial.", "industria"),
  shot("galeria-campus", "Campus", "Extintores en los accesos de un instituto, para cuidar a sus alumnos.", "educacion"),
  shot("galeria-cocina", "Cocina comercial", "Extintor tipo K para aceites y grasas en una cocina.", "gastronomia"),
  shot("galeria-bodega", "Bodega", "Cobertura completa en una bodega industrial.", "industria"),
  shot("galeria-entrega", "Entrega a su sitio", "Cargamos su equipo y se lo llevamos hasta la puerta.", "campo"),
  shot("galeria-lavanderia", "Lavandería", "Extintor y señalamiento instalados en un local de lavado.", "locales"),
  shot("galeria-estacionamiento", "Estacionamiento", "Extintores en un estacionamiento cubierto.", "locales"),
  shot("galeria-trailer", "Unidad de carga", "Extintores en patio de una empresa de transporte a granel.", "transporte"),
  shot("galeria-camioneta", "Servicio a domicilio", "Llevamos el equipo hasta su unidad o su empresa.", "transporte"),
  shot("galeria-comedor", "Terraza de restaurante", "Extintores en el comedor de un restaurante y salón.", "gastronomia"),
  shot("galeria-alberca", "Alberca", "Extintores junto a una alberca cubierta.", "campo"),
  shot("galeria-madereria", "Maderería", "Extintores en un almacén de tableros.", "industria"),
  shot("galeria-evento", "Jornada en sitio", "Revisión y demostración con el mismo equipo que usted va a usar.", "campo"),
  shot("galeria-inventario", "Listos para recargar", "Extintores preparados para suministro y recarga en su empresa.", "campo"),
  shot("galeria-curso-brigada", "Conformación de brigadas", "Participantes y equipo al cierre de una capacitación de Grupo CRM.", "cursos", "Capacitación"),
  shot("galeria-curso-primeros-auxilios", "Primeros auxilios", "Práctica de vendaje y atención inicial en un curso de brigada.", "cursos", "Capacitación"),
  shot("galeria-curso-rescate", "Búsqueda y rescate", "Inmovilización en tabla durante el curso de brigada.", "cursos", "Capacitación"),
  shot("galeria-curso-instructivo", "Capacitación en sitio", "Revisión del procedimiento junto al extintor.", "cursos", "Capacitación"),
  shot("galeria-curso-campo", "Entrenamiento en campo", "Ejercicio de brigada en condiciones reales.", "cursos", "Capacitación"),
  shot("galeria-curso-comunidad", "Jornada de prevención", "Demostración de equipo de emergencia con la comunidad.", "cursos", "Capacitación"),
];

export function lookFull(item) {
  return item?.full || item?.src || "";
}

const PQS =
  "Extintor portátil de presión contenida, cargado con polvo químico seco para fuegos clase ABC. Brinda respuesta rápida ante conatos que involucren materiales combustibles ordinarios, líquidos inflamables y equipos eléctricos energizados.";
const CO2 =
  "Extintor portátil de bióxido de carbono (CO₂) para fuegos clase BC. Proporciona una descarga limpia y eficaz en conatos que involucren líquidos inflamables y equipos eléctricos energizados, sin dejar residuos.";
const HFC =
  "Extintor portátil cargado con HFC-236fa (hexafluoropropano), agente limpio para fuegos clase ABC. Brinda protección rápida en conatos que involucren combustibles ordinarios, líquidos inflamables y equipos eléctricos, sin dejar residuos.";
const K =
  "Extintor portátil tipo K, cargado con solución de acetato de potasio. Diseñado para controlar conatos producidos por aceites y grasas de origen animal o vegetal en equipos de cocina.";
const MOV =
  "Unidad móvil de presión contenida, cargada con polvo químico seco para fuegos clase ABC. Su capacidad y movilidad permiten atender conatos de mayor magnitud en instalaciones comerciales e industriales.";

function item(sku, title, cat, cap, agent, classes, use, desc) {
  return { sku, title, cat, cap, agent, classes, use, desc };
}

export const products = [
  item("CRM-0001", "Extintor automotriz de PQS ABC - 1.0 kg", "extintores", "1.0 kg", "Polvo químico seco ABC", "A, B, C", "Automóviles, camionetas y transporte público.", PQS),
  item("CRM-0002", "Extintor automotriz de PQS ABC - 2.0 kg", "extintores", "2.0 kg", "Polvo químico seco ABC", "A, B, C", "Automóviles, camionetas y transporte público.", PQS),
  item("CRM-0003", "Extintor de PQS ABC para uso comercial e industrial - 4.5 kg", "extintores", "4.5 kg", "Polvo químico seco ABC", "A, B, C", "Comercios, edificios, escuelas, estacionamientos, hoteles, talleres, gasolineras, almacenes, bodegas e industrias.", PQS),
  item("CRM-0004", "Extintor de PQS ABC para uso comercial e industrial - 6.0 kg", "extintores", "6.0 kg", "Polvo químico seco ABC", "A, B, C", "Comercios, edificios, escuelas, estacionamientos, hoteles, talleres, gasolineras, almacenes, bodegas e industrias.", PQS),
  item("CRM-0005", "Extintor de PQS ABC para uso comercial e industrial - 9.0 kg", "extintores", "9.0 kg", "Polvo químico seco ABC", "A, B, C", "Comercios, edificios, escuelas, estacionamientos, hoteles, talleres, gasolineras, almacenes, bodegas e industrias.", PQS),
  item("CRM-0006", "Extintor de CO₂ - 2.3 kg", "extintores", "2.3 kg", "Bióxido de carbono (CO₂)", "B, C", "Áreas de cómputo, oficinas, laboratorios, equipos eléctricos, subestaciones y espacios donde se requiera un agente limpio.", CO2),
  item("CRM-0007", "Extintor de CO₂ - 4.5 kg", "extintores", "4.5 kg", "Bióxido de carbono (CO₂)", "B, C", "Áreas de cómputo, oficinas, laboratorios, equipos eléctricos, subestaciones y espacios donde se requiera un agente limpio.", CO2),
  item("CRM-0008", "Extintor de CO₂ - 6.8 kg", "extintores", "6.8 kg", "Bióxido de carbono (CO₂)", "B, C", "Áreas de cómputo, oficinas, laboratorios, equipos eléctricos, subestaciones y espacios donde se requiera un agente limpio.", CO2),
  item("CRM-0009", "Extintor de agente limpio HFC-236fa - 2.0 kg", "extintores", "2.0 kg", "HFC-236fa (hexafluoropropano)", "A, B, C", "Museos, bibliotecas, laboratorios, salas de cómputo, subestaciones, instalaciones telefónicas, aeronaves y equipos delicados o de alto valor.", HFC),
  item("CRM-0010", "Extintor de agente limpio HFC-236fa - 4.5 kg", "extintores", "4.5 kg", "HFC-236fa (hexafluoropropano)", "A, B, C", "Museos, bibliotecas, laboratorios, salas de cómputo, subestaciones, instalaciones telefónicas, aeronaves y equipos delicados o de alto valor.", HFC),
  item("CRM-0011", "Extintor de agente limpio HFC-236fa - 6.0 kg", "extintores", "6.0 kg", "HFC-236fa (hexafluoropropano)", "A, B, C", "Museos, bibliotecas, laboratorios, salas de cómputo, subestaciones, instalaciones telefónicas, aeronaves y equipos delicados o de alto valor.", HFC),
  item("CRM-0012", "Extintor tipo K para cocinas - 2.4 L", "extintores", "2.4 L", "Acetato de potasio", "K", "Estufas, freidoras, parrillas, marmitas y cocinas comerciales.", K),
  item("CRM-0013", "Extintor tipo K para cocinas - 4.0 L", "extintores", "4.0 L", "Acetato de potasio", "K", "Estufas, freidoras, parrillas, marmitas y cocinas comerciales.", K),
  item("CRM-0014", "Extintor tipo K para cocinas - 6.0 L", "extintores", "6.0 L", "Acetato de potasio", "K", "Estufas, freidoras, parrillas, marmitas y cocinas comerciales.", K),
  item("CRM-0015", "Extintor de agua a presión - 10 L", "extintores", "10 L", "Agua", "A", "Áreas de residuos, talleres, almacenes, madererías y espacios con combustibles sólidos ordinarios.", "Extintor portátil de presión contenida, cargado con agua para fuegos clase A. Adecuado para conatos que involucren papel, madera, cartón, textiles y otros combustibles sólidos ordinarios."),
  item("CRM-0016", "Unidad móvil de PQS ABC - 35 kg", "extintores", "35 kg", "Polvo químico seco ABC", "A, B, C", "Gasolineras, talleres, almacenes, estacionamientos, bodegas, edificios e industrias.", MOV),
  item("CRM-0017", "Unidad móvil de PQS ABC - 50 kg", "extintores", "50 kg", "Polvo químico seco ABC", "A, B, C", "Gasolineras, talleres, almacenes, estacionamientos, bodegas, edificios e industrias.", MOV),
  item("CRM-0018", "Unidad móvil de PQS ABC - 70 kg", "extintores", "70 kg", "Polvo químico seco ABC", "A, B, C", "Gasolineras, talleres, almacenes, estacionamientos, bodegas, edificios e industrias.", MOV),
  item("CRM-0019", "Unidad móvil de agua a presión - 50 L", "extintores", "50 L", "Agua", "A", "Áreas de residuos, talleres, almacenes, madererías, bodegas e industrias.", "Unidad móvil de presión contenida, cargada con agua para fuegos clase A. Adecuada para conatos que involucren papel, madera, cartón, textiles y otros combustibles sólidos ordinarios."),
  item("CRM-0020", "Chaleco de malla para brigadas", "chalecos", "Unitalla", "Malla de punto abierto", "", "Brigadas de emergencia, protección civil, simulacros y evacuaciones en empresas e industrias.", "Chaleco unitalla elaborado en malla de punto abierto, con cintas elásticas laterales y broche frontal. Ligero, ventilado y fácil de identificar durante actividades de emergencia."),
  item("CRM-0021", "Chaleco reflejante de alta visibilidad", "chalecos", "Unitalla", "Poliéster de alta visibilidad", "", "Brigadas de emergencia, protección civil, obras, simulacros y evacuaciones.", "Chaleco unitalla elaborado en poliéster de alta visibilidad, con cierre frontal y cinta reflejante textil gris de 2 pulgadas."),
  item("CRM-0022", "Chaleco de gabardina para brigadista", "chalecos", "Unitalla", "Gabardina de algodón y poliéster", "", "Brigadas de emergencia, protección civil, simulacros y evacuaciones en empresas e industrias.", "Chaleco unitalla elaborado en gabardina de algodón y poliéster, con bolsas frontales y cinta reflejante textil gris de 2 pulgadas."),
  item("CRM-0023", "Cono vial flexible - 45 cm", "senalamiento-vial", "45 cm", "Una pieza, protección UV", "", "Vialidades, estacionamientos, obras, eventos y delimitación de áreas.", "Cono vial flexible fabricado en una sola pieza, con altura de 45 cm y protección contra rayos UV para uso prolongado en exteriores."),
  item("CRM-0024", "Cono vial flexible - 71 cm", "senalamiento-vial", "71 cm", "Una pieza, protección UV", "", "Vialidades, estacionamientos, obras, eventos y delimitación de áreas.", "Cono vial flexible fabricado en una sola pieza, con altura de 71 cm y protección contra rayos UV para uso prolongado en exteriores."),
  item("CRM-0025", "Poste de seguridad para barricada - 117 cm", "senalamiento-vial", "117 cm", "Poste auxiliar", "", "Obras viales, construcciones, estacionamientos y aislamiento de zonas de trabajo.", "Poste auxiliar para señalizar, delimitar y aislar zonas de trabajo. Su altura de 117 cm facilita la visibilidad y contribuye a proteger a trabajadores, peatones y vehículos."),
  item("CRM-0026", "Malla de seguridad para delimitación - 30 m", "senalamiento-vial", "30 m × 1.20 m", "Malla ligera", "", "Construcción, obras viales, delimitación y aislamiento de zonas de trabajo.", "Malla ligera para confinar áreas de construcción u obras viales. Ayuda a controlar el tránsito peatonal y vehicular y a mantener delimitadas las zonas de trabajo. Medidas: 30 m de largo por 1.20 m de alto."),
  item("CRM-0027", "Lámpara solar de destello para señalización", "senalamiento-vial", "", "Polipropileno, batería recargable", "", "Obras viales, barricadas, barreras, postes y señalización nocturna.", "Lámpara de señalización fabricada en polipropileno de alta resistencia, con batería interna recargable y soporte metálico para instalación en barreras, barricadas y postes."),
  item("CRM-0028", "Banderín reflejante para señalización", "senalamiento-vial", "", "Malla de alta visibilidad", "", "Obras en construcción, vialidades y señalización de áreas de trabajo.", "Banderín de malla de alta visibilidad con material reflejante, diseñado como apoyo para señalizar obras y zonas de trabajo."),
  item("CRM-0029", "Banderín de alta visibilidad para camión", "senalamiento-vial", "", "Material resistente UV", "", "Camiones, transporte de carga y señalización de carga sobresaliente.", "Banderín de alta visibilidad para vehículos de carga, fabricado con material resistente y protección contra rayos UV."),
  item("CRM-0030", "Cinta roja de delimitación «Peligro»", "senalamiento-vial", "", "Cinta roja impresa", "", "Obras, vialidades, mantenimiento, emergencias y delimitación de áreas de riesgo.", "Cinta roja para delimitar zonas de riesgo, resistente a la exposición solar e impresa con la leyenda «Peligro»."),
  item("CRM-0031", "Cinta amarilla de delimitación «Precaución»", "senalamiento-vial", "", "Cinta amarilla impresa", "", "Obras, vialidades, mantenimiento y delimitación preventiva de áreas.", "Cinta amarilla para delimitar zonas preventivas, resistente a la exposición solar e impresa con la leyenda «Precaución»."),
  item("CRM-0032", "Cinta amarilla de delimitación «Prohibido el paso»", "senalamiento-vial", "", "Cinta amarilla impresa", "", "Obras, vialidades, mantenimiento y restricción de acceso a áreas.", "Cinta amarilla para restringir el acceso, resistente a la exposición solar e impresa con la leyenda «Prohibido el paso»."),
  item("CRM-0033", "Señal preventiva de piso mojado", "senalamiento-vial", "", "Caballete plegable", "", "Centros comerciales, oficinas, escuelas, hoteles, restaurantes y áreas de limpieza.", "Caballete plegable de color amarillo y alta visibilidad para advertir sobre superficies húmedas o resbalosas."),
  item("CRM-0034", "Brazalete de identificación para brigadistas", "senalamiento-vial", "", "Tela", "", "Brigadas de emergencia, protección civil, simulacros y evacuaciones.", "Brazalete elaborado en tela para identificar de forma rápida al personal integrante de brigadas durante emergencias y simulacros."),
  item("CRM-0035", "Portaextintor de piso tipo cenicero - 4.5 a 6.0 kg", "gabinetes-herrajes", "4.5 a 6.0 kg", "Metálico de piso", "", "Empresas, oficinas, comercios, industrias, hoteles y estacionamientos.", "Portaextintor metálico de piso tipo cenicero, diseñado para resguardar extintores de polvo químico seco o agente limpio con capacidades de 4.5 a 6.0 kg."),
  item("CRM-0036", "Portaextintor de piso tipo cenicero - 9.0 kg y 10 lb", "gabinetes-herrajes", "9.0 kg / 10 lb CO₂", "Metálico de piso", "", "Empresas, oficinas, comercios, industrias, hoteles y estacionamientos.", "Portaextintor metálico de piso tipo cenicero, diseñado para resguardar extintores de polvo químico seco de 9.0 kg o extintores de CO₂ de 10 lb."),
  item("CRM-0037", "Gabinete metálico para manguera de hidrante", "gabinetes-herrajes", "Hasta 30 m", "Metálico de sobreponer", "", "Edificios, industrias, plazas comerciales y redes contra incendio.", "Gabinete metálico de sobreponer para resguardar una manguera contra incendio de hasta 30 m. Incluye chapa y se suministra sin cristal."),
  item("CRM-0038", "Gabinete para un equipo de bombero", "gabinetes-herrajes", "1 equipo", "Metálico para exterior", "", "Estaciones de bomberos, industrias, brigadas y áreas de equipos de emergencia.", "Gabinete metálico para resguardar un equipo o traje de bombero. Incluye chapa, es apto para exteriores y se suministra sin cristal."),
  item("CRM-0039", "Gabinete para dos equipos de bombero", "gabinetes-herrajes", "2 equipos", "Metálico para exterior", "", "Estaciones de bomberos, industrias, brigadas y áreas de equipos de emergencia.", "Gabinete metálico para resguardar dos equipos o trajes de bombero. Incluye chapa, es apto para exteriores y se suministra sin cristal."),
  item("CRM-0040", "Gabinete para extintor - 4.5 a 6.0 kg", "gabinetes-herrajes", "4.5 a 6.0 kg", "Cilíndrico de piso", "", "Empresas, oficinas, comercios, hoteles, edificios e industrias.", "Gabinete cilíndrico de piso para el resguardo de extintores portátiles de 4.5 y 6.0 kg, diseñado para integrarse discretamente a la imagen del área."),
  item("CRM-0041", "Toma siamesa para red contra incendio", "gabinetes-herrajes", "2 entradas", "Cromada y granallada", "", "Edificios, industrias, plazas comerciales y redes contra incendio.", "Toma siamesa cromada y granallada para bomberos, con dos entradas de alimentación de agua a la red contra incendio. Incluye disco, tapones y cadenas."),
  item("CRM-0042", "Llave universal de bronce para coples", "gabinetes-herrajes", "", "Bronce fundido", "", "Redes contra incendio, hidrantes y mantenimiento de mangueras y coples.", "Llave universal fabricada en bronce fundido para ajustar coples de manguera. Su diseño proporciona un mejor apoyo durante las maniobras de conexión y desconexión."),
  item("CRM-0043", "Chiflón de neblina de tres pasos - 1½ pulgadas", "gabinetes-herrajes", "1½ pulgadas", "Bronce fundido", "", "Redes contra incendio, hidrantes, brigadas y cuerpos de bomberos.", "Chiflón de neblina de tres pasos para conexión a manguera contra incendio, fabricado en bronce fundido y diseñado para regular el patrón y flujo del agua."),
  item("CRM-0044", "Manguera industrial contra incendio", "gabinetes-herrajes", "", "Hule natural y poliéster", "", "Edificios, industrias, hidrantes y redes contra incendio.", "Manguera contra incendio con tubo interior de hule natural y cubierta exterior de tejido de poliéster resistente a la abrasión y a la intemperie. Incluye conexiones de bronce con cuerdas IPT o NST; su construcción ligera facilita el manejo."),
  item("CRM-0045", "Válvula globo angular de bronce", "gabinetes-herrajes", "2\" NPT / 1½\" IPT", "Bronce fundido", "", "Hidrantes, redes contra incendio, edificios e industrias.", "Válvula globo angular fabricada en bronce fundido, con entrada hembra NPT de 2 pulgadas y salida macho IPT de 1½ pulgadas. Cuenta con vástago ascendente para apertura y cierre."),
  item("CRM-0046", "Botiquín metálico de pared - chico", "botiquines", "17 × 23 × 6 cm", "Lámina troquelada y esmaltada", "", "Hogares, oficinas, comercios y pequeñas empresas.", "Botiquín metálico para instalación en pared, fabricado en lámina troquelada y esmaltada. Medidas: 17 × 23 × 6 cm."),
  item("CRM-0047", "Botiquín metálico de pared - mediano", "botiquines", "20 × 30 × 7 cm", "Lámina troquelada y esmaltada", "", "Oficinas, comercios, escuelas, talleres y empresas.", "Botiquín metálico para instalación en pared, fabricado en lámina troquelada y esmaltada. Medidas: 20 × 30 × 7 cm."),
  item("CRM-0048", "Botiquín metálico de pared - grande", "botiquines", "25 × 35 × 7.5 cm", "Lámina troquelada y esmaltada", "", "Industrias, empresas, escuelas, centros comerciales y obras.", "Botiquín metálico para instalación en pared, fabricado en lámina troquelada y esmaltada. Medidas: 25 × 35 × 7.5 cm."),
  item("CRM-0049", "Detector de humo con batería de 9 V", "equipo-proteccion", "9 V", "Kidde", "", "Hogares, oficinas, hoteles, comercios y áreas cerradas.", "Detector de humo marca Kidde, alimentado por batería de 9 V. Cuenta con botón de prueba, aviso de batería baja y diseño de fácil instalación."),
  item("CRM-0050", "Lámpara de emergencia recargable", "equipo-proteccion", "40 × 7 cm · 4 a 6 h", "Recargable", "", "Oficinas, pasillos, escaleras, rutas de evacuación y áreas comunes.", "Lámpara de emergencia recargable con autonomía aproximada de 4 a 6 horas. Medidas: 40 cm de largo por 7 cm de alto."),
  item("CRM-0051", "Camilla rígida para rescate e inmovilización", "equipo-proteccion", "Carga 180 kg", "Poliuretano de alta resistencia", "", "Brigadas de emergencia, rescate, protección civil, industrias y eventos.", "Camilla rígida fabricada en poliuretano de alta resistencia, compatible con inmovilizadores de cabeza y cuerpo. Capacidad de carga: 180 kg."),
  item("CRM-0052", "Kit integral de inmovilización", "equipo-proteccion", "10 puntos de sujeción", "Kit corporal, cráneo y collarín", "", "Brigadas de emergencia, rescate, protección civil y servicios médicos.", "Kit de inmovilización que incluye sistema corporal con 10 puntos de sujeción, inmovilizador de cráneo y collarín."),
  item("CRM-0053", "Guantes anticorte de alta resistencia", "equipo-proteccion", "", "PEAD, fibra de vidrio, hilo de acero y PU", "", "Industria, construcción, talleres y manejo de materiales cortantes.", "Guantes anticorte fabricados con polietileno de alta densidad, fibra de vidrio, hilo de acero y recubrimiento de poliuretano."),
  item("CRM-0054", "Casco de seguridad con ajuste de matraca", "equipo-proteccion", "Tipo cachucha", "Polietileno de alta densidad", "", "Obras, construcción, industria, almacenes y brigadas.", "Casco de seguridad tipo cachucha, fabricado en polietileno de alta densidad y equipado con sistema de ajuste de matraca."),
  item("CRM-0055", "Casco de seguridad de ala ancha", "equipo-proteccion", "Ala ancha", "Polietileno de alta densidad", "", "Obras, construcción, industria, almacenes y brigadas.", "Casco de seguridad de ala ancha, fabricado en polietileno de alta densidad y equipado con sistema de ajuste de matraca."),
];

export const clientGroups = [
  { id: "transporte", name: "Transporte" },
  { id: "gastronomia", name: "Gastronomía" },
  { id: "educacion", name: "Educación y deporte" },
  { id: "automotriz", name: "Automotriz" },
];

export const clients = [
  {
    name: "Transportes Calzada S.A. de C.V.",
    group: "transporte",
    note: "Flota, tráiler y camioneta",
    logos: [{ src: "/assets/img/clients/transportes-calzada.png", alt: "Logo de Transportes Calzada S.A. de C.V." }],
  },
  {
    name: "Las Fresas",
    group: "gastronomia",
    note: "Restaurante-bar y salón de eventos, KM 23½ México–Toluca",
    logos: [{ src: "/assets/img/clients/las-fresas.png", alt: "Logo de Las Fresas" }],
  },
  {
    name: "Mansión Black",
    group: "gastronomia",
    note: "Bar y terraza",
    logos: [{ src: "/assets/img/clients/mansion-black.png", alt: "Logo de Mansión Black" }],
  },
  {
    name: "Vapiano Mexico City",
    group: "gastronomia",
    note: "Restaurante en plaza",
    logos: [{ src: "/assets/img/clients/vapiano.png", alt: "Logo de Vapiano Mexico City" }],
  },
  {
    name: "Laplace Cafetería",
    group: "gastronomia",
    round: true,
    logos: [{ src: "/assets/img/clients/laplace.png", alt: "Logo de Laplace Cafetería" }],
  },
  {
    name: "Micael Gastronómica",
    group: "gastronomia",
    note: "Insumos para panadería y repostería",
    logos: [{ src: "/assets/img/clients/micael.png", alt: "Logo de Micael Gastronómica" }],
  },
  {
    name: "MR Crazy Snacks & Drinks",
    group: "gastronomia",
    note: "Local de alimentos",
    ink: true,
    round: true,
    logos: [{ src: "/assets/img/clients/mr-crazy.png", alt: "Logo de MR Crazy Snacks & Drinks" }],
  },
  {
    name: "Colegio de las Américas",
    group: "educacion",
    ink: true,
    logos: [{ src: "/assets/img/clients/colegio-americas.png", alt: "Logo del Colegio de las Américas" }],
  },
  {
    name: "Champions Soccer Academy",
    group: "educacion",
    note: "Campo y gabinetes",
    ink: true,
    round: true,
    logos: [{ src: "/assets/img/clients/champions-soccer.png", alt: "Logo de Champions Soccer Academy" }],
  },
  {
    name: "Agencia Volkswagen / Cupra",
    group: "automotriz",
    note: "Patio, showroom y muro",
    logos: [
      { src: "/assets/img/clients/volkswagen.png", alt: "Logo de Volkswagen" },
      { src: "/assets/img/clients/cupra.png", alt: "Logo de Cupra" },
    ],
  },
];

export const reviews = [
  {
    name: "Montse Leon",
    date: "5 de junio de 2024",
    iso: "2024-06-05",
    stars: 5,
    photo: "/assets/img/reviews/montse-leon.jpg",
    text: "Excelente servicio, atento y rápidos. Muchas gracias !!",
  },
  {
    name: "Melissa Jiménez",
    date: "30 de noviembre de 2023",
    iso: "2023-11-30",
    stars: 5,
    photo: "/assets/img/reviews/melissa-jimenez.jpg",
    text: "Excelente servicio, productos nuevos y a buen costo. Además lo instalan muy rápido y te enseñan a usarlo.",
  },
  {
    name: "Eduardo Solis Almanza",
    date: "22 de septiembre de 2023",
    iso: "2023-09-22",
    stars: 5,
    photo: "/assets/img/reviews/eduardo-solis.jpg",
    text: "Excelente. La respuesta al contactarlos fue muy rápida, me asesoraron en cuanto al tamaño adecuado de extintores y señalizaciones requeridas, cumplieron luego de acordar fecha y hora para la entrega/instalación, todo muy eficiente y profesional.",
  },
];

export const faqs = [
  {
    q: "¿Qué equipo puedo cotizar?",
    a: `Extintores, chalecos, señalamientos, gabinetes, botiquines y equipo de protección. Si no encuentra algo, <a href="https://wa.me/${company.whatsapp}?text=${encodeURIComponent("Hola, quiero una cotización de extintores y equipo contra incendio para mi empresa.")}" target="_blank" rel="noopener noreferrer">escríbanos por WhatsApp</a> y con gusto lo buscamos por usted.`,
  },
  {
    q: "¿En qué zonas atienden?",
    a: "Atendemos toda la Ciudad de México y el Estado de México. Nos encuentra en Chamixto 131, Col. Loma del Padre, Cuajimalpa.",
  },
  {
    q: "¿Cómo pido una cotización?",
    a: `Como le resulte más cómodo: <a href="https://wa.me/${company.whatsapp}?text=${encodeURIComponent("Hola, quiero una cotización de extintores y equipo contra incendio para mi empresa.")}" target="_blank" rel="noopener noreferrer">WhatsApp ${company.whatsappShow}</a>, <a href="tel:${company.phoneTel}">teléfono</a> o el <a href="/contacto">formulario de contacto</a>. Aceptamos tarjeta y meses sin intereses.`,
  },
  {
    q: "¿Cuál es el horario de atención?",
    a: "Lunes a viernes, de 9:00 a 18:00.",
  },
  {
    q: "¿Me ayudan a cumplir con Protección Civil en mi condominio?",
    a: 'Claro que sí. Revisamos extintores, señalamientos y puntos de incendio, y le decimos con claridad qué le falta. La recarga se hace bajo la <a href="/blog/nom-154-scfi-2005">NOM-154-SCFI-2005</a>. La primera visita es sin costo.',
  },
  {
    q: "¿Qué extintor necesito?",
    a: 'Depende de lo que quiera proteger: clase A para sólidos, B para líquidos, C para equipo eléctrico y K para cocinas. En el blog está la <a href="/blog/tipos-de-fuego#comparar-extintores">tabla PQS ABC, CO₂ y tipo K</a> y la guía de <a href="/blog/tipos-de-fuego">tipos de fuego</a>. En cada ficha viene la clase y, si tiene dudas, con gusto lo orientamos.',
  },
  {
    q: "¿Cada cuánto hay que recargar un extintor?",
    a: 'El plazo lo marca la <a href="/blog/nom-154-scfi-2005">NOM-154-SCFI-2005</a> y el tipo de equipo: no es “cuando se vea vacío”. En inspección piden servicio vigente, etiqueta legible y evidencia de quién lo atendió. En la visita de revisión (sin costo) le decimos qué se recarga, qué se sustituye y si el cilindro ya requiere prueba hidrostática.',
  },
  {
    q: "¿Qué revisan para dejar el inmueble listo ante una inspección?",
    a: "Que el equipo exista, se vea y esté servido: manómetro en rango, sello, etiqueta con fecha y quién hizo el servicio, y a menudo señalamientos y puntos de incendio. Revisamos eso en sitio, le indicamos qué falta y dejamos evidencia útil cuando hacemos recarga o mantenimiento.",
  },
  {
    q: "¿Qué incluye el mantenimiento de extintores?",
    a: 'Forma parte de la revisión y recarga: presión, sello, etiqueta y estado físico del equipo. Cuando aplica, la recarga se hace bajo la NOM-154-SCFI-2005, con verificación de MCD cuando corresponde al proceso. Detalle en <a href="/mantenimiento-extintores">mantenimiento de extintores</a>.',
  },
];

/** Short selection aid — facts already published in catálogo / blog tipos-de-fuego. */
export const extinguisherCompare = [
  {
    name: "PQS ABC",
    classes: "A, B, C",
    use: "Pasillos, comercios, estacionamientos, oficinas y locales",
    residue: "Deja residuo (polvo)",
    note: "El más pedido; 6 kg es el que más se instala",
    href: "/productos?cat=extintores#extintores",
  },
  {
    name: "CO₂",
    classes: "B, C",
    use: "Cómputo, laboratorios, tableros y equipo eléctrico",
    residue: "Sin residuo",
    note: "No cubre sólidos (A) ni freidoras (K)",
    href: "/producto?sku=CRM-0007",
  },
  {
    name: "Tipo K",
    classes: "K",
    use: "Freidoras, parrillas, marmitas y cocinas",
    residue: "Agente para grasas de cocina",
    note: "No sustituye al PQS ABC en el resto del local",
    href: "/producto?sku=CRM-0012",
  },
];

export const services = [
  {
    icon: "fa-solid fa-fire-extinguisher",
    title: "Venta e instalación de extintores",
    text: "Extintores nuevos y certificados, e instalación en los puntos adecuados de su empresa.",
  },
  {
    icon: "fa-solid fa-rotate",
    title: "Recarga y mantenimiento",
    text: "Recargamos y damos mantenimiento a sus extintores para mantenerlos en condiciones adecuadas y disponibles cuando los necesite.",
  },
  {
    icon: "fa-solid fa-signs-post",
    title: "Señalamientos",
    text: "Señalamientos de emergencia y vialidad para identificar equipos, rutas de evacuación y áreas importantes.",
  },
  {
    icon: "fa-solid fa-kit-medical",
    title: "Botiquines",
    text: "Botiquines para empresas e instalaciones, disponibles en diferentes presentaciones y tamaños.",
  },
  {
    icon: "fa-solid fa-chalkboard-user",
    title: "Cursos y capacitación",
    text: "Capacitamos a su personal en prevención y combate de incendios, incluyendo el uso y manejo adecuado de extintores.",
  },
  {
    icon: "fa-solid fa-clipboard-check",
    title: "Revisión en sitio",
    text: "Visitamos su empresa para revisar sus equipos y necesidades de seguridad. Le indicamos qué requiere atención y qué podemos hacer para solucionarlo.",
  },
];

export const courses = {
  kicker: "Cursos y capacitaciones",
  title: "Prepare a su equipo para actuar cuando más importa",
  leads: [
    "Capacitamos a su personal para prevenir, responder y actuar ante una emergencia.",
  ],
  listLead: "Ofrecemos cursos y formación especializada en diferentes áreas de seguridad:",
  items: [
    { name: "Primeros auxilios", icon: "fa-solid fa-kit-medical" },
    { name: "Combate contra incendios", icon: "fa-solid fa-fire" },
    { name: "Búsqueda y rescate", icon: "fa-solid fa-life-ring" },
    { name: "Evacuación", icon: "fa-solid fa-person-walking-arrow-right" },
    { name: "Materiales peligrosos", icon: "fa-solid fa-biohazard" },
    { name: "Conformación de brigadas", icon: "fa-solid fa-people-group" },
  ],
};

export const carePoints = [
  { icon: "fa-solid fa-certificate", title: "Equipos certificados" },
  { icon: "fa-solid fa-location-dot", title: "CDMX y Estado de México" },
  { icon: "fa-solid fa-credit-card", title: "Tarjeta y meses sin intereses" },
  { icon: "fa-solid fa-headset", title: "Seguimiento cercano" },
];

export const readyChecks = [
  "¿Extintores vencidos?",
  "¿Señalética incorrecta?",
  "¿Sin programa de Protección Civil?",
  "¿Brigadas sin capacitar?",
];

export const condo = {
  title: "Atención a condominios",
  lead: "Acompañamos a administradores y comités para cumplir con Protección Civil y evitar sanciones.",
  readyLabel: "¿Su condominio está listo?",
  warning: "Estos detalles pueden derivar en multas o clausuras. Con gusto los revisamos con usted, sin costo.",
};

export const sectors = [
  {
    icon: "fa-solid fa-city",
    name: "Condominios",
    text: "Dejamos las áreas comunes listas para Protección Civil.",
  },
  {
    icon: "fa-solid fa-utensils",
    name: "Restaurantes",
    text: "Cocinas y parrillas protegidas con extintor tipo K.",
  },
  {
    icon: "fa-solid fa-building",
    name: "Oficinas",
    text: "Pasillos, áreas de cómputo y botiquines a la mano.",
  },
  {
    icon: "fa-solid fa-briefcase",
    name: "Empresas",
    text: "Comercios, almacenes e industria, del tamaño que sean.",
  },
  {
    icon: "fa-solid fa-hospital",
    name: "Clínicas",
    text: "Extintores y botiquines en accesos y salas de espera.",
  },
  {
    icon: "fa-solid fa-graduation-cap",
    name: "Escuelas",
    text: "Patios, aulas y accesos, pensando en los niños.",
  },
];

export function safeDecode(value) {
  try {
    return decodeURIComponent(String(value ?? ""));
  } catch {
    return String(value ?? "");
  }
}

export function waUrl(text = "Hola, quiero una cotización de extintores y equipo contra incendio para mi empresa.", phone = company.whatsapp) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function catName(id) {
  return categories.find((c) => c.id === id)?.name || id;
}

export function catCount(id) {
  return products.filter((p) => p.cat === id).length;
}

export function productBySku(sku) {
  if (!sku) return undefined;
  const key = String(sku).trim().toUpperCase();
  return products.find((p) => p.sku === key);
}

export function productImg(p) {
  return `/assets/img/catalog/${p.sku}.png`;
}

export function productAlt(p, { detail = false } = {}) {
  if (!p?.title) return "";
  const base = detail
    ? `${p.title} certificado de Grupo CRM Extintores`
    : `${p.title} Grupo CRM Extintores`;
  if (p.cat === "extintores") {
    return detail
      ? `Extintor ${p.title} certificado Grupo CRM para CDMX y Estado de México`
      : `Extintor ${p.title} Grupo CRM`;
  }
  return base;
}

export function lookAlt(item) {
  const note = String(item?.note || "").replace(/\s+/g, " ").trim();
  if (note) return note;
  const title = String(item?.title || "").trim();
  if (title) return `${title} — instalación y equipo contra incendios Grupo CRM`;
  return "Técnico instalando extintor certificado Grupo CRM Extintores";
}

export function productUrl(sku) {
  return withBase(`/producto?sku=${encodeURIComponent(sku)}#${encodeURIComponent(sku)}`);
}

export function readSku() {
  const query = new URLSearchParams(location.search).get("sku");
  if (query) return query;
  const hash = safeDecode((location.hash || "").replace(/^#/, ""));
  if (hash && /^CRM-\d{4}$/i.test(hash)) return hash;
  try {
    return sessionStorage.getItem("crm-sku") || "";
  } catch {
    return "";
  }
}

export function relatedProducts(sku, limit = 4) {
  const current = productBySku(sku);
  if (!current) return [];
  return products.filter((p) => p.cat === current.cat && p.sku !== sku).slice(0, limit);
}

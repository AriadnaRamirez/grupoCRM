import { withBase } from "./base.js";

export const company = {
  name: "Grupo CRM Extintores",
  tagline: "Extintores y equipos de seguridad",
  slogan: "Protección, prevención y respuesta.",
  about:
    "Lo acompañamos con venta, recarga e instalación en CDMX y Estado de México.",
  phone: "56 5947 4605",
  phoneTel: "5659474605",
  phoneAlt: "56 6748 1489",
  phoneAltTel: "5667481489",
  whatsapp: "525554383241",
  whatsappShow: "55 5438 3241",
  email: "crm.extintores@gmail.com",
  facebook: "Grupo CRM Extintores",
  facebookUrl: "https://www.facebook.com/people/GRUPO-CRM-Extintores/100075736857787/",
  instagram: "@grupo_crm_extintores",
  instagramUrl: "https://www.instagram.com/grupo_crm_extintores/",
  hours: "Lunes a viernes 9:00–18:00",
  coverage: "Ciudad de México y Estado de México",
  location: "Atención en Ciudad de México y Estado de México",
  address: "Chamixto 131, Col. Loma del Padre, Alcaldía Cuajimalpa, Ciudad de México",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Chamixto+131+Col.+Loma+del+Padre+Cuajimalpa+Ciudad+de+M%C3%A9xico",
  website: "www.crmextintores.com",
  websiteUrl: "https://www.crmextintores.com",
  payments: "Aceptamos pagos con tarjeta de crédito y meses sin intereses.",
  hook: "Agende su visita de revisión, sin costo.",
  pitch: "Cumpla con Protección Civil y evite multas.",
  mision:
    "Abastecer extintores y equipo contra incendio de alta calidad, que satisfagan las necesidades de nuestros clientes, mientras fomentamos la seguridad, la integridad y la capacitación constante a nuestros clientes y colaboradores.",
  vision:
    "Ser la empresa líder en el mercado, reconocida por nuestra excelencia en el servicio y compromiso en el abastecimiento de extintores y de equipo contra incendios.",
  valores: ["Confianza", "Seguridad", "Calidad", "Lealtad", "Trabajo en equipo"],
};

export const SITE = {
  origin: "https://www.crmextintores.com",
  locale: "es_MX",
  themeColor: "#C11234",
  ogImage: "/assets/img/logo-crm.png",
};

export const pageSeo = {
  inicio: {
    path: "/",
    title: "Extintores y recarga en CDMX | Grupo CRM Extintores",
    description:
      "Extintores, recarga y primera visita sin costo en CDMX y Estado de México. Cumpla con Protección Civil y evite multas. Cotice por WhatsApp 55 5438 3241.",
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
      "Más de 50 equipos: extintores, chalecos, señalamientos, gabinetes y botiquines. Cotice con Grupo CRM en CDMX y Estado de México.",
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
      "Vea cómo quedan extintores e instalaciones en negocios de CDMX y Estado de México. ¿Quiere el mismo resultado? Cotice con Grupo CRM.",
  },
  contacto: {
    path: "/contacto",
    title: "Contacto y cotización por WhatsApp | Grupo CRM Extintores",
    description:
      "Pida su cotización por WhatsApp 55 5438 3241. Con gusto lo atendemos y la primera visita de revisión es sin costo. Chamixto 131, Cuajimalpa, CDMX.",
  },
  servicios: {
    path: "/servicios",
    title: "Venta, recarga e instalación de extintores | Grupo CRM",
    description:
      "Venta, recarga e instalación de extintores para que su negocio cumpla. Primera visita sin costo. WhatsApp 55 5438 3241.",
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
  blog: {
    path: "/blog",
    title: "Blog de extintores y equipo contra incendios | Grupo CRM",
    description:
      "Guías de extintores en CDMX y Estado de México: tipos de fuego, cómo elegir el equipo, cómo usarlo, NOM-002-STPS-2010 y botiquines. Cotice con Grupo CRM.",
  },
  articulo: {
    path: "/blog",
    title: "Guía | Grupo CRM Extintores",
    description:
      "Guías prácticas de extintores y equipo contra incendios para negocios en CDMX y Estado de México.",
  },
  error: {
    path: "/404",
    title: "Página no encontrada | Grupo CRM Extintores",
    description:
      "Esta página no existe. Vuelva al inicio o cotice extintores por WhatsApp con Grupo CRM Extintores en CDMX.",
    robots: "noindex, nofollow",
  },
};

export const blogPosts = [
  {
    slug: "tipos-de-fuego",
    path: "/blog/tipos-de-fuego",
    title: "Tipos de fuego y cómo elegir el extintor correcto | Grupo CRM",
    heading: "Tipos de fuego y cómo elegir el mejor extintor",
    description:
      "Clases de fuego A, B, C y K, y qué extintor le conviene: PQS ABC, CO₂, agua o tipo K. Guía para negocios en CDMX y Estado de México.",
    kicker: "Guía práctica",
    excerpt: "Qué cubre cada clase de fuego y cómo elegir PQS ABC, CO₂, agua o tipo K según su condominio, restaurante u oficina.",
    datePublished: "2026-08-27",
    image: "/assets/img/catalog/CRM-0003.png",
    imageAlt: "Extintor Grupo CRM de polvo químico seco ABC",
  },
  {
    slug: "como-usar-un-extintor",
    path: "/blog/como-usar-un-extintor",
    title: "Cómo usar un extintor ante un conato de incendio | Grupo CRM",
    heading: "Cómo usar un extintor ante un conato de incendio",
    description:
      "Aprenda a usar un extintor, sus partes y qué contiene. Qué es un fuego incipiente y cuándo evacuar. Atención en CDMX y Estado de México.",
    kicker: "Guía práctica",
    excerpt: "Partes del extintor, qué contiene y cómo actuar solo si el fuego sigue en su etapa inicial.",
    datePublished: "2026-08-24",
    image: "/assets/img/categoria-extintores.png",
    imageAlt: "Extintor montado en pared",
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
    image: "/assets/img/crop/galeria-extintores-sitio.jpg",
    imageAlt: "Extintores instalados en un establecimiento",
  },
  {
    slug: "extintor-6-kg",
    path: "/blog/extintor-6-kg",
    title: "Extintor de 6 kg: tipos, usos y cómo cotizar | Grupo CRM",
    heading: "Extintor de 6 kg: tipos, usos y cómo cotizar",
    description:
      "Guía del extintor de 6 kg (PQS, CO₂, agua y automático). Pida su cotización por WhatsApp en CDMX y Estado de México, con el precio real de su caso.",
    kicker: "Catálogo",
    excerpt: "PQS, CO₂, agua y qué implica un extintor automático. Le ayudamos a elegir el que de verdad necesita.",
    datePublished: "2026-08-24",
    image: "/assets/img/catalog/CRM-0004.png",
    imageAlt: "Extintor de PQS ABC de 6.0 kg",
  },
  {
    slug: "nom-002-stps-2010",
    path: "/blog/nom-002-stps-2010",
    title: "NOM-002-STPS-2010: señalización y punto de reunión | Grupo CRM",
    heading: "NOM-002-STPS-2010: prevención, señalización y punto de reunión",
    description:
      "Qué implica la NOM-002-STPS-2010 en centros de trabajo: señalización de extintor, punto de reunión y botiquín. Apoyo en CDMX y Estado de México.",
    kicker: "Normatividad",
    excerpt: "Prevención en centros de trabajo, señales del extintor, punto de reunión y botiquín.",
    datePublished: "2026-08-24",
    image: "/assets/img/categoria-senalamiento-vial.png",
    imageAlt: "Señalamientos de seguridad y vialidad",
  },
  {
    slug: "botiquin-primeros-auxilios",
    path: "/blog/botiquin-primeros-auxilios",
    title: "Botiquín de primeros auxilios para empresas | Grupo CRM",
    heading: "Botiquín de primeros auxilios: cómo elegirlo para su negocio",
    description:
      "Botiquines metálicos de pared para oficinas, escuelas y comercios. Complemento del equipo contra incendios. Cotice en CDMX y Estado de México.",
    kicker: "Catálogo",
    excerpt: "Tres tamaños de pared para completar el equipo de emergencia de su local o empresa.",
    datePublished: "2026-08-24",
    image: "/assets/img/categoria-botiquines.png",
    imageAlt: "Botiquín de emergencia de pared",
  },
];

export function blogPostBySlug(slug) {
  return blogPosts.find((post) => post.slug === slug);
}

export const catSeo = {
  extintores:
    "Extintores PQS, CO₂, tipo K y unidades móviles. Cotice venta y recarga con Grupo CRM en CDMX y Estado de México. WhatsApp 55 5438 3241.",
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
    src: `/assets/img/crop/${stem}.jpg`,
    full: `/assets/img/full/${stem}.jpg`,
    fit: "cover",
    kicker,
    title,
    note,
    venue,
  };
}

export const lookbook = [
  shot("galeria-extintores-sitio", "Listos en su comercio", "Extintores instalados en un establecimiento.", "campo"),
  shot("galeria-salon-eventos", "Salón de eventos", "Protección en salón, restaurante y bar.", "gastronomia"),
  shot("galeria-bar", "Bar y terraza", "Extintores a la mano en la barra y la terraza.", "gastronomia"),
  shot("galeria-comercio", "Comercio e industria", "Suministro e instalación en almacén y punto de venta.", "locales"),
  shot("galeria-deportivo", "Instalación deportiva", "Extintores y gabinetes en un campo y academia de fútbol.", "campo"),
  shot("galeria-gabinetes-sitio", "Punto de incendio", "Gabinetes y portaextintores listos para instalar en su sitio.", "campo"),
  shot("galeria-automotriz", "Agencia automotriz", "Extintores PQS y CO₂ en agencia y taller.", "automotriz"),
  shot("galeria-parrilla", "Terraza y parrilla", "Extintores en cocina al aire libre y espacios de eventos.", "gastronomia"),
  shot("galeria-obra", "Obra en construcción", "Equipo en sitio para proteger a su cuadrilla.", "industria"),
  shot("galeria-local", "Local comercial", "Extintor en el acceso de un negocio de alimentos.", "locales"),
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
  shot("galeria-camioneta", "Servicio a domicilio", "Llevamos el equipo hasta su unidad o su negocio.", "transporte"),
  shot("galeria-comedor", "Terraza de restaurante", "Extintores en el comedor de un restaurante y salón.", "gastronomia"),
  shot("galeria-alberca", "Alberca", "Extintores junto a una alberca cubierta.", "campo"),
  shot("galeria-madereria", "Maderería", "Extintores en un almacén de tableros.", "industria"),
  shot("galeria-evento", "Jornada en sitio", "Revisión y demostración con el mismo equipo que usted va a usar.", "campo"),
  shot("galeria-inventario", "Listos para recargar", "Extintores preparados para suministro y recarga en su negocio.", "campo"),
  shot("galeria-curso-brigada", "Conformación de brigadas", "Participantes y equipo al cierre de una capacitación de Grupo CRM.", "cursos", "Capacitación"),
  shot("galeria-curso-combate", "Combate contra incendios", "Práctica con extintor, con instructor en sitio.", "cursos", "Capacitación"),
  shot("galeria-curso-primeros-auxilios", "Primeros auxilios", "Práctica de vendaje y atención inicial en un curso de brigada.", "cursos", "Capacitación"),
  shot("galeria-curso-rescate", "Búsqueda y rescate", "Inmovilización en tabla durante el curso de brigada.", "cursos", "Capacitación"),
  shot("galeria-curso-co2", "Uso del extintor", "Descarga controlada durante la capacitación.", "cursos", "Capacitación"),
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
  item("CRM-0046", "Botiquín metálico de pared - chico", "botiquines", "17 × 23 × 6 cm", "Lámina troquelada y esmaltada", "", "Hogares, oficinas, comercios y pequeños negocios.", "Botiquín metálico para instalación en pared, fabricado en lámina troquelada y esmaltada. Medidas: 17 × 23 × 6 cm."),
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

export const faqs = [
  {
    q: "¿Qué equipo puedo cotizar?",
    a: "Extintores, chalecos, señalamientos, gabinetes, botiquines y equipo de protección. Si no encuentra algo, escríbanos y con gusto lo buscamos por usted.",
  },
  {
    q: "¿En qué zonas atienden?",
    a: "Atendemos toda la Ciudad de México y el Estado de México. Nos encuentra en Chamixto 131, Col. Loma del Padre, Cuajimalpa.",
  },
  {
    q: "¿Cómo pido una cotización?",
    a: "Como le resulte más cómodo: WhatsApp 55 5438 3241, teléfono o el formulario de esta página. Aceptamos tarjeta y meses sin intereses.",
  },
  {
    q: "¿Cuál es el horario de atención?",
    a: "Lunes a viernes, de 9:00 a 18:00. Si nos escribe fuera de ese horario, le respondemos al siguiente día hábil.",
  },
  {
    q: "¿Me ayudan a cumplir con Protección Civil en mi condominio?",
    a: "Claro que sí. Revisamos extintores, señalamientos y puntos de incendio, y le decimos con claridad qué le falta. La primera visita es sin costo.",
  },
  {
    q: "¿Qué extintor necesito?",
    a: 'Depende de lo que quiera proteger: clase A para sólidos, B para líquidos, C para equipo eléctrico y K para cocinas. En el blog explicamos <a href="/blog/tipos-de-fuego">cómo elegir el extintor</a>. En cada ficha viene la clase y, si tiene dudas, con gusto lo orientamos.',
  },
];

export const services = [
  {
    icon: "fa-solid fa-fire-extinguisher",
    title: "Venta de extintores",
    text: "Equipos nuevos y certificados para su condominio, cocina u oficina.",
  },
  {
    icon: "fa-solid fa-rotate",
    title: "Recarga de extintores",
    text: "A tiempo, para que su equipo nunca falle en una inspección.",
  },
  {
    icon: "fa-solid fa-screwdriver-wrench",
    title: "Instalación de extintores",
    text: "Colocamos sus extintores y puntos de incendio donde deben ir.",
  },
  {
    icon: "fa-solid fa-signs-post",
    title: "Señalamientos",
    text: "De emergencia y vialidad, para dejar su inmueble en regla.",
  },
  {
    icon: "fa-solid fa-kit-medical",
    title: "Botiquines",
    text: "Tres tamaños de pared, según el tamaño de su negocio.",
  },
  {
    icon: "fa-solid fa-clipboard-check",
    title: "Revisión en sitio",
    text: "La primera visita es sin costo y sin compromiso.",
  },
];

export const courses = {
  title: "Cursos y capacitaciones",
  lead: "Formamos brigadas en su sitio para que su personal sepa cómo actuar ante una emergencia.",
  items: [
    "Primeros auxilios",
    "Combate contra incendios",
    "Búsqueda y rescate",
    "Evacuación de inmueble",
    "Atención de emergencias de materiales peligrosos",
    "Conformación de brigadas",
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

export function waUrl(text = "Hola, quiero una cotización de extintores y equipo contra incendio para mi negocio.") {
  return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(text)}`;
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
  return detail ? `${p.title}, Grupo CRM Extintores` : p.title;
}

export function lookAlt(item) {
  const note = String(item?.note || "").replace(/\s+/g, " ").trim();
  if (note) return note;
  const title = String(item?.title || "").trim();
  return title || "Instalación de extintores de Grupo CRM Extintores";
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

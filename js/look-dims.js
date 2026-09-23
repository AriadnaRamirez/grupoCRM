/** Natural width/height of *-800.webp lookbook assets (aspect-ratio truth). Auto-ish snapshot. */
export const lookDims = {
  "blog-cascos": [
    800,
    446
  ],
  "blog-extintor-6kg": [
    800,
    446
  ],
  "blog-extintor-uso": [
    800,
    446
  ],
  "blog-extintores-cdmx": [
    800,
    446
  ],
  "blog-instalar": [
    800,
    446
  ],
  "blog-portada": [
    800,
    446
  ],
  "blog-recarga": [
    800,
    446
  ],
  "blog-tipos-fuego": [
    800,
    446
  ],
  "foto-extintor-manos": [
    800,
    597
  ],
  "galeria-alberca": [
    800,
    1000
  ],
  "galeria-almacen": [
    800,
    683
  ],
  "galeria-automotriz": [
    800,
    1080
  ],
  "galeria-bar": [
    800,
    872
  ],
  "galeria-bodega": [
    800,
    1067
  ],
  "galeria-cafeteria": [
    800,
    1067
  ],
  "galeria-camioneta": [
    800,
    1638
  ],
  "galeria-campus": [
    800,
    869
  ],
  "galeria-clinica": [
    800,
    1067
  ],
  "galeria-cocina": [
    800,
    1350
  ],
  "galeria-comedor": [
    800,
    1056
  ],
  "galeria-comercio": [
    800,
    748
  ],
  "galeria-curso-brigada": [
    800,
    600
  ],
  "galeria-curso-campo": [
    754,
    904
  ],
  "galeria-curso-combate": [
    645,
    1024
  ],
  "galeria-curso-comunidad": [
    711,
    1024
  ],
  "galeria-curso-instructivo": [
    800,
    600
  ],
  "galeria-curso-primeros-auxilios": [
    800,
    600
  ],
  "galeria-curso-rescate": [
    768,
    1024
  ],
  "galeria-deportivo": [
    800,
    566
  ],
  "galeria-entrega": [
    800,
    600
  ],
  "galeria-escuela": [
    800,
    1001
  ],
  "galeria-escuela-patio": [
    800,
    428
  ],
  "galeria-estacionamiento": [
    800,
    600
  ],
  "galeria-evento": [
    800,
    744
  ],
  "galeria-extintores-sitio": [
    800,
    866
  ],
  "galeria-gabinetes-sitio": [
    800,
    1029
  ],
  "galeria-inventario": [
    800,
    627
  ],
  "galeria-lavanderia": [
    800,
    912
  ],
  "galeria-local": [
    800,
    924
  ],
  "galeria-madereria": [
    800,
    805
  ],
  "galeria-obra": [
    800,
    913
  ],
  "galeria-panaderia": [
    800,
    1088
  ],
  "galeria-parrilla": [
    800,
    925
  ],
  "galeria-restaurante": [
    800,
    1128
  ],
  "galeria-salon-eventos": [
    800,
    897
  ],
  "galeria-showroom": [
    800,
    620
  ],
  "galeria-showroom-muro": [
    800,
    647
  ],
  "galeria-trailer": [
    800,
    1094
  ],
  "galeria-transporte": [
    800,
    1141
  ],
  "galeria-vapiano": [
    800,
    1067
  ],
  "hero-nosotros": [
    800,
    446
  ]
};

export function lookSize(stem, fallback = [800, 600]) {
  const pair = lookDims[stem];
  return pair ? { width: pair[0], height: pair[1] } : { width: fallback[0], height: fallback[1] };
}

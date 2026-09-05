import type { RouteQuote, TravelNotification, TravelPackage } from "./models";

const gallery = (main: string, second: string, third: string) => [main, second, third];

export const PACKAGES: TravelPackage[] = [
  {
    id: 1, slug: "cartagena-con-encanto", name: "Cartagena con encanto", destination: "Cartagena", department: "Bolívar", category: "Playa y cultura",
    description: "Murallas, atardeceres frente al Caribe y una estadía familiar a pocos pasos del mar.", price: 1890000, days: 4, nights: 3, stars: 5, rating: 4.9,
    breakfast: true, freeCancellation: true, petFriendly: true, hotel: "Casa del Mar Boutique", image: "/destinos/cartagena.jpg",
    gallery: gallery("/destinos/cartagena.jpg", "/destinos/mompox.jpg", "/destinos/tolu.jpg"),
    itinerary: [
      { day: 1, title: "Bienvenida al Caribe", description: "Recepción, traslado y paseo suave por Getsemaní al atardecer." },
      { day: 2, title: "Ciudad amurallada", description: "Recorrido guiado, plazas coloniales y degustación de sabores cartageneros." },
      { day: 3, title: "Día de playa", description: "Excursión a Barú con almuerzo, tiempo libre y actividades familiares." },
      { day: 4, title: "Últimas postales", description: "Desayuno, mañana libre y traslado de regreso." },
    ],
    included: ["Hotel 5 estrellas", "Desayunos", "Traslados locales", "Tour guiado", "Asistencia Mareva"],
    excluded: ["Almuerzos no indicados", "Gastos personales", "Impuesto de muelle"], petFee: 90000,
  },
  {
    id: 2, slug: "san-andres-todo-incluido", name: "San Andrés todo incluido", destination: "San Andrés", department: "Archipiélago", category: "Playa",
    description: "Cinco días frente al mar de los siete colores con comidas, experiencias y descanso incluidos.", price: 2740000, days: 5, nights: 4, stars: 5, rating: 4.8,
    breakfast: true, freeCancellation: false, petFriendly: false, hotel: "Coral Bay Resort", image: "/destinos/san-andres.jpg",
    gallery: gallery("/destinos/san-andres.jpg", "/destinos/capurgana.jpg", "/destinos/gorgona.jpg"),
    itinerary: [
      { day: 1, title: "Llegada a la isla", description: "Traslado al hotel, cóctel de bienvenida y cena frente al mar." },
      { day: 2, title: "Vuelta a la isla", description: "Recorrido por Hoyo Soplador, West View y playas del sur." },
      { day: 3, title: "Johnny Cay", description: "Día de cayo, almuerzo caribeño y visita al acuario." },
      { day: 4, title: "Mar a tu ritmo", description: "Día libre con deportes náuticos opcionales." },
      { day: 5, title: "Regreso", description: "Desayuno y traslado al aeropuerto." },
    ],
    included: ["Resort 5 estrellas", "Todas las comidas", "Traslados", "Tour de isla"], excluded: ["Tarjeta de turismo", "Bebidas premium"], petFee: 0,
  },
  {
    id: 3, slug: "eje-cafetero-en-familia", name: "Eje Cafetero en familia", destination: "Eje Cafetero", department: "Quindío", category: "Naturaleza",
    description: "Café, paisajes verdes y actividades para todas las edades en el corazón del Quindío.", price: 1350000, days: 4, nights: 3, stars: 4, rating: 4.9,
    breakfast: true, freeCancellation: true, petFriendly: true, hotel: "Finca La Palma", image: "/destinos/eje-cafetero.jpg",
    gallery: gallery("/destinos/eje-cafetero.jpg", "/destinos/valle-cocora.jpg", "/destinos/guatape.jpg"),
    itinerary: [
      { day: 1, title: "Aroma a café", description: "Llegada a la finca y experiencia de catación para grandes y pequeños." },
      { day: 2, title: "Valle del Cocora", description: "Caminata familiar, miradores y almuerzo en Salento." },
      { day: 3, title: "Día de aventura", description: "Parque del Café y tarde de piscina en la finca." },
      { day: 4, title: "Despedida", description: "Desayuno campesino y regreso." },
    ],
    included: ["Finca hotel", "Desayunos", "Entradas", "Guía local"], excluded: ["Almuerzos", "Transporte hasta Armenia"], petFee: 55000,
  },
  {
    id: 4, slug: "medellin-vibrante", name: "Medellín vibrante", destination: "Medellín", department: "Antioquia", category: "Ciudad",
    description: "Diseño, cultura y flores en una escapada urbana llena de contrastes.", price: 1190000, days: 3, nights: 2, stars: 4, rating: 4.7,
    breakfast: true, freeCancellation: true, petFriendly: true, hotel: "Laureles Living", image: "/destinos/medellin.jpg",
    gallery: gallery("/destinos/medellin.jpg", "/destinos/guatape.jpg", "/destinos/eje-cafetero.jpg"),
    itinerary: [
      { day: 1, title: "Medellín moderna", description: "Llegada y recorrido por Parques del Río y Provenza." },
      { day: 2, title: "Transformación", description: "Comuna 13, metrocable y picnic en el Jardín Botánico." },
      { day: 3, title: "Sabores paisas", description: "Mercado local, desayuno tardío y regreso." },
    ],
    included: ["Hotel 4 estrellas", "Desayunos", "City tour", "Tarjeta Cívica"], excluded: ["Vuelos", "Cenas"], petFee: 70000,
  },
  {
    id: 5, slug: "tayrona-natural", name: "Tayrona natural", destination: "Santa Marta", department: "Magdalena", category: "Ecoturismo",
    description: "Senderos entre selva y mar con noches de descanso en un ecolodge pet friendly.", price: 1580000, days: 4, nights: 3, stars: 4, rating: 4.8,
    breakfast: true, freeCancellation: false, petFriendly: true, hotel: "Mendihuaca Eco Lodge", image: "/destinos/tayrona.jpg",
    gallery: gallery("/destinos/tayrona.jpg", "/destinos/sierra-nevada.jpg", "/destinos/nuqui.jpg"),
    itinerary: [
      { day: 1, title: "Encuentro con la Sierra", description: "Traslado al ecolodge y bienvenida de frutos tropicales." },
      { day: 2, title: "Sendero costero", description: "Caminata guiada por Arrecifes hasta Cabo San Juan." },
      { day: 3, title: "Río y bienestar", description: "Tubing suave, masaje opcional y fogata." },
      { day: 4, title: "Regreso", description: "Desayuno y traslado a Santa Marta." },
    ],
    included: ["Ecolodge", "Desayunos", "Entradas", "Guía ambiental"], excluded: ["Cena del día 3", "Seguro de aventura"], petFee: 80000,
  },
  {
    id: 6, slug: "barichara-colonial", name: "Barichara colonial", destination: "Barichara", department: "Santander", category: "Cultura",
    description: "Caminos de piedra, talleres artesanales y cocina santandereana en el pueblo más bonito.", price: 890000, days: 3, nights: 2, stars: 3, rating: 4.6,
    breakfast: true, freeCancellation: true, petFriendly: false, hotel: "Posada del Campanario", image: "/destinos/barichara.jpg",
    gallery: gallery("/destinos/barichara.jpg", "/destinos/chicamocha.jpg", "/destinos/boyaca.jpg"),
    itinerary: [
      { day: 1, title: "Pueblo de piedra", description: "Llegada, paseo patrimonial y cena tradicional." },
      { day: 2, title: "Camino Real", description: "Caminata a Guane y taller de papel artesanal." },
      { day: 3, title: "Miradores", description: "Desayuno, mirador del Suárez y regreso." },
    ],
    included: ["Posada 3 estrellas", "Desayunos", "Guía", "Taller artesanal"], excluded: ["Transporte intermunicipal", "Cenas"], petFee: 0,
  },
  {
    id: 7, slug: "amazonas-esencial", name: "Amazonas esencial", destination: "Amazonas", department: "Amazonas", category: "Aventura",
    description: "Comunidades, delfines rosados y noches de selva con acompañamiento experto.", price: 2950000, days: 5, nights: 4, stars: 4, rating: 4.9,
    breakfast: true, freeCancellation: false, petFriendly: false, hotel: "Selva Viva Lodge", image: "/destinos/amazonas.jpg",
    gallery: gallery("/destinos/amazonas.jpg", "/destinos/cano-cristales.jpg", "/destinos/gorgona.jpg"),
    itinerary: [
      { day: 1, title: "Llegada a Leticia", description: "Recepción y caminata de orientación." },
      { day: 2, title: "Río Amazonas", description: "Navegación, avistamiento y visita a comunidad local." },
      { day: 3, title: "Puerto Nariño", description: "Senderos y mirador Naipata." },
      { day: 4, title: "Reserva natural", description: "Experiencia interpretativa de selva." },
      { day: 5, title: "Regreso", description: "Desayuno y traslado al aeropuerto." },
    ],
    included: ["Lodge", "Alimentación completa", "Transportes fluviales", "Guía"], excluded: ["Vuelos", "Vacuna fiebre amarilla"], petFee: 0,
  },
  {
    id: 8, slug: "tatacoa-bajo-las-estrellas", name: "Tatacoa bajo las estrellas", destination: "Neiva", department: "Huila", category: "Aventura",
    description: "Desierto rojo, observación astronómica y una ruta económica ideal para ir en carro.", price: 740000, days: 3, nights: 2, stars: 3, rating: 4.7,
    breakfast: false, freeCancellation: true, petFriendly: true, hotel: "Biohotel El Cuzco", image: "/destinos/tatacoa.jpg",
    gallery: gallery("/destinos/tatacoa.jpg", "/destinos/cano-cristales.jpg", "/destinos/chicamocha.jpg"),
    itinerary: [
      { day: 1, title: "Desierto rojo", description: "Llegada y caminata al atardecer por El Cuzco." },
      { day: 2, title: "Universo Tatacoa", description: "Piscina natural, sendero gris y observatorio astronómico." },
      { day: 3, title: "Villavieja", description: "Museo paleontológico y regreso." },
    ],
    included: ["Biohotel", "Observatorio", "Guía local"], excluded: ["Alimentación", "Combustible y peajes"], petFee: 45000,
  },
];

export const ROUTES: Record<string, RouteQuote[]> = {
  Cartagena: [
    { name: "Ruta rápida", tolls: 9, tollCost: 112400, distance: 1045, duration: "17 h 10 min", fuel: 232000 },
    { name: "Ruta ahorradora", tolls: 7, tollCost: 84600, distance: 1092, duration: "18 h 35 min", fuel: 226000 },
  ],
  Medellín: [
    { name: "Ruta rápida", tolls: 6, tollCost: 73500, distance: 418, duration: "8 h 05 min", fuel: 104000 },
    { name: "Ruta ahorradora", tolls: 4, tollCost: 51200, distance: 446, duration: "9 h 10 min", fuel: 98000 },
  ],
  "Eje Cafetero": [
    { name: "Ruta rápida", tolls: 5, tollCost: 64100, distance: 286, duration: "6 h 40 min", fuel: 76000 },
    { name: "Ruta ahorradora", tolls: 3, tollCost: 39700, distance: 315, duration: "7 h 35 min", fuel: 72000 },
  ],
  Neiva: [
    { name: "Ruta rápida", tolls: 4, tollCost: 48200, distance: 313, duration: "5 h 45 min", fuel: 81000 },
    { name: "Ruta ahorradora", tolls: 3, tollCost: 35600, distance: 329, duration: "6 h 25 min", fuel: 78000 },
  ],
};

export const INITIAL_NOTIFICATIONS: TravelNotification[] = [
  { id: 1, title: "Tu viaje se acerca", message: "Faltan 3 días para Cartagena. Revisa tu voucher y equipaje.", time: "Hoy, 9:20 a. m.", kind: "reminder" },
  { id: 2, title: "Pago aprobado", message: "Recibimos el abono de tu reserva MV-24018.", time: "Ayer", kind: "payment", read: true },
];

export const ADMIN_SECTIONS = [
  ["dashboard", "Resumen de ventas"], ["packages", "Paquetes"], ["hotels", "Hoteles"], ["tolls", "Peajes 2026"],
  ["reservations", "Reservas"], ["transport", "Transporte"], ["users", "Usuarios"], ["coupons", "Cupones"], ["notifications", "Notificaciones"],
] as const;

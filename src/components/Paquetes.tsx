

const PAQUETES = [
  {
    slug: "cartagena-magica",
    nombre: "Cartagena Mágica",
    categoria: "Playa",
    precio: 1850000,
    duracion_dias: 5,
    duracion_noches: 4,
    descripcion:
      "Descubre la ciudad amurallada con playas privadas e historia colonial.",
    emoji: "🏰",
    destino: "Cartagena",
    departamento: "Bolívar",
  },
  {
    slug: "medellin-innovadora",
    nombre: "Medellín Innovadora",
    categoria: "Ciudad",
    precio: 1200000,
    duracion_dias: 4,
    duracion_noches: 3,
    descripcion:
      "Conoce la ciudad más transformadora de América Latina.",
    emoji: "🚡",
    destino: "Medellín",
    departamento: "Antioquia",
  },
  {
    slug: "guatape-extremo",
    nombre: "Guatapé Extremo",
    categoria: "Aventura",
    precio: 890000,
    duracion_dias: 3,
    duracion_noches: 2,
    descripcion:
      "Adrenalina pura: sube la Piedra del Peñol y navega el embalse.",
    emoji: "🪨",
    destino: "Guatapé",
    departamento: "Antioquia",
  },
  {
    slug: "san-andres-todo-incluido",
    nombre: "San Andrés Todo Incluido",
    categoria: "Playa",
    precio: 3200000,
    duracion_dias: 7,
    duracion_noches: 6,
    descripcion:
      "El mar de los siete colores con todo incluido en resort 5 estrellas.",
    emoji: "🏝️",
    destino: "San Andrés",
    departamento: "San Andrés",
  },
  {
    slug: "tayrona-salvaje",
    nombre: "Tayrona Salvaje",
    categoria: "Ecoturismo",
    precio: 1450000,
    duracion_dias: 5,
    duracion_noches: 4,
    descripcion:
      "Selva, playas vírgenes y ecosistemas únicos en el Parque Tayrona.",
    emoji: "🌴",
    destino: "Parque Tayrona",
    departamento: "Magdalena",
  },
  {
    slug: "valle-cocora-mistico",
    nombre: "Valle del Cocora Místico",
    categoria: "Ecoturismo",
    precio: 980000,
    duracion_dias: 3,
    duracion_noches: 2,
    descripcion:
      "Caminata entre palmas de cera y fincas cafeteras del Quindío.",
    emoji: "🌿",
    destino: "Valle del Cocora",
    departamento: "Quindío",
  },
  {
    slug: "amazonas-aventura",
    nombre: "Amazonas Aventura",
    categoria: "Aventura",
    precio: 2750000,
    duracion_dias: 6,
    duracion_noches: 5,
    descripcion:
      "Explora la selva amazónica y conoce comunidades indígenas.",
    emoji: "🦜",
    destino: "Leticia",
    departamento: "Amazonas",
  },
  {
    slug: "tatacoa",
    nombre: "Desierto de la Tatacoa",
    categoria: "Aventura",
    precio: 750000,
    duracion_dias: 3,
    duracion_noches: 2,
    descripcion:
      "Observación astronómica y recorridos por paisajes únicos.",
    emoji: "🌵",
    destino: "Desierto Tatacoa",
    departamento: "Huila",
  },
  {
    slug: "cano-cristales",
    nombre: "Caño Cristales Premium",
    categoria: "Aventura",
    precio: 2950000,
    duracion_dias: 5,
    duracion_noches: 4,
    descripcion:
      "Visita el río más hermoso del mundo con guía especializado.",
    emoji: "🌈",
    destino: "Caño Cristales",
    departamento: "Meta",
  },
  {
    slug: "eje-cafetero",
    nombre: "Eje Cafetero Tradicional",
    categoria: "Cultural",
    precio: 1350000,
    duracion_dias: 4,
    duracion_noches: 3,
    descripcion:
      "Recorrido por fincas cafeteras y pueblos patrimonio.",
    emoji: "☕",
    destino: "Armenia",
    departamento: "Quindío",
  },
  {
    slug: "nuqui-ecoturismo",
    nombre: "Nuquí Ecoturismo",
    categoria: "Playa",
    precio: 2400000,
    duracion_dias: 5,
    duracion_noches: 4,
    descripcion:
      "Avistamiento de ballenas y playas vírgenes del Pacífico.",
    emoji: "🐋",
    destino: "Nuquí",
    departamento: "Chocó",
  },
  {
    slug: "barichara-colonial",
    nombre: "Barichara Colonial",
    categoria: "Cultural",
    precio: 890000,
    duracion_dias: 3,
    duracion_noches: 2,
    descripcion:
      "Conoce uno de los pueblos más bellos de Colombia.",
    emoji: "🏘️",
    destino: "Barichara",
    departamento: "Santander",
  },
];

function Paquetes() {
  return (
    <div className="paquetes-container">

      <div className="paquetes-header">
        <span>MAREVA • VIAJES POR COLOMBIA</span>

        <h1>Descubre tu próximo destino</h1>

        <p>
          Explora nuestros paquetes turísticos y vive experiencias
          inolvidables por Colombia.
        </p>
      </div>

      <div className="paquetes-grid">

        {PAQUETES.map((paquete) => (
          <div className="paquete-card" key={paquete.slug}>

            <div className="paquete-emoji">
              {paquete.emoji}
            </div>

            <div className="paquete-content">

              <span className="paquete-categoria">
                {paquete.categoria}
              </span>

              <h2>{paquete.nombre}</h2>

              <div className="paquete-info">
                <p>
                  📍 <strong>{paquete.destino}</strong>,{" "}
                  {paquete.departamento}
                </p>

                <p>
                  🕐 {paquete.duracion_dias} días /{" "}
                  {paquete.duracion_noches} noches
                </p>
              </div>

              <p className="paquete-descripcion">
                {paquete.descripcion}
              </p>

              <div className="paquete-footer">

                <div>
                  <span>Desde</span>

                  <strong>
                    ${paquete.precio.toLocaleString("es-CO")}
                  </strong>
                </div>

                <button>
                  Reservar
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Paquetes;

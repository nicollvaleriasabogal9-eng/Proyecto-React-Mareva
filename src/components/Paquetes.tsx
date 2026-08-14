import CardAccion from "./CardAccion";
import "./Paquetes.css";

interface Paquete {
  slug: string;
  nombre: string;
  categoria: string;
  precio: number;
  duracion_dias: number;
  duracion_noches: number;
  descripcion: string;
  destino: string;
  departamento: string;
  imagen: string;
}

interface PaquetesProps {
  mostrarMensaje: (titulo: string, mensaje: string) => void;
}

const PAQUETES: Paquete[] = [
  {
    slug: "cartagena-magica",
    nombre: "Cartagena Mágica",
    categoria: "Playa",
    precio: 1850000,
    duracion_dias: 5,
    duracion_noches: 4,
    descripcion:
      "Descubre la ciudad amurallada con playas privadas e historia colonial.",
    destino: "Cartagena",
    departamento: "Bolívar",
    imagen: "/destinos/cartagena.jpg",
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
    destino: "Medellín",
    departamento: "Antioquia",
    imagen: "/destinos/medellin.jpg",
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
    destino: "Guatapé",
    departamento: "Antioquia",
    imagen: "/destinos/guatape.jpg",
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
    destino: "San Andrés",
    departamento: "San Andrés",
    imagen: "/destinos/san-andres.jpg",
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
    destino: "Parque Tayrona",
    departamento: "Magdalena",
    imagen: "/destinos/tayrona.jpg",
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
    destino: "Valle del Cocora",
    departamento: "Quindío",
    imagen: "/destinos/valle-cocora.jpg",
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
    destino: "Leticia",
    departamento: "Amazonas",
    imagen: "/destinos/amazonas.jpg",
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
    destino: "Desierto Tatacoa",
    departamento: "Huila",
    imagen: "/destinos/tatacoa.jpg",
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
    destino: "Caño Cristales",
    departamento: "Meta",
    imagen: "/destinos/cano-cristales.jpg",
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
    destino: "Armenia",
    departamento: "Quindío",
    imagen: "/destinos/eje-cafetero.jpg",
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
    destino: "Nuquí",
    departamento: "Chocó",
    imagen: "/destinos/nuqui.jpg",
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
    destino: "Barichara",
    departamento: "Santander",
    imagen: "/destinos/barichara.jpg",
  },
  {
    slug: "santuario-las-lajas",
    nombre: "Santuario Las Lajas",
    categoria: "Cultural",
    precio: 680000,
    duracion_dias: 3,
    duracion_noches: 2,
    descripcion:
      "Basílica neogótica construida sobre un cañón.",
    destino: "Ipiales",
    departamento: "Nariño",
    imagen: "/destinos/las-lajas.jpg",
  },
  {
    slug: "boyaca-historica",
    nombre: "Boyacá Histórica",
    categoria: "Cultural",
    precio: 980000,
    duracion_dias: 4,
    duracion_noches: 3,
    descripcion:
      "Villa de Leyva, Ráquira y monumentos históricos.",
    destino: "Villa de Leyva",
    departamento: "Boyacá",
    imagen: "/destinos/boyaca.jpg",
  },
  {
    slug: "canon-del-chicamocha",
    nombre: "Cañón del Chicamocha",
    categoria: "Aventura",
    precio: 1150000,
    duracion_dias: 4,
    duracion_noches: 3,
    descripcion:
      "Deportes extremos y paisajes espectaculares.",
    destino: "San Gil",
    departamento: "Santander",
    imagen: "/destinos/chicamocha.jpg",
  },
  {
    slug: "mompox-patrimonial",
    nombre: "Mompox Patrimonial",
    categoria: "Cultural",
    precio: 1250000,
    duracion_dias: 4,
    duracion_noches: 3,
    descripcion:
      "Historia, arquitectura colonial y cultura ribereña.",
    destino: "Mompox",
    departamento: "Bolívar",
    imagen: "/destinos/mompox.jpg",
  },
  {
    slug: "sierra-nevada-ancestral",
    nombre: "Sierra Nevada Ancestral",
    categoria: "Aventura",
    precio: 2100000,
    duracion_dias: 5,
    duracion_noches: 4,
    descripcion:
      "Conexión con comunidades indígenas y naturaleza.",
    destino: "Santa Marta",
    departamento: "Magdalena",
    imagen: "/destinos/sierra-nevada.jpg",
  },
  {
    slug: "tolu-covenas-relax",
    nombre: "Tolú y Coveñas Relax",
    categoria: "Playa",
    precio: 1100000,
    duracion_dias: 4,
    duracion_noches: 3,
    descripcion:
      "Playas tranquilas y actividades acuáticas.",
    destino: "Tolú",
    departamento: "Sucre",
    imagen: "/destinos/tolu.jpg",
  },
  {
    slug: "isla-gorgona-explorer",
    nombre: "Isla Gorgona Explorer",
    categoria: "Aventura",
    precio: 2800000,
    duracion_dias: 5,
    duracion_noches: 4,
    descripcion:
      "Naturaleza, senderismo y biodiversidad marina.",
    destino: "Guapi",
    departamento: "Cauca",
    imagen: "/destinos/gorgona.jpg",
  },
  {
    slug: "capurgana-paraiso",
    nombre: "Capurganá Paraíso",
    categoria: "Playa",
    precio: 1900000,
    duracion_dias: 5,
    duracion_noches: 4,
    descripcion:
      "Playas cristalinas y ecoturismo en el Caribe colombiano.",
    destino: "Acandí",
    departamento: "Chocó",
    imagen: "/destinos/capurgana.jpg",
  },
];

function Paquetes({ mostrarMensaje }: PaquetesProps) {
  return (
    <section className="paquetes-seccion">
      <div className="paquetes-encabezado">
        <span className="paquetes-etiqueta">
          MAREVA · VIAJES POR COLOMBIA
        </span>

        <h1>
          Descubre tu próximo <em>destino</em>
        </h1>

        <p>
          Explora nuestros paquetes turísticos y vive experiencias
          inolvidables por Colombia.
        </p>
      </div>

      <div className="paquetes-grid">
        {PAQUETES.map((paquete) => (
          <article className="paquete-card" key={paquete.slug}>
            <div className="paquete-imagen-container">
              <img
                src={paquete.imagen}
                alt={paquete.nombre}
                className="paquete-imagen"
              />
            </div>

            <div className="paquete-contenido">
              <span className="paquete-categoria">
                {paquete.categoria}
              </span>

              <h2 className="paquete-nombre">
                {paquete.nombre}
              </h2>

              <div className="paquete-datos">
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
                <div className="paquete-precio">
                  <span>Desde</span>

                  <strong>
                    ${paquete.precio.toLocaleString("es-CO")}
                  </strong>
                </div>

                <CardAccion
                  titulo=""
                  texto=""
                  estado=""
                  boton="Reservar"
                  onAccion={() =>
                    mostrarMensaje(
                      "¡Paquete seleccionado!",
                      `Has seleccionado el paquete ${paquete.nombre}. ¡Prepárate para vivir una experiencia inolvidable!`
                    )
                  }
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Paquetes;

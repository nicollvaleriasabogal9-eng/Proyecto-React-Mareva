import { useEffect, useMemo, useState } from "react";
import "./Paquetes.css";

export interface Paquete {
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
  favoritos?: string[];
  cambiarFavorito?: (slug: string) => void;
  seleccionarPaquete: (paquete: Paquete) => void;
}

/* =========================================================
   PAQUETES
========================================================= */

export const PAQUETES: Paquete[] = [
  {
    slug: "cartagena-magica",
    nombre: "Cartagena Mágica",
    categoria: "Playa",
    precio: 1850000,
    duracion_dias: 5,
    duracion_noches: 4,
    descripcion: "Disfruta playas, historia, cultura y el encanto de la ciudad amurallada.",
    destino: "Cartagena",
    departamento: "Bolívar",
    imagen: "/destinos/cartagena.jpg"
  },
  {
    slug: "medellin-innovadora",
    nombre: "Medellín Innovadora",
    categoria: "Ciudad",
    precio: 1200000,
    duracion_dias: 4,
    duracion_noches: 3,
    descripcion: "Descubre la transformación, gastronomía y cultura de Medellín.",
    destino: "Medellín",
    departamento: "Antioquia",
    imagen: "/destinos/medellin.jpg"
  },
  {
    slug: "guatape-extremo",
    nombre: "Guatapé Extremo",
    categoria: "Aventura",
    precio: 890000,
    duracion_dias: 3,
    duracion_noches: 2,
    descripcion: "Naturaleza, aventura y paisajes increíbles alrededor de la Piedra del Peñol.",
    destino: "Guatapé",
    departamento: "Antioquia",
    imagen: "/destinos/guatape.jpg"
  },
  {
    slug: "san-andres-todo-incluido",
    nombre: "San Andrés Todo Incluido",
    categoria: "Playa",
    precio: 3200000,
    duracion_dias: 6,
    duracion_noches: 5,
    descripcion: "Vive el mar de siete colores con una experiencia completa.",
    destino: "San Andrés",
    departamento: "San Andrés",
    imagen: "/destinos/san-andres.jpg"
  },
  {
    slug: "tayrona-salvaje",
    nombre: "Tayrona Salvaje",
    categoria: "Ecoturismo",
    precio: 1450000,
    duracion_dias: 4,
    duracion_noches: 3,
    descripcion: "Conecta con la naturaleza en uno de los lugares más especiales de Colombia.",
    destino: "Parque Tayrona",
    departamento: "Magdalena",
    imagen: "/destinos/tayrona.jpg"
  },
  {
    slug: "valle-cocora-mistico",
    nombre: "Valle del Cocora Místico",
    categoria: "Ecoturismo",
    precio: 980000,
    duracion_dias: 3,
    duracion_noches: 2,
    descripcion: "Recorre paisajes de montaña rodeados de las famosas palmas de cera.",
    destino: "Valle del Cocora",
    departamento: "Quindío",
    imagen: "/destinos/eje-cafetero.jpg"
  },
  {
    slug: "amazonas-aventura",
    nombre: "Amazonas Aventura",
    categoria: "Aventura",
    precio: 2750000,
    duracion_dias: 5,
    duracion_noches: 4,
    descripcion: "Explora la selva amazónica y conoce una biodiversidad única.",
    destino: "Leticia",
    departamento: "Amazonas",
    imagen: "/destinos/amazonas.jpg"
  },
  {
    slug: "tatacoa",
    nombre: "Desierto de la Tatacoa",
    categoria: "Aventura",
    precio: 750000,
    duracion_dias: 3,
    duracion_noches: 2,
    descripcion: "Paisajes desérticos, estrellas y una experiencia completamente diferente.",
    destino: "Desierto de la Tatacoa",
    departamento: "Huila",
    imagen: "/destinos/tatacoa.jpg"
  },
  {
    slug: "cano-cristales",
    nombre: "Caño Cristales Premium",
    categoria: "Ecoturismo",
    precio: 2950000,
    duracion_dias: 5,
    duracion_noches: 4,
    descripcion: "Conoce el río de los cinco colores y los paisajes del Meta.",
    destino: "Caño Cristales",
    departamento: "Meta",
    imagen: "/destinos/cano-cristales.jpg"
  },
  {
    slug: "eje-cafetero",
    nombre: "Eje Cafetero Tradicional",
    categoria: "Cultural",
    precio: 1350000,
    duracion_dias: 4,
    duracion_noches: 3,
    descripcion: "Café, montañas, pueblos tradicionales y cultura colombiana.",
    destino: "Armenia",
    departamento: "Quindío",
    imagen: "/destinos/eje-cafetero.jpg"
  },
  {
    slug: "nuqui",
    nombre: "Nuquí Ecoturismo",
    categoria: "Ecoturismo",
    precio: 2400000,
    duracion_dias: 5,
    duracion_noches: 4,
    descripcion: "Playas, selva y naturaleza en la costa del Pacífico colombiano.",
    destino: "Nuquí",
    departamento: "Chocó",
    imagen: "/destinos/nuqui.jpg"
  },
  {
    slug: "barichara",
    nombre: "Barichara Colonial",
    categoria: "Cultural",
    precio: 890000,
    duracion_dias: 3,
    duracion_noches: 2,
    descripcion: "Arquitectura colonial, calles de piedra y paisajes de Santander.",
    destino: "Barichara",
    departamento: "Santander",
    imagen: "/destinos/barichara.jpg"
  },
  {
    slug: "las-lajas",
    nombre: "Santuario Las Lajas",
    categoria: "Cultural",
    precio: 680000,
    duracion_dias: 3,
    duracion_noches: 2,
    descripcion: "Conoce uno de los santuarios más impresionantes de Colombia.",
    destino: "Ipiales",
    departamento: "Nariño",
    imagen: "/destinos/las-lajas.jpg"
  },
  {
    slug: "boyaca-historica",
    nombre: "Boyacá Histórica",
    categoria: "Cultural",
    precio: 980000,
    duracion_dias: 3,
    duracion_noches: 2,
    descripcion: "Historia, arquitectura y pueblos tradicionales de Boyacá.",
    destino: "Villa de Leyva",
    departamento: "Boyacá",
    imagen: "/destinos/villa-de-leyva.jpg"
  },
  {
    slug: "chicamocha",
    nombre: "Cañón del Chicamocha",
    categoria: "Aventura",
    precio: 1150000,
    duracion_dias: 3,
    duracion_noches: 2,
    descripcion: "Paisajes increíbles y aventura en el impresionante cañón.",
    destino: "San Gil",
    departamento: "Santander",
    imagen: "/destinos/chicamocha.jpg"
  },
  {
    slug: "mompox",
    nombre: "Mompox Patrimonial",
    categoria: "Cultural",
    precio: 1250000,
    duracion_dias: 4,
    duracion_noches: 3,
    descripcion: "Historia, arquitectura y tranquilidad a orillas del río Magdalena.",
    destino: "Mompox",
    departamento: "Bolívar",
    imagen: "/destinos/mompox.jpg"
  },
  {
    slug: "sierra-nevada",
    nombre: "Sierra Nevada Ancestral",
    categoria: "Ecoturismo",
    precio: 2100000,
    duracion_dias: 5,
    duracion_noches: 4,
    descripcion: "Naturaleza, montaña y conexión con culturas ancestrales.",
    destino: "Santa Marta",
    departamento: "Magdalena",
    imagen: "/destinos/santa-marta.jpg"
  },
  {
    slug: "tolu-covenas",
    nombre: "Tolú y Coveñas Relax",
    categoria: "Playa",
    precio: 1100000,
    duracion_dias: 4,
    duracion_noches: 3,
    descripcion: "Sol, playa y descanso en la costa del Caribe colombiano.",
    destino: "Tolú",
    departamento: "Sucre",
    imagen: "/destinos/tolu.jpg"
  },
  {
    slug: "gorgona",
    nombre: "Isla Gorgona Explorer",
    categoria: "Aventura",
    precio: 2800000,
    duracion_dias: 5,
    duracion_noches: 4,
    descripcion: "Una aventura natural entre selva, mar y biodiversidad.",
    destino: "Guapi",
    departamento: "Cauca",
    imagen: "/destinos/gorgona.jpg"
  },
  {
    slug: "capurgana",
    nombre: "Capurganá Paraíso",
    categoria: "Playa",
    precio: 1900000,
    duracion_dias: 5,
    duracion_noches: 4,
    descripcion: "Playas cristalinas y naturaleza en el Caribe colombiano.",
    destino: "Acandí",
    departamento: "Chocó",
    imagen: "/destinos/capurgana.jpg"
  }
];

const CATEGORIAS = [
  { nombre: "Todas", icono: "✨" },
  { nombre: "Playa", icono: "🏖️" },
  { nombre: "Ciudad", icono: "🏙️" },
  { nombre: "Aventura", icono: "🧗" },
  { nombre: "Ecoturismo", icono: "🌿" },
  { nombre: "Cultural", icono: "🏛️" }
];

function formatearPrecio(valor: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(valor);
}

function obtenerImagen(paquete: Paquete): string {
  if (paquete.imagen && paquete.imagen.trim() !== "") {
    return paquete.imagen;
  }

  return "/destinos/tayrona.jpg";
}

export default function Paquetes({
  mostrarMensaje,
  favoritos = [],
  cambiarFavorito,
  seleccionarPaquete
}: PaquetesProps) {

  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState("Todas");

  const [paquetes, setPaquetes] =
    useState<Paquete[]>(PAQUETES);

  const [busqueda, setBusqueda] = useState({
    destino: "",
    fechaIda: "",
    fechaRegreso: "",
    adultos: 2,
    menores: 0,
    bebes: 0
  });

  const [busquedaActiva, setBusquedaActiva] =
    useState(false);

  /* =====================================================
     CARGAR PAQUETES GUARDADOS
  ===================================================== */

  useEffect(() => {
    try {
      const guardados = localStorage.getItem("mareva_paquetes");

      if (guardados) {
        const parsed = JSON.parse(guardados);

        if (Array.isArray(parsed) && parsed.length > 0) {
          setPaquetes(parsed);
        }
      }
    } catch {
      setPaquetes(PAQUETES);
    }
  }, []);

  /* =====================================================
     CARGAR BUSQUEDA DEL INICIO
  ===================================================== */

  useEffect(() => {
    try {
      const guardada = localStorage.getItem("mareva_busqueda");

      if (guardada) {
        const datos = JSON.parse(guardada);

        setBusqueda({
          destino: datos.destino || "",
          fechaIda: datos.fechaIda || "",
          fechaRegreso: datos.fechaRegreso || "",
          adultos: Number(datos.adultos) || 2,
          menores: Number(datos.menores) || 0,
          bebes: Number(datos.bebes) || 0
        });

        if (
          datos.destino ||
          datos.fechaIda ||
          datos.fechaRegreso
        ) {
          setBusquedaActiva(true);
        }
      }
    } catch {
      // Si no existe una búsqueda válida, se mantienen los valores iniciales.
    }
  }, []);

  /* =====================================================
     FILTRAR PAQUETES
  ===================================================== */

  const paquetesFiltrados = useMemo(() => {

    const destinoBuscado =
      busqueda.destino.trim().toLowerCase();

    return paquetes.filter((paquete) => {

      const coincideCategoria =
        categoriaSeleccionada === "Todas" ||
        paquete.categoria.toLowerCase() ===
          categoriaSeleccionada.toLowerCase();

      const textoPaquete = `
        ${paquete.nombre}
        ${paquete.destino}
        ${paquete.departamento}
        ${paquete.categoria}
      `.toLowerCase();

      const coincideDestino =
        !destinoBuscado ||
        textoPaquete.includes(destinoBuscado);

      return coincideCategoria && coincideDestino;
    });

  }, [
    paquetes,
    categoriaSeleccionada,
    busqueda.destino
  ]);

  /* =====================================================
     FAVORITOS
  ===================================================== */

  const esFavorito = (slug: string) =>
    favoritos.includes(slug);

  const manejarFavorito = (
    evento: React.MouseEvent,
    slug: string
  ) => {

    evento.stopPropagation();

    if (cambiarFavorito) {
      cambiarFavorito(slug);
    }
  };

  /* =====================================================
     RESERVAR
  ===================================================== */

  const manejarReserva = (
    paquete: Paquete
  ) => {

    seleccionarPaquete(paquete);
  };

  /* =====================================================
     LIMPIAR BUSQUEDA
  ===================================================== */

  const limpiarBusqueda = () => {

    const nuevaBusqueda = {
      destino: "",
      fechaIda: "",
      fechaRegreso: "",
      adultos: 2,
      menores: 0,
      bebes: 0
    };

    setBusqueda(nuevaBusqueda);

    setBusquedaActiva(false);

    localStorage.removeItem("mareva_busqueda");
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <main className="paquetes-page">

      {/* =================================================
          ENCABEZADO
      ================================================= */}

      <section className="paquetes-hero">

        <div className="paquetes-hero-contenido">

          <div className="paquetes-etiqueta">
            ✈️ MAREVA · VIAJA POR COLOMBIA
          </div>

          <h1>
            Descubre tu próximo{" "}
            <span>destino</span>
          </h1>

          <p>
            Explora nuestros paquetes turísticos,
            encuentra tu viaje ideal y crea
            recuerdos inolvidables.
          </p>

        </div>

      </section>


      {/* =================================================
          CONTENIDO
      ================================================= */}

      <section className="paquetes-contenido">

        {/* BUSQUEDA ACTIVA */}

        {busquedaActiva && (
          <div className="busqueda-resumen">

            <div className="busqueda-resumen-icono">
              🔎
            </div>

            <div className="busqueda-resumen-info">

              <strong>
                Tu búsqueda
              </strong>

              <span>
                {busqueda.destino
                  ? `Destino: ${busqueda.destino}`
                  : "Todos los destinos"}

                {" · "}

                {busqueda.fechaIda
                  ? `Salida: ${busqueda.fechaIda}`
                  : "Fecha flexible"}

                {" · "}

                {busqueda.adultos +
                  busqueda.menores +
                  busqueda.bebes}{" "}
                viajeros
              </span>

            </div>

            <button
              type="button"
              onClick={limpiarBusqueda}
            >
              Limpiar búsqueda
            </button>

          </div>
        )}


        {/* =================================================
            TITULO
        ================================================= */}

        <div className="paquetes-titulo">

          <div>

            <span>
              ✦ EXPERIENCIAS PARA TI
            </span>

            <h2>
              Elige tu próxima{" "}
              <strong>aventura</strong>
            </h2>

            <p>
              Tenemos opciones para todos los estilos
              de viaje.
            </p>

          </div>

          <div className="contador-paquetes">
            <strong>
              {paquetesFiltrados.length}
            </strong>

            <span>
              paquetes disponibles
            </span>
          </div>

        </div>


        {/* =================================================
            CATEGORIAS
        ================================================= */}

        <div className="categorias-mareva">

          {CATEGORIAS.map((categoria) => (

            <button
              key={categoria.nombre}
              type="button"
              className={
                categoriaSeleccionada === categoria.nombre
                  ? "categoria-mareva activa"
                  : "categoria-mareva"
              }
              onClick={() =>
                setCategoriaSeleccionada(
                  categoria.nombre
                )
              }
            >

              <span>
                {categoria.icono}
              </span>

              {categoria.nombre}

            </button>

          ))}

        </div>


        {/* =================================================
            RESULTADOS
        ================================================= */}

        {paquetesFiltrados.length > 0 ? (

          <div className="paquetes-grid-mareva">

            {paquetesFiltrados.map(
              (paquete, index) => (

                <article
                  key={paquete.slug}
                  className="paquete-card-mareva"
                  style={{
                    animationDelay:
                      `${index * 0.05}s`
                  }}
                >

                  {/* IMAGEN */}

                  <div
                    className="paquete-card-imagen"
                    onClick={() =>
                      manejarReserva(paquete)
                    }
                  >

                    <img
                      src={obtenerImagen(paquete)}
                      alt={paquete.nombre}
                      onError={(
                        evento
                      ) => {
                        const imagen =
                          evento.currentTarget;

                        if (
                          !imagen.dataset.fallback
                        ) {
                          imagen.dataset.fallback =
                            "true";

                          imagen.src =
                            "/destinos/tayrona.jpg";
                        }
                      }}
                    />

                    <div className="imagen-degradado" />

                    <span className="categoria-imagen">
                      {paquete.categoria}
                    </span>

                    <button
                      type="button"
                      className={
                        esFavorito(paquete.slug)
                          ? "favorito-mareva favorito-activo"
                          : "favorito-mareva"
                      }
                      onClick={(evento) =>
                        manejarFavorito(
                          evento,
                          paquete.slug
                        )
                      }
                      aria-label="Agregar a favoritos"
                    >
                      {esFavorito(paquete.slug)
                        ? "♥"
                        : "♡"}
                    </button>

                  </div>


                  {/* INFORMACION */}

                  <div className="paquete-card-contenido">

                    <div className="paquete-ubicacion">
                      📍{" "}
                      <strong>
                        {paquete.destino}
                      </strong>

                      <span>
                        , {paquete.departamento}
                      </span>
                    </div>

                    <h3>
                      {paquete.nombre}
                    </h3>

                    <p className="paquete-descripcion">
                      {paquete.descripcion}
                    </p>


                    {/* DETALLES */}

                    <div className="paquete-tags">

                      <span>
                        🌙{" "}
                        {paquete.duracion_noches} noches
                      </span>

                      <span>
                        📅{" "}
                        {paquete.duracion_dias} días
                      </span>

                      <span>
                        ✈️ Experiencia Mareva
                      </span>

                    </div>


                    {/* PRECIO */}

                    <div className="paquete-card-footer">

                      <div className="precio-mareva">

                        <small>
                          Desde
                        </small>

                        <strong>
                          {formatearPrecio(
                            paquete.precio
                          )}
                        </strong>

                        <span>
                          por persona
                        </span>

                      </div>

                      <button
                        type="button"
                        className="reservar-mareva"
                        onClick={() =>
                          manejarReserva(paquete)
                        }
                      >
                        Ver viaje
                        <span>→</span>
                      </button>

                    </div>

                  </div>

                </article>

              )
            )}

          </div>

        ) : (

          /* =================================================
             SIN RESULTADOS
          ================================================= */

          <div className="sin-resultados">

            <div>
              🔎
            </div>

            <h3>
              No encontramos ese destino
            </h3>

            <p>
              Prueba con otro destino o revisa
              todas nuestras opciones.
            </p>

            <button
              type="button"
              onClick={() => {
                limpiarBusqueda();
                setCategoriaSeleccionada("Todas");
              }}
            >
              Ver todos los paquetes
            </button>

          </div>

        )}


        {/* =================================================
            MENSAJE FINAL
        ================================================= */}

        {paquetesFiltrados.length > 0 && (
          <div className="paquetes-final">

            <div>
              ✈️
            </div>

            <section>
              <strong>
                ¿Listo para viajar?
              </strong>

              <span>
                Encuentra tu próxima experiencia
                con Mareva.
              </span>
            </section>

          </div>
        )}

      </section>

    </main>
  );
}


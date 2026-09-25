import { useState } from "react";
import "./Inicio.css";

interface InicioProps {
  irAPaquetes: () => void;
  seleccionarPaquete?: (paquete: any) => void;
}

interface Busqueda {
  destino: string;
  fechaIda: string;
  fechaRegreso: string;
  adultos: number;
  menores: number;
  bebes: number;
}

const DESTINOS = [
  "Cartagena",
  "San Andrés",
  "Santa Marta",
  "Medellín",
  "Guatapé",
  "Eje Cafetero",
  "Amazonas",
  "Tayrona",
  "Nuquí",
  "Capurganá",
  "Villa de Leyva",
  "Barichara",
  "Mompox",
  "Caño Cristales",
  "Desierto de la Tatacoa",
  "Isla Gorgona",
  "Tolú",
  "Coveñas",
  "San Gil",
  "Bogotá"
];

/* Duración de los paquetes */
const DURACIONES: Record<string, number> = {
  "Cartagena": 5,
  "San Andrés": 6,
  "Santa Marta": 4,
  "Medellín": 4,
  "Guatapé": 3,
  "Eje Cafetero": 5,
  "Amazonas": 5,
  "Tayrona": 4,
  "Nuquí": 5,
  "Capurganá": 5,
  "Villa de Leyva": 3,
  "Barichara": 3,
  "Mompox": 4,
  "Caño Cristales": 5,
  "Desierto de la Tatacoa": 3,
  "Isla Gorgona": 5,
  "Tolú": 4,
  "Coveñas": 4,
  "San Gil": 3,
  "Bogotá": 3
};

const PAQUETES_DESTACADOS = [
  {
    nombre: "Cartagena Mágica",
    destino: "Cartagena",
    precio: 1850000,
    dias: 5,
    imagen: "/destinos/cartagena.jpg"
  },
  {
    nombre: "San Andrés Todo Incluido",
    destino: "San Andrés",
    precio: 3200000,
    dias: 6,
    imagen: "/destinos/san-andres.jpg"
  },
  {
    nombre: "Tayrona Salvaje",
    destino: "Parque Tayrona",
    precio: 1450000,
    dias: 4,
    imagen: "/destinos/tayrona.jpg"
  },
  {
    nombre: "Guatapé Extremo",
    destino: "Guatapé",
    precio: 890000,
    dias: 3,
    imagen: "/destinos/guatape.jpg"
  }
];

const DESTINOS_POPULARES = [
  {
    nombre: "Cartagena",
    texto: "Mar Caribe, historia y cultura",
    imagen: "/destinos/cartagena.jpg"
  },
  {
    nombre: "San Andrés",
    texto: "El mar de siete colores",
    imagen: "/destinos/san-andres.jpg"
  },
  {
    nombre: "Medellín",
    texto: "Ciudad, cultura y gastronomía",
    imagen: "/destinos/medellin.jpg"
  },
  {
    nombre: "Tayrona",
    texto: "Naturaleza y playas increíbles",
    imagen: "/destinos/tayrona.jpg"
  },
  {
    nombre: "Eje Cafetero",
    texto: "Café, montañas y naturaleza",
    imagen: "/destinos/eje-cafetero.jpg"
  },
  {
    nombre: "Amazonas",
    texto: "Aventura en el corazón de Colombia",
    imagen: "/destinos/amazonas.jpg"
  }
];

function dinero(valor: number) {
  return valor.toLocaleString("es-CO");
}

function fechaBonita(fecha: string) {
  if (!fecha) return "";

  const partes = fecha.split("-");

  if (partes.length !== 3) return fecha;

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

/* ==========================================================
   CALCULAR FECHA DE REGRESO AUTOMÁTICAMENTE
========================================================== */

function calcularFechaRegreso(
  fechaIda: string,
  dias: number
) {
  if (!fechaIda || !dias) return "";

  const fecha = new Date(`${fechaIda}T12:00:00`);

  fecha.setDate(fecha.getDate() + dias - 1);

  const año = fecha.getFullYear();
  const mes = String(
    fecha.getMonth() + 1
  ).padStart(2, "0");

  const dia = String(
    fecha.getDate()
  ).padStart(2, "0");

  return `${año}-${mes}-${dia}`;
}

export default function Inicio({
  irAPaquetes,
  seleccionarPaquete
}: InicioProps) {

  const [menu, setMenu] = useState<
    "destino" | "fecha" | "viajeros" | null
  >(null);

  const [busqueda, setBusqueda] = useState<Busqueda>({
    destino: "",
    fechaIda: "",
    fechaRegreso: "",
    adultos: 2,
    menores: 0,
    bebes: 0
  });

  const totalViajeros =
    busqueda.adultos +
    busqueda.menores +
    busqueda.bebes;

  const hoy = new Date()
    .toISOString()
    .split("T")[0];

  /* ========================================================
     DURACIÓN DEL DESTINO
  ======================================================== */

  const duracionDestino =
    DURACIONES[busqueda.destino] || 4;

  /* ========================================================
     CAMBIAR FECHA DE IDA
  ======================================================== */

  const cambiarFechaIda = (
    nuevaFecha: string
  ) => {

    const fechaRegreso =
      calcularFechaRegreso(
        nuevaFecha,
        duracionDestino
      );

    setBusqueda((actual) => ({
      ...actual,
      fechaIda: nuevaFecha,
      fechaRegreso
    }));
  };

  /* ========================================================
     BUSCAR
  ======================================================== */

  const buscar = () => {

    if (!busqueda.destino) {
      setMenu("destino");
      return;
    }

    if (!busqueda.fechaIda) {
      setMenu("fecha");
      return;
    }

    const busquedaFinal = {
      ...busqueda,
      fechaRegreso:
        busqueda.fechaRegreso ||
        calcularFechaRegreso(
          busqueda.fechaIda,
          duracionDestino
        )
    };

    localStorage.setItem(
      "mareva_busqueda",
      JSON.stringify(busquedaFinal)
    );

    irAPaquetes();
  };

  /* ========================================================
     SELECCIONAR DESTINO
  ======================================================== */

  const seleccionarDestino = (
    destino: string
  ) => {

    const nuevaFechaRegreso =
      busqueda.fechaIda
        ? calcularFechaRegreso(
            busqueda.fechaIda,
            DURACIONES[destino] || 4
          )
        : "";

    setBusqueda((actual) => ({
      ...actual,
      destino,
      fechaRegreso: nuevaFechaRegreso
    }));

    setMenu(null);
  };

  /* ========================================================
     DESTINO POPULAR
  ======================================================== */

  const seleccionarDestinoPopular = (
    destino: string
  ) => {

    const nuevaBusqueda = {
      ...busqueda,
      destino
    };

    localStorage.setItem(
      "mareva_busqueda",
      JSON.stringify(nuevaBusqueda)
    );

    setBusqueda(nuevaBusqueda);

    irAPaquetes();
  };

  return (
    <main className="inicio">

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="hero">

        <div className="hero-fondo"></div>

        <div className="hero-contenido">

          <div className="hero-superior">

            <span className="hero-tag">
              ✈️ VIAJA POR COLOMBIA
            </span>

            <h1>
              Tu próxima aventura
              <br />
              <span>empieza aquí</span>
            </h1>

            <p>
              Descubre destinos increíbles, encuentra tu viaje
              ideal y reserva todo en un solo lugar.
            </p>

          </div>


          {/* ==================================================
              BUSCADOR
          ================================================== */}

          <div className="buscador">

            {/* DESTINO */}

            <div
              className={`campo ${
                menu === "destino"
                  ? "campo-activo"
                  : ""
              }`}
              onClick={() =>
                setMenu(
                  menu === "destino"
                    ? null
                    : "destino"
                )
              }
            >

              <div className="campo-icono">
                📍
              </div>

              <div className="campo-info">

                <span>
                  DESTINO
                </span>

                <strong>
                  {busqueda.destino ||
                    "¿A dónde quieres ir?"}
                </strong>

              </div>


              {menu === "destino" && (

                <div
                  className="dropdown destino-dropdown"
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                >

                  <h3>
                    ¿A dónde quieres ir?
                  </h3>

                  <p>
                    Elige tu próximo destino
                  </p>

                  <div className="destinos-lista">

                    {DESTINOS.map(
                      (destino) => (

                        <button
                          key={destino}
                          type="button"
                          className={
                            busqueda.destino ===
                            destino
                              ? "destino-opcion seleccionado"
                              : "destino-opcion"
                          }
                          onClick={() =>
                            seleccionarDestino(
                              destino
                            )
                          }
                        >

                          <span>
                            📍
                          </span>

                          {destino}

                        </button>

                      )
                    )}

                  </div>

                </div>

              )}

            </div>


            {/* FECHA */}

            <div
              className={`campo ${
                menu === "fecha"
                  ? "campo-activo"
                  : ""
              }`}
              onClick={() =>
                setMenu(
                  menu === "fecha"
                    ? null
                    : "fecha"
                )
              }
            >

              <div className="campo-icono">
                📅
              </div>

              <div className="campo-info">

                <span>
                  FECHAS
                </span>

                <strong>
                  {busqueda.fechaIda
                    ? fechaBonita(
                        busqueda.fechaIda
                      )
                    : "Selecciona tu fecha"}
                </strong>

                {busqueda.fechaRegreso && (

                  <small>
                    Regreso:{" "}
                    {fechaBonita(
                      busqueda.fechaRegreso
                    )}
                  </small>

                )}

              </div>


              {menu === "fecha" && (

                <div
                  className="dropdown fecha-dropdown"
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                >

                  <h3>
                    Selecciona tu fecha de viaje
                  </h3>

                  <p>
                    La fecha de regreso se calcula automáticamente.
                  </p>

                  <div className="fecha-automatica">

                    <label>

                      <span>
                        FECHA DE IDA
                      </span>

                      <input
                        type="date"
                        min={hoy}
                        value={
                          busqueda.fechaIda
                        }
                        onChange={(e) =>
                          cambiarFechaIda(
                            e.target.value
                          )
                        }
                      />

                    </label>


                    <div className="fecha-regreso">

                      <span>
                        FECHA DE REGRESO
                      </span>

                      <strong>
                        {busqueda.fechaRegreso
                          ? fechaBonita(
                              busqueda.fechaRegreso
                            )
                          : "Se calculará automáticamente"}
                      </strong>

                      {busqueda.destino && (
                        <small>
                          {duracionDestino} días
                        </small>
                      )}

                    </div>

                  </div>


                  <div className="aviso-fecha">

                    🔄 El regreso se calcula
                    automáticamente según la duración
                    del paquete.

                  </div>


                  <button
                    type="button"
                    className="dropdown-listo"
                    onClick={() =>
                      setMenu(null)
                    }
                  >
                    Listo
                  </button>

                </div>

              )}

            </div>


            {/* VIAJEROS */}

            <div
              className={`campo ${
                menu === "viajeros"
                  ? "campo-activo"
                  : ""
              }`}
              onClick={() =>
                setMenu(
                  menu === "viajeros"
                    ? null
                    : "viajeros"
                )
              }
            >

              <div className="campo-icono">
                👥
              </div>

              <div className="campo-info">

                <span>
                  VIAJEROS
                </span>

                <strong>
                  {totalViajeros}{" "}
                  {totalViajeros === 1
                    ? "viajero"
                    : "viajeros"}
                </strong>

              </div>


              {menu === "viajeros" && (

                <div
                  className="dropdown viajeros-dropdown"
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                >

                  <h3>
                    ¿Quiénes viajan?
                  </h3>

                  <p>
                    Agrega las personas de tu viaje
                  </p>


                  <div className="viajero-row">

                    <div>

                      <strong>
                        Adultos
                      </strong>

                      <small>
                        13 años o más
                      </small>

                    </div>


                    <div className="contador">

                      <button
                        type="button"
                        onClick={() =>
                          setBusqueda(
                            (actual) => ({
                              ...actual,
                              adultos:
                                Math.max(
                                  1,
                                  actual.adultos -
                                    1
                                )
                            })
                          )
                        }
                      >
                        −
                      </button>

                      <b>
                        {busqueda.adultos}
                      </b>

                      <button
                        type="button"
                        onClick={() =>
                          setBusqueda(
                            (actual) => ({
                              ...actual,
                              adultos:
                                actual.adultos +
                                1
                            })
                          )
                        }
                      >
                        +
                      </button>

                    </div>

                  </div>


                  <div className="viajero-row">

                    <div>

                      <strong>
                        Menores
                      </strong>

                      <small>
                        2 a 12 años
                      </small>

                    </div>


                    <div className="contador">

                      <button
                        type="button"
                        onClick={() =>
                          setBusqueda(
                            (actual) => ({
                              ...actual,
                              menores:
                                Math.max(
                                  0,
                                  actual.menores -
                                    1
                                )
                            })
                          )
                        }
                      >
                        −
                      </button>

                      <b>
                        {busqueda.menores}
                      </b>

                      <button
                        type="button"
                        onClick={() =>
                          setBusqueda(
                            (actual) => ({
                              ...actual,
                              menores:
                                actual.menores +
                                1
                            })
                          )
                        }
                      >
                        +
                      </button>

                    </div>

                  </div>


                  <div className="viajero-row">

                    <div>

                      <strong>
                        Bebés
                      </strong>

                      <small>
                        Menores de 2 años
                      </small>

                    </div>


                    <div className="contador">

                      <button
                        type="button"
                        onClick={() =>
                          setBusqueda(
                            (actual) => ({
                              ...actual,
                              bebes:
                                Math.max(
                                  0,
                                  actual.bebes -
                                    1
                                )
                            })
                          )
                        }
                      >
                        −
                      </button>

                      <b>
                        {busqueda.bebes}
                      </b>

                      <button
                        type="button"
                        onClick={() =>
                          setBusqueda(
                            (actual) => ({
                              ...actual,
                              bebes:
                                actual.bebes +
                                1
                            })
                          )
                        }
                      >
                        +
                      </button>

                    </div>

                  </div>


                  <button
                    type="button"
                    className="dropdown-listo"
                    onClick={() =>
                      setMenu(null)
                    }
                  >
                    Listo
                  </button>

                </div>

              )}

            </div>


            {/* BUSCAR */}

            <button
              type="button"
              className="boton-buscar"
              onClick={buscar}
            >

              <span>
                🔍
              </span>

              Buscar

            </button>

          </div>


          <div className="beneficios-hero">

            <span>
              ✓ Sin costos ocultos
            </span>

            <span>
              ✓ Paquetes completos
            </span>

            <span>
              ✓ Reserva fácil y segura
            </span>

          </div>

        </div>

      </section>


      {/* ==================================================
          PAQUETES DESTACADOS
      ================================================== */}

      <section className="seccion">

        <div className="titulo-seccion">

          <div>

            <span>
              OFERTAS PARA TI
            </span>

            <h2>
              Descubre nuestros
              <strong>
                {" "}paquetes destacados
              </strong>
            </h2>

            <p>
              Encuentra tu próximo viaje al mejor precio.
            </p>

          </div>

          <button
            type="button"
            onClick={irAPaquetes}
          >
            Ver todos →
          </button>

        </div>


        <div className="paquetes-grid">

          {PAQUETES_DESTACADOS.map(
            (paquete) => (

              <article
                className="paquete-card"
                key={paquete.nombre}
              >

                <div className="paquete-imagen">

                  <img
                    src={paquete.imagen}
                    alt={paquete.nombre}
                  />

                  <span className="etiqueta-oferta">
                    ⭐ Recomendado
                  </span>

                </div>


                <div className="paquete-info">

                  <span className="paquete-destino">
                    📍 {paquete.destino}
                  </span>

                  <h3>
                    {paquete.nombre}
                  </h3>

                  <div className="paquete-detalles">

                    <span>
                      🕐 {paquete.dias} días
                    </span>

                    <span>
                      ⭐ 4.8
                    </span>

                  </div>


                  <div className="precio">

                    <small>
                      Desde
                    </small>

                    <strong>
                      ${dinero(
                        paquete.precio
                      )}
                    </strong>

                    <span>
                      COP / persona
                    </span>

                  </div>


                  <button
                    type="button"
                    onClick={() => {

                      if (
                        seleccionarPaquete
                      ) {

                        seleccionarPaquete(
                          paquete
                        );

                      } else {

                        irAPaquetes();

                      }

                    }}
                  >
                    Ver paquete
                  </button>

                </div>

              </article>

            )
          )}

        </div>

      </section>


      {/* ==================================================
          DESTINOS POPULARES
      ================================================== */}

      <section className="destinos">

        <div className="seccion">

          <div className="titulo-centro">

            <span>
              DESTINOS POPULARES
            </span>

            <h2>
              Inspírate para tu
              <strong>
                {" "}próximo viaje
              </strong>
            </h2>

            <p>
              Los destinos que todos quieren conocer.
            </p>

          </div>


          <div className="destinos-grid">

            {DESTINOS_POPULARES.map(
              (destino) => (

                <button
                  type="button"
                  className="destino-card"
                  key={destino.nombre}
                  onClick={() =>
                    seleccionarDestinoPopular(
                      destino.nombre
                    )
                  }
                >

                  <img
                    src={destino.imagen}
                    alt={destino.nombre}
                  />

                  <div className="destino-card-overlay">

                    <div>

                      <h3>
                        {destino.nombre}
                      </h3>

                      <p>
                        {destino.texto}
                      </p>

                    </div>

                    <span>
                      →
                    </span>

                  </div>

                </button>

              )
            )}

          </div>

        </div>

      </section>


      {/* ==================================================
          VENTAJAS
      ================================================== */}

      <section className="seccion">

        <div className="titulo-centro">

          <span>
            VIAJA CON MAREVA
          </span>

          <h2>
            Todo lo que necesitas
            <strong>
              {" "}para viajar
            </strong>
          </h2>

        </div>


        <div className="ventajas">

          <div className="ventaja">

            <div>
              🔎
            </div>

            <h3>
              Encuentra tu viaje
            </h3>

            <p>
              Compara destinos y paquetes
              desde un solo lugar.
            </p>

          </div>


          <div className="ventaja">

            <div>
              💰
            </div>

            <h3>
              Precios claros
            </h3>

            <p>
              Conoce el valor de tu experiencia
              antes de reservar.
            </p>

          </div>


          <div className="ventaja">

            <div>
              🧳
            </div>

            <h3>
              Todo incluido
            </h3>

            <p>
              Paquetes pensados para que
              disfrutes sin complicaciones.
            </p>

          </div>


          <div className="ventaja">

            <div>
              🛡️
            </div>

            <h3>
              Reserva fácilmente
            </h3>

            <p>
              Un proceso sencillo para
              organizar tu próxima aventura.
            </p>

          </div>

        </div>

      </section>


      {/* ==================================================
          CTA
      ================================================== */}

      <section className="cta">

        <div>

          <span>
            ✈️ TU PRÓXIMO VIAJE TE ESPERA
          </span>

          <h2>
            Colombia está
            <br />
            esperando por ti.
          </h2>

          <p>
            Explora nuestros paquetes y encuentra
            el destino perfecto para tu próxima aventura.
          </p>

          <button
            type="button"
            onClick={irAPaquetes}
          >
            Explorar paquetes →
          </button>

        </div>

      </section>


      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer className="footer">

        <div className="footer-principal">

          <div>

            <div className="logo-footer">
              MAREVA
            </div>

            <p>
              Viaja. Descubre. Vive.
            </p>

          </div>


          <div>

            <h4>
              Mareva
            </h4>

            <span>
              Destinos
            </span>

            <span>
              Paquetes
            </span>

            <span>
              Reservas
            </span>

          </div>


          <div>

            <h4>
              Explora
            </h4>

            <span>
              Colombia
            </span>

            <span>
              Experiencias
            </span>

            <span>
              Viajes
            </span>

          </div>

        </div>


        <div className="footer-bottom">
          © 2026 Mareva · Agencia de viajes
        </div>

      </footer>

    </main>
  );
}

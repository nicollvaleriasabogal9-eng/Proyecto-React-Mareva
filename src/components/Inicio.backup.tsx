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
  "Bogotá",
];

const PAQUETES_DESTACADOS = [
  {
    nombre: "Cartagena Mágica",
    destino: "Cartagena",
    precio: 1850000,
    imagen: "/destinos/cartagena.jpg",
  },
  {
    nombre: "San Andrés Todo Incluido",
    destino: "San Andrés",
    precio: 3200000,
    imagen: "/destinos/san-andres.jpg",
  },
  {
    nombre: "Tayrona Salvaje",
    destino: "Parque Tayrona",
    precio: 1450000,
    imagen: "/destinos/tayrona.jpg",
  },
  {
    nombre: "Guatapé Extremo",
    destino: "Guatapé",
    precio: 890000,
    imagen: "/destinos/guatape.jpg",
  },
];

const DESTINOS_POPULARES = [
  {
    nombre: "Cartagena",
    texto: "Mar, historia y experiencias inolvidables",
    imagen: "/destinos/cartagena.jpg",
  },
  {
    nombre: "San Andrés",
    texto: "Playas paradisíacas y mar de siete colores",
    imagen: "/destinos/san-andres.jpg",
  },
  {
    nombre: "Medellín",
    texto: "Ciudad, cultura y gastronomía",
    imagen: "/destinos/medellin.jpg",
  },
  {
    nombre: "Tayrona",
    texto: "Naturaleza, playa y aventura",
    imagen: "/destinos/tayrona.jpg",
  },
  {
    nombre: "Eje Cafetero",
    texto: "Paisajes, café y experiencias rurales",
    imagen: "/destinos/eje-cafetero.jpg",
  },
  {
    nombre: "Amazonas",
    texto: "Una aventura en el corazón de la selva",
    imagen: "/destinos/amazonas.jpg",
  },
];

function formatearPrecio(precio: number) {
  return precio.toLocaleString("es-CO");
}

function formatearFecha(fecha: string) {
  if (!fecha) return "";

  const partes = fecha.split("-");

  if (partes.length !== 3) return fecha;

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export default function Inicio({
  irAPaquetes,
  seleccionarPaquete,
}: InicioProps) {
  const [menuAbierto, setMenuAbierto] = useState<
    "destino" | "fecha" | "viajeros" | null
  >(null);

  const [busqueda, setBusqueda] = useState<Busqueda>({
    destino: "",
    fechaIda: "",
    fechaRegreso: "",
    adultos: 2,
    menores: 0,
    bebes: 0,
  });

  const totalViajeros =
    busqueda.adultos + busqueda.menores + busqueda.bebes;

  const guardarBusqueda = () => {
    localStorage.setItem(
      "mareva_busqueda",
      JSON.stringify(busqueda)
    );

    irAPaquetes();
  };

  const seleccionarDestino = (destino: string) => {
    setBusqueda((actual) => ({
      ...actual,
      destino,
    }));

    setMenuAbierto(null);
  };

  const cambiarAdultos = (cantidad: number) => {
    setBusqueda((actual) => ({
      ...actual,
      adultos: Math.max(1, cantidad),
    }));
  };

  const cambiarMenores = (cantidad: number) => {
    setBusqueda((actual) => ({
      ...actual,
      menores: Math.max(0, cantidad),
    }));
  };

  const cambiarBebes = (cantidad: number) => {
    setBusqueda((actual) => ({
      ...actual,
      bebes: Math.max(0, cantidad),
    }));
  };

  return (
    <main className="inicio">

      <section className="hero-mareva">
        <div className="hero-overlay"></div>

        <div className="hero-contenido">

          <span className="hero-etiqueta">
            ✈️ VIAJA CON MAREVA
          </span>

          <h1>
            Descubre Colombia
            <br />
            <span>como nunca antes</span>
          </h1>

          <p>
            Encuentra destinos increíbles, paquetes completos
            y experiencias diseñadas para ti.
          </p>

          <div className="buscador-interactivo">

            <div
              className={`buscador-item ${
                menuAbierto === "destino" ? "activo" : ""
              }`}
              onClick={() =>
                setMenuAbierto(
                  menuAbierto === "destino" ? null : "destino"
                )
              }
            >
              <div className="buscador-icono">📍</div>

              <div className="buscador-texto">
                <span>DESTINO</span>
                <strong>
                  {busqueda.destino || "¿A dónde quieres ir?"}
                </strong>
              </div>

              {menuAbierto === "destino" && (
                <div
                  className="buscador-dropdown destino-dropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3>¿A dónde quieres ir?</h3>

                  <p className="dropdown-subtitulo">
                    Selecciona un destino
                  </p>

                  <div className="lista-destinos">
                    {DESTINOS.map((destino) => (
                      <button
                        key={destino}
                        type="button"
                        className={
                          busqueda.destino === destino
                            ? "destino-opcion seleccionado"
                            : "destino-opcion"
                        }
                        onClick={() =>
                          seleccionarDestino(destino)
                        }
                      >
                        📍 {destino}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div
              className={`buscador-item ${
                menuAbierto === "fecha" ? "activo" : ""
              }`}
              onClick={() =>
                setMenuAbierto(
                  menuAbierto === "fecha" ? null : "fecha"
                )
              }
            >
              <div className="buscador-icono">📅</div>

              <div className="buscador-texto">
                <span>FECHA</span>

                <strong>
                  {busqueda.fechaIda
                    ? formatearFecha(busqueda.fechaIda)
                    : "Selecciona tus fechas"}
                </strong>

                {busqueda.fechaRegreso && (
                  <small>
                    Regreso: {formatearFecha(busqueda.fechaRegreso)}
                  </small>
                )}
              </div>

              {menuAbierto === "fecha" && (
                <div
                  className="buscador-dropdown fecha-dropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3>¿Cuándo quieres viajar?</h3>

                  <div className="fecha-campos">

                    <label>
                      <span>IDA</span>

                      <input
                        type="date"
                        min={
                          new Date()
                            .toISOString()
                            .split("T")[0]
                        }
                        value={busqueda.fechaIda}
                        onChange={(e) =>
                          setBusqueda((actual) => ({
                            ...actual,
                            fechaIda: e.target.value,
                            fechaRegreso:
                              actual.fechaRegreso &&
                              actual.fechaRegreso <
                                e.target.value
                                ? ""
                                : actual.fechaRegreso,
                          }))
                        }
                      />
                    </label>

                    <label>
                      <span>REGRESO</span>

                      <input
                        type="date"
                        min={
                          busqueda.fechaIda ||
                          new Date()
                            .toISOString()
                            .split("T")[0]
                        }
                        value={busqueda.fechaRegreso}
                        onChange={(e) =>
                          setBusqueda((actual) => ({
                            ...actual,
                            fechaRegreso: e.target.value,
                          }))
                        }
                      />
                    </label>

                  </div>

                  <button
                    type="button"
                    className="boton-listo"
                    onClick={() => setMenuAbierto(null)}
                  >
                    Listo
                  </button>
                </div>
              )}
            </div>

            <div
              className={`buscador-item ${
                menuAbierto === "viajeros" ? "activo" : ""
              }`}
              onClick={() =>
                setMenuAbierto(
                  menuAbierto === "viajeros"
                    ? null
                    : "viajeros"
                )
              }
            >
              <div className="buscador-icono">👥</div>

              <div className="buscador-texto">
                <span>VIAJEROS</span>

                <strong>
                  {totalViajeros}{" "}
                  {totalViajeros === 1
                    ? "viajero"
                    : "viajeros"}
                </strong>
              </div>

              {menuAbierto === "viajeros" && (
                <div
                  className="buscador-dropdown viajeros-dropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3>¿Quiénes viajan?</h3>

                  <div className="contador">
                    <div>
                      <strong>Adultos</strong>
                      <span>13 años o más</span>
                    </div>

                    <div className="contador-controles">
                      <button
                        type="button"
                        onClick={() =>
                          cambiarAdultos(
                            busqueda.adultos - 1
                          )
                        }
                      >
                        −
                      </button>

                      <b>{busqueda.adultos}</b>

                      <button
                        type="button"
                        onClick={() =>
                          cambiarAdultos(
                            busqueda.adultos + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="contador">
                    <div>
                      <strong>Menores</strong>
                      <span>2 a 12 años</span>
                    </div>

                    <div className="contador-controles">
                      <button
                        type="button"
                        onClick={() =>
                          cambiarMenores(
                            busqueda.menores - 1
                          )
                        }
                      >
                        −
                      </button>

                      <b>{busqueda.menores}</b>

                      <button
                        type="button"
                        onClick={() =>
                          cambiarMenores(
                            busqueda.menores + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="contador">
                    <div>
                      <strong>Bebés</strong>
                      <span>Menores de 2 años</span>
                    </div>

                    <div className="contador-controles">
                      <button
                        type="button"
                        onClick={() =>
                          cambiarBebes(
                            busqueda.bebes - 1
                          )
                        }
                      >
                        −
                      </button>

                      <b>{busqueda.bebes}</b>

                      <button
                        type="button"
                        onClick={() =>
                          cambiarBebes(
                            busqueda.bebes + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="boton-listo"
                    onClick={() => setMenuAbierto(null)}
                  >
                    Listo
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              className="boton-buscar"
              onClick={guardarBusqueda}
            >
              🔍 BUSCAR
            </button>

          </div>

          <div className="hero-confianza">
            <span>✓ Paquetes completos</span>
            <span>✓ Precios transparentes</span>
            <span>✓ Viaja seguro</span>
          </div>

        </div>
      </section>

      <section className="seccion">

        <div className="seccion-encabezado">

          <div>
            <span className="seccion-etiqueta">
              OFERTAS DESTACADAS
            </span>

            <h2>
              Viajes que
              <span> te van a encantar</span>
            </h2>

            <p>
              Descubre algunos de nuestros paquetes más buscados.
            </p>
          </div>

          <button
            type="button"
            className="boton-ver-todos"
            onClick={irAPaquetes}
          >
            Ver todos →
          </button>

        </div>

        <div className="grid-paquetes-inicio">

          {PAQUETES_DESTACADOS.map((paquete) => (
            <article
              className="card-paquete-inicio"
              key={paquete.nombre}
            >

              <div className="card-imagen">

                <img
                  src={paquete.imagen}
                  alt={paquete.nombre}
                />

                <span className="card-badge">
                  ⭐ Destacado
                </span>

              </div>

              <div className="card-contenido">

                <span className="card-destino">
                  📍 {paquete.destino}
                </span>

                <h3>{paquete.nombre}</h3>

                <div className="card-precio">
                  <span>Desde</span>

                  <strong>
                    ${formatearPrecio(paquete.precio)}
                  </strong>

                  <small> COP / persona</small>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (seleccionarPaquete) {
                      seleccionarPaquete(paquete);
                    } else {
                      irAPaquetes();
                    }
                  }}
                >
                  Ver paquete
                </button>

              </div>

            </article>
          ))}

        </div>
      </section>

      <section className="destinos-inicio">

        <div className="seccion">

          <div className="seccion-encabezado centrado">

            <span className="seccion-etiqueta">
              DESTINOS POPULARES
            </span>

            <h2>
              ¿Dónde quieres
              <span> despertar?</span>
            </h2>

            <p>
              Explora los destinos favoritos de nuestros viajeros.
            </p>

          </div>

          <div className="grid-destinos">

            {DESTINOS_POPULARES.map((destino) => (
              <button
                type="button"
                className="destino-card"
                key={destino.nombre}
                onClick={() => {

                  const nuevaBusqueda = {
                    ...busqueda,
                    destino: destino.nombre,
                  };

                  setBusqueda(nuevaBusqueda);

                  localStorage.setItem(
                    "mareva_busqueda",
                    JSON.stringify(nuevaBusqueda)
                  );

                  irAPaquetes();

                }}
              >

                <img
                  src={destino.imagen}
                  alt={destino.nombre}
                />

                <div className="destino-overlay">

                  <div>
                    <h3>{destino.nombre}</h3>
                    <p>{destino.texto}</p>
                  </div>

                  <span>→</span>

                </div>

              </button>
            ))}

          </div>

        </div>

      </section>

      <section className="beneficios">

        <div className="beneficio">
          <div>💰</div>
          <h3>Precios transparentes</h3>
          <p>
            Conoce el valor de tu viaje desde el principio.
          </p>
        </div>

        <div className="beneficio">
          <div>🧳</div>
          <h3>Paquetes completos</h3>
          <p>
            Encuentra alojamiento, actividades y servicios.
          </p>
        </div>

        <div className="beneficio">
          <div>🛡️</div>
          <h3>Viaja con tranquilidad</h3>
          <p>
            Información clara para planear tu experiencia.
          </p>
        </div>

        <div className="beneficio">
          <div>💙</div>
          <h3>Experiencias Mareva</h3>
          <p>
            Creamos viajes pensados para cada tipo de viajero.
          </p>
        </div>

      </section>

      <section className="cta-mareva">

        <div>

          <span>
            ✈️ TU PRÓXIMA AVENTURA COMIENZA AQUÍ
          </span>

          <h2>
            ¿Listo para
            <br />
            descubrir Colombia?
          </h2>

          <p>
            Encuentra tu próximo destino y empieza a crear
            recuerdos inolvidables.
          </p>

          <button
            type="button"
            onClick={irAPaquetes}
          >
            Explorar paquetes →
          </button>

        </div>

      </section>

      <footer className="footer-mareva">

        <div className="footer-contenido">

          <div className="footer-logo">

            <div className="logo-mareva">
              M
            </div>

            <div>
              <strong>MAREVA</strong>
              <span>VIAJA. DESCUBRE. VIVE.</span>
            </div>

          </div>

          <p>
            Tu próxima aventura empieza con Mareva.
          </p>

        </div>

        <div className="footer-bottom">
          © 2026 Mareva · Agencia de viajes
        </div>

      </footer>

    </main>
  );
}

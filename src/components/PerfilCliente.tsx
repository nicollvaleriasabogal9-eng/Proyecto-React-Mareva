import { useEffect, useState } from "react";
import axios from "axios";
import "./PerfilCliente.css";

interface PerfilClienteProps {
  mostrarMensaje: (titulo: string, mensaje: string) => void;
  favoritos?: string[];
  cambiarFavorito: (slug: string) => void;
}

interface Usuario {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: string;
}

interface Reserva {
  id_reserva: number;
  destino: string;
  paquete: string;
  fecha_ida: string;
  fecha_regreso: string;
  adultos: number;
  ninos: number;
  bebes: number;
  mascotas: number;
  transporte: string;
  precio_total: number;
  estado: string;
}

interface Notificacion {
  id_notificacion?: number;
  id?: number;
  titulo?: string;
  mensaje?: string;
  fecha?: string;
  fecha_creacion?: string;
  leida?: boolean;
  estado?: string;
}

function PerfilCliente({
  mostrarMensaje,
  favoritos = [],
  cambiarFavorito,
}: PerfilClienteProps) {
  const [seccion, setSeccion] = useState("inicio");
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [cargando, setCargando] = useState(true);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");

  const token = localStorage.getItem("mareva_token");

  const cargarPerfil = async () => {
    if (!token) {
      setCargando(false);
      return;
    }

    try {
      const respuesta = await axios.get(
        "http://127.0.0.1:5000/perfil",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsuario(respuesta.data);
      setNombre(respuesta.data.nombre || "");
      setCorreo(respuesta.data.correo || "");
    } catch (error) {
      console.error("Error cargando perfil:", error);
      mostrarMensaje("Error", "No se pudo cargar tu perfil.");
    } finally {
      setCargando(false);
    }
  };

  const cargarReservas = async () => {
    if (!token) return;

    try {
      const respuesta = await axios.get(
        "http://127.0.0.1:5000/mis-reservas",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReservas(Array.isArray(respuesta.data) ? respuesta.data : []);
    } catch (error) {
      console.error("Error cargando reservas:", error);
      setReservas([]);
    }
  };

  const cargarNotificaciones = async () => {
    if (!token) return;

    try {
      const respuesta = await axios.get(
        "http://127.0.0.1:5000/mis-notificaciones",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const datos = respuesta.data;

      if (Array.isArray(datos)) {
        setNotificaciones(datos);
      } else if (Array.isArray(datos?.notificaciones)) {
        setNotificaciones(datos.notificaciones);
      } else {
        setNotificaciones([]);
      }
    } catch (error) {
      console.error("Error cargando notificaciones:", error);
      setNotificaciones([]);
    }
  };

  useEffect(() => {
    cargarPerfil();
    cargarReservas();
    cargarNotificaciones();
  }, []);

  const guardarDatos = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return;

    try {
      const respuesta = await axios.put(
        "http://127.0.0.1:5000/perfil",
        {
          nombre,
          correo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsuario(respuesta.data);

      localStorage.setItem(
        "mareva_usuario",
        JSON.stringify(respuesta.data)
      );

      mostrarMensaje(
        "Datos actualizados",
        "Tu información se actualizó correctamente."
      );
    } catch (error: any) {
      console.error("Error actualizando datos:", error);

      mostrarMensaje(
        "Error",
        error.response?.data?.mensaje ||
          "No se pudieron actualizar tus datos."
      );
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("mareva_token");
    localStorage.removeItem("mareva_usuario");
    window.location.reload();
  };

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(Number(precio) || 0);
  };

  const formatearFecha = (fecha: string) => {
    if (!fecha) return "";

    const fechaFormateada = new Date(`${fecha}T00:00:00`);

    if (Number.isNaN(fechaFormateada.getTime())) {
      return fecha;
    }

    return fechaFormateada.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const obtenerEstado = (estado?: string) => {
    return estado || "Pendiente de pago";
  };

  const notificacionesNoLeidas = notificaciones.filter(
    (notificacion) =>
      notificacion.leida !== true &&
      notificacion.estado !== "Leída"
  ).length;

  if (cargando) {
    return (
      <div className="perfil-cargando">
        <div className="perfil-spinner"></div>
        <p>Cargando tu perfil...</p>
      </div>
    );
  }

  return (
    <div className="perfil-cliente">
      <aside className="perfil-menu">
        <div className="perfil-avatar">
          {usuario?.nombre?.charAt(0).toUpperCase() || "U"}
        </div>

        <h2>{usuario?.nombre || "Usuario"}</h2>
        <p>{usuario?.correo || ""}</p>

        <nav>
          <button
            className={seccion === "inicio" ? "activo" : ""}
            onClick={() => setSeccion("inicio")}
          >
            🏠 Resumen
          </button>

          <button
            className={seccion === "reservas" ? "activo" : ""}
            onClick={() => setSeccion("reservas")}
          >
            ✈️ Mis reservas
          </button>

          <button
            className={seccion === "favoritos" ? "activo" : ""}
            onClick={() => setSeccion("favoritos")}
          >
            ❤️ Mis favoritos ({favoritos.length})
          </button>

          <button
            className={seccion === "datos" ? "activo" : ""}
            onClick={() => setSeccion("datos")}
          >
            📝 Mis datos
          </button>

          <button
            className={seccion === "notificaciones" ? "activo" : ""}
            onClick={() => setSeccion("notificaciones")}
          >
            🔔 Notificaciones ({notificacionesNoLeidas})
          </button>
        </nav>

        <button
          className="btn-cerrar-sesion"
          onClick={cerrarSesion}
        >
          🚪 Cerrar sesión
        </button>
      </aside>

      <main className="perfil-contenido">
        {seccion === "inicio" && (
          <section>
            <div className="perfil-bienvenida">
              <div>
                <span>Bienvenido de nuevo</span>

                <h1>
                  Hola,{" "}
                  {usuario?.nombre?.split(" ")[0] || "Usuario"} 👋
                </h1>

                <p>
                  Organiza tus próximos viajes y administra tu cuenta en
                  Mareva.
                </p>
              </div>

              <div className="perfil-avion">✈️</div>
            </div>

            <div className="perfil-estadisticas">
              <div className="estadistica">
                <span>✈️</span>
                <strong>{reservas.length}</strong>
                <p>Reservas</p>
              </div>

              <div className="estadistica">
                <span>❤️</span>
                <strong>{favoritos.length}</strong>
                <p>Favoritos</p>
              </div>

              <div className="estadistica">
                <span>🔔</span>
                <strong>{notificacionesNoLeidas}</strong>
                <p>Notificaciones</p>
              </div>
            </div>

            <div className="perfil-seccion-titulo">
              <h2>Mis próximos viajes</h2>

              <button onClick={() => setSeccion("reservas")}>
                Ver todas
              </button>
            </div>

            {reservas.length === 0 ? (
              <div className="perfil-vacio">
                <div>🌎</div>
                <h3>Aún no tienes viajes</h3>
                <p>
                  Explora nuestros destinos y encuentra tu próxima aventura.
                </p>
              </div>
            ) : (
              <div className="reservas-preview">
                {reservas.slice(0, 3).map((reserva) => {
                  const estado = obtenerEstado(reserva.estado);

                  return (
                    <div
                      className="reserva-preview-card"
                      key={reserva.id_reserva}
                    >
                      <div>
                        <span>
                          ✈️ {reserva.destino || "Destino"}
                        </span>

                        <h3>
                          {reserva.paquete || "Paquete turístico"}
                        </h3>

                        <p>
                          {formatearFecha(reserva.fecha_ida)} →{" "}
                          {formatearFecha(reserva.fecha_regreso)}
                        </p>
                      </div>

                      <span
                        className={`estado ${estado
                          .toLowerCase()
                          .replaceAll(" ", "-")}`}
                      >
                        {estado}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {seccion === "reservas" && (
          <section>
            <div className="perfil-titulo">
              <span>Mis viajes</span>
              <h1>Mis reservas ✈️</h1>
              <p>Aquí puedes consultar todos tus viajes.</p>
            </div>

            {reservas.length === 0 ? (
              <div className="perfil-vacio">
                <div>🌎</div>
                <h3>Aún no tienes reservas</h3>
                <p>
                  Cuando realices una reserva aparecerá aquí.
                </p>
              </div>
            ) : (
              <div className="reservas-lista">
                {reservas.map((reserva) => {
                  const estado = obtenerEstado(reserva.estado);

                  return (
                    <article
                      className="reserva-card"
                      key={reserva.id_reserva}
                    >
                      <div className="reserva-card-top">
                        <div>
                          <span className="reserva-destino">
                            ✈️ {reserva.destino || "Destino"}
                          </span>

                          <h2>
                            {reserva.paquete || "Paquete turístico"}
                          </h2>
                        </div>

                        <span
                          className={`estado ${estado
                            .toLowerCase()
                            .replaceAll(" ", "-")}`}
                        >
                          {estado}
                        </span>
                      </div>

                      <div className="reserva-info">
                        <div>
                          <span>📅 Fechas</span>

                          <strong>
                            {formatearFecha(reserva.fecha_ida)}
                          </strong>

                          <small>
                            hasta{" "}
                            {formatearFecha(
                              reserva.fecha_regreso
                            )}
                          </small>
                        </div>

                        <div>
                          <span>👥 Viajeros</span>

                          <strong>
                            {reserva.adultos || 0} adultos
                          </strong>

                          {(reserva.ninos || 0) > 0 && (
                            <small>
                              {reserva.ninos} niños
                            </small>
                          )}

                          {(reserva.bebes || 0) > 0 && (
                            <small>
                              {reserva.bebes} bebés
                            </small>
                          )}
                        </div>

                        <div>
                          <span>🐾 Mascotas</span>

                          <strong>
                            {reserva.mascotas || 0}
                          </strong>
                        </div>

                        <div>
                          <span>🚌 Transporte</span>

                          <strong>
                            {reserva.transporte || "No especificado"}
                          </strong>
                        </div>
                      </div>

                      <div className="reserva-total">
                        <span>Total</span>

                        <strong>
                          {formatearPrecio(
                            reserva.precio_total
                          )}
                        </strong>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {seccion === "favoritos" && (
          <section>
            <div className="perfil-titulo">
              <span>Tus destinos guardados</span>
              <h1>Mis favoritos ❤️</h1>
              <p>
                Los paquetes que has guardado aparecerán aquí.
              </p>
            </div>

            {favoritos.length === 0 ? (
              <div className="perfil-vacio">
                <div>❤️</div>

                <h3>
                  No tienes favoritos todavía
                </h3>

                <p>
                  Presiona el corazón en tus paquetes favoritos
                  para guardarlos.
                </p>
              </div>
            ) : (
              <div className="favoritos-lista">
                {favoritos.map((slug) => (
                  <div
                    className="favorito-card"
                    key={slug}
                  >
                    <div>
                      <span>
                        ❤️ Destino guardado
                      </span>

                      <h3>
                        {slug.replaceAll("-", " ")}
                      </h3>
                    </div>

                    <button
                      onClick={() => {
                        cambiarFavorito(slug);

                        mostrarMensaje(
                          "Favorito eliminado",
                          "El paquete fue eliminado de tus favoritos."
                        );
                      }}
                    >
                      Quitar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {seccion === "datos" && (
          <section>
            <div className="perfil-titulo">
              <span>Cuenta</span>
              <h1>Mis datos 📝</h1>
              <p>
                Actualiza la información de tu cuenta.
              </p>
            </div>

            <form
              className="datos-formulario"
              onSubmit={guardarDatos}
            >
              <div className="campo">
                <label>Nombre completo</label>

                <input
                  type="text"
                  value={nombre}
                  onChange={(e) =>
                    setNombre(e.target.value)
                  }
                  required
                />
              </div>

              <div className="campo">
                <label>Correo electrónico</label>

                <input
                  type="email"
                  value={correo}
                  onChange={(e) =>
                    setCorreo(e.target.value)
                  }
                  required
                />
              </div>

              <div className="campo">
                <label>Tipo de cuenta</label>

                <input
                  type="text"
                  value="Cliente"
                  disabled
                />
              </div>

              <button
                className="btn-guardar"
                type="submit"
              >
                Guardar cambios
              </button>
            </form>
          </section>
        )}

        {seccion === "notificaciones" && (
          <section>
            <div className="perfil-titulo">
              <span>Mantente informado</span>

              <h1>
                Notificaciones 🔔
              </h1>

              <p>
                Consulta las novedades de tu cuenta y tus viajes.
              </p>
            </div>

            {notificaciones.length === 0 ? (
              <div className="perfil-vacio">
                <div>🔔</div>

                <h3>
                  No tienes notificaciones
                </h3>

                <p>
                  Cuando haya novedades aparecerán aquí.
                </p>
              </div>
            ) : (
              <div className="notificaciones-lista">
                {notificaciones.map(
                  (notificacion, indice) => {
                    const id =
                      notificacion.id_notificacion ??
                      notificacion.id ??
                      indice;

                    const noLeida =
                      notificacion.leida !== true &&
                      notificacion.estado !== "Leída";

                    return (
                      <div
                        className={`notificacion-card ${
                          noLeida ? "nueva" : ""
                        }`}
                        key={id}
                      >
                        <div className="notificacion-icono">
                          {noLeida ? "🔔" : "✓"}
                        </div>

                        <div>
                          <h3>
                            {notificacion.titulo ||
                              "Notificación de MAREVA"}
                          </h3>

                          <p>
                            {notificacion.mensaje ||
                              "Tienes una nueva notificación."}
                          </p>

                          <small>
                            {notificacion.fecha_creacion ||
                              notificacion.fecha ||
                              ""}
                          </small>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default PerfilCliente;


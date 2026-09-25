import { useEffect, useState } from "react";
import axios from "axios";
import "./Notificaciones.css";

interface Notificacion {
  id_notificacion?: number;
  id?: number;
  mensaje?: string;
  titulo?: string;
  leida?: boolean;
  estado?: string;
  fecha?: string;
  fecha_creacion?: string;
}

interface NotificacionesProps {
  mostrarMensaje: (titulo: string, texto: string) => void;
}

function Notificaciones({
  mostrarMensaje,
}: NotificacionesProps) {
  const [notificaciones, setNotificaciones] = useState<
    Notificacion[]
  >([]);

  const [cargando, setCargando] = useState(true);

  const cargarNotificaciones = async () => {
    const token = localStorage.getItem("mareva_token");

    if (!token) {
      setCargando(false);
      return;
    }

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
      } else if (Array.isArray(datos.notificaciones)) {
        setNotificaciones(datos.notificaciones);
      } else {
        setNotificaciones([]);
      }
    } catch (error) {
      console.error(
        "Error cargando notificaciones:",
        error
      );

      mostrarMensaje(
        "Error",
        "No fue posible cargar tus notificaciones."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  const marcarComoLeida = async (
    notificacion: Notificacion
  ) => {
    const id =
      notificacion.id_notificacion ??
      notificacion.id;

    if (!id || notificacion.leida === true) {
      return;
    }

    const token = localStorage.getItem("mareva_token");

    if (!token) {
      return;
    }

    try {
      await axios.put(
        `http://127.0.0.1:5000/mis-notificaciones/${id}/leer`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotificaciones((actuales) =>
        actuales.map((item) => {
          const itemId =
            item.id_notificacion ?? item.id;

          if (itemId === id) {
            return {
              ...item,
              leida: true,
              estado: "Leída",
            };
          }

          return item;
        })
      );
    } catch (error) {
      console.error(
        "Error marcando notificación:",
        error
      );
    }
  };

  const obtenerMensaje = (
    notificacion: Notificacion
  ) => {
    return (
      notificacion.mensaje ||
      notificacion.titulo ||
      "Tienes una nueva notificación."
    );
  };

  const obtenerFecha = (
    notificacion: Notificacion
  ) => {
    return (
      notificacion.fecha_creacion ||
      notificacion.fecha ||
      ""
    );
  };

  const notificacionesNoLeidas =
    notificaciones.filter(
      (notificacion) =>
        notificacion.leida !== true &&
        notificacion.estado !== "Leída"
    ).length;

  if (cargando) {
    return (
      <section className="notificaciones-page">
        <div className="notificaciones-cargando">
          <div className="notificaciones-spinner">
            ⟳
          </div>

          <p>
            Cargando tus notificaciones...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="notificaciones-page">

      <div className="notificaciones-encabezado">

        <div>
          <span className="notificaciones-etiqueta">
            MAREVA · NOTIFICACIONES
          </span>

          <h1>
            Mis notificaciones 🔔
          </h1>

          <p>
            Aquí encontrarás las novedades
            relacionadas con tus reservas y
            tu cuenta.
          </p>
        </div>

        {notificacionesNoLeidas > 0 && (
          <div className="notificaciones-contador">
            {notificacionesNoLeidas}{" "}
            {notificacionesNoLeidas === 1
              ? "sin leer"
              : "sin leer"}
          </div>
        )}

      </div>

      {notificaciones.length === 0 ? (
        <div className="notificaciones-vacio">

          <div className="notificaciones-vacio-icono">
            🔔
          </div>

          <h2>
            No tienes notificaciones
          </h2>

          <p>
            Cuando tengas novedades sobre
            tus reservas aparecerán aquí.
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
                <article
                  key={id}
                  className={`notificacion-card ${
                    noLeida
                      ? "notificacion-no-leida"
                      : ""
                  }`}
                  onClick={() =>
                    marcarComoLeida(notificacion)
                  }
                >

                  <div className="notificacion-icono">
                    {noLeida ? "🔔" : "✓"}
                  </div>

                  <div className="notificacion-contenido">

                    <div className="notificacion-arriba">

                      <h3>
                        {notificacion.titulo ||
                          "Notificación de MAREVA"}
                      </h3>

                      {noLeida && (
                        <span className="notificacion-nueva">
                          NUEVA
                        </span>
                      )}

                    </div>

                    <p>
                      {obtenerMensaje(
                        notificacion
                      )}
                    </p>

                    {obtenerFecha(
                      notificacion
                    ) && (
                      <span className="notificacion-fecha">
                        {obtenerFecha(
                          notificacion
                        )}
                      </span>
                    )}

                  </div>

                </article>
              );
            }
          )}

        </div>
      )}

    </section>
  );
}

export default Notificaciones;


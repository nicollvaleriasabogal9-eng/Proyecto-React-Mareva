import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./FormularioReserva.css";

interface PaqueteReserva {
  slug: string;
  nombre: string;
  destino: string;
  precio: number;
  duracion_dias?: number;
  duracion_noches?: number;
  dias?: number;
  descripcion?: string;
  imagen?: string;
}

interface UsuarioReserva {
  id_usuario?: number;
  id?: number;
  nombre: string;
  correo: string;
  rol?: string;
}

interface FormularioReservaProps {
  paquete: PaqueteReserva;
  mostrarMensaje: (titulo: string, mensaje: string) => void;
  volver: () => void;
  reservaCreada?: (idReserva: number) => void;
  usuario?: UsuarioReserva | null;
}

interface FechaDisponible {
  fecha_ida?: string;
  fecha_regreso?: string;
  fecha?: string;
  cupos_disponibles?: number;
  cupos?: number;
}

interface Alojamiento {
  id_alojamiento?: number;
  id?: number;
  nombre: string;
  tipo?: string;
  precio_noche?: number;
  precio?: number;
  capacidad?: number;
  mascotas?: boolean;
  pet_friendly?: boolean;
  disponible?: boolean;
  activo?: boolean;
}

interface Transporte {
  id_transporte?: number;
  id?: number;
  nombre: string;
  tipo?: string;
  precio?: number;
  precio_persona?: number;
  sillas_disponibles?: number;
  cupos_disponibles?: number;
  disponible?: boolean;
  activo?: boolean;
}

const API = "http://127.0.0.1:5000";

const RESERVA_PENDIENTE_KEY =
  "mareva_reserva_pendiente";

const obtenerToken = () => {
  return (
    localStorage.getItem("mareva_token") ||
    localStorage.getItem("token") ||
    ""
  );
};

const corregirTexto = (texto: string) => {
  if (!texto) return "";

  try {
    if (
      texto.includes("Ã") ||
      texto.includes("Â") ||
      texto.includes("â")
    ) {
      return decodeURIComponent(
        escape(texto)
      );
    }
  } catch {
    return texto;
  }

  return texto;
};

const formatearPrecio = (valor: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor || 0);
};

const obtenerNumeroId = (
  item: any,
  nombres: string[]
) => {
  for (const nombre of nombres) {
    if (
      item?.[nombre] !== undefined &&
      item?.[nombre] !== null
    ) {
      const numero = Number(
        item[nombre]
      );

      if (!Number.isNaN(numero)) {
        return numero;
      }
    }
  }

  return null;
};

const calcularFechaRegreso = (
  fecha: string,
  dias: number
) => {
  if (!fecha) return "";

  const partes = fecha
    .split("-")
    .map(Number);

  if (
    partes.length !== 3 ||
    partes.some((numero) =>
      Number.isNaN(numero)
    )
  ) {
    return "";
  }

  const [anio, mes, dia] = partes;

  const inicio = new Date(
    anio,
    mes - 1,
    dia
  );

  if (
    Number.isNaN(
      inicio.getTime()
    )
  ) {
    return "";
  }

  inicio.setDate(
    inicio.getDate() +
      Math.max(0, dias - 1)
  );

  return [
    inicio.getFullYear(),
    String(
      inicio.getMonth() + 1
    ).padStart(2, "0"),
    String(
      inicio.getDate()
    ).padStart(2, "0"),
  ].join("-");
};

export default function FormularioReserva({
  paquete,
  mostrarMensaje,
  volver,
  reservaCreada,
  usuario,
}: FormularioReservaProps) {
  const token = obtenerToken();

  const idUsuario = useMemo(() => {
    if (!usuario) return null;

    const id =
      usuario.id_usuario !== undefined
        ? usuario.id_usuario
        : usuario.id;

    if (
      id === undefined ||
      id === null
    ) {
      return null;
    }

    const numero = Number(id);

    return Number.isNaN(numero)
      ? null
      : numero;
  }, [usuario]);

  const [
    fechaIda,
    setFechaIda,
  ] = useState("");

  const [
    fechaRegreso,
    setFechaRegreso,
  ] = useState("");

  const [
    adultos,
    setAdultos,
  ] = useState(1);

  const [
    ninos,
    setNinos,
  ] = useState(0);

  const [
    bebes,
    setBebes,
  ] = useState(0);

  const [
    tieneMascota,
    setTieneMascota,
  ] = useState<boolean | null>(
    null
  );

  const [
    mascotas,
    setMascotas,
  ] = useState(0);

  const [
    mostrarTransportes,
    setMostrarTransportes,
  ] = useState(false);

  const [
    transporteSeleccionado,
    setTransporteSeleccionado,
  ] = useState<number | null>(
    null
  );

  const [
    alojamientoSeleccionado,
    setAlojamientoSeleccionado,
  ] = useState<number | null>(
    null
  );

  const [
    fechasDisponibles,
    setFechasDisponibles,
  ] = useState<
    FechaDisponible[]
  >([]);

  const [
    alojamientos,
    setAlojamientos,
  ] = useState<Alojamiento[]>(
    []
  );

  const [
    transportes,
    setTransportes,
  ] = useState<Transporte[]>(
    []
  );

  const [
    cargandoFechas,
    setCargandoFechas,
  ] = useState(false);

  const [
    cargandoAlojamientos,
    setCargandoAlojamientos,
  ] = useState(false);

  const [
    cargandoTransportes,
    setCargandoTransportes,
  ] = useState(false);

  const [
    creandoReserva,
    setCreandoReserva,
  ] = useState(false);

  const [
    errorFormulario,
    setErrorFormulario,
  ] = useState("");

  const totalViajeros =
    adultos +
    ninos +
    bebes;

  const fechaSeleccionada =
    useMemo(() => {
      return fechasDisponibles.find(
        (fecha) => {
          const fechaItem =
            fecha.fecha_ida ||
            fecha.fecha ||
            "";

          return (
            fechaItem ===
            fechaIda
          );
        }
      );
    }, [
      fechasDisponibles,
      fechaIda,
    ]);

  const cuposDisponibles =
    useMemo(() => {
      if (!fechaSeleccionada) {
        return null;
      }

      const cupos =
        fechaSeleccionada.cupos_disponibles ??
        fechaSeleccionada.cupos;

      if (
        cupos === undefined ||
        cupos === null
      ) {
        return null;
      }

      return Number(cupos);
    }, [fechaSeleccionada]);

  const noches = useMemo(() => {
    if (
      !fechaIda ||
      !fechaRegreso
    ) {
      return Number(
        paquete.duracion_noches ||
          Math.max(
            1,
            Number(
              paquete.duracion_dias ||
                paquete.dias ||
                1
            ) - 1
          )
      );
    }

    const inicioPartes =
      fechaIda
        .split("-")
        .map(Number);

    const regresoPartes =
      fechaRegreso
        .split("-")
        .map(Number);

    if (
      inicioPartes.length !== 3 ||
      regresoPartes.length !== 3
    ) {
      return Number(
        paquete.duracion_noches || 1
      );
    }

    const inicio = new Date(
      inicioPartes[0],
      inicioPartes[1] - 1,
      inicioPartes[2]
    );

    const fin = new Date(
      regresoPartes[0],
      regresoPartes[1] - 1,
      regresoPartes[2]
    );

    const diferencia =
      fin.getTime() -
      inicio.getTime();

    const calculadas = Math.ceil(
      diferencia /
        (1000 * 60 * 60 * 24)
    );

    return calculadas > 0
      ? calculadas
      : Number(
          paquete.duracion_noches ||
            1
        );
  }, [
    fechaIda,
    fechaRegreso,
    paquete.duracion_dias,
    paquete.duracion_noches,
    paquete.dias,
  ]);

  const alojamientosFiltrados =
    useMemo(() => {
      return alojamientos.filter(
        (alojamiento) => {
          if (
            alojamiento.disponible ===
            false
          ) {
            return false;
          }

          if (
            alojamiento.activo ===
            false
          ) {
            return false;
          }

          if (
            alojamiento.capacidad !==
              undefined &&
            alojamiento.capacidad !==
              null &&
            totalViajeros >
              Number(
                alojamiento.capacidad
              )
          ) {
            return false;
          }

          if (
            tieneMascota === true
          ) {
            const permiteMascotas =
              alojamiento.mascotas ===
                true ||
              alojamiento.pet_friendly ===
                true;

            if (
              !permiteMascotas
            ) {
              return false;
            }
          }

          return true;
        }
      );
    }, [
      alojamientos,
      totalViajeros,
      tieneMascota,
    ]);

  const alojamientoActual =
    useMemo(() => {
      return alojamientos.find(
        (alojamiento) => {
          const id =
            obtenerNumeroId(
              alojamiento,
              [
                "id_alojamiento",
                "id",
              ]
            );

          return (
            id ===
            alojamientoSeleccionado
          );
        }
      );
    }, [
      alojamientos,
      alojamientoSeleccionado,
    ]);

  const transportesFiltrados =
    useMemo(() => {
      return transportes.filter(
        (transporte) => {
          if (
            transporte.disponible ===
            false
          ) {
            return false;
          }

          if (
            transporte.activo ===
            false
          ) {
            return false;
          }

          const cupos =
            transporte.sillas_disponibles ??
            transporte.cupos_disponibles;

          if (
            cupos !== undefined &&
            cupos !== null &&
            totalViajeros >
              Number(cupos)
          ) {
            return false;
          }

          return true;
        }
      );
    }, [
      transportes,
      totalViajeros,
    ]);

  const transporteActual =
    useMemo(() => {
      return transportes.find(
        (transporte) => {
          const id =
            obtenerNumeroId(
              transporte,
              [
                "id_transporte",
                "id",
              ]
            );

          return (
            id ===
            transporteSeleccionado
          );
        }
      );
    }, [
      transportes,
      transporteSeleccionado,
    ]);

  const precioPaquete = Number(
    paquete.precio || 0
  );

  const precioAlojamiento =
    Number(
      alojamientoActual?.precio_noche ??
        alojamientoActual?.precio ??
        0
    );

  const precioTransporte =
    Number(
      transporteActual?.precio_persona ??
        transporteActual?.precio ??
        0
    );

  const subtotalPaquete =
    precioPaquete *
    totalViajeros;

  const subtotalAlojamiento =
    precioAlojamiento *
    noches;

  const subtotalTransporte =
    precioTransporte *
    totalViajeros;

  const subtotalCalculado =
    subtotalPaquete +
    subtotalAlojamiento +
    subtotalTransporte;

  useEffect(() => {
    const cargarFechas =
      async () => {
        try {
          setCargandoFechas(true);
          setErrorFormulario("");

          const respuesta =
            await axios.get(
              `${API}/fechas-disponibles`,
              {
                params: {
                  paquete:
                    paquete.nombre,
                },
              }
            );

          const data =
            respuesta.data;

          const fechas =
            Array.isArray(data)
              ? data
              : Array.isArray(
                  data?.fechas
                )
              ? data.fechas
              : [];

          setFechasDisponibles(
            fechas
          );

          if (
            fechas.length > 0
          ) {
            const primeraFecha =
              fechas[0];

            const ida =
              primeraFecha.fecha_ida ||
              primeraFecha.fecha ||
              "";

            setFechaIda(ida);
          }
        } catch (error) {
          console.error(
            "Error cargando fechas:",
            error
          );

          setErrorFormulario(
            "No fue posible cargar las fechas disponibles."
          );
        } finally {
          setCargandoFechas(
            false
          );
        }
      };

    cargarFechas();
  }, [paquete.nombre]);

  useEffect(() => {
    const cargarAlojamientos =
      async () => {
        try {
          setCargandoAlojamientos(
            true
          );

          const respuesta =
            await axios.get(
              `${API}/alojamientos`
            );

          const data =
            respuesta.data;

          const lista =
            Array.isArray(data)
              ? data
              : Array.isArray(
                  data?.alojamientos
                )
              ? data.alojamientos
              : [];

          setAlojamientos(lista);
        } catch (error) {
          console.error(
            "Error cargando alojamientos:",
            error
          );

          setErrorFormulario(
            "No fue posible cargar los alojamientos."
          );
        } finally {
          setCargandoAlojamientos(
            false
          );
        }
      };

    cargarAlojamientos();
  }, []);

  useEffect(() => {
    const cargarTransportes =
      async () => {
        try {
          setCargandoTransportes(
            true
          );

          const respuesta =
            await axios.get(
              `${API}/transportes`
            );

          const data =
            respuesta.data;

          const lista =
            Array.isArray(data)
              ? data
              : Array.isArray(
                  data?.transportes
                )
              ? data.transportes
              : [];

          setTransportes(lista);
        } catch (error) {
          console.error(
            "Error cargando transportes:",
            error
          );

          setErrorFormulario(
            "No fue posible cargar los transportes."
          );
        } finally {
          setCargandoTransportes(
            false
          );
        }
      };

    cargarTransportes();
  }, []);

  useEffect(() => {
    if (!fechaIda) {
      setFechaRegreso("");
      return;
    }

    const dias = Number(
      paquete.duracion_dias ||
        paquete.dias ||
        1
    );

    const regreso =
      calcularFechaRegreso(
        fechaIda,
        dias
      );

    setFechaRegreso(
      regreso
    );
  }, [
    fechaIda,
    paquete.duracion_dias,
    paquete.dias,
  ]);

  useEffect(() => {
    if (
      alojamientoSeleccionado !==
        null &&
      !alojamientosFiltrados.some(
        (alojamiento) =>
          obtenerNumeroId(
            alojamiento,
            [
              "id_alojamiento",
              "id",
            ]
          ) ===
          alojamientoSeleccionado
      )
    ) {
      setAlojamientoSeleccionado(
        null
      );
    }
  }, [
    alojamientosFiltrados,
    alojamientoSeleccionado,
  ]);

  useEffect(() => {
    if (
      transporteSeleccionado !==
        null &&
      !transportesFiltrados.some(
        (transporte) =>
          obtenerNumeroId(
            transporte,
            [
              "id_transporte",
              "id",
            ]
          ) ===
          transporteSeleccionado
      )
    ) {
      setTransporteSeleccionado(
        null
      );
    }
  }, [
    transportesFiltrados,
    transporteSeleccionado,
  ]);

  useEffect(() => {
    if (
      tieneMascota === false
    ) {
      setMascotas(0);
    }

    if (
      tieneMascota === true &&
      mascotas === 0
    ) {
      setMascotas(1);
    }
  }, [
    tieneMascota,
    mascotas,
  ]);

  const crearReserva =
    async () => {
      setErrorFormulario("");

      if (
        creandoReserva
      ) {
        return;
      }

      if (
        !usuario ||
        idUsuario === null
      ) {
        setErrorFormulario(
          "Debes iniciar sesión antes de realizar una reserva."
        );
        return;
      }

      const tokenActual =
        obtenerToken();

      if (!tokenActual) {
        setErrorFormulario(
          "Tu sesión no es válida. Inicia sesión nuevamente."
        );
        return;
      }

      if (!fechaIda) {
        setErrorFormulario(
          "Selecciona una fecha de ida disponible."
        );
        return;
      }

      if (!fechaRegreso) {
        setErrorFormulario(
          "No fue posible calcular la fecha de regreso."
        );
        return;
      }

      if (
        totalViajeros <= 0
      ) {
        setErrorFormulario(
          "Debes registrar al menos un viajero."
        );
        return;
      }

      if (
        totalViajeros > 50
      ) {
        setErrorFormulario(
          "El máximo permitido es de 50 viajeros."
        );
        return;
      }

      if (
        cuposDisponibles !==
          null &&
        totalViajeros >
          cuposDisponibles
      ) {
        setErrorFormulario(
          `No hay suficientes cupos. Solo quedan ${cuposDisponibles} disponibles.`
        );
        return;
      }

      if (
        tieneMascota === null
      ) {
        setErrorFormulario(
          "Indica si vas a viajar con mascota."
        );
        return;
      }

      if (
        tieneMascota &&
        mascotas <= 0
      ) {
        setErrorFormulario(
          "Indica la cantidad de mascotas."
        );
        return;
      }

      if (
        alojamientosFiltrados.length ===
        0
      ) {
        setErrorFormulario(
          "No hay alojamientos disponibles para esta configuración."
        );
        return;
      }

      if (
        alojamientoSeleccionado ===
        null
      ) {
        setErrorFormulario(
          "Selecciona un alojamiento."
        );
        return;
      }

      if (
        mostrarTransportes &&
        transporteSeleccionado ===
          null
      ) {
        setErrorFormulario(
          "Selecciona el transporte que deseas utilizar."
        );
        return;
      }

      if (
        transporteActual &&
        totalViajeros >
          Number(
            transporteActual.sillas_disponibles ??
              transporteActual.cupos_disponibles ??
              999999
          )
      ) {
        setErrorFormulario(
          "No hay suficientes cupos en el transporte seleccionado."
        );
        return;
      }

      setCreandoReserva(true);

      try {
        const precioParaServidor =
          Math.round(
            subtotalCalculado
          );

        const datosReserva = {
          id_usuario:
            Number(idUsuario),

          destino:
            corregirTexto(
              paquete.destino
            ),

          paquete:
            corregirTexto(
              paquete.nombre
            ),

          fecha_ida:
            fechaIda,

          fecha_regreso:
            fechaRegreso,

          adultos,

          ninos,

          bebes,

          mascotas,

          alojamiento:
            alojamientoActual?.nombre ||
            "Sin alojamiento",

          id_alojamiento:
            alojamientoActual
              ? obtenerNumeroId(
                  alojamientoActual,
                  [
                    "id_alojamiento",
                    "id",
                  ]
                )
              : null,

          transporte:
            transporteActual?.nombre ||
            "Sin transporte",

          id_transporte:
            transporteActual
              ? obtenerNumeroId(
                  transporteActual,
                  [
                    "id_transporte",
                    "id",
                  ]
                )
              : null,

          precio_total:
            precioParaServidor,
        };

        const respuesta =
          await axios.post(
            `${API}/reservas`,
            datosReserva,
            {
              headers: {
                Authorization:
                  `Bearer ${tokenActual}`,
                "Content-Type":
                  "application/json",
              },
            }
          );

        const data =
          respuesta.data;

        const nuevoId =
          data?.id_reserva ??
          data?.id ??
          data?.reserva?.id_reserva ??
          data?.reserva?.id ??
          data?.reserva?.reserva_id ??
          data?.data?.id_reserva ??
          data?.data?.id ??
          null;

        const numeroReserva =
          Number(nuevoId);

        if (
          !numeroReserva ||
          Number.isNaN(
            numeroReserva
          )
        ) {
          console.error(
            "Respuesta completa del servidor:",
            data
          );

          throw new Error(
            "La reserva fue procesada, pero el servidor no devolvió un número de reserva válido."
          );
        }

        localStorage.setItem(
          RESERVA_PENDIENTE_KEY,
          String(
            numeroReserva
          )
        );

        mostrarMensaje(
          "Reserva creada",
          `Tu reserva #${numeroReserva} quedó en estado Pendiente de pago.`
        );

        if (
          typeof reservaCreada ===
          "function"
        ) {
          reservaCreada(
            numeroReserva
          );
          return;
        }

        setErrorFormulario(
          `Reserva #${numeroReserva} creada correctamente. Ve a Mis reservas para continuar con el pago.`
        );
      } catch (error: any) {
        console.error(
          "Error creando reserva:",
          error
        );

        const mensajeBackend =
          error?.response?.data
            ?.mensaje ||
          error?.response?.data
            ?.error ||
          error?.response?.data
            ?.message;

        if (
          error?.response?.status ===
          401
        ) {
          setErrorFormulario(
            "Tu sesión expiró. Inicia sesión nuevamente."
          );
        } else if (
          error?.response?.status ===
          400
        ) {
          setErrorFormulario(
            mensajeBackend ||
              "Los datos enviados para la reserva no son válidos."
          );
        } else if (
          error?.response?.status ===
          404
        ) {
          setErrorFormulario(
            "No se encontró el servicio de reservas en el servidor."
          );
        } else if (
          error?.response?.status >=
          500
        ) {
          setErrorFormulario(
            "El servidor tuvo un problema al crear la reserva."
          );
        } else {
          setErrorFormulario(
            mensajeBackend ||
              error?.message ||
              "No fue posible crear la reserva."
          );
        }
      } finally {
        setCreandoReserva(
          false
        );
      }
    };

  return (
    <div className="formulario-reserva">
      <div className="formulario-reserva-contenedor">

        <button
          type="button"
          className="btn-volver-reserva"
          onClick={volver}
        >
          ← Volver
        </button>

        <div className="reserva-header">
          <span className="reserva-etiqueta">
            MAREVA · NUEVA RESERVA
          </span>

          <h1>
            Reserva tu viaje
          </h1>

          <p>
            Completa los datos para
            reservar tu experiencia.
          </p>
        </div>

        <div className="paquete-seleccionado-reserva">

          <div className="paquete-imagen-reserva">
            {paquete.imagen ? (
              <img
                src={paquete.imagen}
                alt={paquete.nombre}
              />
            ) : (
              <div className="paquete-imagen-placeholder">
                🌴
              </div>
            )}
          </div>

          <div className="paquete-info-reserva">

            <span>
              PAQUETE SELECCIONADO
            </span>

            <h2>
              {corregirTexto(
                paquete.nombre
              )}
            </h2>

            <p>
              📍{" "}
              {corregirTexto(
                paquete.destino
              )}
            </p>

            <div className="paquete-datos-reserva">

              <span>
                🗓️{" "}
                {paquete.duracion_dias ||
                  paquete.dias ||
                  paquete.duracion_noches ||
                  1}{" "}
                días
              </span>

              <strong>
                {formatearPrecio(
                  precioPaquete
                )}{" "}
                por persona
              </strong>

            </div>

          </div>

        </div>

        {errorFormulario && (
          <div className="mensaje-error-reserva">
            ⚠️ {errorFormulario}
          </div>
        )}

        <div className="formulario-card">

          <div className="seccion-formulario">

            <div className="titulo-seccion-formulario">

              <span>
                1
              </span>

              <div>
                <h3>
                  Fechas del viaje
                </h3>

                <p>
                  Selecciona la fecha en la
                  que quieres viajar.
                </p>
              </div>

            </div>

            {cargandoFechas ? (
              <div className="estado-cargando">
                Cargando fechas disponibles...
              </div>
            ) : fechasDisponibles.length ===
              0 ? (
              <div className="mensaje-info-reserva">
                No hay fechas disponibles
                para este paquete.
              </div>
            ) : (
              <div className="campo-formulario">

                <label htmlFor="fechaIda">
                  Fecha de ida
                </label>

                <select
                  id="fechaIda"
                  value={fechaIda}
                  onChange={(e) =>
                    setFechaIda(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Selecciona una fecha
                  </option>

                  {fechasDisponibles.map(
                    (
                      fecha,
                      index
                    ) => {

                      const ida =
                        fecha.fecha_ida ||
                        fecha.fecha ||
                        "";

                      const cupos =
                        fecha.cupos_disponibles ??
                        fecha.cupos;

                      return (
                        <option
                          key={`${ida}-${index}`}
                          value={ida}
                        >
                          {ida}

                          {cupos !==
                            undefined &&
                          cupos !==
                            null
                            ? ` · ${cupos} cupos`
                            : ""}
                        </option>
                      );
                    }
                  )}

                </select>

                {fechaRegreso && (
                  <small className="texto-ayuda-formulario">
                    Regreso:{" "}
                    {fechaRegreso}
                  </small>
                )}

                {cuposDisponibles !==
                  null && (
                  <small className="texto-cupos-formulario">
                    {cuposDisponibles}{" "}
                    cupos disponibles
                  </small>
                )}

              </div>
            )}

          </div>

          <div className="seccion-formulario">

            <div className="titulo-seccion-formulario">

              <span>
                2
              </span>

              <div>

                <h3>
                  Viajeros
                </h3>

                <p>
                  Indica cuántas personas
                  viajarán.
                </p>

              </div>

            </div>

            <div className="viajeros-grid-reserva">

              <div className="contador-viajero">

                <div>
                  <strong>
                    Adultos
                  </strong>

                  <small>
                    18 años o más
                  </small>
                </div>

                <div className="controles-contador">

                  <button
                    type="button"
                    onClick={() =>
                      setAdultos(
                        Math.max(
                          1,
                          adultos - 1
                        )
                      )
                    }
                  >
                    −
                  </button>

                  <strong>
                    {adultos}
                  </strong>

                  <button
                    type="button"
                    onClick={() =>
                      setAdultos(
                        Math.min(
                          50,
                          adultos + 1
                        )
                      )
                    }
                  >
                    +
                  </button>

                </div>

              </div>

              <div className="contador-viajero">

                <div>
                  <strong>
                    Niños
                  </strong>

                  <small>
                    2 a 11 años
                  </small>
                </div>

                <div className="controles-contador">

                  <button
                    type="button"
                    onClick={() =>
                      setNinos(
                        Math.max(
                          0,
                          ninos - 1
                        )
                      )
                    }
                  >
                    −
                  </button>

                  <strong>
                    {ninos}
                  </strong>

                  <button
                    type="button"
                    onClick={() =>
                      setNinos(
                        Math.min(
                          50,
                          ninos + 1
                        )
                      )
                    }
                  >
                    +
                  </button>

                </div>

              </div>

              <div className="contador-viajero">

                <div>
                  <strong>
                    Bebés
                  </strong>

                  <small>
                    0 a 23 meses
                  </small>
                </div>

                <div className="controles-contador">

                  <button
                    type="button"
                    onClick={() =>
                      setBebes(
                        Math.max(
                          0,
                          bebes - 1
                        )
                      )
                    }
                  >
                    −
                  </button>

                  <strong>
                    {bebes}
                  </strong>

                  <button
                    type="button"
                    onClick={() =>
                      setBebes(
                        Math.min(
                          50,
                          bebes + 1
                        )
                      )
                    }
                  >
                    +
                  </button>

                </div>

              </div>

            </div>

            <div className="resumen-viajeros">
              Total de viajeros:{" "}
              <strong>
                {totalViajeros}
              </strong>
            </div>

          </div>

          <div className="seccion-formulario">

            <div className="titulo-seccion-formulario">

              <span>
                3
              </span>

              <div>

                <h3>
                  Mascota
                </h3>

                <p>
                  ¿Viajas con tu mascota?
                </p>

              </div>

            </div>

            <div className="opciones-mascota">

              <button
                type="button"
                className={
                  tieneMascota === true
                    ? "opcion-mascota activa"
                    : "opcion-mascota"
                }
                onClick={() =>
                  setTieneMascota(
                    true
                  )
                }
              >
                🐶

                <span>
                  Sí, viajo con mascota
                </span>

              </button>

              <button
                type="button"
                className={
                  tieneMascota === false
                    ? "opcion-mascota activa"
                    : "opcion-mascota"
                }
                onClick={() =>
                  setTieneMascota(
                    false
                  )
                }
              >
                🚫

                <span>
                  No llevo mascota
                </span>

              </button>

            </div>

            {tieneMascota && (
              <div className="campo-formulario campo-mascotas">

                <label htmlFor="mascotas">
                  Cantidad de mascotas
                </label>

                <input
                  id="mascotas"
                  type="number"
                  min="1"
                  max="10"
                  value={mascotas}
                  onChange={(e) =>
                    setMascotas(
                      Math.max(
                        1,
                        Math.min(
                          10,
                          Number(
                            e.target.value
                          )
                        )
                      )
                    )
                  }
                />

              </div>
            )}

          </div>

          <div className="seccion-formulario">

            <div className="titulo-seccion-formulario">

              <span>
                4
              </span>

              <div>

                <h3>
                  Alojamiento
                </h3>

                <p>
                  Selecciona el alojamiento
                  para tu viaje.
                </p>

              </div>

            </div>

            {cargandoAlojamientos ? (
              <div className="estado-cargando">
                Cargando alojamientos...
              </div>
            ) : alojamientosFiltrados.length ===
              0 ? (
              <div className="mensaje-info-reserva">
                No hay alojamientos
                disponibles para esta
                configuración.
              </div>
            ) : (
              <div className="opciones-alojamiento">

                {alojamientosFiltrados.map(
                  (alojamiento) => {

                    const id =
                      obtenerNumeroId(
                        alojamiento,
                        [
                          "id_alojamiento",
                          "id",
                        ]
                      );

                    if (id === null) {
                      return null;
                    }

                    const precio =
                      Number(
                        alojamiento.precio_noche ??
                          alojamiento.precio ??
                          0
                      );

                    const permiteMascotas =
                      alojamiento.mascotas ===
                        true ||
                      alojamiento.pet_friendly ===
                        true;

                    return (
                      <button
                        type="button"
                        key={id}
                        className={
                          alojamientoSeleccionado ===
                          id
                            ? "tarjeta-opcion activa"
                            : "tarjeta-opcion"
                        }
                        onClick={() =>
                          setAlojamientoSeleccionado(
                            id
                          )
                        }
                      >

                        <div className="opcion-icono">
                          🏨
                        </div>

                        <div className="opcion-contenido">

                          <strong>
                            {corregirTexto(
                              alojamiento.nombre
                            )}
                          </strong>

                          {alojamiento.tipo && (
                            <span>
                              {corregirTexto(
                                alojamiento.tipo
                              )}
                            </span>
                          )}

                          {alojamiento.capacidad !==
                            undefined &&
                            alojamiento.capacidad !==
                              null && (
                              <small>
                                Capacidad:{" "}
                                {
                                  alojamiento.capacidad
                                }{" "}
                                personas
                              </small>
                            )}

                          {tieneMascota &&
                            permiteMascotas && (
                              <small>
                                🐾 Pet Friendly
                              </small>
                            )}

                          <b>
                            {formatearPrecio(
                              precio
                            )}{" "}
                            / noche
                          </b>

                        </div>

                        <div className="opcion-check">
                          {alojamientoSeleccionado ===
                          id
                            ? "✓"
                            : ""}
                        </div>

                      </button>
                    );
                  }
                )}

              </div>
            )}

          </div>

          <div className="seccion-formulario">

            <div className="titulo-seccion-formulario">

              <span>
                5
              </span>

              <div>

                <h3>
                  Transporte
                </h3>

                <p>
                  Puedes agregar transporte
                  para tu viaje.
                </p>

              </div>

            </div>

            <div className="opciones-transporte-toggle">

              <button
                type="button"
                className={
                  !mostrarTransportes
                    ? "toggle-transporte activo"
                    : "toggle-transporte"
                }
                onClick={() => {
                  setMostrarTransportes(
                    false
                  );

                  setTransporteSeleccionado(
                    null
                  );
                }}
              >
                🚗

                <span>
                  No necesito transporte
                </span>

              </button>

              <button
                type="button"
                className={
                  mostrarTransportes
                    ? "toggle-transporte activo"
                    : "toggle-transporte"
                }
                onClick={() =>
                  setMostrarTransportes(
                    true
                  )
                }
              >
                🚌

                <span>
                  Quiero transporte
                </span>

              </button>

            </div>

            {mostrarTransportes && (
              <div className="transportes-lista">

                {cargandoTransportes ? (
                  <div className="estado-cargando">
                    Cargando transportes...
                  </div>
                ) : transportesFiltrados.length ===
                  0 ? (
                  <div className="mensaje-info-reserva">
                    No hay transportes
                    disponibles para esta
                    cantidad de viajeros.
                  </div>
                ) : (
                  transportesFiltrados.map(
                    (transporte) => {

                      const id =
                        obtenerNumeroId(
                          transporte,
                          [
                            "id_transporte",
                            "id",
                          ]
                        );

                      if (id === null) {
                        return null;
                      }

                      const precio =
                        Number(
                          transporte.precio_persona ??
                            transporte.precio ??
                            0
                        );

                      const cupos =
                        transporte.sillas_disponibles ??
                        transporte.cupos_disponibles;

                      return (
                        <button
                          type="button"
                          key={id}
                          className={
                            transporteSeleccionado ===
                            id
                              ? "tarjeta-opcion activa"
                              : "tarjeta-opcion"
                          }
                          onClick={() =>
                            setTransporteSeleccionado(
                              id
                            )
                          }
                        >

                          <div className="opcion-icono">
                            🚌
                          </div>

                          <div className="opcion-contenido">

                            <strong>
                              {corregirTexto(
                                transporte.nombre
                              )}
                            </strong>

                            {transporte.tipo && (
                              <span>
                                {corregirTexto(
                                  transporte.tipo
                                )}
                              </span>
                            )}

                            {cupos !==
                              undefined &&
                              cupos !==
                                null && (
                                <small>
                                  {cupos}{" "}
                                  cupos
                                  disponibles
                                </small>
                              )}

                            <b>
                              {formatearPrecio(
                                precio
                              )}{" "}
                              por persona
                            </b>

                          </div>

                          <div className="opcion-check">
                            {transporteSeleccionado ===
                            id
                              ? "✓"
                              : ""}
                          </div>

                        </button>
                      );
                    }
                  )
                )}

              </div>
            )}

          </div>

          <div className="seccion-resumen-final">

            <div>
              <span>
                Paquete
              </span>

              <strong>
                {formatearPrecio(
                  subtotalPaquete
                )}
              </strong>
            </div>

            <div>
              <span>
                Alojamiento
              </span>

              <strong>
                {formatearPrecio(
                  subtotalAlojamiento
                )}
              </strong>
            </div>

            <div>
              <span>
                Transporte
              </span>

              <strong>
                {formatearPrecio(
                  subtotalTransporte
                )}
              </strong>
            </div>

            <div className="total-reserva-final">

              <span>
                Total estimado
              </span>

              <strong>
                {formatearPrecio(
                  subtotalCalculado
                )}
              </strong>

            </div>

          </div>

          <div className="nota-pago-reserva">

            <span>
              💳
            </span>

            <div>

              <strong>
                Pago después de crear
                la reserva
              </strong>

              <p>
                Primero crearemos tu
                reserva con estado{" "}
                <b>
                  Pendiente de pago
                </b>
                . Después podrás aplicar
                tu cupón y realizar el pago
                desde{" "}
                <b>
                  Mis reservas
                </b>
                .
              </p>

            </div>

          </div>

          <button
            type="button"
            className="btn-crear-reserva"
            onClick={crearReserva}
            disabled={creandoReserva}
          >
            {creandoReserva ? (
              <>
                <span className="spinner-reserva" />
                Creando reserva...
              </>
            ) : (
              <>
                Crear reserva →
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
}

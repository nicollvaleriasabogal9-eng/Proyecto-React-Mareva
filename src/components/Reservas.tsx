import { useEffect, useMemo, useState } from "react";
import "./Reservas.css";

type Usuario = {
  id?: number;
  id_usuario?: number;
  nombre?: string;
  email?: string;
  correo?: string;
};

type Reserva = {
  id_reserva: number;
  id_usuario?: number;
  id_paquete?: number;
  destino?: string;
  paquete?: string;
  fecha_ida?: string;
  fecha_regreso?: string;
  adultos?: number;
  ninos?: number;
  bebes?: number;
  mascotas?: number | boolean;
  alojamiento?: string;
  transporte?: string;
  precio_total?: number;
  estado?: string;
  fecha_reserva?: string;
};

type Props = {
  usuario: Usuario | null;
  irA: (ruta: string) => void;
  mostrarMensaje: (titulo: string, mensaje: string) => void;
};

const API = "http://127.0.0.1:5000";
const RESERVA_PENDIENTE_KEY = "mareva_reserva_pendiente";

function obtenerToken() {
  return (
    localStorage.getItem("mareva_token") ||
    localStorage.getItem("token") ||
    ""
  );
}

function formatearPrecio(valor?: number) {
  const numero = Number(valor || 0);

  return numero.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

function formatearFecha(fecha?: string) {
  if (!fecha) return "Sin fecha";

  const date = new Date(`${fecha}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return fecha;
  }

  return date.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function normalizarReserva(item: any): Reserva {
  return {
    id_reserva: Number(item.id_reserva ?? item.id ?? 0),
    id_usuario: item.id_usuario,
    id_paquete: item.id_paquete,
    destino: item.destino ?? "",
    paquete: item.paquete ?? "",
    fecha_ida: item.fecha_ida ?? "",
    fecha_regreso: item.fecha_regreso ?? "",
    adultos: Number(item.adultos ?? 0),
    ninos: Number(item.ninos ?? 0),
    bebes: Number(item.bebes ?? 0),
    mascotas: item.mascotas ?? 0,
    alojamiento: item.alojamiento ?? "",
    transporte: item.transporte ?? "",
    precio_total: Number(item.precio_total ?? 0),
    estado: item.estado ?? "Pendiente de pago",
    fecha_reserva: item.fecha_reserva ?? "",
  };
}

function obtenerListaReservas(data: any): Reserva[] {
  if (Array.isArray(data)) {
    return data.map(normalizarReserva);
  }

  if (Array.isArray(data?.reservas)) {
    return data.reservas.map(normalizarReserva);
  }

  if (Array.isArray(data?.data)) {
    return data.data.map(normalizarReserva);
  }

  return [];
}

export default function Reservas({
  usuario,
  irA,
  mostrarMensaje,
}: Props) {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);

  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("Todas");

  const [reservaSeleccionada, setReservaSeleccionada] =
    useState<Reserva | null>(null);

  const [codigoCupon, setCodigoCupon] = useState("");
  const [descuento, setDescuento] = useState(0);
  const [aplicandoCupon, setAplicandoCupon] = useState(false);

  const [metodoPago, setMetodoPago] = useState("Tarjeta");
  const [procesandoPago, setProcesandoPago] = useState(false);

  const cargarReservas = async (silencioso = false) => {
    const token = obtenerToken();

    if (!token) {
      setCargando(false);
      return;
    }

    if (!silencioso) {
      setCargando(true);
    }

    try {
      const response = await fetch(`${API}/mis-reservas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.mensaje || data?.error || "No se pudieron cargar las reservas.");
      }

      const lista = obtenerListaReservas(data);

      setReservas(lista);

      const pendienteGuardada = localStorage.getItem(
        RESERVA_PENDIENTE_KEY
      );

      if (pendienteGuardada) {
        const idPendiente = Number(pendienteGuardada);

        const reservaPendiente = lista.find(
          (reserva) =>
            Number(reserva.id_reserva) === idPendiente &&
            String(reserva.estado).toLowerCase() ===
              "pendiente de pago"
        );

        if (reservaPendiente) {
          abrirPago(reservaPendiente);
        } else {
          localStorage.removeItem(RESERVA_PENDIENTE_KEY);
        }
      }
    } catch (error: any) {
      mostrarMensaje(
        "No pudimos cargar tus reservas",
        error?.message || "Intenta nuevamente."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const abrirPago = (reserva: Reserva) => {
    setReservaSeleccionada(reserva);
    setCodigoCupon("");
    setDescuento(0);
    setMetodoPago("Tarjeta");

    if (
      String(reserva.estado).toLowerCase() ===
      "pendiente de pago"
    ) {
      localStorage.setItem(
        RESERVA_PENDIENTE_KEY,
        String(reserva.id_reserva)
      );
    }
  };

  const cerrarPago = () => {
    if (procesandoPago) return;

    setReservaSeleccionada(null);
    setCodigoCupon("");
    setDescuento(0);
    setMetodoPago("Tarjeta");
  };

  const aplicarCupon = async () => {
    if (!reservaSeleccionada) return;

    const codigo = codigoCupon.trim().toUpperCase();

    if (!codigo) {
      mostrarMensaje(
        "Código requerido",
        "Escribe un código de cupón para continuar."
      );
      return;
    }

    setAplicandoCupon(true);

    try {
      const response = await fetch(
        `${API}/reservas/${reservaSeleccionada.id_reserva}/aplicar-cupon`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${obtenerToken()}`,
          },
          body: JSON.stringify({
            codigo,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.mensaje ||
            data?.error ||
            "El cupón no es válido."
        );
      }

      const nuevoDescuento = Number(
        data?.descuento ??
          data?.monto_descuento ??
          data?.descuento_aplicado ??
          0
      );

      setDescuento(nuevoDescuento);

      if (
        data?.nuevo_total !== undefined ||
        data?.precio_total !== undefined
      ) {
        const nuevoPrecio = Number(
          data?.nuevo_total ?? data?.precio_total
        );

        setReservaSeleccionada((actual) =>
          actual
            ? {
                ...actual,
                precio_total: nuevoPrecio,
              }
            : actual
        );
      }

      mostrarMensaje(
        "Cupón aplicado",
        data?.mensaje ||
          `Se aplicó un descuento de ${formatearPrecio(
            nuevoDescuento
          )}.`
      );
    } catch (error: any) {
      mostrarMensaje(
        "Cupón no válido",
        error?.message || "No pudimos aplicar el cupón."
      );
    } finally {
      setAplicandoCupon(false);
    }
  };

  const pagarReserva = async () => {
    if (!reservaSeleccionada) return;

    setProcesandoPago(true);

    try {
      const response = await fetch(
        `${API}/reservas/${reservaSeleccionada.id_reserva}/pagar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${obtenerToken()}`,
          },
          body: JSON.stringify({
            metodo_pago: metodoPago,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.mensaje ||
            data?.error ||
            "No se pudo procesar el pago."
        );
      }

      setReservas((actuales) =>
        actuales.map((reserva) =>
          reserva.id_reserva ===
          reservaSeleccionada.id_reserva
            ? {
                ...reserva,
                estado: "Pagada",
              }
            : reserva
        )
      );

      localStorage.removeItem(RESERVA_PENDIENTE_KEY);

      setReservaSeleccionada(null);
      setCodigoCupon("");
      setDescuento(0);

      mostrarMensaje(
        "¡Pago realizado!",
        data?.mensaje ||
          "Tu reserva fue pagada correctamente."
      );

      await cargarReservas(true);
    } catch (error: any) {
      mostrarMensaje(
        "No se pudo completar el pago",
        error?.message ||
          "Ocurrió un problema al procesar el pago."
      );
    } finally {
      setProcesandoPago(false);
    }
  };

  const reservasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return reservas.filter((reserva) => {
      const coincideBusqueda =
        !termino ||
        [
          reserva.id_reserva,
          reserva.destino,
          reserva.paquete,
          reserva.estado,
          reserva.alojamiento,
          reserva.transporte,
        ]
          .filter(Boolean)
          .some((valor) =>
            String(valor).toLowerCase().includes(termino)
          );

      const estado = String(
        reserva.estado || ""
      ).toLowerCase();

      const coincideFiltro =
        filtro === "Todas" ||
        (filtro === "Pendientes" &&
          estado === "pendiente de pago") ||
        (filtro === "Pagadas" && estado === "pagada");

      return coincideBusqueda && coincideFiltro;
    });
  }, [reservas, busqueda, filtro]);

  const totalReservas = reservas.length;

  const pendientes = reservas.filter(
    (reserva) =>
      String(reserva.estado).toLowerCase() ===
      "pendiente de pago"
  ).length;

  const pagadas = reservas.filter(
    (reserva) =>
      String(reserva.estado).toLowerCase() ===
      "pagada"
  ).length;

  const totalPago = Math.max(
    0,
    Number(reservaSeleccionada?.precio_total || 0) -
      Number(descuento || 0)
  );

  if (!usuario) {
    return (
      <div className="reservas-page">
        <div className="reservas-login">
          <div className="reservas-login-icon">✈</div>

          <span className="reservas-label">
            MAREVA · MIS VIAJES
          </span>

          <h1>Inicia sesión para ver tus viajes</h1>

          <p>
            Aquí podrás consultar tus reservas, revisar
            tus viajes y completar los pagos pendientes.
          </p>

          <button
            className="reservas-primary-button"
            onClick={() => irA("login")}
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reservas-page">
      <div className="reservas-shell">

        <header className="reservas-hero">
          <div>
            <span className="reservas-label">
              MAREVA · MIS VIAJES
            </span>

            <h1>
              Tus viajes,
              <br />
              <span>todos en un solo lugar.</span>
            </h1>

            <p>
              Consulta tus reservas, revisa los detalles
              de cada experiencia y completa tus pagos.
            </p>
          </div>

          <button
            className="reservas-refresh"
            onClick={() => cargarReservas()}
            disabled={cargando}
          >
            <span className={cargando ? "refresh-spin" : ""}>
              ↻
            </span>
            Actualizar
          </button>
        </header>

        <section className="reservas-dashboard">

          <div className="dashboard-card dashboard-main">
            <div className="dashboard-icon purple">
              ✈
            </div>

            <div>
              <span>Total de reservas</span>
              <strong>{totalReservas}</strong>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-icon orange">
              ◷
            </div>

            <div>
              <span>Pendientes de pago</span>
              <strong>{pendientes}</strong>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-icon green">
              ✓
            </div>

            <div>
              <span>Viajes pagados</span>
              <strong>{pagadas}</strong>
            </div>
          </div>

        </section>

        <section className="reservas-controls">

          <div className="search-box">
            <span className="search-icon">⌕</span>

            <input
              type="text"
              value={busqueda}
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
              placeholder="Busca por destino, paquete o número de reserva..."
            />

            {busqueda && (
              <button
                className="clear-search"
                onClick={() => setBusqueda("")}
              >
                ×
              </button>
            )}
          </div>

          <div className="filter-buttons">
            {["Todas", "Pendientes", "Pagadas"].map(
              (opcion) => (
                <button
                  key={opcion}
                  className={
                    filtro === opcion
                      ? "filter-button active"
                      : "filter-button"
                  }
                  onClick={() => setFiltro(opcion)}
                >
                  {opcion}
                </button>
              )
            )}
          </div>

        </section>

        {!cargando && (
          <div className="results-line">
            <span>
              Mostrando{" "}
              <strong>
                {reservasFiltradas.length}
              </strong>{" "}
              de {reservas.length} reservas
            </span>

            {busqueda && (
              <span>
                Resultados para{" "}
                <strong>“{busqueda}”</strong>
              </span>
            )}
          </div>
        )}

        {cargando ? (
          <div className="reservas-loading">
            <div className="loading-circle"></div>

            <div>
              <strong>Preparando tus viajes...</strong>
              <span>Un momento, por favor.</span>
            </div>
          </div>
        ) : reservasFiltradas.length === 0 ? (
          <div className="reservas-empty">

            <div className="empty-icon">
              {busqueda || filtro !== "Todas"
                ? "⌕"
                : "✈"}
            </div>

            <h2>
              {busqueda || filtro !== "Todas"
                ? "No encontramos esa reserva"
                : "Todavía no tienes reservas"}
            </h2>

            <p>
              {busqueda || filtro !== "Todas"
                ? "Prueba con otro destino, número de reserva o cambia el filtro."
                : "Cuando reserves una experiencia en MAREVA aparecerá aquí."}
            </p>

            {busqueda || filtro !== "Todas" ? (
              <button
                onClick={() => {
                  setBusqueda("");
                  setFiltro("Todas");
                }}
              >
                Ver todas las reservas
              </button>
            ) : (
              <button
                onClick={() => irA("paquetes")}
              >
                Explorar paquetes
              </button>
            )}

          </div>
        ) : (
          <section className="reservas-list">

            {reservasFiltradas.map((reserva) => {
              const pendiente =
                String(reserva.estado).toLowerCase() ===
                "pendiente de pago";

              const personas =
                Number(reserva.adultos || 0) +
                Number(reserva.ninos || 0) +
                Number(reserva.bebes || 0);

              return (
                <article
                  className="reserva-card"
                  key={reserva.id_reserva}
                >
                  <div className="reservation-top">

                    <div className="destination-info">

                      <div className="destination-avatar">
                        ✈
                      </div>

                      <div>
                        <span className="reservation-code">
                          RESERVA #
                          {reserva.id_reserva}
                        </span>

                        <h2>
                          {reserva.paquete ||
                            reserva.destino ||
                            "Experiencia MAREVA"}
                        </h2>

                        <p>
                          📍{" "}
                          {reserva.destino ||
                            "Destino turístico"}
                        </p>
                      </div>

                    </div>

                    <div
                      className={
                        pendiente
                          ? "status pending"
                          : "status paid"
                      }
                    >
                      <span></span>

                      {pendiente
                        ? "Pendiente de pago"
                        : "Pagada"}
                    </div>

                  </div>

                  <div className="reservation-route">

                    <div className="route-place">
                      <span>IDA</span>

                      <strong>
                        {formatearFecha(
                          reserva.fecha_ida
                        )}
                      </strong>
                    </div>

                    <div className="route-line">
                      <span>✈</span>
                    </div>

                    <div className="route-place right">
                      <span>REGRESO</span>

                      <strong>
                        {formatearFecha(
                          reserva.fecha_regreso
                        )}
                      </strong>
                    </div>

                  </div>

                  <div className="reservation-details">

                    <div>
                      <span>Viajantes</span>
                      <strong>
                        {personas}{" "}
                        {personas === 1
                          ? "persona"
                          : "personas"}
                      </strong>
                    </div>

                    <div>
                      <span>Alojamiento</span>
                      <strong>
                        {reserva.alojamiento ||
                          "No especificado"}
                      </strong>
                    </div>

                    <div>
                      <span>Transporte</span>
                      <strong>
                        {reserva.transporte ||
                          "No especificado"}
                      </strong>
                    </div>

                    <div>
                      <span>Mascotas</span>
                      <strong>
                        {Number(
                          reserva.mascotas || 0
                        ) > 0
                          ? "Sí"
                          : "No"}
                      </strong>
                    </div>

                  </div>

                  <div className="reservation-bottom">

                    <div className="reservation-created">
                      Reserva realizada
                      {reserva.fecha_reserva
                        ? ` · ${formatearFecha(
                            reserva.fecha_reserva
                          )}`
                        : ""}
                    </div>

                    <div className="reservation-payment">

                      <div className="price">
                        <span>Total</span>
                        <strong>
                          {formatearPrecio(
                            reserva.precio_total
                          )}
                        </strong>
                      </div>

                      {pendiente ? (
                        <button
                          className="continue-payment"
                          onClick={() =>
                            abrirPago(reserva)
                          }
                        >
                          <span>Continuar pago</span>
                          <b>→</b>
                        </button>
                      ) : (
                        <div className="paid-badge">
                          <span>✓</span>
                          Pago confirmado
                        </div>
                      )}

                    </div>

                  </div>
                </article>
              );
            })}

          </section>
        )}

        <div className="reservas-footer">
          <button onClick={() => irA("paquetes")}>
            ← Seguir explorando destinos
          </button>
        </div>

      </div>

      {reservaSeleccionada && (
        <div
          className="payment-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              cerrarPago();
            }
          }}
        >
          <div className="payment-modal">

            <div className="payment-header">

              <button
                className="payment-close"
                onClick={cerrarPago}
                disabled={procesandoPago}
              >
                ×
              </button>

              <span>MAREVA · PAGO SEGURO</span>

              <h2>Completa tu pago</h2>

              <p>
                Tu reserva está pendiente de pago.
              </p>

            </div>

            <div className="payment-body">

              <div className="payment-trip">

                <div className="trip-icon">
                  ✈
                </div>

                <div>
                  <span>Tu viaje</span>

                  <strong>
                    {reservaSeleccionada.paquete ||
                      reservaSeleccionada.destino}
                  </strong>

                  <small>
                    Reserva #
                    {reservaSeleccionada.id_reserva}
                  </small>
                </div>

              </div>

              <section className="payment-section">

                <div className="section-heading">
                  <div>
                    <span className="step-number">
                      01
                    </span>

                    <div>
                      <h3>¿Tienes un cupón?</h3>
                      <p>
                        Obtén un descuento en tu reserva.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="coupon-row">

                  <input
                    value={codigoCupon}
                    onChange={(e) =>
                      setCodigoCupon(
                        e.target.value.toUpperCase()
                      )
                    }
                    placeholder="Ingresa tu código"
                    disabled={aplicandoCupon}
                  />

                  <button
                    onClick={aplicarCupon}
                    disabled={
                      aplicandoCupon ||
                      !codigoCupon.trim()
                    }
                  >
                    {aplicandoCupon
                      ? "Validando..."
                      : "Aplicar"}
                  </button>

                </div>

              </section>

              <section className="payment-section">

                <div className="section-heading">
                  <div>
                    <span className="step-number">
                      02
                    </span>

                    <div>
                      <h3>Elige tu método de pago</h3>
                      <p>
                        Selecciona cómo quieres pagar.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="payment-methods">

                  <button
                    className={
                      metodoPago === "Tarjeta"
                        ? "payment-method selected"
                        : "payment-method"
                    }
                    onClick={() =>
                      setMetodoPago("Tarjeta")
                    }
                  >
                    <div className="method-icon">
                      💳
                    </div>

                    <div>
                      <strong>Tarjeta</strong>
                      <span>
                        Crédito o débito
                      </span>
                    </div>

                    {metodoPago === "Tarjeta" && (
                      <i>✓</i>
                    )}
                  </button>

                  <button
                    className={
                      metodoPago === "PSE"
                        ? "payment-method selected"
                        : "payment-method"
                    }
                    onClick={() =>
                      setMetodoPago("PSE")
                    }
                  >
                    <div className="method-icon pse">
                      P
                    </div>

                    <div>
                      <strong>PSE</strong>
                      <span>
                        Desde tu banco
                      </span>
                    </div>

                    {metodoPago === "PSE" && (
                      <i>✓</i>
                    )}
                  </button>

                  <button
                    className={
                      metodoPago === "Nequi"
                        ? "payment-method selected"
                        : "payment-method"
                    }
                    onClick={() =>
                      setMetodoPago("Nequi")
                    }
                  >
                    <div className="method-icon nequi">
                      N
                    </div>

                    <div>
                      <strong>Nequi</strong>
                      <span>
                        Pago digital
                      </span>
                    </div>

                    {metodoPago === "Nequi" && (
                      <i>✓</i>
                    )}
                  </button>

                </div>

              </section>

              <section className="payment-summary">

                <div>
                  <span>Subtotal</span>
                  <strong>
                    {formatearPrecio(
                      reservaSeleccionada.precio_total
                    )}
                  </strong>
                </div>

                {descuento > 0 && (
                  <div className="discount">
                    <span>Descuento</span>
                    <strong>
                      -{" "}
                      {formatearPrecio(descuento)}
                    </strong>
                  </div>
                )}

                <div className="summary-total">
                  <span>Total a pagar</span>
                  <strong>
                    {formatearPrecio(totalPago)}
                  </strong>
                </div>

              </section>

              <button
                className="pay-now"
                onClick={pagarReserva}
                disabled={procesandoPago}
              >
                {procesandoPago ? (
                  <>
                    <span className="button-spinner"></span>
                    Procesando pago...
                  </>
                ) : (
                  <>
                    Pagar{" "}
                    {formatearPrecio(totalPago)}
                    <span>→</span>
                  </>
                )}
              </button>

              <div className="secure-payment">
                <span>🔒</span>
                Pago protegido y seguro por MAREVA
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

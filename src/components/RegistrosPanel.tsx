import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./redux/store";
import { obtenerReservas } from "./redux/reservasSlice";

/**
 * RegistrosPanel: componente totalmente independiente de la navegación.
 * No recibe props del padre: se conecta directo al estado global de Redux
 * (store -> reservas), que a su vez viene de la tabla "reservations" de la
 * base de datos a través de api.ts (GET /reservations).
 *
 * Al estar montado en App.tsx por fuera del switch de páginas, se muestra
 * flotando sobre cualquier vista (home, resultados, detalle, perfil, etc.)
 * y se actualiza solo, sin recargar la página, cada vez que el estado
 * global cambia (por ejemplo, al confirmarse una nueva reserva).
 */
function RegistrosPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const { reservas, cargando, error, ultimaActualizacion } = useSelector(
    (state: RootState) => state.reservas
  );

  useEffect(() => {
    dispatch(obtenerReservas());
  }, [dispatch]);

  const totalReservas = reservas.length;
  const confirmadas = reservas.filter((r) => r.status === "Confirmada").length;
  const pendientes = totalReservas - confirmadas;

  return (
    <div className="registros-panel" role="status" aria-live="polite">
      <div className="registros-panel-header">
        <span className="registros-panel-dot" />
        <strong>Reservas registradas</strong>
      </div>

      {cargando && <p className="registros-panel-msg">Consultando base de datos…</p>}
      {error && <p className="registros-panel-msg registros-panel-error">{error}</p>}

      {!cargando && !error && (
        <>
          <div className="registros-panel-total">{totalReservas}</div>
          <div className="registros-panel-detalle">
            <span>✅ {confirmadas} confirmadas</span>
            <span>⏳ {pendientes} pendientes</span>
          </div>
          {ultimaActualizacion && (
            <p className="registros-panel-hora">
              Actualizado: {new Date(ultimaActualizacion).toLocaleTimeString("es-CO")}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default RegistrosPanel;

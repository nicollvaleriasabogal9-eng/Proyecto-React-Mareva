import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchWeather } from "./redux/weatherSlice";

import type {
  AppDispatch,
  RootState,
} from "./redux/store";

function descripcionClima(codigo: number): string {
  if (codigo === 0) return "Cielo despejado";
  if (codigo <= 3) return "Parcialmente nublado";
  if (codigo <= 48) return "Niebla";
  if (codigo <= 57) return "Llovizna";
  if (codigo <= 67) return "Lluvia";
  if (codigo <= 77) return "Nieve";
  if (codigo <= 82) return "Chubascos";
  if (codigo <= 86) return "Chubascos de nieve";

  return "Tormenta";
}

function Notificaciones() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    data,
    status,
    error,
    lastUpdated,
  } = useSelector(
    (state: RootState) => state.weather
  );

  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    dispatch(fetchWeather());

    const interval = window.setInterval(() => {
      dispatch(fetchWeather());
    }, 60000);

    return () => {
      window.clearInterval(interval);
    };
  }, [dispatch]);

  const horaActualizacion = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString(
        "es-CO",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      )
    : null;

  return (
    <div className="notificaciones-flotantes">

      {!abierto && (
        <button
          className="campana-notificaciones"
          onClick={() => setAbierto(true)}
          aria-label="Abrir notificaciones"
        >
          🔔
        </button>
      )}

      {abierto && (
        <div className="panel-clima">

          <div className="panel-clima-header">
            <div>
              <span className="panel-clima-icono">
                🌦️
              </span>

              <div>
                <strong>
                  Clima en tu ciudad
                </strong>

                <small>
                  Información en tiempo real
                </small>
              </div>
            </div>

            <button
              className="cerrar-clima"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>

          {status === "loading" && !data && (
            <p className="clima-mensaje">
              Consultando el clima...
            </p>
          )}

          {status === "failed" && (
            <p className="clima-mensaje clima-error">
              {error}
            </p>
          )}

          {data && (
            <div className="clima-contenido">

              <div className="clima-ciudad">
                <span>📍</span>

                <div>
                  <strong>
                    Bogotá, Colombia
                  </strong>

                  <small>
                    Clima actual
                  </small>
                </div>
              </div>

              <div className="clima-temperatura">
                {Math.round(data.temperature)}°
                <span>C</span>
              </div>

              <p className="clima-descripcion">
                {descripcionClima(
                  data.weatherCode
                )}
              </p>

              <div className="clima-datos">

                <div>
                  <span>💧</span>
                  <div>
                    <small>Humedad</small>
                    <strong>
                      {data.humidity}%
                    </strong>
                  </div>
                </div>

                <div>
                  <span>💨</span>
                  <div>
                    <small>Viento</small>
                    <strong>
                      {data.windSpeed} km/h
                    </strong>
                  </div>
                </div>

              </div>

              {horaActualizacion && (
                <small className="clima-actualizado">
                  Actualizado a las{" "}
                  {horaActualizacion}
                </small>
              )}

            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Notificaciones;

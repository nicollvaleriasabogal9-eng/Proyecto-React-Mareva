import { useState } from "react";
import CardAccion from "./CardAccion";

interface ReservasProps {
  mostrarMensaje: (titulo: string, mensaje: string) => void;
}

interface Reserva {
  id: number;
  destino: string;
  cliente: string;
  fecha: string;
  estado: "Confirmada" | "Pendiente";
}

const RESERVAS: Reserva[] = [
  {
    id: 1,
    destino: "Cartagena Mágica",
    cliente: "Laura Rubiano",
    fecha: "20 de septiembre de 2026",
    estado: "Confirmada",
  },
  {
    id: 2,
    destino: "Medellín Innovadora",
    cliente: "Cesar Uzcategui",
    fecha: "5 de octubre de 2026",
    estado: "Pendiente",
  },
  {
    id: 3,
    destino: "Tayrona Salvaje",
    cliente: "Andres Aroca",
    fecha: "18 de octubre de 2026",
    estado: "Confirmada",
  },
];

function Reservas({ mostrarMensaje }: ReservasProps) {
  const [filtro, setFiltro] = useState("Todas");

  const reservasFiltradas = RESERVAS.filter((reserva) => {
    if (filtro === "Todas") {
      return true;
    }

    return reserva.estado === filtro;
  });

  return (
    <section className="modulo-section" id="reservas">
      <div className="modulo-header">
        <span>MAREVA · RESERVAS</span>

        <h1>Mis reservas</h1>

        <p>
          Consulta y administra las reservas realizadas
          en MAREVA.
        </p>
      </div>

      <div className="reservas-filtros">
        <button
          type="button"
          className={
            filtro === "Todas"
              ? "reserva-filtro activo"
              : "reserva-filtro"
          }
          onClick={() => setFiltro("Todas")}
        >
          📋 Todas
        </button>

        <button
          type="button"
          className={
            filtro === "Confirmada"
              ? "reserva-filtro activo"
              : "reserva-filtro"
          }
          onClick={() => setFiltro("Confirmada")}
        >
          ✅ Confirmadas
        </button>

        <button
          type="button"
          className={
            filtro === "Pendiente"
              ? "reserva-filtro activo"
              : "reserva-filtro"
          }
          onClick={() => setFiltro("Pendiente")}
        >
          ⏳ Pendientes
        </button>
      </div>

      <div className="reservas-contador">
        {reservasFiltradas.length}{" "}
        {reservasFiltradas.length === 1
          ? "reserva encontrada"
          : "reservas encontradas"}
      </div>

      <div className="modulo-grid">
        {reservasFiltradas.map((reserva) => (
          <CardAccion
            key={reserva.id}
            titulo={reserva.destino}
            texto={`${reserva.cliente} · ${reserva.fecha}`}
            estado={reserva.estado}
            boton="Ver reserva"
            onAccion={() =>
              mostrarMensaje(
                "¡Reserva encontrada!",
                `Tu reserva para ${reserva.destino} está registrada correctamente.`
              )
            }
          />
        ))}
      </div>

      {reservasFiltradas.length === 0 && (
        <div className="sin-reservas">
          <span>✈️</span>

          <h2>No hay reservas</h2>

          <p>
            No encontramos reservas con el filtro seleccionado.
          </p>
        </div>
      )}
    </section>
  );
}

export default Reservas;

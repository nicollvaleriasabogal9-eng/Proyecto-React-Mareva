import { useState } from "react";
import CardAccion from "./CardAccion";

interface Reserva {
  destino: string;
  cliente: string;
  fecha: string;
  estado: "Confirmada" | "Pendiente";
}

interface ReservasProps {
  mostrarMensaje: (titulo: string, mensaje: string) => void;
}

function Reservas({ mostrarMensaje }: ReservasProps) {
  const [filtro, setFiltro] = useState<string>("Todas");

  const reservas: Reserva[] = [
    {
      destino: "Cartagena Mágica",
      cliente: "Laura Rubiano",
      fecha: "20 de septiembre de 2026",
      estado: "Confirmada",
    },
    {
      destino: "Medellín Innovadora",
      cliente: "Cesar Uzcategui",
      fecha: "5 de octubre de 2026",
      estado: "Pendiente",
    },
    {
      destino: "Tayrona Salvaje",
      cliente: "Andres Aroca",
      fecha: "18 de octubre de 2026",
      estado: "Confirmada",
    },
  ];

  const reservasFiltradas = reservas.filter((reserva) => {
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
          Consulta y administra las reservas realizadas en MAREVA.
        </p>
      </div>

      <div className="reservas-filtro">
        <label htmlFor="filtro-reserva">
          Filtrar reservas:
        </label>

        <select
          id="filtro-reserva"
          value={filtro}
          onChange={(event) => setFiltro(event.target.value)}
        >
          <option value="Todas">Todas</option>
          <option value="Confirmada">Confirmadas</option>
          <option value="Pendiente">Pendientes</option>
        </select>
      </div>

      <div className="modulo-grid">
        {reservasFiltradas.map((reserva, index) => (
          <CardAccion
            key={index}
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
        <p>No hay reservas con este estado.</p>
      )}
    </section>
  );
}

export default Reservas;

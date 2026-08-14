import CardAccion from "./CardAccion";

interface ReservasProps {
  mostrarMensaje: (titulo: string, mensaje: string) => void;
}

function Reservas({ mostrarMensaje }: ReservasProps) {
  const reservas = [
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

  return (
    <section className="modulo-section" id="reservas">
      <div className="modulo-header">
        <span>MAREVA · RESERVAS</span>

        <h1>Mis reservas</h1>

        <p>
          Consulta y administra las reservas realizadas en MAREVA.
        </p>
      </div>

      <div className="modulo-grid">
        {reservas.map((reserva, index) => (
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
    </section>
  );
}

export default Reservas;

import CardAccion from "./CardAccion";

function Usuarios() {
  const usuarios = [
    {
      id: 1,
      nombre: "Laura Rubiano",
      correo: "laura@gmail.com",
      telefono: "300 123 4567",
      nivel: "Explorador",
      estado: "Activo",
    },
    {
      id: 2,
      nombre: "Nicoll Sabogal",
      correo: "nicoll@gmail.com",
      telefono: "301 456 7890",
      nivel: "Viajero",
      estado: "Activo",
    },
    {
      id: 3,
      nombre: "Cesar Uzcategui",
      correo: "cesar@gmail.com",
      telefono: "310 987 6543",
      nivel: "Aventurero",
      estado: "Activo",
    },
    {
      id: 4,
      nombre: "Andres Aroca",
      correo: "andres@gmail.com",
      telefono: "315 654 3210",
      nivel: "Explorador",
      estado: "Inactivo",
    },
    {
      id: 5,
      nombre: "Sofia Munevar",
      correo: "sofia@gmail.com",
      telefono: "315 654 3210",
      nivel: "Explorador",
      estado: "Inactivo",
    },
  ];

  const manejarAccion = (nombre: string) => {
    alert(`Acción realizada en el módulo Usuarios: ${nombre}`);
    console.log(`Acción realizada en Usuarios: ${nombre}`);
  };

  return (
    <section className="usuarios-section" id="usuarios">
      <div className="usuarios-header">
        <span>MAREVA · VIAJEROS</span>

        <h1>
          Nuestros <span>usuarios</span>
        </h1>

        <p>
          Conoce a los viajeros registrados en nuestra plataforma.
        </p>
      </div>

      <div className="usuarios-card">
        <div className="usuarios-card-header">
          <div>
            <h2>Usuarios registrados</h2>

            <p>
              Información de los viajeros de MAREVA
            </p>
          </div>

          <button
            className="btn-agregar"
            onClick={() => manejarAccion("Agregar usuario")}
          >
            + Agregar usuario
          </button>
        </div>

        <div className="tabla-contenedor">
          <table className="usuarios-tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Nivel</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>

                  <td className="usuario-nombre">
                    {usuario.nombre}
                  </td>

                  <td>{usuario.correo}</td>

                  <td>{usuario.telefono}</td>

                  <td>
                    <span className="usuario-nivel">
                      {usuario.nivel}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        usuario.estado === "Activo"
                          ? "estado activo"
                          : "estado inactivo"
                      }
                    >
                      {usuario.estado}
                    </span>
                  </td>

                  <td>
                    <CardAccion
                      titulo={usuario.nombre}
                      texto={usuario.correo}
                      estado={usuario.estado}
                      boton="Ver"
                      onAccion={() =>
                        manejarAccion(usuario.nombre)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Usuarios;

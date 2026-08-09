import { useState } from "react";
import CardAccion from "./CardAccion";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [contrasena, setContrasena] = useState("");

  const registrarUsuario = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!correo.includes("@")) {
      alert("El correo electrónico debe contener al menos un @.");
      return;
    }

    alert(
      `Registro exitoso en MAREVA\n\n` +
      `Nombre: ${nombre}\n` +
      `Correo: ${correo}\n` +
      `Teléfono: ${telefono}\n` +
      `Contraseña: ${contrasena}`
    );

    console.log("Acción realizada en el módulo Registro");
  };

  const manejarAccion = () => {
    console.log("Acción realizada en el módulo Registro");
  };

  return (
    <section className="registro-section">
      <div className="registro-contenedor">

        <div className="registro-header">
          <span>MAREVA · CREA TU CUENTA</span>

          <h1>
            Únete a <span>MAREVA</span>
          </h1>

          <p>
            Crea tu cuenta y comienza a descubrir
            increíbles destinos por Colombia.
          </p>
        </div>

        <div className="registro-card">

          <div className="registro-card-header">
            <h2>Crear una cuenta</h2>

            <p>
              Completa tus datos para registrarte
              en nuestra plataforma.
            </p>
          </div>

          <form
            className="registro-form"
            onSubmit={registrarUsuario}
          >

            <div className="campo-registro">
              <label>Nombre completo</label>

              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingresa tu nombre"
                required
              />
            </div>

            <div className="campo-registro">
              <label>Correo electrónico</label>

              <input
                type="text"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div className="campo-registro">
              <label>Teléfono</label>

              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="300 123 4567"
                required
              />
            </div>

            <div className="campo-registro">
              <label>Contraseña</label>

              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="Crea una contraseña"
                required
              />
            </div>

            <CardAccion
              titulo="Crear cuenta"
              texto="Registrar nuevo usuario"
              estado="Disponible"
              boton="Registrarme"
              onAccion={manejarAccion}
            />

          </form>

        </div>

      </div>
    </section>
  );
}

export default Registro;
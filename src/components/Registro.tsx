import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import CardAccion from "./CardAccion";

interface RegistroProps {
  mostrarMensaje: (titulo: string, mensaje: string) => void;
}

function Registro({ mostrarMensaje }: RegistroProps) {
  const [nombre, setNombre] = useState<string>("");
  const [correo, setCorreo] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  const [contrasena, setContrasena] = useState<string>("");

  const registrarUsuario = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!correo.includes("@")) {
      mostrarMensaje(
        "Correo no válido",
        "El correo electrónico debe contener al menos un @. Verifica tus datos e inténtalo nuevamente."
      );

      return;
    }

    mostrarMensaje(
      "¡Registro exitoso!",
      `Bienvenido a MAREVA, ${nombre}. Tu cuenta fue creada correctamente con el correo ${correo}.`
    );

    console.log("Acción realizada en el módulo Registro");
    console.log("Nombre:", nombre);
    console.log("Correo:", correo);
    console.log("Teléfono:", telefono);
  };

  const manejarNombre = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setNombre(event.target.value);
  };

  const manejarCorreo = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setCorreo(event.target.value);
  };

  const manejarTelefono = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setTelefono(event.target.value);
  };

  const manejarContrasena = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setContrasena(event.target.value);
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
              <label htmlFor="nombre">
                Nombre completo
              </label>

              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={manejarNombre}
                placeholder="Ingresa tu nombre"
                required
              />
            </div>

            <div className="campo-registro">
              <label htmlFor="correo">
                Correo electrónico
              </label>

              <input
                id="correo"
                type="email"
                value={correo}
                onChange={manejarCorreo}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div className="campo-registro">
              <label htmlFor="telefono">
                Teléfono
              </label>

              <input
                id="telefono"
                type="tel"
                value={telefono}
                onChange={manejarTelefono}
                placeholder="300 123 4567"
                required
              />
            </div>

            <div className="campo-registro">
              <label htmlFor="contrasena">
                Contraseña
              </label>

              <input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={manejarContrasena}
                placeholder="Crea una contraseña"
                required
              />
            </div>

            <button
              type="submit"
              className="formulario-boton"
            >
              Registrarme
            </button>

          </form>

          <CardAccion
            titulo="¿Ya tienes una cuenta?"
            texto="Ingresa a MAREVA para continuar tu viaje."
            estado="ACCESO"
            boton="Iniciar sesión"
            onAccion={() =>
              mostrarMensaje(
                "¡Iniciar sesión!",
                "La opción para iniciar sesión fue seleccionada correctamente."
              )
            }
          />

        </div>

      </div>
    </section>
  );
}

export default Registro;

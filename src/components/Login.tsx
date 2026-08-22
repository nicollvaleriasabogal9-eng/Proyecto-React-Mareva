import { useState } from "react";
import type {
  ChangeEvent,
  FormEvent,
} from "react";
import CardAccion from "./CardAccion";

interface LoginProps {
  mostrarMensaje: (
    titulo: string,
    mensaje: string
  ) => void;
}

function Login({ mostrarMensaje }: LoginProps) {
  const [correo, setCorreo] = useState<string>("");
  const [contrasena, setContrasena] =
    useState<string>("");

  const manejarCorreo = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setCorreo(event.target.value);
  };

  const manejarContrasena = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setContrasena(event.target.value);
  };

  const iniciarSesion = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    mostrarMensaje(
      "¡Bienvenido a MAREVA!",
      `Has iniciado sesión correctamente con el correo ${correo}. ¡Prepárate para continuar tu viaje!`
    );

    console.log("Acción realizada en Login");
    console.log("Correo:", correo);
    console.log("Contraseña:", contrasena);
  };

  return (
    <section
      className="formulario-section"
      id="login"
    >
      <div className="formulario-card">
        <div className="formulario-header">
          <span>MAREVA · ACCESO</span>

          <h1>Iniciar sesión</h1>

          <p>
            Ingresa a tu cuenta para continuar tu viaje.
          </p>
        </div>

        <form onSubmit={iniciarSesion}>
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

          <label htmlFor="contrasena">
            Contraseña
          </label>

          <input
            id="contrasena"
            type="password"
            value={contrasena}
            onChange={manejarContrasena}
            placeholder="Ingresa tu contraseña"
            required
          />

          <button
            type="submit"
            className="formulario-boton"
          >
            Iniciar sesión
          </button>
        </form>

        <CardAccion
          titulo="¿Aún no tienes cuenta?"
          texto="Regístrate en MAREVA y empieza a descubrir nuevos destinos."
          estado="NUEVO"
          boton="Crear cuenta"
          onAccion={() =>
            mostrarMensaje(
              "¡Crear cuenta!",
              "La opción de registro fue seleccionada. ¡Crea tu cuenta y comienza a descubrir Colombia!"
            )
          }
        />
      </div>
    </section>
  );
}

export default Login;

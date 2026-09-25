import { useState } from "react";
import type {
  ChangeEvent,
  FormEvent,
} from "react";
import axios from "axios";
import "./Registro.css";

const API = "http://127.0.0.1:5000";

interface RegistroProps {
  mostrarMensaje: (
    titulo: string,
    mensaje: string
  ) => void;

  irA: (ruta: "login") => void;
}

const Registro = ({
  mostrarMensaje,
  irA,
}: RegistroProps) => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] =
    useState("");

  const [mostrarPassword, setMostrarPassword] =
    useState(false);

  const [mostrarConfirmacion, setMostrarConfirmacion] =
    useState(false);

  const [cargando, setCargando] = useState(false);

  // =========================================================
  // MANEJADORES
  // =========================================================

  const manejarNombre = (
    evento: ChangeEvent<HTMLInputElement>
  ) => {
    setNombre(evento.target.value);
  };

  const manejarCorreo = (
    evento: ChangeEvent<HTMLInputElement>
  ) => {
    setCorreo(evento.target.value);
  };

  const manejarContrasena = (
    evento: ChangeEvent<HTMLInputElement>
  ) => {
    setContrasena(evento.target.value);
  };

  const manejarConfirmarContrasena = (
    evento: ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmarContrasena(evento.target.value);
  };

  // =========================================================
  // VALIDAR CONTRASEÑA
  // =========================================================

  const validarContrasena = (
    password: string
  ): string | null => {
    if (password.length < 8) {
      return "La contraseña debe tener mínimo 8 caracteres.";
    }

    if (!/[A-Z]/.test(password)) {
      return "La contraseña debe contener al menos una mayúscula.";
    }

    if (!/[a-z]/.test(password)) {
      return "La contraseña debe contener al menos una minúscula.";
    }

    if (!/[0-9]/.test(password)) {
      return "La contraseña debe contener al menos un número.";
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]';`~]/.test(password)) {
      return "La contraseña debe contener al menos un carácter especial.";
    }

    return null;
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const manejarSubmit = async (
    evento: FormEvent<HTMLFormElement>
  ) => {
    evento.preventDefault();

    // =======================================================
    // NOMBRE
    // =======================================================

    if (!nombre.trim()) {
      mostrarMensaje(
        "Nombre requerido",
        "Ingresa tu nombre completo."
      );
      return;
    }

    if (nombre.trim().length < 3) {
      mostrarMensaje(
        "Nombre inválido",
        "El nombre debe tener al menos 3 caracteres."
      );
      return;
    }

    // =======================================================
    // CORREO
    // =======================================================

    if (!correo.trim()) {
      mostrarMensaje(
        "Correo requerido",
        "Ingresa tu correo electrónico."
      );
      return;
    }

    const correoValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        correo.trim()
      );

    if (!correoValido) {
      mostrarMensaje(
        "Correo inválido",
        "Ingresa un correo electrónico válido."
      );
      return;
    }

    // =======================================================
    // CONTRASEÑA
    // =======================================================

    if (!contrasena) {
      mostrarMensaje(
        "Contraseña requerida",
        "Ingresa una contraseña."
      );
      return;
    }

    const errorPassword =
      validarContrasena(contrasena);

    if (errorPassword) {
      mostrarMensaje(
        "Contraseña no válida",
        errorPassword
      );
      return;
    }

    // =======================================================
    // CONFIRMAR CONTRASEÑA
    // =======================================================

    if (!confirmarContrasena) {
      mostrarMensaje(
        "Confirma tu contraseña",
        "Debes repetir tu contraseña."
      );
      return;
    }

    if (contrasena !== confirmarContrasena) {
      mostrarMensaje(
        "Las contraseñas no coinciden",
        "Verifica que ambas contraseñas sean iguales."
      );
      return;
    }

    // =======================================================
    // REGISTRO EN POSTGRESQL
    // =======================================================

    try {
      setCargando(true);

      const respuesta = await axios.post(
        `${API}/registro`,
        {
          nombre: nombre.trim(),
          correo: correo.trim().toLowerCase(),
          contrasena,
          rol: "cliente",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "Respuesta registro:",
        respuesta.data
      );

      // =====================================================
      // REGISTRO EXITOSO
      // =====================================================

      mostrarMensaje(
        "Registro exitoso",
        "Tu cuenta fue creada correctamente. Ahora puedes iniciar sesión."
      );

      // Limpiar formulario

      setNombre("");
      setCorreo("");
      setContrasena("");
      setConfirmarContrasena("");

      setMostrarPassword(false);
      setMostrarConfirmacion(false);

      // =====================================================
      // VOLVER AL LOGIN
      // =====================================================

      setTimeout(() => {
        irA("login");
      }, 1200);

    } catch (error: any) {
      console.error(
        "Error registrando usuario:",
        error
      );

      const mensaje =
        error?.response?.data?.mensaje ||
        error?.response?.data?.message ||
        "No fue posible crear la cuenta. Inténtalo nuevamente.";

      mostrarMensaje(
        "No se pudo completar el registro",
        mensaje
      );

    } finally {
      setCargando(false);
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <section className="registro-section">

      <div className="registro-card">

        {/* ==================================================
            ENCABEZADO
            ================================================== */}

        <div className="registro-header">

          <span className="registro-icono">
            ✈️
          </span>

          <h1>
            Crea tu cuenta en MAREVA
          </h1>

          <p>
            Regístrate y comienza a descubrir
            nuevos destinos.
          </p>

        </div>

        {/* ==================================================
            FORMULARIO
            ================================================== */}

        <form
          className="registro-form"
          onSubmit={manejarSubmit}
        >

          {/* =================================================
              NOMBRE
              ================================================= */}

          <div className="registro-campo">

            <label htmlFor="registro-nombre">
              Nombre completo
            </label>

            <div className="registro-input-contenedor">

              <span>
                👤
              </span>

              <input
                id="registro-nombre"
                type="text"
                placeholder="Ej. Sofía Rubiano"
                value={nombre}
                onChange={manejarNombre}
                autoComplete="name"
                disabled={cargando}
              />

            </div>

          </div>

          {/* =================================================
              CORREO
              ================================================= */}

          <div className="registro-campo">

            <label htmlFor="registro-correo">
              Correo electrónico
            </label>

            <div className="registro-input-contenedor">

              <span>
                ✉️
              </span>

              <input
                id="registro-correo"
                type="email"
                placeholder="correo@ejemplo.com"
                value={correo}
                onChange={manejarCorreo}
                autoComplete="email"
                disabled={cargando}
              />

            </div>

          </div>

          {/* =================================================
              CONTRASEÑA
              ================================================= */}

          <div className="registro-campo">

            <label htmlFor="registro-contrasena">
              Contraseña
            </label>

            <div className="registro-input-contenedor">

              <span>
                🔒
              </span>

              <input
                id="registro-contrasena"
                type={
                  mostrarPassword
                    ? "text"
                    : "password"
                }
                placeholder="Crea una contraseña segura"
                value={contrasena}
                onChange={manejarContrasena}
                autoComplete="new-password"
                disabled={cargando}
              />

              <button
                type="button"
                className="registro-mostrar-password"
                onClick={() =>
                  setMostrarPassword(
                    !mostrarPassword
                  )
                }
                disabled={cargando}
                aria-label={
                  mostrarPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {mostrarPassword
                  ? "🙈"
                  : "👁️"}
              </button>

            </div>

            {/* =================================================
                REQUISITOS DE CONTRASEÑA
                ================================================= */}

            <div className="registro-requisitos">

              <span
                className={
                  contrasena.length >= 8
                    ? "cumplido"
                    : ""
                }
              >
                ✓ Mínimo 8 caracteres
              </span>

              <span
                className={
                  /[A-Z]/.test(contrasena)
                    ? "cumplido"
                    : ""
                }
              >
                ✓ Una letra mayúscula
              </span>

              <span
                className={
                  /[a-z]/.test(contrasena)
                    ? "cumplido"
                    : ""
                }
              >
                ✓ Una letra minúscula
              </span>

              <span
                className={
                  /[0-9]/.test(contrasena)
                    ? "cumplido"
                    : ""
                }
              >
                ✓ Un número
              </span>

              <span
                className={
                  /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]';`~]/.test(
                    contrasena
                  )
                    ? "cumplido"
                    : ""
                }
              >
                ✓ Un carácter especial
              </span>

            </div>

          </div>

          {/* =================================================
              CONFIRMAR CONTRASEÑA
              ================================================= */}

          <div className="registro-campo">

            <label htmlFor="registro-confirmar">
              Confirmar contraseña
            </label>

            <div className="registro-input-contenedor">

              <span>
                🔐
              </span>

              <input
                id="registro-confirmar"
                type={
                  mostrarConfirmacion
                    ? "text"
                    : "password"
                }
                placeholder="Repite tu contraseña"
                value={confirmarContrasena}
                onChange={
                  manejarConfirmarContrasena
                }
                autoComplete="new-password"
                disabled={cargando}
              />

              <button
                type="button"
                className="registro-mostrar-password"
                onClick={() =>
                  setMostrarConfirmacion(
                    !mostrarConfirmacion
                  )
                }
                disabled={cargando}
                aria-label={
                  mostrarConfirmacion
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {mostrarConfirmacion
                  ? "🙈"
                  : "👁️"}
              </button>

            </div>

            {/* =================================================
                COMPROBAR COINCIDENCIA
                ================================================= */}

            {confirmarContrasena && (

              <span
                className={
                  contrasena ===
                  confirmarContrasena
                    ? "registro-coincide"
                    : "registro-no-coincide"
                }
              >
                {contrasena ===
                confirmarContrasena
                  ? "✓ Las contraseñas coinciden"
                  : "✕ Las contraseñas no coinciden"}
              </span>

            )}

          </div>

          {/* =================================================
              BOTÓN
              ================================================= */}

          <button
            type="submit"
            className="registro-boton"
            disabled={cargando}
          >

            {cargando ? (
              <>
                <span className="registro-spinner"></span>
                Creando cuenta...
              </>
            ) : (
              "Crear mi cuenta"
            )}

          </button>

        </form>

        {/* ==================================================
            VOLVER AL LOGIN
            ================================================== */}

        <div className="registro-login">

          <p>
            ¿Ya tienes una cuenta?
          </p>

          <button
            type="button"
            onClick={() => irA("login")}
            disabled={cargando}
          >
            Iniciar sesión
          </button>

        </div>

      </div>

    </section>
  );
};

export default Registro;

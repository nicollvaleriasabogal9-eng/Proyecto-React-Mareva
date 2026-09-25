import { useState } from "react";
import type {
  ChangeEvent,
  FormEvent,
} from "react";
import axios from "axios";
import CardAccion from "./CardAccion";
import "./Login.css";

const API = "http://127.0.0.1:5000";

interface Usuario {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: string;
}

interface LoginProps {
  mostrarMensaje: (
    titulo: string,
    mensaje: string
  ) => void;

  iniciarSesion: (
    usuario: Usuario,
    token: string
  ) => void;

  irA: (ruta: string) => void;
}

const Login = ({
  mostrarMensaje,
  iniciarSesion,
  irA,
}: LoginProps) => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [tipoIngreso, setTipoIngreso] = useState<
    "cliente" | "admin"
  >("cliente");

  const [cargando, setCargando] = useState(false);

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

  const manejarSubmit = async (
    evento: FormEvent<HTMLFormElement>
  ) => {
    evento.preventDefault();

    if (!correo.trim()) {
      mostrarMensaje(
        "Correo requerido",
        "Ingresa tu correo electrónico."
      );
      return;
    }

    if (!contrasena) {
      mostrarMensaje(
        "Contraseña requerida",
        "Ingresa tu contraseña."
      );
      return;
    }

    try {
      setCargando(true);

      const respuesta = await axios.post(
        `${API}/login`,
        {
          correo: correo.trim(),
          contrasena,
          tipo_ingreso: tipoIngreso,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = respuesta.data?.token;
      const usuario = respuesta.data?.usuario;

      if (!token || !usuario) {
        mostrarMensaje(
          "Error",
          "El servidor no devolvió correctamente los datos de inicio de sesión."
        );
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem(
        "mareva_token",
        token
      );

      localStorage.setItem(
        "usuario",
        JSON.stringify(usuario)
      );

      iniciarSesion(usuario, token);

      mostrarMensaje(
        "Bienvenido a MAREVA",
        `Hola ${usuario.nombre}, has iniciado sesión correctamente.`
      );
    } catch (error: any) {
      console.error(
        "Error iniciando sesión:",
        error
      );

      const mensaje =
        error?.response?.data?.mensaje ||
        error?.response?.data?.message ||
        "Correo o contraseña incorrectos.";

      mostrarMensaje(
        "No se pudo iniciar sesión",
        mensaje
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="login-section">
      <div className="login-card">

        <div className="login-header">
          <span className="login-icono">
            ✈️
          </span>

          <h1>Bienvenido a MAREVA</h1>

          <p>
            Inicia sesión para continuar.
          </p>
        </div>

        <div className="login-tipos">
          <button
            type="button"
            className={
              tipoIngreso === "cliente"
                ? "activo"
                : ""
            }
            onClick={() =>
              setTipoIngreso("cliente")
            }
          >
            👤 Cliente
          </button>

          <button
            type="button"
            className={
              tipoIngreso === "admin"
                ? "activo"
                : ""
            }
            onClick={() =>
              setTipoIngreso("admin")
            }
          >
            🛠️ Administrador
          </button>
        </div>

        <form
          className="login-form"
          onSubmit={manejarSubmit}
        >
          <div className="login-campo">
            <label htmlFor="correo">
              Correo electrónico
            </label>

            <div className="login-input-contenedor">
              <span>✉️</span>

              <input
                id="correo"
                type="email"
                placeholder="correo@ejemplo.com"
                value={correo}
                onChange={manejarCorreo}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="login-campo">
            <label htmlFor="contrasena">
              Contraseña
            </label>

            <div className="login-input-contenedor">
              <span>🔒</span>

              <input
                id="contrasena"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={contrasena}
                onChange={manejarContrasena}
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="login-boton"
            disabled={cargando}
          >
            {cargando ? (
              <>
                <span className="login-spinner"></span>
                Iniciando sesión...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>

        <div className="login-registro">
          <p>
            ¿No tienes una cuenta?
          </p>

          <button
            type="button"
            onClick={() => irA("registro")}
          >
            Crear una cuenta
          </button>
        </div>

        <CardAccion
          titulo="¿Quieres conocer nuestros paquetes?"
          descripcion="Explora nuestros destinos antes de reservar."
          textoBoton="Ver paquetes"
          onClick={() => irA("paquetes")}
        />

      </div>
    </section>
  );
};

export default Login;

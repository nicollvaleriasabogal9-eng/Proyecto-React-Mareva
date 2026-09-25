import { useEffect, useState } from "react";
import "./App.css";

import Inicio from "./components/Inicio";
import Login from "./components/Login";
import Registro from "./components/Registro";
import Paquetes from "./components/Paquetes";
import Favoritos from "./components/Favoritos";
import Reservas from "./components/Reservas";
import Usuarios from "./components/Usuarios";
import AdminDashboard from "./components/AdminDashboard";
import Alojamientos from "./components/Alojamientos";
import Peajes from "./components/Peajes";
import Transporte from "./components/Transorte";
import PerfilCliente from "./components/PerfilCliente";
import FormularioReserva from "./components/FormularioReserva";
import Notificaciones from "./components/Notificaciones";
import Cupones from "./components/Cupones";

type Ruta =
  | "inicio"
  | "login"
  | "registro"
  | "paquetes"
  | "favoritos"
  | "reservas"
  | "reserva"
  | "usuarios"
  | "admin"
  | "alojamientos"
  | "peajes"
  | "transporte"
  | "perfil"
  | "notificaciones"
  | "cupones";

interface Usuario {
  id_usuario?: number;
  id?: number;
  nombre: string;
  correo: string;
  rol?: string;
}

interface Paquete {
  id_paquete: number;
  nombre: string;
  destino?: string;
  departamento?: string;
  categoria?: string;
  descripcion?: string;
  precio?: number;
  precio_base?: number;
  imagen?: string;
  imagen_url?: string;
  dias?: number;
  noches?: number;
  slug?: string;
}

function App() {
  const [rutaActual, setRutaActual] =
    useState<Ruta>("inicio");

  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const [favoritos, setFavoritos] = useState<string[]>(() => {
    try {
      const guardados = localStorage.getItem("mareva_favoritos");
      return guardados ? JSON.parse(guardados) : [];
    } catch {
      return [];
    }
  });

  const cambiarFavorito = (slug: string) => {
    setFavoritos((actuales) => {
      const nuevos = actuales.includes(slug)
        ? actuales.filter((item) => item !== slug)
        : [...actuales, slug];

      localStorage.setItem(
        "mareva_favoritos",
        JSON.stringify(nuevos)
      );

      return nuevos;
    });
  };

  const [paqueteSeleccionado, setPaqueteSeleccionado] =
    useState<Paquete | null>(null);

  const [mensaje, setMensaje] =
    useState("");

  const mostrarMensaje = (
    titulo: string,
    detalle?: string
  ) => {
    const texto = detalle
      ? `${titulo}: ${detalle}`
      : titulo;

    setMensaje(texto);

    setTimeout(() => {
      setMensaje("");
    }, 4000);
  };

  useEffect(() => {
    const usuarioGuardado =
      localStorage.getItem("mareva_usuario");

    if (usuarioGuardado) {
      try {
        setUsuario(
          JSON.parse(usuarioGuardado)
        );
      } catch {
        localStorage.removeItem(
          "mareva_usuario"
        );
      }
    }
  }, []);

  const irA = (ruta: Ruta) => {
    setRutaActual(ruta);
  };

  const iniciarSesion = (
    datosUsuario: Usuario
  ) => {
    setUsuario(datosUsuario);

    localStorage.setItem(
      "mareva_usuario",
      JSON.stringify(datosUsuario)
    );

    setRutaActual("paquetes");

    mostrarMensaje(
      "Bienvenido",
      `Hola ${datosUsuario.nombre}`
    );
  };

  const cerrarSesion = () => {
    setUsuario(null);

    localStorage.removeItem(
      "mareva_usuario"
    );

    localStorage.removeItem(
      "mareva_token"
    );

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "mareva_reserva_pendiente"
    );

    setPaqueteSeleccionado(null);

    setRutaActual("login");

    mostrarMensaje(
      "SesiÃ³n cerrada"
    );
  };

  const reservarPaquete = (
    paquete: Paquete
  ) => {
    if (!usuario) {
      mostrarMensaje(
        "Inicia sesiÃ³n",
        "Debes iniciar sesiÃ³n para realizar una reserva."
      );

      setRutaActual("login");

      return;
    }

    setPaqueteSeleccionado(paquete);

    setRutaActual("reserva");
  };

  const reservaCreada = (
    idReserva: number
  ) => {
    const numeroReserva =
      Number(idReserva);

    if (
      !numeroReserva ||
      Number.isNaN(numeroReserva)
    ) {
      mostrarMensaje(
        "Error",
        "La reserva fue creada, pero no se recibiÃ³ un nÃºmero de reserva vÃ¡lido."
      );

      return;
    }

    localStorage.setItem(
      "mareva_reserva_pendiente",
      String(numeroReserva)
    );

    setPaqueteSeleccionado(null);

    setRutaActual("reservas");
  };

  const seleccionarPaqueteDesdeFavoritos = (
    paquete: Paquete
  ) => {
    reservarPaquete(paquete);
  };

  const renderContenido = () => {
    switch (rutaActual) {
      case "inicio":
        return (
          <Inicio
            seleccionarPaquete={
              reservarPaquete
            }
            irAPaquetes={() =>
              irA("paquetes")
            }
          />
        );

      case "login":
        return (
          <Login
            iniciarSesion={
              iniciarSesion
            }
            irA={irA}
            mostrarMensaje={
              mostrarMensaje
            }
          />
        );

      case "registro":
        return (
          <Registro
            irA={irA}
            mostrarMensaje={
              mostrarMensaje
            }
          />
        );

      case "paquetes":
        return (
          <Paquetes
            mostrarMensaje={
              mostrarMensaje
            }
            favoritos={favoritos}
            cambiarFavorito={cambiarFavorito}
            seleccionarPaquete={
              reservarPaquete
            }
          />
        );

      case "favoritos":
        return (
          <Favoritos
            usuario={usuario}
            favoritos={favoritos}
            cambiarFavorito={cambiarFavorito}
            irA={irA}
            seleccionarPaquete={
              seleccionarPaqueteDesdeFavoritos
            }
            mostrarMensaje={
              mostrarMensaje
            }
          />
        );

      case "reservas":
        return (
          <Reservas
            usuario={usuario}
            irA={irA}
            mostrarMensaje={
              mostrarMensaje
            }
          />
        );

      case "reserva":
        if (!paqueteSeleccionado) {
          return (
            <Paquetes
              mostrarMensaje={
                mostrarMensaje
              }
              favoritos={favoritos}
            cambiarFavorito={cambiarFavorito}
              seleccionarPaquete={
                reservarPaquete
              }
            />
          );
        }

        return (
          <FormularioReserva
            usuario={usuario}
            paquete={
              paqueteSeleccionado
            }
            volver={() =>
              irA("paquetes")
            }
            mostrarMensaje={(
              titulo,
              detalle
            ) =>
              mostrarMensaje(
                detalle
                  ? `${titulo}: ${detalle}`
                  : titulo
              )
            }
            reservaCreada={
              reservaCreada
            }
          />
        );

      case "usuarios":
        return (
          <Usuarios
            mostrarMensaje={
              mostrarMensaje
            }
          />
        );

      case "admin":
        return (
          <AdminDashboard
            mostrarMensaje={
              mostrarMensaje
            }
          />
        );

      case "alojamientos":
        return (
          <Alojamientos
            mostrarMensaje={
              mostrarMensaje
            }
          />
        );

      case "peajes":
        return (
          <Peajes
            mostrarMensaje={
              mostrarMensaje
            }
          />
        );

      case "transporte":
        return (
          <Transporte
            mostrarMensaje={
              mostrarMensaje
            }
          />
        );

      case "perfil":
        return (
          <PerfilCliente
            usuario={usuario}
            mostrarMensaje={
              mostrarMensaje
            }
          />
        );

      case "notificaciones":
        return (
          <Notificaciones
            usuario={usuario}
            mostrarMensaje={
              mostrarMensaje
            }
          />
        );

      case "cupones":
        return (
          <Cupones
            usuario={usuario}
            mostrarMensaje={
              mostrarMensaje
            }
          />
        );

      default:
        return (
          <Inicio
            seleccionarPaquete={
              reservarPaquete
            }
            irAPaquetes={() =>
              irA("paquetes")
            }
          />
        );
    }
  };

  return (
    <div className="app">

      <header className="app-header">

        <div
          className="logo"
          onClick={() =>
            irA("inicio")
          }
        >
          
        </div>

        <nav className="app-nav">

          <button
            className={
              rutaActual === "inicio"
                ? "nav-link activo"
                : "nav-link"
            }
            onClick={() =>
              irA("inicio")
            }
          >
            Inicio
          </button>

          <button
            className={
              rutaActual === "paquetes"
                ? "nav-link activo"
                : "nav-link"
            }
            onClick={() =>
              irA("paquetes")
            }
          >
            Paquetes
          </button>

          {usuario && (
            <button
              className={
                rutaActual === "favoritos"
                  ? "nav-link activo"
                  : "nav-link"
              }
              onClick={() =>
                irA("favoritos")
              }
            >
              Favoritos
            </button>
          )}

          {usuario && (
            <button
              className={
                rutaActual === "reservas"
                  ? "nav-link activo"
                  : "nav-link"
              }
              onClick={() =>
                irA("reservas")
              }
            >
              Mis reservas
            </button>
          )}

          {usuario && (
            <button
              className={
                rutaActual === "perfil"
                  ? "nav-link activo"
                  : "nav-link"
              }
              onClick={() =>
                irA("perfil")
              }
            >
              Perfil
            </button>
          )}

          {usuario?.rol === "admin" && (
            <button
              className={
                rutaActual === "admin"
                  ? "nav-link activo"
                  : "nav-link"
              }
              onClick={() =>
                irA("admin")
              }
            >
              AdministraciÃ³n
            </button>
          )}

        </nav>

        <div className="header-actions">

          {usuario ? (
            <>
              <span className="usuario-nombre">
                {usuario.nombre}
              </span>

              <button
                className="btn-logout"
                onClick={
                  cerrarSesion
                }
              >
                Cerrar sesiÃ³n
              </button>
            </>
          ) : (
            <>
              <button
                className="btn-login"
                onClick={() =>
                  irA("login")
                }
              >
                Iniciar sesiÃ³n
              </button>

              <button
                className="btn-register"
                onClick={() =>
                  irA("registro")
                }
              >
                Registrarse
              </button>
            </>
          )}

        </div>

      </header>

      {mensaje && (
        <div className="mensaje-global">
          {mensaje}
        </div>
      )}

      <main className="app-content">
        {renderContenido()}
      </main>

    </div>
  );
}
// PRUEBA MAREVA 15 SEPTIEMBRE
// PRUEBA HMR MAREVA
//te amo



export default App;


// PRUEBA DIRECTA VITE

// PRUEBA VITE 12345



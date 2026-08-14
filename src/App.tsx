import { useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Paquetes from "./components/Paquetes";
import Usuarios from "./components/Usuarios";
import Login from "./components/Login";
import Registro from "./components/Registro";
import Reservas from "./components/Reservas";

function App() {
  const [pagina, setPagina] = useState("inicio");

  const mostrarMensaje = (titulo: string, mensaje: string) => {
    const modal = document.createElement("div");
    modal.className = "modal-reserva";

    modal.innerHTML = `
      <div class="modal-contenido">
        <div class="modal-icono">✈️</div>

        <h2>${titulo}</h2>

        <p>${mensaje}</p>

        <button id="cerrarModal">Aceptar</button>
      </div>
    `;

    document.body.appendChild(modal);

    document
      .getElementById("cerrarModal")
      ?.addEventListener("click", () => {
        modal.remove();
      });

    console.log(`${titulo}: ${mensaje}`);
  };

  return (
    <div className="app-layout">
      <Sidebar
        paginaActual={pagina}
        cambiarPagina={setPagina}
      />

      <main className="contenido-principal">

        {pagina === "inicio" && (
          <section className="inicio-pagina">
            <div className="inicio-contenido">
              <span>MAREVA · VIAJES POR COLOMBIA</span>

              <h1>
                Descubre Colombia
                <br />
                de una nueva manera
              </h1>

              <p>
                Encuentra destinos increíbles, descubre
                nuevos lugares y crea experiencias
                inolvidables con MAREVA.
              </p>

              <button
                className="inicio-boton"
                onClick={() => setPagina("paquetes")}
              >
                Explorar paquetes
              </button>
            </div>
          </section>
        )}

        {pagina === "paquetes" && (
          <Paquetes mostrarMensaje={mostrarMensaje} />
        )}

        {pagina === "usuarios" && (
          <Usuarios mostrarMensaje={mostrarMensaje} />
        )}

        {pagina === "reservas" && (
          <Reservas mostrarMensaje={mostrarMensaje} />
        )}

        {pagina === "login" && (
          <Login mostrarMensaje={mostrarMensaje} />
        )}

        {pagina === "registro" && (
          <Registro mostrarMensaje={mostrarMensaje} />
        )}

      </main>
    </div>
  );
}

export default App;

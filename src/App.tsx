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

        {pagina === "paquetes" && <Paquetes />}

        {pagina === "usuarios" && <Usuarios />}

        {pagina === "reservas" && <Reservas />}

        {pagina === "login" && <Login />}

        {pagina === "registro" && <Registro />}

      </main>
    </div>
  );
}

export default App;

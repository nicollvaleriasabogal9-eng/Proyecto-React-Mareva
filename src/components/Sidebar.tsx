interface SidebarProps {
  paginaActual: string;
  cambiarPagina: (pagina: string) => void;
}

function Sidebar({ paginaActual, cambiarPagina }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>MAREVA</h2>
        <span>Viajes por Colombia</span>
      </div>

      <nav className="sidebar-menu">
        <button
          className={paginaActual === "inicio" ? "menu-activo" : ""}
          onClick={() => cambiarPagina("inicio")}
        >
          🏠 Inicio
        </button>

        <button
          className={paginaActual === "paquetes" ? "menu-activo" : ""}
          onClick={() => cambiarPagina("paquetes")}
        >
          ✈️ Paquetes
        </button>

        <button
          className={paginaActual === "usuarios" ? "menu-activo" : ""}
          onClick={() => cambiarPagina("usuarios")}
        >
          👥 Usuarios
        </button>

        <button
          className={paginaActual === "reservas" ? "menu-activo" : ""}
          onClick={() => cambiarPagina("reservas")}
        >
          📋 Reservas
        </button>

        <button
          className={paginaActual === "login" ? "menu-activo" : ""}
          onClick={() => cambiarPagina("login")}
        >
          🔐 Iniciar sesión
        </button>

        <button
          className={paginaActual === "registro" ? "menu-activo" : ""}
          onClick={() => cambiarPagina("registro")}
        >
          📝 Registro
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
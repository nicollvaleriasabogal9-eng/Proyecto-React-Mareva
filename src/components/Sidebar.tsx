interface SidebarProps {
  paginaActual: string;
  cambiarPagina: (pagina: string) => void;
}

interface OpcionMenu {
  id: string;
  nombre: string;
  icono: string;
}

const opcionesMenu: OpcionMenu[] = [
  {
    id: "inicio",
    nombre: "Inicio",
    icono: "🏠",
  },
  {
    id: "paquetes",
    nombre: "Paquetes",
    icono: "✈️",
  },
  {
    id: "usuarios",
    nombre: "Usuarios",
    icono: "👥",
  },
  {
    id: "reservas",
    nombre: "Reservas",
    icono: "📋",
  },

  {
    id: "login",
    nombre: "Iniciar sesión",
    icono: "🔐",
  },
  {
    id: "registro",
    nombre: "Registro",
    icono: "📝",
  },
];

function Sidebar({
  paginaActual,
  cambiarPagina,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>MAREVA</h2>

        <span>Viajes por Colombia</span>
      </div>

      <nav className="sidebar-menu">
        {opcionesMenu.map((opcion) => (
          <button
            key={opcion.id}
            type="button"
            className={
              paginaActual === opcion.id
                ? "menu-activo"
                : ""
            }
            onClick={() => cambiarPagina(opcion.id)}
          >
            {opcion.icono} {opcion.nombre}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;

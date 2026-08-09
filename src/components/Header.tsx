import logoMareva from "../assets/logo-mareva.png";

function Header() {
  return (
    <header className="header">
      <div className="header-logo">
        <img
          src={logoMareva}
          alt="Logo MAREVA"
          className="logo-mareva"
        />

      
      </div>

      <nav className="header-nav">
        <a href="#inicio">Inicio</a>
        <a href="#paquetes">Paquetes</a>
        <a href="#usuarios">Usuarios</a>
      </nav>

      <button className="header-button">
        Explorar viajes
      </button>
    </header>
  );
}

export default Header;
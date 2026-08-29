import React, { useState } from 'react';
import './App.css';
import { Inicio } from './pages/Inicio';
import { Paquetes } from './pages/Paquetes';
import { Usuarios } from './pages/Usuarios';
import { Reservas } from './pages/Reservas';
import { Login } from './pages/Login';
import { Registro } from './pages/Registro';

export const App: React.FC = () => {
  // Estado para controlar la página o ruta de tabla activa
  const [rutaActual, setRutaActual] = useState<string>('inicio');

  // Datos simulados de las tablas para renderizar el detalle en forma de lista
  const tablasData: Record<string, { titulo: string; descripcion: string; registros: { id: string; detalle: string }[] }> = {
    clientes: {
      titulo: 'Tabla: Clientes',
      descripcion: 'Listado de clientes registrados en la agencia Mareva.',
      registros: [
        { id: 'CLI-01', detalle: 'Nicoll Sabogal - nicoll@mareva.com - Estado: Activo' },
        { id: 'CLI-02', detalle: 'Jimmy Gonzales - jimmy@mareva.com - Estado: Activo' },
        { id: 'CLI-03', detalle: 'Andrea Kalifa - andrea@mareva.com - Estado: Inactivo' },
        { id: 'CLI-04', detalle: 'Santiago Uldarico - santiago@mareva.com - Estado: Activo' }
      ]
    },
    niveles: {
      titulo: 'Tabla: Niveles',
      descripcion: 'Niveles de membresía y fidelización de usuarios.',
      registros: [
        { id: 'NIV-1', detalle: 'Bronce - Descuento base 5%' },
        { id: 'NIV-2', detalle: 'Plata - Descuento base 10%' },
        { id: 'NIV-3', detalle: 'Oro - Descuento base 15% + Asistencia VIP' }
      ]
    },
    destinos: {
      titulo: 'Tabla: Destinos',
      descripcion: 'Destinos turísticos disponibles en la plataforma.',
      registros: [
        { id: 'DEST-101', detalle: 'Cartagena de Indias - Colombia - Clima Cálido' },
        { id: 'DEST-102', detalle: 'San Andrés Islas - Colombia - Playa y Sol' },
        { id: 'DEST-103', detalle: 'Medellín - Colombia - Ciudad/Cultura' }
      ]
    },
    'paquetes-turisticos': {
      titulo: 'Tabla: Paquetes Turísticos',
      descripcion: 'Oferta de paquetes integrales para viajeros.',
      registros: [
        { id: 'PAQ-501', detalle: 'Caribe Soñado - 5 Días / 4 Noches - $2.500.000 COP' },
        { id: 'PAQ-502', detalle: 'Aventura Cafetera - 4 Días / 3 Noches - $1.800.000 COP' },
        { id: 'PAQ-503', detalle: 'Escape Colonial - 3 Días / 2 Noches - $1.200.000 COP' }
      ]
    },
    promociones: {
      titulo: 'Tabla: Promociones',
      descripcion: 'Descuentos y promociones vigentes.',
      registros: [
        { id: 'PROM-01', detalle: 'Descuento Temporada Baja - 20% OFF' },
        { id: 'PROM-02', detalle: 'Viaja en Pareja - 15% OFF en segundo tiquete' }
      ]
    },
    favoritos: {
      titulo: 'Tabla: Favoritos',
      descripcion: 'Paquetes y destinos guardados por los clientes.',
      registros: [
        { id: 'FAV-01', detalle: 'Cliente: CLI-01 -> Paquete: PAQ-501' },
        { id: 'FAV-02', detalle: 'Cliente: CLI-02 -> Destino: DEST-102' }
      ]
    },
    notificaciones: {
      titulo: 'Tabla: Notificaciones',
      descripcion: 'Alertas y mensajes enviados a los usuarios.',
      registros: [
        { id: 'NOT-1001', detalle: 'Reserva Confirmada - Enviado a CLI-01' },
        { id: 'NOT-1002', detalle: 'Recordatorio de Pago - Enviado a CLI-03' }
      ]
    }
  };

  const renderContenido = () => {
    switch (rutaActual) {
      case 'inicio':
        return <Inicio />;
      case 'paquetes':
        return <Paquetes />;
      case 'usuarios':
        return <Usuarios />;
      case 'reservas':
        return <Reservas />;
      case 'login':
        return <Login />;
      case 'registro':
        return <Registro />;
      default:
        if (tablasData[rutaActual]) {
          const tabla = tablasData[rutaActual];
          return (
            <div className="apple-card" style={{ padding: '30px' }}>
              <h2 style={{ color: '#2997ff', marginBottom: '10px' }}>{tabla.titulo}</h2>
              <p style={{ color: '#a1a1a6', marginBottom: '20px' }}>{tabla.descripcion}</p>
              
              <h4 style={{ color: '#f5f5f7', marginBottom: '15px' }}>Registros (Detalle de la Tabla):</h4>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {tabla.registros.map((item) => (
                  <li 
                    key={item.id} 
                    style={{
                      backgroundColor: '#2c2c2e',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      marginBottom: '10px',
                      borderLeft: '4px solid #0071e3'
                    }}
                  >
                    <strong>[{item.id}]</strong> — {item.detalle}
                  </li>
                ))}
              </ul>
            </div>
          );
        }
        return <h2>Página no encontrada</h2>;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#000000', color: '#f5f5f7' }}>
      {/* Menú Lateral Completo */}
      <aside style={{ width: '260px', backgroundColor: '#1c1c1e', padding: '20px', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ fontSize: '20px', color: '#fff', marginBottom: '25px', textAlign: 'center' }}>
          Agencia MAREVA
        </h2>
        <div style={{ marginBottom: '30px' }}>
          <p style={{ color: '#86868b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
            Páginas Principales
          </p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button className={`nav-btn ${rutaActual === 'inicio' ? 'active' : ''}`} onClick={() => setRutaActual('inicio')}>🏠 Inicio</button>
            <button className={`nav-btn ${rutaActual === 'paquetes' ? 'active' : ''}`} onClick={() => setRutaActual('paquetes')}>✈️ Paquetes</button>
            <button className={`nav-btn ${rutaActual === 'usuarios' ? 'active' : ''}`} onClick={() => setRutaActual('usuarios')}>👥 Usuarios</button>
            <button className={`nav-btn ${rutaActual === 'reservas' ? 'active' : ''}`} onClick={() => setRutaActual('reservas')}>📋 Reservas</button>
            <button className={`nav-btn ${rutaActual === 'login' ? 'active' : ''}`} onClick={() => setRutaActual('login')}>🔐 Login</button>
            <button className={`nav-btn ${rutaActual === 'registro' ? 'active' : ''}`} onClick={() => setRutaActual('registro')}>📝 Registro</button>
          </nav>
        </div>
        <div>
          <p style={{ color: '#86868b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
            Rutas / Tablas del Proyecto
          </p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button className={`nav-btn ${rutaActual === 'clientes' ? 'active' : ''}`} onClick={() => setRutaActual('clientes')}>📊 Clientes</button>
            <button className={`nav-btn ${rutaActual === 'niveles' ? 'active' : ''}`} onClick={() => setRutaActual('niveles')}>📊 Niveles</button>
            <button className={`nav-btn ${rutaActual === 'destinos' ? 'active' : ''}`} onClick={() => setRutaActual('destinos')}>📊 Destinos</button>
            <button className={`nav-btn ${rutaActual === 'paquetes-turisticos' ? 'active' : ''}`} onClick={() => setRutaActual('paquetes-turisticos')}>📊 Paquetes Turísticos</button>
            <button className={`nav-btn ${rutaActual === 'promociones' ? 'active' : ''}`} onClick={() => setRutaActual('promociones')}>📊 Promociones</button>
            <button className={`nav-btn ${rutaActual === 'favoritos' ? 'active' : ''}`} onClick={() => setRutaActual('favoritos')}>📊 Favoritos</button>
            <button className={`nav-btn ${rutaActual === 'notificaciones' ? 'active' : ''}`} onClick={() => setRutaActual('notificaciones')}>📊 Notificaciones</button>
          </nav>
        </div>
      </aside>
      <main style={{ flex: 1, padding: '40px' }}>
        <header style={{ marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: '15px' }}>
          <h1 style={{ fontSize: '28px' }}>Sistema de Gestión Mareva</h1>
        </header>
        {renderContenido()}
      </main>
    </div>
  );
};

export default App;

import { useState, type FormEvent } from "react";
import { ADMIN_SECTIONS } from "../data";
import type { Reservation, TravelPackage } from "../models";

type Notify = (title: string, message: string, kind?: "favorite" | "booking" | "route" | "payment" | "reminder") => void;

interface AdminPanelProps {
  packages: TravelPackage[];
  reservations: Reservation[];
  notify: Notify;
  onExit: () => void;
}

const currency = (value: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);

const users = [
  { name: "Laura Rubiano", email: "laura@mareva.co", level: "Aventurera", favorites: 4, status: "Activo" },
  { name: "Nicoll Sabogal", email: "nicoll@mareva.co", level: "Embajadora", favorites: 7, status: "Activo" },
  { name: "César Uzcátegui", email: "cesar@mareva.co", level: "Explorador", favorites: 2, status: "Activo" },
  { name: "Andrés Aroca", email: "andres@mareva.co", level: "Viajero Elite", favorites: 5, status: "Inactivo" },
];

export default function AdminPanel({ packages, reservations, notify, onExit }: AdminPanelProps) {
  const [section, setSection] = useState("dashboard");
  const [hotels, setHotels] = useState([
    { name: "Casa del Mar Boutique", destination: "Cartagena", stars: 5, rooms: 24, pet: true },
    { name: "Coral Bay Resort", destination: "San Andrés", stars: 5, rooms: 62, pet: false },
    { name: "Finca La Palma", destination: "Eje Cafetero", stars: 4, rooms: 18, pet: true },
    { name: "Laureles Living", destination: "Medellín", stars: 4, rooms: 31, pet: true },
  ]);
  const [tolls, setTolls] = useState([
    { id: 1, name: "Andes", road: "Bogotá · Medellín", category: "I", price: 16200 },
    { id: 2, name: "Cajamarca", road: "Bogotá · Armenia", category: "I", price: 17400 },
    { id: 3, name: "Gambote", road: "Sincelejo · Cartagena", category: "I", price: 11800 },
    { id: 4, name: "Los Llanos", road: "Bogotá · Villavicencio", category: "I", price: 15300 },
  ]);
  const [coupons, setCoupons] = useState([
    { code: "MAREVA10", discount: "10%", uses: 34, status: "Activo" },
    { code: "PETVIAJERO", discount: "$60.000", uses: 12, status: "Activo" },
    { code: "CARIBE2026", discount: "15%", uses: 58, status: "Pausado" },
  ]);
  const [notificationText, setNotificationText] = useState("Tu viaje está cerca. Revisa el clima y prepara tu equipaje.");

  const sectionTitle = ADMIN_SECTIONS.find(([id]) => id === section)?.[1] || "Administración";
  const editable = (label: string) => notify(`${label} listo para editar`, "El formulario administrativo se abrió correctamente.");

  const sendNotification = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    notify("Notificación enviada", notificationText, "reminder");
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <button className="admin-brand" onClick={() => setSection("dashboard")}><span>M</span><div><strong>MAREVA</strong><small>Panel administrativo</small></div></button>
        <nav aria-label="Módulos administrativos">
          {ADMIN_SECTIONS.map(([id, label], index) => (
            <button key={id} className={section === id ? "active" : ""} onClick={() => setSection(id)}><span>{String(index + 1).padStart(2, "0")}</span>{label}</button>
          ))}
        </nav>
        <button className="admin-exit" onClick={onExit}>← Volver al sitio</button>
      </aside>

      <main className="admin-main">
        <header className="admin-header"><div><span>MAREVA · OPERACIONES</span><h1>{sectionTitle}</h1></div><div className="admin-user"><span>NS</span><div><strong>Nicoll Sabogal</strong><small>Administradora</small></div></div></header>

        {section === "dashboard" && (
          <div className="admin-stack">
            <div className="admin-kpis">
              <article><span>Ventas del mes</span><strong>{currency(48640000)}</strong><small className="positive">↑ 18% vs. agosto</small></article>
              <article><span>Reservas activas</span><strong>{reservations.length + 28}</strong><small>9 viajan esta semana</small></article>
              <article><span>Ocupación de buses</span><strong>76%</strong><small>126 de 166 sillas</small></article>
              <article><span>Viajeros con mascota</span><strong>14</strong><small className="positive">↑ 4 este mes</small></article>
            </div>
            <div className="admin-dashboard-grid">
              <section className="admin-card sales-chart"><div className="admin-card-title"><div><span>INGRESOS 2026</span><h2>Ventas por mes</h2></div><strong>{currency(187400000)}</strong></div><div className="bars" aria-label="Gráfica de ventas">{[38,51,44,62,58,78,69,84,92].map((height, index) => <div key={index}><span style={{ height: `${height}%` }}></span><small>{["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep"][index]}</small></div>)}</div></section>
              <section className="admin-card"><div className="admin-card-title"><div><span>MÁS ELEGIDOS</span><h2>Destinos destacados</h2></div></div><div className="rank-list">{packages.slice(0,4).map((item,index) => <div key={item.id}><span>{index+1}</span><img src={item.image} alt=""/><div><strong>{item.destination}</strong><small>{18-index*3} reservas</small></div><b>{currency(item.price)}</b></div>)}</div></section>
            </div>
            <section className="admin-card"><div className="admin-card-title"><div><span>ACTIVIDAD RECIENTE</span><h2>Últimas reservas</h2></div><button onClick={() => setSection("reservations")}>Ver todas →</button></div><ReservationTable reservations={reservations} /></section>
          </div>
        )}

        {section === "packages" && (
          <section className="admin-card data-module"><ModuleHeader eyebrow="CATÁLOGO" title="Gestor de paquetes" description="Precios, disponibilidad, beneficios y políticas." action="+ Nuevo paquete" onAction={() => editable("Nuevo paquete")} />
            <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Paquete</th><th>Duración</th><th>Precio</th><th>Beneficios</th><th>Estado</th><th></th></tr></thead><tbody>{packages.map(item => <tr key={item.id}><td><div className="table-product"><img src={item.image} alt=""/><div><strong>{item.name}</strong><small>{item.destination}</small></div></div></td><td>{item.days} días</td><td>{currency(item.price)}</td><td><div className="tag-row">{item.petFriendly && <span className="tag aqua">Pet</span>}{item.breakfast && <span className="tag sand">Desayuno</span>}</div></td><td><span className="status success">Publicado</span></td><td><button className="table-action" onClick={() => editable(item.name)}>Editar</button></td></tr>)}</tbody></table></div>
          </section>
        )}

        {section === "hotels" && (
          <section className="admin-card data-module"><ModuleHeader eyebrow="ALOJAMIENTOS" title="Gestor de hoteles" description="Controla habitaciones y políticas para mascotas." action="+ Nuevo hotel" onAction={() => editable("Nuevo hotel")} />
            <div className="hotel-admin-grid">{hotels.map((hotel,index) => <article key={hotel.name}><div className="hotel-icon">H</div><div className="hotel-copy"><small>{hotel.destination}</small><h3>{hotel.name}</h3><p>{"★".repeat(hotel.stars)} · {hotel.rooms} habitaciones</p></div><label className="switch-label"><input type="checkbox" checked={hotel.pet} onChange={() => setHotels(current => current.map((item,i) => i === index ? {...item, pet: !item.pet} : item))}/><span></span>Pet Friendly</label></article>)}</div>
          </section>
        )}

        {section === "tolls" && (
          <section className="admin-card data-module"><ModuleHeader eyebrow="RUTAS NACIONALES" title="Gestor de peajes 2026" description="Actualiza valores para mantener precisas las comparaciones." action="+ Nuevo peaje" onAction={() => editable("Nuevo peaje")} />
            <div className="route-admin-note"><strong>Valores vigentes 2026</strong><span>Última actualización: 2 de septiembre de 2026</span></div>
            <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Peaje</th><th>Corredor</th><th>Categoría</th><th>Valor COP</th><th></th></tr></thead><tbody>{tolls.map((toll,index) => <tr key={toll.id}><td><strong>{toll.name}</strong></td><td>{toll.road}</td><td><span className="tag">Categoría {toll.category}</span></td><td><input className="price-input" type="number" value={toll.price} onChange={(event) => setTolls(current => current.map((item,i) => i === index ? {...item, price:Number(event.target.value)} : item))}/></td><td><button className="table-action" onClick={() => notify("Peaje actualizado", `${toll.name}: ${currency(toll.price)}`, "route")}>Guardar</button></td></tr>)}</tbody></table></div>
          </section>
        )}

        {section === "reservations" && (
          <section className="admin-card data-module"><ModuleHeader eyebrow="OPERACIÓN" title="Gestor de reservas" description="Consulta pasajeros, bebés, mascotas y forma de viaje." action="Exportar" onAction={() => notify("Reporte preparado", "La exportación de reservas está lista.")} /><ReservationTable reservations={reservations} extended /></section>
        )}

        {section === "transport" && (
          <section className="admin-card data-module"><ModuleHeader eyebrow="FLOTA MAREVA" title="Transporte y sillas" description="Asigna vehículos y controla la ocupación de cada salida." action="+ Nueva salida" onAction={() => editable("Nueva salida")} />
            <div className="transport-layout"><div className="bus-card"><div className="bus-head"><div><span>MV-08</span><strong>Bogotá → Cartagena</strong><small>15 dic 2026 · 7:00 p. m.</small></div><b>32/40</b></div><div className="seat-grid">{Array.from({length:40},(_,i) => <button key={i} className={i < 32 ? "reserved" : ""} title={i < 32 ? "Reservada" : "Disponible"}>{i+1}</button>)}</div><div className="seat-legend"><span><i className="available"></i>Disponible</span><span><i className="busy"></i>Reservada</span></div></div><div className="transport-stats"><article><span>Sillas libres</span><strong>8</strong></article><article><span>Viajeros en carro propio</span><strong>6</strong><small>No ocupan silla</small></article><article><span>Mascotas registradas</span><strong>3</strong></article></div></div>
          </section>
        )}

        {section === "users" && (
          <section className="admin-card data-module"><ModuleHeader eyebrow="COMUNIDAD" title="Gestor de usuarios" description="Consulta perfiles, niveles y favoritos guardados." action="+ Nuevo usuario" onAction={() => editable("Nuevo usuario")} />
            <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Usuario</th><th>Nivel</th><th>Favoritos</th><th>Estado</th><th></th></tr></thead><tbody>{users.map(user => <tr key={user.email}><td><div className="user-cell"><span>{user.name.split(" ").map(part => part[0]).join("").slice(0,2)}</span><div><strong>{user.name}</strong><small>{user.email}</small></div></div></td><td>{user.level}</td><td>♥ {user.favorites}</td><td><span className={`status ${user.status === "Activo" ? "success" : "muted"}`}>{user.status}</span></td><td><button className="table-action" onClick={() => editable(user.name)}>Ver perfil</button></td></tr>)}</tbody></table></div>
          </section>
        )}

        {section === "coupons" && (
          <section className="admin-card data-module"><ModuleHeader eyebrow="PROMOCIONES" title="Gestor de cupones" description="Crea incentivos y controla sus usos." action="+ Crear cupón" onAction={() => setCoupons(current => [...current,{code:`VIAJA${current.length+1}0`,discount:"10%",uses:0,status:"Activo"}])} />
            <div className="coupon-grid">{coupons.map((coupon,index) => <article key={coupon.code}><div className="coupon-cut"></div><small>CUPÓN MAREVA</small><h3>{coupon.code}</h3><strong>{coupon.discount} de descuento</strong><p>{coupon.uses} usos</p><button onClick={() => setCoupons(current => current.map((item,i) => i === index ? {...item,status:item.status === "Activo" ? "Pausado" : "Activo"} : item))}>{coupon.status}</button></article>)}</div>
          </section>
        )}

        {section === "notifications" && (
          <section className="admin-card data-module"><ModuleHeader eyebrow="MENSAJERÍA" title="Gestor de notificaciones" description="Envía mensajes temáticos a tus viajeros." />
            <div className="notification-admin"><form onSubmit={sendNotification}><label>Tipo de mensaje<select><option>Recordatorio de viaje</option><option>Promoción</option><option>Cambio en la reserva</option><option>Pago aprobado</option></select></label><label>Destinatarios<select><option>Todos los viajeros</option><option>Viajeros de diciembre</option><option>Viajeros con mascota</option></select></label><label>Mensaje<textarea value={notificationText} onChange={(event) => setNotificationText(event.target.value)} rows={5}/></label><button className="primary-button" type="submit">Enviar notificación</button></form><div className="ticket-preview"><span className="ticket-brand">MAREVA AIR · AVISO</span><div className="ticket-route"><strong>BOG</strong><span>✈</span><strong>COL</strong></div><h3>¡Prepara la maleta!</h3><p>{notificationText}</p><div><span>DESTINATARIO</span><strong>Viajeros Mareva</strong></div></div></div>
          </section>
        )}
      </main>
    </div>
  );
}

function ModuleHeader({ eyebrow, title, description, action, onAction }: { eyebrow: string; title: string; description: string; action?: string; onAction?: () => void }) {
  return <div className="module-heading"><div><span>{eyebrow}</span><h2>{title}</h2><p>{description}</p></div>{action && <button className="primary-button" onClick={onAction}>{action}</button>}</div>;
}

function ReservationTable({ reservations, extended = false }: { reservations: Reservation[]; extended?: boolean }) {
  const list = reservations.length ? reservations : [{ id:"MV-24018", packageName:"Cartagena con encanto", destination:"Cartagena", startDate:"2026-12-15", endDate:"2026-12-18", travelers:"2 adultos · 1 niño · 1 mascota", travelMode:"bus" as const, status:"Confirmada" as const, total:2380000, petName:"Luna" }];
  return <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Reserva</th><th>Viaje</th><th>Viajeros</th>{extended && <th>Movilidad</th>}<th>Total</th><th>Estado</th></tr></thead><tbody>{list.map(item => <tr key={item.id}><td><strong>{item.id}</strong><small>{item.startDate}</small></td><td><strong>{item.packageName}</strong><small>{item.destination}</small></td><td>{item.travelers}</td>{extended && <td><span className="tag aqua">{item.travelMode === "car" ? "Carro propio" : item.travelMode === "plane" ? "Avión" : "Bus Mareva"}</span></td>}<td>{currency(item.total)}</td><td><span className={`status ${item.status === "Confirmada" ? "success" : "warning"}`}>{item.status}</span></td></tr>)}</tbody></table></div>;
}

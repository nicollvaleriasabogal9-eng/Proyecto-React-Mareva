import { useEffect, useMemo, useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import "./polish.css";
import { api } from "./api";
import { INITIAL_NOTIFICATIONS, PACKAGES, ROUTES } from "./data";
import type { Filters, Page, Reservation, SearchState, TravelMode, TravelNotification, TravelPackage } from "./models";
import AdminPanel from "./components/AdminPanel";
import RegistrosPanel from "./components/RegistrosPanel";
import { agregarReserva } from "./components/redux/reservasSlice";
import type { AppDispatch } from "./components/redux/store";

const currency = (value: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);
const modeName = (mode: TravelMode) => mode === "car" ? "Carro propio" : mode === "plane" ? "Avión" : "Bus Mareva";

const initialSearch: SearchState = {
  origin: "Bogotá", destination: "Cartagena", startDate: "2026-12-15", endDate: "2026-12-18",
  adults: 2, childrenAges: [8], babies: 0, pets: [], travelMode: "bus",
};

const initialReservation: Reservation = {
  id: "MV-24018", packageName: "Cartagena con encanto", destination: "Cartagena", startDate: "2026-12-15", endDate: "2026-12-18",
  travelers: "2 adultos · 1 niño · 1 mascota", travelMode: "bus", status: "Confirmada", total: 2380000, petName: "Luna",
};

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState<Page>("home");
  const [search, setSearch] = useState<SearchState>(initialSearch);
  const [filters, setFilters] = useState<Filters>({ maxPrice: 3500000, stars: 0, breakfast: false, freeCancellation: false, petFriendly: false });
  const [packages, setPackages] = useState(PACKAGES);
  const [selectedPackage, setSelectedPackage] = useState(PACKAGES[0]);
  const [favorites, setFavorites] = useState<number[]>([3]);
  const [favoriteDrawer, setFavoriteDrawer] = useState(false);
  const [notificationDrawer, setNotificationDrawer] = useState(false);
  const [notifications, setNotifications] = useState<TravelNotification[]>(INITIAL_NOTIFICATIONS);
  const [reservations, setReservations] = useState<Reservation[]>([initialReservation]);
  const [userName, setUserName] = useState("Sofía Munevar");
  const [signedIn, setSignedIn] = useState(false);
  const [toast, setToast] = useState<TravelNotification | null>(null);

  useEffect(() => {
    api.packages().then((items) => { if (items.length) setPackages(items); }).catch(() => undefined);
  }, []);

  const navigate = (next: Page) => {
    setPage(next);
    setFavoriteDrawer(false);
    setNotificationDrawer(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const notify = (title: string, message: string, kind: TravelNotification["kind"] = "booking") => {
    const item = { id: Date.now(), title, message, time: "Ahora", kind };
    setNotifications((current) => [item, ...current]);
    setToast(item);
    window.setTimeout(() => setToast(null), 3600);
  };

  const submitSearch = () => {
    setFilters((current) => ({ ...current, petFriendly: search.pets.length > 0 }));
    if (search.travelMode === "car") notify("Encontramos una ruta más barata", "Compara la ruta rápida y la ahorradora antes de reservar.", "route");
    navigate("results");
  };

  const toggleFavorite = (packageId: number) => {
    const active = !favorites.includes(packageId);
    setFavorites((current) => active ? [...current, packageId] : current.filter((id) => id !== packageId));
    const item = packages.find((travelPackage) => travelPackage.id === packageId);
    if (active && item) notify("Favorito guardado", `${item.name} te espera en Tus Favoritos.`, "favorite");
    api.toggleFavorite(packageId, active).catch(() => undefined);
  };

  const viewPackage = (travelPackage: TravelPackage) => { setSelectedPackage(travelPackage); navigate("detail"); };
  const reservePackage = (travelPackage: TravelPackage) => { setSelectedPackage(travelPackage); navigate("booking"); };

  const createReservation = (reservation: Reservation) => {
    setReservations((current) => [reservation, ...current]);
    dispatch(agregarReserva(reservation)); // refleja el nuevo registro en el estado global al instante
    api.createReservation(reservation).catch(() => undefined);
    notify("Pago aprobado", `Tu reserva ${reservation.id} está confirmada. El voucher ya está disponible.`, "payment");
    navigate("profile");
  };

  if (page === "admin") return (
    <>
      <AdminPanel packages={packages} reservations={reservations} notify={notify} onExit={() => navigate("home")} />
      <RegistrosPanel />
    </>
  );

  const favoritePackages = packages.filter((item) => favorites.includes(item.id));

  return (
    <div className="app-shell">
      <Header
        page={page}
        navigate={navigate}
        favoriteCount={favorites.length}
        unreadCount={notifications.filter((item) => !item.read).length}
        signedIn={signedIn}
        userName={userName}
        onFavorites={() => setFavoriteDrawer(true)}
        onNotifications={() => setNotificationDrawer(true)}
      />
      <main>
        {page === "home" && <HomePage packages={packages} search={search} setSearch={setSearch} onSearch={submitSearch} favorites={favorites} onFavorite={toggleFavorite} onView={viewPackage} onReserve={reservePackage} navigate={navigate} />}
        {page === "results" && <ResultsPage packages={packages} search={search} setSearch={setSearch} onSearch={submitSearch} filters={filters} setFilters={setFilters} favorites={favorites} onFavorite={toggleFavorite} onView={viewPackage} onReserve={reservePackage} />}
        {page === "detail" && <DetailPage travelPackage={selectedPackage} search={search} favorite={favorites.includes(selectedPackage.id)} onFavorite={() => toggleFavorite(selectedPackage.id)} onReserve={() => navigate("booking")} />}
        {page === "favorites" && <FavoritesPage packages={favoritePackages} favorites={favorites} onFavorite={toggleFavorite} onView={viewPackage} onReserve={reservePackage} navigate={navigate} />}
        {page === "booking" && <BookingPage travelPackage={selectedPackage} search={search} onBack={() => navigate("detail")} onConfirm={createReservation} />}
        {page === "login" && <AuthPage mode="login" onSwitch={() => navigate("register")} onSuccess={(name) => { setUserName(name); setSignedIn(true); notify("¡Bienvenida a Mareva!", "Tu sesión inició correctamente."); navigate("profile"); }} />}
        {page === "register" && <AuthPage mode="register" onSwitch={() => navigate("login")} onSuccess={(name) => { setUserName(name); setSignedIn(true); notify("Cuenta creada", "Ya puedes guardar favoritos y reservar tu próximo viaje."); navigate("profile"); }} />}
        {page === "profile" && <ProfilePage name={userName} signedIn={signedIn} reservations={reservations} favorites={favoritePackages} onLogin={() => navigate("login")} onView={viewPackage} />}
      </main>
      {favoriteDrawer && <FavoritesDrawer packages={favoritePackages} onClose={() => setFavoriteDrawer(false)} onView={viewPackage} onAll={() => navigate("favorites")} />}
      {notificationDrawer && <NotificationDrawer notifications={notifications} onClose={() => setNotificationDrawer(false)} />}
      {toast && <div className={`travel-toast ${toast.kind}`}><span>✦</span><div><strong>{toast.title}</strong><p>{toast.message}</p></div><button onClick={() => setToast(null)}>×</button></div>}
      <RegistrosPanel />
    </div>
  );
}

function Header({ page, navigate, favoriteCount, unreadCount, signedIn, userName, onFavorites, onNotifications }: { page: Page; navigate: (page: Page) => void; favoriteCount: number; unreadCount: number; signedIn: boolean; userName: string; onFavorites: () => void; onNotifications: () => void }) {
  return <header className="topbar">
    <button className="brand" onClick={() => navigate("home")} aria-label="Ir al inicio">
      <span className="brand-mark">M</span>
      <span><strong>MAREVA</strong><small>Viaja a tu manera</small></span>
    </button>
    <nav className="nav-links" aria-label="Navegación principal">
      <button className={page === "home" ? "active" : ""} onClick={() => navigate("home")}>Inicio</button>
      <button className={["results", "detail", "booking"].includes(page) ? "active" : ""} onClick={() => navigate("results")}>Paquetes</button>
      <button className={page === "favorites" ? "active" : ""} onClick={() => navigate("favorites")}>Favoritos</button>
      <button onClick={() => navigate("admin")}>Panel administrativo</button>
    </nav>
    <div className="top-actions">
      <button className="header-icon" onClick={onNotifications} aria-label="Abrir notificaciones">♢{unreadCount > 0 && <span>{unreadCount}</span>}</button>
      <button className="header-icon heart" onClick={onFavorites} aria-label="Abrir favoritos">♥{favoriteCount > 0 && <span>{favoriteCount}</span>}</button>
      <button className="login-button" onClick={() => navigate(signedIn ? "profile" : "login")}>{signedIn ? userName.split(" ")[0] : "Ingresar"}</button>
    </div>
  </header>;
}

function HomePage({ packages, search, setSearch, onSearch, favorites, onFavorite, onView, onReserve, navigate }: { packages: TravelPackage[]; search: SearchState; setSearch: Dispatch<SetStateAction<SearchState>>; onSearch: () => void; favorites: number[]; onFavorite: (id: number) => void; onView: (item: TravelPackage) => void; onReserve: (item: TravelPackage) => void; navigate: (page: Page) => void }) {
  return <>
    <section className="hero"><div className="hero-copy"><span className="eyebrow">COLOMBIA TE ESPERA</span><h1>Tu próxima historia<br/><em>empieza aquí.</em></h1><p>Paquetes pensados para familias, mascotas y cada forma de viajar.</p></div><SearchPanel search={search} setSearch={setSearch} onSearch={onSearch} compact /></section>
    <section className="content-section home-intro"><div className="section-heading"><div><span className="eyebrow dark">FAVORITOS DE VIAJEROS</span><h2>Escápate por Colombia</h2><p>Experiencias seleccionadas con alojamiento, actividades y acompañamiento local.</p></div><button className="text-button" onClick={() => navigate("results")}>Ver todos los paquetes →</button></div><div className="package-grid">{packages.slice(0,3).map((item) => <PackageCard key={item.id} item={item} favorite={favorites.includes(item.id)} onFavorite={() => onFavorite(item.id)} onView={() => onView(item)} onReserve={() => onReserve(item)} />)}</div></section>
    <section className="service-strip" aria-label="Servicios de Mareva"><article><span className="service-icon">✓</span><div><strong>Planes para toda la familia</strong><p>También puedes viajar con bebés y mascotas.</p></div></article><article><span className="service-icon">$</span><div><strong>Precios claros</strong><p>Conoce el valor completo antes de reservar.</p></div></article><article><span className="service-icon">⌖</span><div><strong>Te ayudamos con la ruta</strong><p>Compara peajes si prefieres llevar tu carro.</p></div></article></section>
  </>;
}

function SearchPanel({ search, setSearch, onSearch, compact = false }: { search: SearchState; setSearch: Dispatch<SetStateAction<SearchState>>; onSearch: () => void; compact?: boolean }) {
  const [peopleOpen, setPeopleOpen] = useState(false);
  const update = (partial: Partial<SearchState>) => setSearch((current) => ({ ...current, ...partial }));
  const passengerSummary = `${search.adults} adulto${search.adults === 1 ? "" : "s"}${search.childrenAges.length ? ` · ${search.childrenAges.length} niño${search.childrenAges.length === 1 ? "" : "s"}` : ""}${search.babies ? ` · ${search.babies} bebé${search.babies === 1 ? "" : "s"}` : ""}`;
  const changeCount = (key: "adults" | "babies", delta: number) => update({ [key]: Math.max(key === "adults" ? 1 : 0, search[key] + delta) });
  const changeChildren = (delta: number) => update({ childrenAges: delta > 0 ? [...search.childrenAges, 6] : search.childrenAges.slice(0,-1) });
  const changePets = (delta: number) => update({ pets: delta > 0 ? [...search.pets, "Pequeña"] : search.pets.slice(0,-1) });

  return <div className={`search-card ${compact ? "floating" : ""}`}>
    <div className="search-card-top"><div className="search-tabs"><button className="active">Paquetes</button><button>Solo hotel</button></div><span>Soporte de viaje incluido</span></div>
    <div className="search-grid wide">
      <label className="field"><span>Origen</span><select value={search.origin} onChange={(event) => update({ origin:event.target.value })}><option>Bogotá</option><option>Medellín</option><option>Cali</option><option>Bucaramanga</option></select></label>
      <label className="field"><span>Destino</span><select value={search.destination} onChange={(event) => update({ destination:event.target.value })}><option>Cartagena</option><option>San Andrés</option><option>Medellín</option><option>Eje Cafetero</option><option>Santa Marta</option><option>Barichara</option><option>Amazonas</option><option>Neiva</option></select></label>
      <label className="field"><span>Ida</span><input type="date" value={search.startDate} onChange={(event) => update({ startDate:event.target.value })}/></label>
      <label className="field"><span>Vuelta</span><input type="date" min={search.startDate} value={search.endDate} onChange={(event) => update({ endDate:event.target.value })}/></label>
      <button className="field passenger-field" onClick={() => setPeopleOpen(!peopleOpen)}><span>Viajeros</span><strong>{passengerSummary}</strong></button>
    </div>
    {peopleOpen && <div className="people-popover">
      <Counter label="Adultos" detail="13 años o más" value={search.adults} onMinus={() => changeCount("adults",-1)} onPlus={() => changeCount("adults",1)}/>
      <Counter label="Niños" detail="2 a 12 años" value={search.childrenAges.length} onMinus={() => changeChildren(-1)} onPlus={() => changeChildren(1)}/>
      {search.childrenAges.map((age,index) => <label className="age-field" key={index}>Edad del niño {index+1}<select value={age} onChange={(event) => update({ childrenAges:search.childrenAges.map((item,i) => i === index ? Number(event.target.value) : item) })}>{Array.from({length:11},(_,i) => i+2).map(item => <option key={item}>{item}</option>)}</select></label>)}
      <Counter label="Bebés" detail="0 a 23 meses" value={search.babies} onMinus={() => changeCount("babies",-1)} onPlus={() => changeCount("babies",1)}/>
      <Counter label="Mascotas" detail="Viajan con condiciones especiales" value={search.pets.length} onMinus={() => changePets(-1)} onPlus={() => changePets(1)}/>
      {search.pets.map((size,index) => <label className="age-field" key={index}>Tamaño mascota {index+1}<select value={size} onChange={(event) => update({ pets:search.pets.map((item,i) => i === index ? event.target.value as SearchState["pets"][number] : item) })}><option>Pequeña</option><option>Mediana</option><option>Grande</option></select></label>)}
      <button className="popover-done" onClick={() => setPeopleOpen(false)}>Listo</button>
    </div>}
    <div className="travel-row"><span>¿Cómo viajas?</span><div className="travel-options">{(["bus","car","plane"] as TravelMode[]).map((mode) => <button key={mode} className={search.travelMode === mode ? "selected" : ""} onClick={() => update({travelMode:mode})}>{modeName(mode)}</button>)}</div><div className="pet-summary">{search.pets.length ? `🐾 ${search.pets.length} mascota${search.pets.length > 1 ? "s" : ""}` : "Sin mascotas"}</div><button className="search-button" onClick={onSearch}>Buscar viajes <span>→</span></button></div>
    {search.travelMode === "car" && <div className="route-teaser"><strong>Ruta inteligente activada</strong><span>Compararemos peajes, combustible, tiempo y ahorro.</span></div>}
  </div>;
}

function Counter({ label, detail, value, onMinus, onPlus }: { label: string; detail: string; value: number; onMinus: () => void; onPlus: () => void }) {
  return <div className="counter-row"><div><strong>{label}</strong><small>{detail}</small></div><div><button onClick={onMinus} aria-label={`Quitar ${label}`}>−</button><span>{value}</span><button onClick={onPlus} aria-label={`Agregar ${label}`}>+</button></div></div>;
}

function ResultsPage({ packages, search, setSearch, onSearch, filters, setFilters, favorites, onFavorite, onView, onReserve }: { packages: TravelPackage[]; search: SearchState; setSearch: Dispatch<SetStateAction<SearchState>>; onSearch: () => void; filters: Filters; setFilters: Dispatch<SetStateAction<Filters>>; favorites: number[]; onFavorite: (id: number) => void; onView: (item: TravelPackage) => void; onReserve: (item: TravelPackage) => void }) {
  const filtered = useMemo(() => packages.filter((item) => item.price <= filters.maxPrice && item.stars >= filters.stars && (!filters.breakfast || item.breakfast) && (!filters.freeCancellation || item.freeCancellation) && (!filters.petFriendly || item.petFriendly)), [packages, filters]);
  return <div className="results-page">
    <section className="results-search"><div className="content-section"><span className="eyebrow">ENCUENTRA TU VIAJE</span><h1>{search.destination}, a tu manera</h1><p>{search.startDate} → {search.endDate} · {modeName(search.travelMode)}</p><SearchPanel search={search} setSearch={setSearch} onSearch={onSearch}/></div></section>
    <div className="content-section results-layout"><aside className="filters-panel"><div className="filter-title"><h2>Filtrar resultados</h2><button onClick={() => setFilters({maxPrice:3500000,stars:0,breakfast:false,freeCancellation:false,petFriendly:search.pets.length>0})}>Limpiar</button></div>{search.pets.length > 0 && <div className="auto-filter"><span>🐾</span><div><strong>Pet Friendly activo</strong><small>Porque viajas con {search.pets.length} mascota{search.pets.length > 1 ? "s" : ""}</small></div></div>}<label className="range-filter"><span>Precio máximo <strong>{currency(filters.maxPrice)}</strong></span><input type="range" min="700000" max="3500000" step="100000" value={filters.maxPrice} onChange={(event) => setFilters(current => ({...current,maxPrice:Number(event.target.value)}))}/></label><div className="filter-group"><span>Categoría del hotel</span><div className="star-buttons">{[0,3,4,5].map(value => <button key={value} className={filters.stars === value ? "active" : ""} onClick={() => setFilters(current => ({...current,stars:value}))}>{value === 0 ? "Todas" : `${value}★`}</button>)}</div></div><label className="check-filter"><input type="checkbox" checked={filters.breakfast} onChange={(event) => setFilters(current => ({...current,breakfast:event.target.checked}))}/><span>Incluye desayuno</span></label><label className="check-filter"><input type="checkbox" checked={filters.freeCancellation} onChange={(event) => setFilters(current => ({...current,freeCancellation:event.target.checked}))}/><span>Cancelación gratis</span></label><label className="check-filter"><input type="checkbox" checked={filters.petFriendly} onChange={(event) => setFilters(current => ({...current,petFriendly:event.target.checked}))}/><span>Solo Pet Friendly</span></label></aside>
      <section className="results-list"><div className="results-heading"><div><span>{filtered.length} opciones encontradas</span><h2>Paquetes para {search.destination}</h2></div><select aria-label="Ordenar resultados"><option>Recomendados</option><option>Menor precio</option><option>Mejor calificación</option></select></div>{filtered.map(item => <PackageCard key={item.id} item={item} horizontal favorite={favorites.includes(item.id)} onFavorite={() => onFavorite(item.id)} onView={() => onView(item)} onReserve={() => onReserve(item)} />)}{filtered.length === 0 && <EmptyState title="No encontramos paquetes" message="Prueba ampliando el precio o quitando alguno de los filtros."/>}</section></div>
  </div>;
}

function PackageCard({ item, horizontal = false, favorite, onFavorite, onView, onReserve }: { item: TravelPackage; horizontal?: boolean; favorite: boolean; onFavorite: () => void; onView: () => void; onReserve: () => void }) {
  return <article className={`package-card ${horizontal ? "horizontal" : ""}`}><div className="card-image"><img src={item.image} alt={item.name}/><span>{item.petFriendly ? "Pet Friendly" : item.breakfast ? "Desayuno incluido" : item.category}</span><button className={favorite ? "saved" : ""} onClick={onFavorite} aria-label={`${favorite ? "Quitar" : "Guardar"} ${item.name}`}>{favorite ? "♥" : "♡"}</button></div><div className="card-body"><div className="card-meta"><span>{item.department}</span><span>★ {item.rating}</span></div><h3>{item.name}</h3><p>{item.description}</p><div className="feature-line"><span>{item.days} días · {item.nights} noches</span>{item.freeCancellation && <span>Cancelación gratis</span>}</div><div className="card-price"><span>Precio total desde<small>por adulto</small></span><strong>{currency(item.price)}</strong></div><div className="card-actions"><button className="secondary-button" onClick={onView}>Ver detalles</button><button className="primary-button" onClick={onReserve}>Reservar</button></div></div></article>;
}

function DetailPage({ travelPackage, search, favorite, onFavorite, onReserve }: { travelPackage: TravelPackage; search: SearchState; favorite: boolean; onFavorite: () => void; onReserve: () => void }) {
  const rooms = Math.max(1, Math.ceil((search.adults + search.childrenAges.length) / 3));
  return <div className="detail-page"><section className="detail-hero content-section"><div className="breadcrumb">Inicio / Paquetes / <strong>{travelPackage.name}</strong></div><div className="detail-title"><div><div className="tag-row"><span className="tag aqua">{travelPackage.category}</span>{travelPackage.petFriendly && <span className="tag coral">Pet Friendly</span>}</div><h1>{travelPackage.name}</h1><p>📍 {travelPackage.destination}, {travelPackage.department} · ★ {travelPackage.rating} ({86 + travelPackage.id * 7} reseñas)</p></div><button className={`favorite-large ${favorite ? "saved" : ""}`} onClick={onFavorite}>{favorite ? "♥ Guardado" : "♡ Guardar"}</button></div><div className="gallery"><img className="gallery-main" src={travelPackage.gallery[0]} alt={travelPackage.destination}/><img src={travelPackage.gallery[1]} alt="Experiencia incluida"/><img src={travelPackage.gallery[2]} alt="Paisaje cercano"/></div></section>
    <div className="content-section detail-layout"><div className="detail-content"><section className="detail-block"><span className="eyebrow dark">TU EXPERIENCIA</span><h2>Una escapada para recordar</h2><p className="lead">{travelPackage.description}</p><div className="benefit-grid"><article><span>◷</span><strong>{travelPackage.days} días</strong><small>{travelPackage.nights} noches</small></article><article><span>⌂</span><strong>{travelPackage.hotel}</strong><small>{travelPackage.stars} estrellas</small></article><article><span>☕</span><strong>{travelPackage.breakfast ? "Desayuno incluido" : "Plan flexible"}</strong><small>Según itinerario</small></article><article><span>✓</span><strong>Asistencia 24/7</strong><small>Durante todo el viaje</small></article></div></section>
      <section className="detail-block"><span className="eyebrow dark">DÍA A DÍA</span><h2>Itinerario del viaje</h2><div className="timeline">{travelPackage.itinerary.map(item => <article key={item.day}><span>{String(item.day).padStart(2,"0")}</span><div><small>DÍA {item.day}</small><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div></section>
      <section className="detail-block"><div className="included-grid"><div><h3>Lo que incluye</h3>{travelPackage.included.map(item => <p key={item}><span className="yes">✓</span>{item}</p>)}</div><div><h3>No incluye</h3>{travelPackage.excluded.map(item => <p key={item}><span className="no">×</span>{item}</p>)}</div></div></section>
      <section className="detail-block"><span className="eyebrow dark">DISTRIBUCIÓN</span><h2>Habitaciones recomendadas</h2><div className="room-table"><div className="room-row header"><span>Habitación</span><span>Ocupación</span><span>Condiciones</span></div>{Array.from({length:rooms},(_,index) => <div className="room-row" key={index}><span><strong>Habitación {index+1}</strong><small>Estándar familiar</small></span><span>{index === 0 ? `${Math.min(search.adults,2)} adultos${search.childrenAges.length ? ` · ${Math.min(search.childrenAges.length,1)} niño` : ""}` : `${Math.max(search.adults-2,1)} adulto${search.babies ? ` · ${search.babies} bebé` : ""}`}</span><span>Desayuno {travelPackage.breakfast ? "incluido" : "opcional"}</span></div>)}</div></section>
      <section className="detail-block policies"><article><span>👶</span><div><h3>Política para bebés</h3><p>Los bebés de 0 a 23 meses no pagan alojamiento. Cuna sujeta a disponibilidad y solicitud previa.</p></div></article><article><span>🐾</span><div><h3>Política para mascotas</h3><p>{travelPackage.petFriendly ? `Acepta mascotas. Suplemento de ${currency(travelPackage.petFee)} por estadía; incluye kit de bienvenida.` : "Este alojamiento no recibe mascotas. Te mostramos alternativas Pet Friendly en resultados."}</p></div></article></section>
      {search.travelMode === "car" && <RouteComparison destination={travelPackage.destination} />}
    </div><aside className="booking-summary"><span>Precio total desde</span><strong>{currency(travelPackage.price * search.adults)}</strong><small>Para {search.adults} adulto{search.adults > 1 ? "s" : ""} · impuestos incluidos</small><hr/><p><b>{search.startDate}</b> → <b>{search.endDate}</b></p><p>{search.adults} adultos · {search.childrenAges.length} niños · {search.babies} bebés</p>{search.pets.length > 0 && <p>🐾 {search.pets.length} mascota{search.pets.length > 1 ? "s" : ""}</p>}<p>{modeName(search.travelMode)}</p><button className="primary-button large" onClick={onReserve}>Continuar con la reserva</button><em>Cancelación {travelPackage.freeCancellation ? "gratis hasta 7 días antes" : "según condiciones del plan"}</em></aside></div>
  </div>;
}

function RouteComparison({ destination }: { destination: string }) {
  const routes = ROUTES[destination] || ROUTES.Cartagena;
  const saving = routes[0].tollCost + routes[0].fuel - routes[1].tollCost - routes[1].fuel;
  return <section className="detail-block route-comparison"><span className="eyebrow dark">COTIZADOR DE PEAJES</span><h2>De Bogotá a {destination}</h2><div className="route-map"><div className="map-point start"><span>B</span><strong>Bogotá</strong></div><div className="road-line"><i></i><i></i><i></i><i></i></div><div className="map-point end"><span>M</span><strong>{destination}</strong></div></div><div className="route-cards">{routes.map((route,index) => <article className={index === 1 ? "recommended" : ""} key={route.name}>{index === 1 && <b className="route-badge">Recomendada</b>}<h3>{route.name}</h3><div><span>Distancia<strong>{route.distance} km</strong></span><span>Tiempo<strong>{route.duration}</strong></span><span>Peajes<strong>{route.tolls} · {currency(route.tollCost)}</strong></span><span>Combustible<strong>{currency(route.fuel)}</strong></span></div><footer><span>Total estimado</span><strong>{currency(route.tollCost + route.fuel)}</strong></footer></article>)}</div><p className="saving-note">Ahorras <strong>{currency(saving)}</strong> con la ruta ahorradora.</p></section>;
}

function FavoritesPage({ packages, favorites, onFavorite, onView, onReserve, navigate }: { packages: TravelPackage[]; favorites: number[]; onFavorite: (id: number) => void; onView: (item: TravelPackage) => void; onReserve: (item: TravelPackage) => void; navigate: (page: Page) => void }) {
  return <div className="simple-page content-section"><div className="page-heading"><span className="eyebrow dark">TU PRÓXIMA AVENTURA</span><h1>Tus favoritos</h1><p>Guarda, compara y vuelve cuando estés lista para viajar.</p></div>{packages.length ? <div className="package-grid">{packages.map(item => <PackageCard key={item.id} item={item} favorite={favorites.includes(item.id)} onFavorite={() => onFavorite(item.id)} onView={() => onView(item)} onReserve={() => onReserve(item)}/>)}</div> : <EmptyState title="Aún no tienes favoritos" message="Explora nuestros paquetes y guarda los que te hagan soñar." action="Explorar paquetes" onAction={() => navigate("results")}/>}</div>;
}

function BookingPage({ travelPackage, search, onBack, onConfirm }: { travelPackage: TravelPackage; search: SearchState; onBack: () => void; onConfirm: (reservation: Reservation) => void }) {
  const [payment, setPayment] = useState("PSE");
  const [petName, setPetName] = useState("");
  const [crib, setCrib] = useState(search.babies > 0);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const peopleTotal = travelPackage.price * search.adults + Math.round(travelPackage.price * .65) * search.childrenAges.length;
  const petTotal = travelPackage.petFriendly ? travelPackage.petFee * search.pets.length : 0;
  const transport = search.travelMode === "plane" ? 420000 * (search.adults + search.childrenAges.length) : search.travelMode === "bus" ? 150000 * (search.adults + search.childrenAges.length) : 0;
  const subtotal = peopleTotal + petTotal + transport;
  const discount = couponApplied ? Math.round(subtotal * .1) : 0;
  const total = subtotal - discount;

  const confirm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onConfirm({ id:`MV-${String(Date.now()).slice(-5)}`, packageName:travelPackage.name, destination:travelPackage.destination, startDate:search.startDate, endDate:search.endDate, travelers:`${search.adults} adultos · ${search.childrenAges.length} niños · ${search.babies} bebés${search.pets.length ? ` · ${search.pets.length} mascota` : ""}`, travelMode:search.travelMode, status:"Confirmada", total, petName:petName || undefined });
  };

  return <div className="booking-page"><div className="content-section"><button className="back-button" onClick={onBack}>← Volver al paquete</button><div className="booking-heading"><span className="eyebrow dark">RESERVA SEGURA</span><h1>Ya casi comienza tu viaje</h1><div className="steps"><span className="done">1</span><i></i><span className="done">2</span><i></i><span className="active">3</span><small>Viajeros</small><small>Servicios</small><small>Pago</small></div></div><form className="booking-layout" onSubmit={confirm}><div className="booking-forms"><section className="form-card"><div className="form-card-title"><span>01</span><div><h2>Datos de contacto</h2><p>Te enviaremos aquí el voucher y las novedades.</p></div></div><div className="form-grid"><label>Nombre completo<input required defaultValue="Sofía Munevar"/></label><label>Documento<input required placeholder="Número de documento"/></label><label>Correo electrónico<input required type="email" defaultValue="sofia@correo.com"/></label><label>Celular<input required type="tel" placeholder="300 000 0000"/></label></div></section>
      <section className="form-card"><div className="form-card-title"><span>02</span><div><h2>Detalles de los viajeros</h2><p>Información necesaria para preparar tu estadía.</p></div></div>{search.childrenAges.map((age,index) => <div className="traveler-line" key={index}><strong>Niño {index+1}</strong><span>{age} años</span><input required placeholder="Nombre completo"/></div>)}{search.babies > 0 && <label className="option-card"><input type="checkbox" checked={crib} onChange={(event) => setCrib(event.target.checked)}/><span>Solicitar cuna para {search.babies} bebé{search.babies > 1 ? "s" : ""}<small>Sin costo, sujeta a disponibilidad</small></span></label>}{search.pets.length > 0 && <label>Nombre de la mascota<input required value={petName} onChange={(event) => setPetName(event.target.value)} placeholder="Ej. Luna"/></label>}{search.travelMode === "car" && <div className="car-confirm"><span>✓</span><div><strong>Viajas en carro propio</strong><p>No reservaremos sillas en el bus. Tu cotización de peajes se conserva en el resumen.</p></div></div>}</section>
      <section className="form-card"><div className="form-card-title"><span>03</span><div><h2>Forma de pago</h2><p>Selecciona cómo quieres asegurar tu viaje.</p></div></div><div className="payment-options">{["PSE","Nequi","Tarjeta","Abono 30%"].map(item => <label className={payment === item ? "selected" : ""} key={item}><input type="radio" name="payment" value={item} checked={payment === item} onChange={() => setPayment(item)}/><span>{item === "PSE" ? "P" : item === "Nequi" ? "N" : item === "Tarjeta" ? "▣" : "%"}</span><strong>{item}</strong></label>)}</div>{payment === "Tarjeta" && <div className="form-grid card-fields"><label>Número de tarjeta<input inputMode="numeric" placeholder="0000 0000 0000 0000"/></label><label>Vencimiento<input placeholder="MM/AA"/></label></div>}<label className="terms"><input required type="checkbox"/> Acepto los términos, políticas de cancelación y tratamiento de datos.</label></section></div>
      <aside className="checkout-summary"><img src={travelPackage.image} alt=""/><span className="tag aqua">{travelPackage.destination}</span><h2>{travelPackage.name}</h2><p>{search.startDate} → {search.endDate}</p><div className="summary-lines"><span>Plan para viajeros <b>{currency(peopleTotal)}</b></span>{petTotal > 0 && <span>Suplemento mascotas <b>{currency(petTotal)}</b></span>}<span>{modeName(search.travelMode)} <b>{transport ? currency(transport) : "Sin cargo"}</b></span>{discount > 0 && <span className="discount">Cupón MAREVA10 <b>− {currency(discount)}</b></span>}</div><div className="coupon-field"><input value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="Código de cupón"/><button type="button" onClick={() => setCouponApplied(coupon.trim().toUpperCase() === "MAREVA10")}>Aplicar</button></div><div className="summary-total"><span>Total</span><strong>{currency(total)}</strong><small>Impuestos incluidos</small></div><button className="primary-button large" type="submit">Pagar con {payment}</button><p className="secure-note">Pago protegido · Confirmación inmediata</p></aside></form></div></div>;
}

function AuthPage({ mode, onSwitch, onSuccess }: { mode: "login" | "register"; onSwitch: () => void; onSuccess: (name: string) => void }) {
  const [name, setName] = useState("Sofía Munevar");
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); onSuccess(name || "Viajera Mareva"); };
  return <div className="auth-page"><div className="auth-photo"><div><span className="eyebrow">VIAJA CON MAREVA</span><h1>Tu colección de<br/>recuerdos comienza hoy.</h1><p>Guarda favoritos, administra tus reservas y recibe recomendaciones para ti.</p></div></div><div className="auth-panel"><button className="brand auth-brand"><span className="brand-mark">M</span><span><strong>MAREVA</strong><small>Viaja a tu manera</small></span></button><form onSubmit={submit}><span className="eyebrow dark">{mode === "login" ? "QUÉ BUENO VERTE" : "ÚNETE A LA AVENTURA"}</span><h2>{mode === "login" ? "Inicia sesión" : "Crea tu cuenta"}</h2><p>{mode === "login" ? "Continúa planeando tu próxima escapada." : "Toda Colombia estará a un clic de distancia."}</p>{mode === "register" && <label>Nombre completo<input required value={name} onChange={(event) => setName(event.target.value)}/></label>}<label>Correo electrónico<input required type="email" defaultValue="sofia@correo.com"/></label><label>Contraseña<input required type="password" defaultValue="mareva2026"/></label>{mode === "login" && <div className="form-links"><label><input type="checkbox"/> Recordarme</label><button type="button">Olvidé mi contraseña</button></div>}<button className="primary-button large" type="submit">{mode === "login" ? "Entrar a mi cuenta" : "Crear mi cuenta"}</button><div className="auth-switch">{mode === "login" ? "¿Aún no tienes cuenta?" : "¿Ya tienes una cuenta?"}<button type="button" onClick={onSwitch}>{mode === "login" ? "Regístrate" : "Inicia sesión"}</button></div></form></div></div>;
}

function ProfilePage({ name, signedIn, reservations, favorites, onLogin, onView }: { name: string; signedIn: boolean; reservations: Reservation[]; favorites: TravelPackage[]; onLogin: () => void; onView: (item: TravelPackage) => void }) {
  const [tab, setTab] = useState("reservations");
  if (!signedIn) return <div className="simple-page content-section"><EmptyState title="Tu espacio de viajera" message="Inicia sesión para consultar reservas, favoritos y datos personales." action="Iniciar sesión" onAction={onLogin}/></div>;
  return <div className="profile-page"><div className="profile-cover"><div className="content-section"><span>SM</span><div><small>VIAJERA MAREVA</small><h1>Hola, {name.split(" ")[0]}</h1><p>Nivel Aventurera · 1.240 puntos</p></div></div></div><div className="content-section profile-layout"><aside className="profile-menu"><button className={tab === "reservations" ? "active" : ""} onClick={() => setTab("reservations")}>Mis reservas <span>{reservations.length}</span></button><button className={tab === "favorites" ? "active" : ""} onClick={() => setTab("favorites")}>Mis favoritos <span>{favorites.length}</span></button><button className={tab === "data" ? "active" : ""} onClick={() => setTab("data")}>Mis datos</button></aside><section className="profile-content">{tab === "reservations" && <><div className="profile-heading"><span className="eyebrow dark">PRÓXIMOS VIAJES</span><h2>Mis reservas</h2></div>{reservations.length ? reservations.map(item => <article className="reservation-ticket" key={item.id}><div className="ticket-side"><span>MAREVA</span><strong>{item.id}</strong><small>{item.status}</small></div><div className="ticket-main"><div><span>DESTINO</span><h3>{item.destination}</h3><p>{item.packageName}</p></div><div className="ticket-data"><span><small>FECHAS</small><strong>{item.startDate} → {item.endDate}</strong></span><span><small>VIAJEROS</small><strong>{item.travelers}</strong></span><span><small>VIAJE</small><strong>{modeName(item.travelMode)}</strong></span></div><div className="ticket-actions"><button className="secondary-button">Descargar voucher</button><a className="whatsapp-button" href="https://wa.me/573001234567?text=Hola%20MAREVA%2C%20necesito%20ayuda%20con%20mi%20reserva" target="_blank" rel="noreferrer">WhatsApp</a></div></div></article>) : <EmptyState title="Aún no tienes viajes" message="Cuando reserves una experiencia aparecerá aquí con su voucher."/>}</>}{tab === "favorites" && <><div className="profile-heading"><span className="eyebrow dark">GUARDADOS</span><h2>Mis favoritos</h2></div>{favorites.length ? <div className="mini-favorites">{favorites.map(item => <button key={item.id} onClick={() => onView(item)}><img src={item.image} alt=""/><span><strong>{item.name}</strong><small>{currency(item.price)}</small></span><b>→</b></button>)}</div> : <EmptyState title="Sin favoritos todavía" message="Usa el corazón de cada paquete para guardarlo aquí."/>}</>}{tab === "data" && <><div className="profile-heading"><span className="eyebrow dark">PERFIL</span><h2>Mis datos</h2></div><form className="form-card profile-form"><div className="form-grid"><label>Nombre completo<input defaultValue={name}/></label><label>Correo<input type="email" defaultValue="sofia@correo.com"/></label><label>Celular<input defaultValue="300 000 0000"/></label><label>Ciudad<select defaultValue="Bogotá"><option>Bogotá</option><option>Medellín</option><option>Cali</option></select></label></div><button className="primary-button" type="button">Guardar cambios</button></form></>}</section></div></div>;
}

function FavoritesDrawer({ packages, onClose, onView, onAll }: { packages: TravelPackage[]; onClose: () => void; onView: (item: TravelPackage) => void; onAll: () => void }) {
  return <div className="drawer-backdrop" onMouseDown={onClose}><aside className="side-drawer" onMouseDown={(event) => event.stopPropagation()}><header><div><span>TU COLECCIÓN</span><h2>Tus favoritos</h2></div><button onClick={onClose}>×</button></header><div className="drawer-list">{packages.length ? packages.map(item => <button key={item.id} onClick={() => onView(item)}><img src={item.image} alt=""/><span><strong>{item.name}</strong><small>{item.destination} · {currency(item.price)}</small></span><b>→</b></button>) : <EmptyState title="Nada guardado aún" message="Toca el corazón de un paquete para verlo aquí."/>}</div>{packages.length > 0 && <footer><button className="primary-button large" onClick={onAll}>Ver todos mis favoritos</button></footer>}</aside></div>;
}

function NotificationDrawer({ notifications, onClose }: { notifications: TravelNotification[]; onClose: () => void }) {
  return <div className="drawer-backdrop" onMouseDown={onClose}><aside className="side-drawer notification-drawer" onMouseDown={(event) => event.stopPropagation()}><header><div><span>CENTRO DE VIAJE</span><h2>Notificaciones</h2></div><button onClick={onClose}>×</button></header><div className="notification-list">{notifications.map(item => <article className={item.kind} key={item.id}><div className="notification-stub"><span>MAREVA</span><b>{item.kind === "payment" ? "$" : item.kind === "favorite" ? "♥" : item.kind === "route" ? "↝" : "✈"}</b></div><div><small>{item.time}</small><h3>{item.title}</h3><p>{item.message}</p></div></article>)}</div></aside></div>;
}

function EmptyState({ title, message, action, onAction }: { title: string; message: string; action?: string; onAction?: () => void }) {
  return <div className="empty-state"><span>⌁</span><h2>{title}</h2><p>{message}</p>{action && <button className="primary-button" onClick={onAction}>{action}</button>}</div>;
}

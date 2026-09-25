import "./Favoritos.css";
import { PAQUETES, type Paquete } from "./Paquetes";

interface FavoritosProps {
  favoritos?: string[];
  cambiarFavorito: (slug: string) => void;
  mostrarMensaje: (titulo: string, mensaje: string) => void;
  seleccionarPaquete: (paquete: Paquete) => void;
}

function Favoritos({
  favoritos,
  cambiarFavorito,
  mostrarMensaje,
  seleccionarPaquete,
}: FavoritosProps) {
  const favoritosSeguros = Array.isArray(favoritos) ? favoritos : [];

  const paquetesFavoritos = PAQUETES.filter((paquete) =>
    favoritosSeguros.includes(paquete.slug)
  );

  return (
    <section className="favoritos-seccion">
      <div className="favoritos-encabezado">
        <span className="favoritos-etiqueta">
          MAREVA · MIS VIAJES FAVORITOS
        </span>

        <h1>
          Mis destinos <em>favoritos</em>
        </h1>

        <p>
          Guarda los destinos que más te gustan y vuelve a ellos cuando
          estés listo para vivir tu próxima aventura.
        </p>
      </div>

      {paquetesFavoritos.length > 0 ? (
        <>
          <div className="favoritos-resultados">
            <span>
              {paquetesFavoritos.length}{" "}
              {paquetesFavoritos.length === 1
                ? "destino guardado"
                : "destinos guardados"}
            </span>
          </div>

          <div className="favoritos-grid">
            {paquetesFavoritos.map((paquete) => (
              <article className="favorito-card" key={paquete.slug}>
                <div className="favorito-imagen-container">
                  <img
                    src={paquete.imagen}
                    alt={paquete.nombre}
                    className="favorito-imagen"
                  />

                  <button
                    type="button"
                    className="favorito-corazon"
                    onClick={() => cambiarFavorito(paquete.slug)}
                    aria-label={`Quitar ${paquete.nombre} de favoritos`}
                    title="Quitar de favoritos"
                  >
                    ♥
                  </button>
                </div>

                <div className="favorito-contenido">
                  <span className="favorito-categoria">
                    {paquete.categoria}
                  </span>

                  <h2>{paquete.nombre}</h2>

                  <div className="favorito-ubicacion">
                    <span className="ubicacion-icono">●</span>
                    <span>
                      {paquete.destino}, {paquete.departamento}
                    </span>
                  </div>

                  <div className="favorito-info">
                    <span>🕐 {paquete.duracion_dias} días</span>
                    <span className="info-separador">•</span>
                    <span>{paquete.duracion_noches} noches</span>
                  </div>

                  <p className="favorito-descripcion">
                    {paquete.descripcion}
                  </p>

                  <div className="favorito-footer">
                    <div className="favorito-precio">
                      <span>Desde</span>

                      <strong>
                        ${paquete.precio.toLocaleString("es-CO")}
                      </strong>

                      <small>por persona</small>
                    </div>

                    <button
                      type="button"
                      className="favorito-reservar"
                      onClick={() => seleccionarPaquete(paquete)}
                    >
                      Reservar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="favoritos-vacio">
          <div className="favoritos-vacio-icono">♡</div>

          <h2>Aún no tienes favoritos</h2>

          <p>
            Explora nuestros paquetes y guarda los destinos que más te
            gusten para encontrarlos fácilmente después.
          </p>
        </div>
      )}
    </section>
  );
}

export default Favoritos;


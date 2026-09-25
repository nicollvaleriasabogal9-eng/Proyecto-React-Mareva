import { useEffect, useState } from "react";
import axios from "axios";
import "./Alojamientos.css";

interface Alojamiento {
  id_alojamiento: number;
  nombre: string;
  ciudad: string;
  descripcion: string;
  estrellas: number;
  precio_noche: number;
  pet_friendly: boolean;
  disponible: boolean;
  fecha_registro: string;
}

interface AlojamientosProps {
  mostrarMensaje: (titulo: string, mensaje: string) => void;
}

interface FormularioAlojamiento {
  nombre: string;
  ciudad: string;
  descripcion: string;
  estrellas: number;
  precio_noche: string;
  pet_friendly: boolean;
  disponible: boolean;
}

const formularioInicial: FormularioAlojamiento = {
  nombre: "",
  ciudad: "",
  descripcion: "",
  estrellas: 3,
  precio_noche: "",
  pet_friendly: false,
  disponible: true,
};

function Alojamientos({ mostrarMensaje }: AlojamientosProps) {
  const [alojamientos, setAlojamientos] = useState<Alojamiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState<number | null>(null);
  const [formulario, setFormulario] =
    useState<FormularioAlojamiento>(formularioInicial);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarAlojamientos();
  }, []);

  const cargarAlojamientos = async () => {
    try {
      const respuesta = await axios.get(
        "http://127.0.0.1:5000/alojamientos"
      );

      setAlojamientos(respuesta.data);
    } catch (error) {
      console.error(error);

      mostrarMensaje(
        "Error",
        "No fue posible cargar los alojamientos."
      );
    } finally {
      setCargando(false);
    }
  };

  const formatoPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(precio);
  };

  const abrirNuevo = () => {
    setEditando(null);
    setFormulario(formularioInicial);
    setMostrarFormulario(true);
  };

  const abrirEditar = (alojamiento: Alojamiento) => {
    setEditando(alojamiento.id_alojamiento);

    setFormulario({
      nombre: alojamiento.nombre,
      ciudad: alojamiento.ciudad,
      descripcion: alojamiento.descripcion,
      estrellas: alojamiento.estrellas,
      precio_noche: String(alojamiento.precio_noche),
      pet_friendly: alojamiento.pet_friendly,
      disponible: alojamiento.disponible,
    });

    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    if (guardando) {
      return;
    }

    setMostrarFormulario(false);
    setEditando(null);
    setFormulario(formularioInicial);
  };

  const manejarCambio = (
    campo: keyof FormularioAlojamiento,
    valor: string | number | boolean
  ) => {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }));
  };

  const guardarAlojamiento = async () => {
    if (
      !formulario.nombre.trim() ||
      !formulario.ciudad.trim() ||
      !formulario.precio_noche
    ) {
      mostrarMensaje(
        "Campos obligatorios",
        "Debes completar el nombre, la ciudad y el precio por noche."
      );
      return;
    }

    const precio = Number(formulario.precio_noche);

    if (precio < 0 || Number.isNaN(precio)) {
      mostrarMensaje(
        "Precio inválido",
        "El precio por noche debe ser un número válido."
      );
      return;
    }

    if (
      formulario.estrellas < 1 ||
      formulario.estrellas > 5
    ) {
      mostrarMensaje(
        "Calificación inválida",
        "Las estrellas deben estar entre 1 y 5."
      );
      return;
    }

    const datos = {
      nombre: formulario.nombre.trim(),
      ciudad: formulario.ciudad.trim(),
      descripcion: formulario.descripcion.trim(),
      estrellas: formulario.estrellas,
      precio_noche: precio,
      pet_friendly: formulario.pet_friendly,
      disponible: formulario.disponible,
    };

    try {
      setGuardando(true);

      if (editando === null) {
        await axios.post(
          "http://127.0.0.1:5000/alojamientos",
          datos
        );

        mostrarMensaje(
          "Alojamiento creado",
          "El alojamiento se agregó correctamente."
        );
      } else {
        await axios.put(
          `http://127.0.0.1:5000/alojamientos/${editando}`,
          datos
        );

        mostrarMensaje(
          "Alojamiento actualizado",
          "Los cambios se guardaron correctamente."
        );
      }

      cerrarFormulario();
      await cargarAlojamientos();
    } catch (error: any) {
      console.error(error);

      const mensaje =
        error?.response?.data?.error ||
        "No fue posible guardar el alojamiento.";

      mostrarMensaje("Error", mensaje);
    } finally {
      setGuardando(false);
    }
  };

  const eliminarAlojamiento = async (
    alojamiento: Alojamiento
  ) => {
    const confirmar = window.confirm(
      `¿Estás segura de que quieres eliminar "${alojamiento.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    try {
      await axios.delete(
        `http://127.0.0.1:5000/alojamientos/${alojamiento.id_alojamiento}`
      );

      mostrarMensaje(
        "Alojamiento eliminado",
        `${alojamiento.nombre} fue eliminado correctamente.`
      );

      await cargarAlojamientos();
    } catch (error: any) {
      console.error(error);

      const mensaje =
        error?.response?.data?.error ||
        "No fue posible eliminar el alojamiento.";

      mostrarMensaje("Error", mensaje);
    }
  };

  return (
    <section className="alojamientos-page">
      <div className="alojamientos-encabezado">
        <div>
          <span className="alojamientos-etiqueta">
            ADMINISTRACIÓN MAREVA
          </span>

          <h1>Gestor de Alojamientos</h1>

          <p>
            Administra los hoteles y alojamientos disponibles
            para los viajeros de Mareva.
          </p>
        </div>

        <button
          className="btn-nuevo-alojamiento"
          onClick={abrirNuevo}
        >
          + Nuevo alojamiento
        </button>
      </div>

      <div className="alojamientos-resumen">
        <div className="alojamiento-stat">
          <span>🏨</span>

          <div>
            <strong>{alojamientos.length}</strong>
            <small>Total alojamientos</small>
          </div>
        </div>

        <div className="alojamiento-stat">
          <span>🐶</span>

          <div>
            <strong>
              {
                alojamientos.filter(
                  (a) => a.pet_friendly
                ).length
              }
            </strong>

            <small>Pet Friendly</small>
          </div>
        </div>

        <div className="alojamiento-stat">
          <span>✓</span>

          <div>
            <strong>
              {
                alojamientos.filter(
                  (a) => a.disponible
                ).length
              }
            </strong>

            <small>Disponibles</small>
          </div>
        </div>
      </div>

      {cargando ? (
        <div className="alojamientos-cargando">
          <div className="spinner"></div>
          <p>Cargando alojamientos...</p>
        </div>
      ) : alojamientos.length === 0 ? (
        <div className="alojamientos-vacio">
          <span>🏨</span>

          <h2>No hay alojamientos registrados</h2>

          <p>
            Cuando agregues alojamientos aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="alojamientos-grid">
          {alojamientos.map((alojamiento) => (
            <article
              className="alojamiento-card"
              key={alojamiento.id_alojamiento}
            >
              <div className="alojamiento-card-top">
                <div className="alojamiento-icono">
                  🏨
                </div>

                <span
                  className={
                    alojamiento.disponible
                      ? "estado disponible"
                      : "estado no-disponible"
                  }
                >
                  {alojamiento.disponible
                    ? "Disponible"
                    : "No disponible"}
                </span>
              </div>

              <div className="alojamiento-info">
                <h2>{alojamiento.nombre}</h2>

                <p className="alojamiento-ciudad">
                  📍 {alojamiento.ciudad}
                </p>

                <div className="estrellas">
                  {"★".repeat(alojamiento.estrellas)}
                  {"☆".repeat(
                    5 - alojamiento.estrellas
                  )}
                </div>

                <p className="alojamiento-descripcion">
                  {alojamiento.descripcion}
                </p>

                <div className="alojamiento-detalles">
                  <div>
                    <span>Precio por noche</span>

                    <strong>
                      {formatoPrecio(
                        alojamiento.precio_noche
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Mascotas</span>

                    <strong>
                      {alojamiento.pet_friendly
                        ? "🐶 Sí"
                        : "No"}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="alojamiento-acciones">
                <button
                  onClick={() =>
                    abrirEditar(alojamiento)
                  }
                >
                  ✏️ Editar
                </button>

                <button
                  className="btn-eliminar"
                  onClick={() =>
                    eliminarAlojamiento(alojamiento)
                  }
                >
                  🗑️ Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {mostrarFormulario && (
        <div
          className="alojamiento-modal-overlay"
          onClick={cerrarFormulario}
        >
          <div
            className="alojamiento-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="alojamiento-modal-header">
              <div>
                <span>
                  ADMINISTRACIÓN MAREVA
                </span>

                <h2>
                  {editando === null
                    ? "Nuevo alojamiento"
                    : "Editar alojamiento"}
                </h2>

                <p>
                  Completa la información del alojamiento.
                </p>
              </div>

              <button
                type="button"
                className="alojamiento-modal-cerrar"
                onClick={cerrarFormulario}
                disabled={guardando}
              >
                ×
              </button>
            </div>

            <div className="alojamiento-formulario">
              <div className="campo-alojamiento">
                <label>Nombre del alojamiento</label>

                <input
                  type="text"
                  value={formulario.nombre}
                  onChange={(e) =>
                    manejarCambio(
                      "nombre",
                      e.target.value
                    )
                  }
                  placeholder="Ej. Hotel Caribe Real"
                />
              </div>

              <div className="campo-alojamiento">
                <label>Ciudad</label>

                <input
                  type="text"
                  value={formulario.ciudad}
                  onChange={(e) =>
                    manejarCambio(
                      "ciudad",
                      e.target.value
                    )
                  }
                  placeholder="Ej. Cartagena"
                />
              </div>

              <div className="campo-alojamiento campo-completo">
                <label>Descripción</label>

                <textarea
                  value={formulario.descripcion}
                  onChange={(e) =>
                    manejarCambio(
                      "descripcion",
                      e.target.value
                    )
                  }
                  placeholder="Describe el alojamiento..."
                  rows={4}
                />
              </div>

              <div className="campo-alojamiento">
                <label>Estrellas</label>

                <select
                  value={formulario.estrellas}
                  onChange={(e) =>
                    manejarCambio(
                      "estrellas",
                      Number(e.target.value)
                    )
                  }
                >
                  <option value={1}>1 estrella</option>
                  <option value={2}>2 estrellas</option>
                  <option value={3}>3 estrellas</option>
                  <option value={4}>4 estrellas</option>
                  <option value={5}>5 estrellas</option>
                </select>
              </div>

              <div className="campo-alojamiento">
                <label>Precio por noche</label>

                <input
                  type="number"
                  min="0"
                  value={formulario.precio_noche}
                  onChange={(e) =>
                    manejarCambio(
                      "precio_noche",
                      e.target.value
                    )
                  }
                  placeholder="Ej. 280000"
                />
              </div>

              <div className="alojamiento-opciones">
                <label className="check-alojamiento">
                  <input
                    type="checkbox"
                    checked={formulario.pet_friendly}
                    onChange={(e) =>
                      manejarCambio(
                        "pet_friendly",
                        e.target.checked
                      )
                    }
                  />

                  <span>🐶 Pet Friendly</span>
                </label>

                <label className="check-alojamiento">
                  <input
                    type="checkbox"
                    checked={formulario.disponible}
                    onChange={(e) =>
                      manejarCambio(
                        "disponible",
                        e.target.checked
                      )
                    }
                  />

                  <span>✓ Disponible</span>
                </label>
              </div>
            </div>

            <div className="alojamiento-modal-acciones">
              <button
                type="button"
                className="btn-cancelar-alojamiento"
                onClick={cerrarFormulario}
                disabled={guardando}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn-guardar-alojamiento"
                onClick={guardarAlojamiento}
                disabled={guardando}
              >
                {guardando
                  ? "Guardando..."
                  : editando === null
                    ? "Crear alojamiento"
                    : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Alojamientos;

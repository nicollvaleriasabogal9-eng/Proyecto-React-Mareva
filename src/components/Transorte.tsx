import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Transporte.css";

interface Transporte {
  id_transporte: number;
  tipo: string;
  nombre: string;
  descripcion: string;
  precio: number;
  capacidad: number;
  sillas_disponibles: number;
  activo: boolean;
  fecha_actualizacion: string;
}

interface TransporteProps {
  mostrarMensaje: (titulo: string, mensaje: string) => void;
}

interface FormularioTransporte {
  tipo: string;
  nombre: string;
  descripcion: string;
  precio: string;
  capacidad: string;
  sillas_disponibles: string;
  activo: boolean;
}

const formularioInicial: FormularioTransporte = {
  tipo: "Bus agencia",
  nombre: "",
  descripcion: "",
  precio: "0",
  capacidad: "40",
  sillas_disponibles: "40",
  activo: true,
};

function Transporte({ mostrarMensaje }: TransporteProps) {
  const [transportes, setTransportes] = useState<Transporte[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<number | null>(null);
  const [formulario, setFormulario] =
    useState<FormularioTransporte>(formularioInicial);

  const cargarTransportes = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await axios.get(
        "http://127.0.0.1:5000/transportes"
      );

      const datos = Array.isArray(respuesta.data)
        ? respuesta.data
        : [];

      const transportesNormalizados: Transporte[] = datos.map(
        (transporte: any) => ({
          id_transporte: Number(transporte.id_transporte),
          tipo: transporte.tipo ?? "",
          nombre:
            transporte.nombre ??
            transporte.empresa ??
            "Transporte Mareva",
          descripcion: transporte.descripcion ?? "",
          precio: Number(transporte.precio ?? 0),
          capacidad: Number(transporte.capacidad ?? 0),
          sillas_disponibles: Number(
            transporte.sillas_disponibles ??
              transporte.capacidad ??
              0
          ),
          activo:
            transporte.activo === undefined ||
            transporte.activo === null
              ? true
              : Boolean(transporte.activo),
          fecha_actualizacion:
            transporte.fecha_actualizacion ?? "",
        })
      );

      setTransportes(transportesNormalizados);
    } catch (error) {
      console.error(error);
      setError("No se pudieron cargar los transportes.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarTransportes();
  }, []);

  const abrirNuevo = () => {
    setEditando(null);
    setFormulario({ ...formularioInicial });
    setModalAbierto(true);
  };

  const abrirEditar = (transporte: Transporte) => {
    setEditando(transporte.id_transporte);

    setFormulario({
      tipo: transporte.tipo ?? "Bus agencia",
      nombre: transporte.nombre ?? "",
      descripcion: transporte.descripcion ?? "",
      precio: String(transporte.precio ?? 0),
      capacidad: String(transporte.capacidad ?? 0),
      sillas_disponibles: String(
        transporte.sillas_disponibles ?? transporte.capacidad ?? 0
      ),
      activo:
        transporte.activo === undefined ||
        transporte.activo === null
          ? true
          : transporte.activo,
    });

    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEditando(null);
    setFormulario({ ...formularioInicial });
  };

  const cambiarCampo = (
    campo: keyof FormularioTransporte,
    valor: string | boolean
  ) => {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  };

  const guardarTransporte = async (e: React.FormEvent) => {
    e.preventDefault();

    const precio = Number(formulario.precio);
    const capacidad = Number(formulario.capacidad);
    const sillasDisponibles = Number(
      formulario.sillas_disponibles
    );

    if (!formulario.nombre.trim()) {
      mostrarMensaje(
        "Campo requerido",
        "Ingresa el nombre del transporte."
      );
      return;
    }

    if (!Number.isFinite(precio) || precio < 0) {
      mostrarMensaje(
        "Precio inválido",
        "El precio debe ser un número válido y no puede ser negativo."
      );
      return;
    }

    if (!Number.isFinite(capacidad) || capacidad < 0) {
      mostrarMensaje(
        "Capacidad inválida",
        "La capacidad debe ser un número válido y no puede ser negativa."
      );
      return;
    }

    if (
      !Number.isFinite(sillasDisponibles) ||
      sillasDisponibles < 0
    ) {
      mostrarMensaje(
        "Sillas inválidas",
        "Las sillas disponibles deben ser un número válido y no pueden ser negativas."
      );
      return;
    }

    if (sillasDisponibles > capacidad) {
      mostrarMensaje(
        "Cantidad inválida",
        "Las sillas disponibles no pueden superar la capacidad."
      );
      return;
    }

    const datos = {
      tipo: formulario.tipo.trim(),
      nombre: formulario.nombre.trim(),
      descripcion: formulario.descripcion.trim(),
      precio,
      capacidad,
      sillas_disponibles: sillasDisponibles,
      activo: formulario.activo,
    };

    try {
      if (editando !== null) {
        await axios.put(
          "http://127.0.0.1:5000/transportes",
          {
            id_transporte: editando,
            ...datos,
          }
        );

        mostrarMensaje(
          "Transporte actualizado",
          "El transporte se actualizó correctamente."
        );
      } else {
        await axios.post(
          "http://127.0.0.1:5000/transportes",
          datos
        );

        mostrarMensaje(
          "Transporte creado",
          "El transporte se agregó correctamente."
        );
      }

      cerrarModal();
      await cargarTransportes();
    } catch (error: any) {
      console.error(error);

      const mensaje =
        error?.response?.data?.error ||
        "No fue posible guardar el transporte.";

      mostrarMensaje("Error", mensaje);
    }
  };

  const eliminarTransporte = async (id: number) => {
    const confirmar = window.confirm(
      "¿Estás segura de que deseas eliminar este transporte?"
    );

    if (!confirmar) {
      return;
    }

    try {
      await axios.delete(
        "http://127.0.0.1:5000/transportes",
        {
          data: {
            id_transporte: id,
          },
        }
      );

      mostrarMensaje(
        "Transporte eliminado",
        "El transporte se eliminó correctamente."
      );

      await cargarTransportes();
    } catch (error: any) {
      console.error(error);

      const mensaje =
        error?.response?.data?.error ||
        "No fue posible eliminar el transporte.";

      mostrarMensaje("Error", mensaje);
    }
  };

  const transportesFiltrados = transportes.filter(
    (transporte) => {
      const texto = busqueda.toLowerCase();

      const nombre = String(
        transporte.nombre ?? ""
      ).toLowerCase();

      const tipo = String(
        transporte.tipo ?? ""
      ).toLowerCase();

      const descripcion = String(
        transporte.descripcion ?? ""
      ).toLowerCase();

      return (
        nombre.includes(texto) ||
        tipo.includes(texto) ||
        descripcion.includes(texto)
      );
    }
  );

  const formatearPrecio = (precio: number) => {
    const precioSeguro = Number(precio);

    if (!Number.isFinite(precioSeguro) || precioSeguro === 0) {
      return "Gratis";
    }

    return precioSeguro.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });
  };

  return (
    <section className="transporte-page">
      <div className="transporte-encabezado">
        <div>
          <span className="transporte-etiqueta">
            GESTIÓN ADMINISTRATIVA
          </span>

          <h1>Transporte 🚍</h1>

          <p>
            Administra buses, vuelos y vehículos propios disponibles
            para los viajeros de Mareva.
          </p>
        </div>

        <button
          className="btn-nuevo-transporte"
          onClick={abrirNuevo}
        >
          + Agregar transporte
        </button>
      </div>

      <div className="transporte-herramientas">
        <div className="transporte-buscador">
          <span>🔎</span>

          <input
            type="text"
            placeholder="Buscar por nombre, tipo o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="transporte-contador">
          {transportesFiltrados.length} transporte
          {transportesFiltrados.length !== 1 ? "s" : ""}
        </div>
      </div>

      {cargando ? (
        <div className="transporte-estado">
          <div className="transporte-spinner"></div>
          <p>Cargando transportes...</p>
        </div>
      ) : error ? (
        <div className="transporte-error">
          <strong>⚠️ {error}</strong>

          <button onClick={cargarTransportes}>
            Intentar nuevamente
          </button>
        </div>
      ) : transportesFiltrados.length === 0 ? (
        <div className="transporte-vacio">
          <div>🚍</div>

          <h2>No hay transportes</h2>

          <p>
            No encontramos transportes con la búsqueda realizada.
          </p>
        </div>
      ) : (
        <div className="transportes-grid">
          {transportesFiltrados.map((transporte) => (
            <article
              className={`transporte-card ${
                !transporte.activo
                  ? "transporte-inactivo"
                  : ""
              }`}
              key={transporte.id_transporte}
            >
              <div className="transporte-card-superior">
                <div className="transporte-icono">
                  {transporte.tipo === "Avion"
                    ? "✈️"
                    : transporte.tipo === "Carro propio"
                    ? "🚗"
                    : "🚌"}
                </div>

                <span
                  className={`transporte-estado-badge ${
                    transporte.activo
                      ? "activo"
                      : "inactivo"
                  }`}
                >
                  {transporte.activo
                    ? "Activo"
                    : "Inactivo"}
                </span>
              </div>

              <span className="transporte-tipo">
                {transporte.tipo || "Sin tipo"}
              </span>

              <h2>
                {transporte.nombre || "Transporte Mareva"}
              </h2>

              <p className="transporte-descripcion">
                {transporte.descripcion ||
                  "Sin descripción"}
              </p>

              <div className="transporte-datos">
                <div>
                  <span>Precio</span>

                  <strong>
                    {formatearPrecio(
                      transporte.precio
                    )}
                  </strong>
                </div>

                <div>
                  <span>Capacidad</span>

                  <strong>
                    {Number(
                      transporte.capacidad ?? 0
                    )}{" "}
                    personas
                  </strong>
                </div>

                <div>
                  <span>Sillas disponibles</span>

                  <strong>
                    {Number(
                      transporte.sillas_disponibles ?? 0
                    )}
                  </strong>
                </div>
              </div>

              <div className="transporte-acciones">
                <button
                  className="btn-editar-transporte"
                  onClick={() =>
                    abrirEditar(transporte)
                  }
                >
                  ✏️ Editar
                </button>

                <button
                  className="btn-eliminar-transporte"
                  onClick={() =>
                    eliminarTransporte(
                      transporte.id_transporte
                    )
                  }
                >
                  🗑️ Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {modalAbierto && (
        <div className="transporte-modal-fondo">
          <div className="transporte-modal">
            <div className="transporte-modal-header">
              <div>
                <span className="transporte-etiqueta">
                  {editando !== null
                    ? "EDITAR"
                    : "NUEVO"}
                </span>

                <h2>
                  {editando !== null
                    ? "Editar transporte"
                    : "Agregar transporte"}
                </h2>
              </div>

              <button
                className="btn-cerrar-modal"
                onClick={cerrarModal}
                type="button"
              >
                ×
              </button>
            </div>

            <form onSubmit={guardarTransporte}>
              <div className="transporte-form-grid">
                <div className="transporte-campo">
                  <label>
                    Tipo de transporte
                  </label>

                  <select
                    value={formulario.tipo}
                    onChange={(e) =>
                      cambiarCampo(
                        "tipo",
                        e.target.value
                      )
                    }
                  >
                    <option value="Bus agencia">
                      Bus agencia
                    </option>

                    <option value="Avion">
                      Avión
                    </option>

                    <option value="Carro propio">
                      Carro propio
                    </option>
                  </select>
                </div>

                <div className="transporte-campo">
                  <label>Nombre</label>

                  <input
                    type="text"
                    value={formulario.nombre}
                    onChange={(e) =>
                      cambiarCampo(
                        "nombre",
                        e.target.value
                      )
                    }
                    placeholder="Ej. Bus MAREVA Cartagena"
                  />
                </div>

                <div className="transporte-campo transporte-campo-completo">
                  <label>Descripción</label>

                  <textarea
                    value={formulario.descripcion}
                    onChange={(e) =>
                      cambiarCampo(
                        "descripcion",
                        e.target.value
                      )
                    }
                    placeholder="Describe el transporte..."
                    rows={4}
                  />
                </div>

                <div className="transporte-campo">
                  <label>Precio</label>

                  <input
                    type="number"
                    min="0"
                    value={formulario.precio}
                    onChange={(e) =>
                      cambiarCampo(
                        "precio",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="transporte-campo">
                  <label>Capacidad</label>

                  <input
                    type="number"
                    min="0"
                    value={formulario.capacidad}
                    onChange={(e) =>
                      cambiarCampo(
                        "capacidad",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="transporte-campo">
                  <label>
                    Sillas disponibles
                  </label>

                  <input
                    type="number"
                    min="0"
                    max={formulario.capacidad}
                    value={
                      formulario.sillas_disponibles
                    }
                    onChange={(e) =>
                      cambiarCampo(
                        "sillas_disponibles",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="transporte-campo transporte-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={formulario.activo}
                      onChange={(e) =>
                        cambiarCampo(
                          "activo",
                          e.target.checked
                        )
                      }
                    />

                    Transporte activo
                  </label>
                </div>
              </div>

              <div className="transporte-modal-acciones">
                <button
                  type="button"
                  className="btn-cancelar-transporte"
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-guardar-transporte"
                >
                  {editando !== null
                    ? "Guardar cambios"
                    : "Agregar transporte"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Transporte;


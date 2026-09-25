import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Cupones.css";

interface Cupon {
  id_cupon: number;
  codigo: string;
  descripcion: string;
  tipo_descuento: "porcentaje" | "valor";
  valor_descuento: number;
  fecha_inicio: string;
  fecha_vencimiento: string;
  activo: boolean;
}

interface CuponesProps {
  mostrarMensaje?: (titulo: string, mensaje: string) => void;
}

const API_URL = "http://127.0.0.1:5000";

function Cupones({ mostrarMensaje }: CuponesProps) {
  const [cupones, setCupones] = useState<Cupon[]>([]);
  const [cargando, setCargando] = useState(true);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState<Cupon | null>(null);

  const [codigo, setCodigo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [tipoDescuento, setTipoDescuento] = useState<
    "porcentaje" | "valor"
  >("porcentaje");

  const [valorDescuento, setValorDescuento] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [activo, setActivo] = useState(true);

  const [guardando, setGuardando] = useState(false);

  // ==========================================
  // MENSAJES
  // ==========================================

  const mensaje = (titulo: string, texto: string) => {
    if (mostrarMensaje) {
      mostrarMensaje(titulo, texto);
    } else {
      alert(`${titulo}\n\n${texto}`);
    }
  };

  // ==========================================
  // CARGAR CUPONES
  // ==========================================

  const cargarCupones = async () => {
    try {
      setCargando(true);

      const respuesta = await axios.get(`${API_URL}/cupones`);

      const datos = respuesta.data;

      if (Array.isArray(datos)) {
        setCupones(datos);
      } else if (Array.isArray(datos.cupones)) {
        setCupones(datos.cupones);
      } else {
        setCupones([]);
      }
    } catch (error: any) {
      console.error("Error al cargar cupones:", error);

      let texto =
        "No se pudieron cargar los cupones. Verifica que Flask esté ejecutándose.";

      if (error.response?.data?.mensaje) {
        texto = error.response.data.mensaje;
      }

      mensaje("Error", texto);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCupones();
  }, []);

  // ==========================================
  // LIMPIAR FORMULARIO
  // ==========================================

  const limpiarFormulario = () => {
    setCodigo("");
    setDescripcion("");
    setTipoDescuento("porcentaje");
    setValorDescuento("");
    setFechaInicio("");
    setFechaVencimiento("");
    setActivo(true);
    setEditando(null);
  };

  // ==========================================
  // NUEVO CUPÓN
  // ==========================================

  const nuevoCupon = () => {
    limpiarFormulario();
    setMostrarFormulario(true);
  };

  // ==========================================
  // EDITAR CUPÓN
  // ==========================================

  const editarCupon = (cupon: Cupon) => {
    setEditando(cupon);

    setCodigo(cupon.codigo);
    setDescripcion(cupon.descripcion || "");

    setTipoDescuento(cupon.tipo_descuento);

    setValorDescuento(String(cupon.valor_descuento));

    setFechaInicio(
      cupon.fecha_inicio
        ? cupon.fecha_inicio.substring(0, 10)
        : ""
    );

    setFechaVencimiento(
      cupon.fecha_vencimiento
        ? cupon.fecha_vencimiento.substring(0, 10)
        : ""
    );

    setActivo(cupon.activo);

    setMostrarFormulario(true);
  };

  // ==========================================
  // CERRAR FORMULARIO
  // ==========================================

  const cerrarFormulario = () => {
    if (guardando) return;

    limpiarFormulario();
    setMostrarFormulario(false);
  };

  // ==========================================
  // GUARDAR CUPÓN
  // ==========================================

  const guardarCupon = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!codigo.trim()) {
      mensaje(
        "Campo obligatorio",
        "Debes ingresar el código del cupón."
      );
      return;
    }

    if (!fechaInicio) {
      mensaje(
        "Campo obligatorio",
        "Debes seleccionar la fecha de inicio."
      );
      return;
    }

    if (!fechaVencimiento) {
      mensaje(
        "Campo obligatorio",
        "Debes seleccionar la fecha de vencimiento."
      );
      return;
    }

    if (fechaVencimiento < fechaInicio) {
      mensaje(
        "Fechas inválidas",
        "La fecha de vencimiento no puede ser anterior a la fecha de inicio."
      );
      return;
    }

    if (!valorDescuento.trim()) {
      mensaje(
        "Campo obligatorio",
        "Debes ingresar el valor del descuento."
      );
      return;
    }

    const valor = Number(valorDescuento);

    if (isNaN(valor) || valor <= 0) {
      mensaje(
        "Valor inválido",
        "El valor del descuento debe ser mayor que 0."
      );
      return;
    }

    if (tipoDescuento === "porcentaje" && valor > 100) {
      mensaje(
        "Valor inválido",
        "Un descuento porcentual no puede ser mayor al 100%."
      );
      return;
    }

    const datos = {
      codigo: codigo.trim().toUpperCase(),
      descripcion: descripcion.trim(),
      tipo_descuento: tipoDescuento,
      valor_descuento: valor,
      fecha_inicio: fechaInicio,
      fecha_vencimiento: fechaVencimiento,
      activo: activo,
    };

    try {
      setGuardando(true);

      if (editando) {
        await axios.put(
          `${API_URL}/cupones/${editando.id_cupon}`,
          datos
        );

        mensaje(
          "Cupón actualizado",
          "El cupón se actualizó correctamente."
        );
      } else {
        await axios.post(
          `${API_URL}/cupones`,
          datos
        );

        mensaje(
          "Cupón creado",
          "El cupón se creó correctamente."
        );
      }

      limpiarFormulario();
      setMostrarFormulario(false);

      await cargarCupones();
    } catch (error: any) {
      console.error("Error al guardar cupón:", error);

      let texto =
        "No se pudo guardar el cupón. Verifica que el servidor esté funcionando.";

      if (error.response?.data?.mensaje) {
        texto = error.response.data.mensaje;
      }

      mensaje("Error", texto);
    } finally {
      setGuardando(false);
    }
  };

  // ==========================================
  // ELIMINAR CUPÓN
  // ==========================================

  const eliminarCupon = async (cupon: Cupon) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar el cupón "${cupon.codigo}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmar) return;

    try {
      await axios.delete(
        `${API_URL}/cupones/${cupon.id_cupon}`
      );

      mensaje(
        "Cupón eliminado",
        `El cupón ${cupon.codigo} fue eliminado correctamente.`
      );

      await cargarCupones();
    } catch (error: any) {
      console.error("Error al eliminar cupón:", error);

      let texto = "No se pudo eliminar el cupón.";

      if (error.response?.data?.mensaje) {
        texto = error.response.data.mensaje;
      }

      mensaje("Error", texto);
    }
  };

  // ==========================================
  // ACTIVAR / DESACTIVAR
  // ==========================================

  const cambiarEstado = async (cupon: Cupon) => {
    const nuevoEstado = !cupon.activo;

    try {
      await axios.put(
        `${API_URL}/cupones/${cupon.id_cupon}/estado`,
        {
          activo: nuevoEstado,
        }
      );

      mensaje(
        nuevoEstado
          ? "Cupón activado"
          : "Cupón desactivado",
        nuevoEstado
          ? `El cupón ${cupon.codigo} ahora está activo.`
          : `El cupón ${cupon.codigo} ahora está inactivo.`
      );

      await cargarCupones();
    } catch (error: any) {
      console.error(
        "Error al cambiar estado:",
        error
      );

      let texto =
        "No se pudo cambiar el estado del cupón.";

      if (error.response?.data?.mensaje) {
        texto = error.response.data.mensaje;
      }

      mensaje("Error", texto);
    }
  };

  // ==========================================
  // FORMATEAR FECHA
  // ==========================================

  const formatearFecha = (fecha: string) => {
    if (!fecha) return "Sin fecha";

    const fechaLimpia = fecha.substring(0, 10);
    const partes = fechaLimpia.split("-");

    if (partes.length !== 3) {
      return fecha;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  // ==========================================
  // FORMATEAR DESCUENTO
  // ==========================================

  const mostrarDescuento = (cupon: Cupon) => {
    if (cupon.tipo_descuento === "porcentaje") {
      return `${cupon.valor_descuento}%`;
    }

    return `$${Number(
      cupon.valor_descuento
    ).toLocaleString("es-CO")}`;
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="cupones-container">

      {/* ENCABEZADO */}
      <div className="cupones-header">

        <div>
          <span className="cupones-kicker">
            ADMINISTRACIÓN
          </span>

          <h1>
            <span className="cupones-icono">
              🎟️
            </span>

            Cupones
          </h1>

          <p>
            Crea, administra y controla los descuentos de MAREVA.
          </p>
        </div>

        <button
          className="btn-nuevo-cupon"
          onClick={nuevoCupon}
        >
          <span>＋</span>
          Nuevo cupón
        </button>

      </div>

      {/* ESTADÍSTICAS */}
      <div className="cupones-estadisticas">

        <div className="cupon-stat-card">

          <div className="cupon-stat-icono">
            🎟️
          </div>

          <div>
            <span>Total cupones</span>

            <strong>
              {cupones.length}
            </strong>
          </div>

        </div>

        <div className="cupon-stat-card">

          <div className="cupon-stat-icono">
            ✓
          </div>

          <div>
            <span>Cupones activos</span>

            <strong>
              {
                cupones.filter(
                  (cupon) => cupon.activo
                ).length
              }
            </strong>
          </div>

        </div>

        <div className="cupon-stat-card">

          <div className="cupon-stat-icono">
            ⏸
          </div>

          <div>
            <span>Cupones inactivos</span>

            <strong>
              {
                cupones.filter(
                  (cupon) => !cupon.activo
                ).length
              }
            </strong>
          </div>

        </div>

      </div>

      {/* CONTENIDO */}
      <div className="cupones-card">

        <div className="cupones-card-header">

          <div>
            <h2>
              Lista de cupones
            </h2>

            <p>
              Administra los códigos de descuento disponibles.
            </p>
          </div>

          <button
            className="btn-recargar-cupones"
            onClick={cargarCupones}
            disabled={cargando}
          >
            ↻{" "}
            {cargando
              ? "Cargando..."
              : "Actualizar"}
          </button>

        </div>

        {/* CARGANDO */}
        {cargando ? (

          <div className="cupones-estado">

            <div className="spinner-cupon"></div>

            <p>
              Cargando cupones...
            </p>

          </div>

        ) : cupones.length === 0 ? (

          /* SIN CUPONES */
          <div className="cupones-vacio">

            <div className="cupones-vacio-icono">
              🎟️
            </div>

            <h3>
              No hay cupones registrados
            </h3>

            <p>
              Crea tu primer cupón para comenzar a ofrecer descuentos.
            </p>

            <button
              className="btn-nuevo-cupon vacio"
              onClick={nuevoCupon}
            >
              ＋ Crear primer cupón
            </button>

          </div>

        ) : (

          /* TABLA */
          <div className="tabla-cupones-wrapper">

            <table className="tabla-cupones">

              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descripción</th>
                  <th>Descuento</th>
                  <th>Vigencia</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>

                {cupones.map((cupon) => (

                  <tr key={cupon.id_cupon}>

                    {/* CÓDIGO */}
                    <td>

                      <div className="codigo-cupon">

                        <span className="codigo-icono">
                          %
                        </span>

                        <strong>
                          {cupon.codigo}
                        </strong>

                      </div>

                    </td>

                    {/* DESCRIPCIÓN */}
                    <td>

                      <div className="descripcion-cupon">

                        {cupon.descripcion || (
                          <span className="sin-descripcion">
                            Sin descripción
                          </span>
                        )}

                      </div>

                    </td>

                    {/* DESCUENTO */}
                    <td>

                      <span className="descuento-cupon">
                        {mostrarDescuento(cupon)}
                      </span>

                    </td>

                    {/* VIGENCIA */}
                    <td>

                      <div className="fechas-cupon">

                        <span>
                          <b>Desde:</b>{" "}
                          {formatearFecha(
                            cupon.fecha_inicio
                          )}
                        </span>

                        <span>
                          <b>Hasta:</b>{" "}
                          {formatearFecha(
                            cupon.fecha_vencimiento
                          )}
                        </span>

                      </div>

                    </td>

                    {/* ESTADO */}
                    <td>

                      <button
                        className={`estado-cupon ${
                          cupon.activo
                            ? "activo"
                            : "inactivo"
                        }`}
                        onClick={() =>
                          cambiarEstado(cupon)
                        }
                        title={
                          cupon.activo
                            ? "Desactivar cupón"
                            : "Activar cupón"
                        }
                      >

                        <span className="estado-punto"></span>

                        {cupon.activo
                          ? "Activo"
                          : "Inactivo"}

                      </button>

                    </td>

                    {/* ACCIONES */}
                    <td>

                      <div className="acciones-cupon">

                        <button
                          className="btn-accion editar"
                          onClick={() =>
                            editarCupon(cupon)
                          }
                          title="Editar cupón"
                        >
                          ✏️
                        </button>

                        <button
                          className="btn-accion eliminar"
                          onClick={() =>
                            eliminarCupon(cupon)
                          }
                          title="Eliminar cupón"
                        >
                          🗑️
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ==========================================
          MODAL CREAR / EDITAR
          ========================================== */}

      {mostrarFormulario && (

        <div
          className="modal-cupon-overlay"
          onClick={cerrarFormulario}
        >

          <div
            className="modal-cupon"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER MODAL */}
            <div className="modal-cupon-header">

              <div>

                <span className="modal-cupon-kicker">
                  MAREVA
                </span>

                <h2>
                  {editando
                    ? "Editar cupón"
                    : "Nuevo cupón"}
                </h2>

                <p>
                  {editando
                    ? "Modifica la información del cupón."
                    : "Crea un nuevo descuento para tus clientes."}
                </p>

              </div>

              <button
                className="btn-cerrar-modal"
                onClick={cerrarFormulario}
                disabled={guardando}
              >
                ×
              </button>

            </div>

            {/* FORMULARIO */}
            <form
              className="formulario-cupon"
              onSubmit={guardarCupon}
            >

              {/* CÓDIGO */}
              <div className="campo-cupon">

                <label htmlFor="codigo">
                  Código del cupón *
                </label>

                <input
                  id="codigo"
                  type="text"
                  value={codigo}
                  onChange={(e) =>
                    setCodigo(
                      e.target.value.toUpperCase()
                    )
                  }
                  placeholder="Ej: MAREVA10"
                  maxLength={50}
                  disabled={guardando}
                />

                <small>
                  Los códigos se guardarán en mayúsculas.
                </small>

              </div>

              {/* DESCRIPCIÓN */}
              <div className="campo-cupon">

                <label htmlFor="descripcion">
                  Descripción
                </label>

                <textarea
                  id="descripcion"
                  value={descripcion}
                  onChange={(e) =>
                    setDescripcion(
                      e.target.value
                    )
                  }
                  placeholder="Ej: Descuento especial para clientes MAREVA"
                  rows={3}
                  maxLength={250}
                  disabled={guardando}
                />

              </div>

              {/* TIPO Y VALOR */}
              <div className="campos-dobles-cupon">

                <div className="campo-cupon">

                  <label htmlFor="tipoDescuento">
                    Tipo de descuento *
                  </label>

                  <select
                    id="tipoDescuento"
                    value={tipoDescuento}
                    onChange={(e) =>
                      setTipoDescuento(
                        e.target.value as
                          | "porcentaje"
                          | "valor"
                      )
                    }
                    disabled={guardando}
                  >

                    <option value="porcentaje">
                      Porcentaje (%)
                    </option>

                    <option value="valor">
                      Valor fijo ($)
                    </option>

                  </select>

                </div>

                <div className="campo-cupon">

                  <label htmlFor="valorDescuento">
                    Valor del descuento *
                  </label>

                  <div className="input-con-simbolo">

                    <input
                      id="valorDescuento"
                      type="number"
                      min="0"
                      max={
                        tipoDescuento ===
                        "porcentaje"
                          ? "100"
                          : undefined
                      }
                      step="0.01"
                      value={valorDescuento}
                      onChange={(e) =>
                        setValorDescuento(
                          e.target.value
                        )
                      }
                      placeholder={
                        tipoDescuento ===
                        "porcentaje"
                          ? "10"
                          : "50000"
                      }
                      disabled={guardando}
                    />

                    <span>
                      {tipoDescuento ===
                      "porcentaje"
                        ? "%"
                        : "$"}
                    </span>

                  </div>

                </div>

              </div>

              {/* FECHAS */}
              <div className="campos-dobles-cupon">

                <div className="campo-cupon">

                  <label htmlFor="fechaInicio">
                    Fecha de inicio *
                  </label>

                  <input
                    id="fechaInicio"
                    type="date"
                    value={fechaInicio}
                    onChange={(e) =>
                      setFechaInicio(
                        e.target.value
                      )
                    }
                    disabled={guardando}
                  />

                </div>

                <div className="campo-cupon">

                  <label htmlFor="fechaVencimiento">
                    Fecha de vencimiento *
                  </label>

                  <input
                    id="fechaVencimiento"
                    type="date"
                    value={fechaVencimiento}
                    onChange={(e) =>
                      setFechaVencimiento(
                        e.target.value
                      )
                    }
                    disabled={guardando}
                  />

                </div>

              </div>

              {/* ESTADO */}
              <div className="estado-formulario-cupon">

                <div>

                  <strong>
                    Estado del cupón
                  </strong>

                  <p>
                    Puedes activar o desactivar el cupón cuando quieras.
                  </p>

                </div>

                <label className="switch-cupon">

                  <input
                    type="checkbox"
                    checked={activo}
                    onChange={(e) =>
                      setActivo(
                        e.target.checked
                      )
                    }
                    disabled={guardando}
                  />

                  <span className="slider-cupon"></span>

                </label>

                <span
                  className={`texto-switch ${
                    activo
                      ? "activo"
                      : "inactivo"
                  }`}
                >
                  {activo
                    ? "Activo"
                    : "Inactivo"}
                </span>

              </div>

              {/* BOTONES */}
              <div className="botones-formulario-cupon">

                <button
                  type="button"
                  className="btn-cancelar-cupon"
                  onClick={cerrarFormulario}
                  disabled={guardando}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-guardar-cupon"
                  disabled={guardando}
                >

                  {guardando ? (
                    <>
                      <span className="spinner-mini"></span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      ✓{" "}
                      {editando
                        ? "Guardar cambios"
                        : "Crear cupón"}
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Cupones;


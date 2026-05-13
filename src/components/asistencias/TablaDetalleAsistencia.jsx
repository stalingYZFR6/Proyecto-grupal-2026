// src/components/asistencia/TablaDetalleAsistencia.jsx

import React, { useEffect, useState } from "react";

import {
  Table,
  Badge,
  Spinner,
  Alert,
  Button,
  Image,
} from "react-bootstrap";

import { supabase } from "../../database/supabaseconfig";

import ModalMarcarSalida from "./ModalMarcarSalida";

const TablaDetalleAsistencia = ({ id_jornada }) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [detalles, setDetalles] = useState([]);

  const [showSalida, setShowSalida] = useState(false);
  const [asistenciaSeleccionada, setAsistenciaSeleccionada] =
    useState(null);

  // =========================================
  // CARGAR DETALLE
  // =========================================
  useEffect(() => {

    if (id_jornada) {
      cargarDetalle();
    }

  }, [id_jornada]);

  const cargarDetalle = async () => {

    try {

      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("asistencias")
        .select(`
          *,
          empleado (
            nombre,
            apellido,
            cedula,
            telefono,
            url_imagen
          ),
          turnos (
            tipo_turno,
            hora_inicio,
            hora_fin
          ),
          Incidencias (
            tipo_incidencia
          )
        `)
        .eq("id_jornada", id_jornada)
        .order("hora_entrada", {
          ascending: true,
        });

      if (error) throw error;

      setDetalles(data || []);

    } catch (err) {

      console.error(err);
      setError(err.message);

    } finally {

      setLoading(false);

    }
  };

  // =========================================
  // FORMATEAR HORA
  // =========================================
  const formatearHora = (fechaHora) => {

    if (!fechaHora) return "----";

    return new Date(fechaHora).toLocaleTimeString(
      "es-NI",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =========================================
  // FORMATEAR FECHA
  // =========================================
  const formatearFecha = (fechaHora) => {

    if (!fechaHora) return "----";

    return new Date(fechaHora).toLocaleDateString(
      "es-NI"
    );
  };

  // =========================================
  // ELIMINAR ASISTENCIA
  // =========================================
  const eliminarAsistencia = async (id_asistencia) => {

    const confirmar = window.confirm(
      "¿Deseas eliminar este registro?"
    );

    if (!confirmar) return;

    try {

      const { error } = await supabase
        .from("asistencias")
        .delete()
        .eq("id_asistencia", id_asistencia);

      if (error) throw error;

      cargarDetalle();

    } catch (err) {

      console.error(err);
      alert("Error al eliminar");

    }
  };
const marcarSalida = async (asistencia) => {

  if (jornada.estado === "cerrada") {
    alert("La jornada está cerrada");
    return;
  }

  try {

    // =====================================
    // HORA ACTUAL
    // =====================================

    const ahora = new Date();

    // =====================================
    // OBTENER TURNO
    // =====================================

    const { data: turno, error: errorTurno } =
      await supabase
        .from("turnos")
        .select("*")
        .eq("id_turno", asistencia.id_turno)
        .single();

    if (errorTurno) throw errorTurno;

    // =====================================
    // HORA SALIDA
    // =====================================

    const horaSalidaISO =
      ahora.toISOString();

    // =====================================
    // FECHAS
    // =====================================

    const entrada = new Date(
      asistencia.hora_entrada
    );

    const salida = new Date(
      horaSalidaISO
    );

    // =====================================
    // CALCULAR HORAS
    // =====================================

    const horasTrabajadas =
      (salida - entrada) / 1000 / 60 / 60;

    // =====================================
    // COMPARAR CON TURNO
    // =====================================

    const horaFinTurno =
      turno.hora_fin;

    const salidaActual =
      ahora.toTimeString().slice(0,5);

    let estadoSalida = "completado";

    if (salidaActual < horaFinTurno) {
      estadoSalida =
        "salida_temprana";
    }

    if (salidaActual > horaFinTurno) {
      estadoSalida =
        "horas_extra";
    }

    // =====================================
    // ACTUALIZAR
    // =====================================

    const { error } = await supabase
      .from("asistencias")
      .update({
        hora_salida: horaSalidaISO,
        horas_trabajadas:
          horasTrabajadas.toFixed(2),
        estado_salida: estadoSalida,
      })
      .eq(
        "id_asistencia",
        asistencia.id_asistencia
      );

    if (error) throw error;

    alert("Salida registrada");

    onActualizar();

  } catch (err) {

    console.error(err);

    alert(
      "Error registrando salida"
    );
  }
};
  // =========================================
  // ABRIR MODAL SALIDA
  // =========================================
  const abrirModalSalida = (asistencia) => {

    setAsistenciaSeleccionada(asistencia);
    setShowSalida(true);

  };

  return (
    <>

      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      {loading ? (

        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>

      ) : detalles.length === 0 ? (

        <Alert variant="warning">
          No hay registros en esta jornada
        </Alert>

      ) : (

        <Table
          striped
          bordered
          hover
          responsive
          className="align-middle"
        >

          <thead className="table-dark">

            <tr>
              <th>Foto</th>
              <th>Empleado</th>
              <th>Turno</th>
              <th>Fecha</th>
              <th>Entrada</th>
              <th>Salida</th>
              <th>Horas</th>
              <th>Estado</th>
              <th>Incidencia</th>
              <th width="180">
                Acciones
              </th>
            </tr>

          </thead>

          <tbody>

            {detalles.map((detalle) => (

              <tr key={detalle.id_asistencia}>

                {/* FOTO */}
                <td className="text-center">

                  <Image
                    src={
                      detalle.empleado?.url_imagen ||
                      "https://via.placeholder.com/50"
                    }
                    roundedCircle
                    width={55}
                    height={55}
                    style={{
                      objectFit: "cover",
                    }}
                  />

                </td>

                {/* EMPLEADO */}
                <td>

                  <strong>
                    {detalle.empleado?.nombre}
                  </strong>

                  <br />

                  {detalle.empleado?.apellido}

                  <br />

                  <small className="text-muted">
                    {detalle.empleado?.cedula}
                  </small>

                </td>

                {/* TURNO */}
                <td>

                  <Badge bg="info">
                    {detalle.turnos?.tipo_turno}
                  </Badge>

                  <br />

                  <small>
                    {detalle.turnos?.hora_inicio}
                    {" - "}
                    {detalle.turnos?.hora_fin}
                  </small>

                </td>

                {/* FECHA */}
                <td>
                  {formatearFecha(detalle.hora_entrada)}
                </td>

                {/* ENTRADA */}
                <td>

                  <Badge bg="success">
                    {formatearHora(detalle.hora_entrada)}
                  </Badge>

                </td>

                {/* SALIDA */}
                <td>

                  {detalle.hora_salida ? (

                    <Badge bg="primary">
                      {formatearHora(detalle.hora_salida)}
                    </Badge>

                  ) : (

                    <Badge bg="warning">
                      Pendiente
                    </Badge>

                  )}

                </td>

                {/* HORAS */}
                <td>

                  {detalle.horas_trabajadas ? (
                    <Badge bg="dark">
                      {detalle.horas_trabajadas.toFixed(2)} h
                    </Badge>
                  ) : (
                    "----"
                  )}

                </td>

                {/* ESTADO */}
                <td>

                  <Badge
                    bg={
                      detalle.estado_asistencia === "Presente"
                        ? "success"
                        : detalle.estado_asistencia === "Tardanza"
                        ? "warning"
                        : detalle.estado_asistencia === "Ausente"
                        ? "danger"
                        : "secondary"
                    }
                  >
                    {detalle.estado_asistencia}
                  </Badge>

                </td>

                {/* INCIDENCIA */}
                <td>

                  {detalle.Incidencias?.tipo_incidencia ? (

                    <Badge bg="danger">
                      {detalle.Incidencias.tipo_incidencia}
                    </Badge>

                  ) : (

                    <span className="text-muted">
                      Ninguna
                    </span>

                  )}

                </td>

                {/* ACCIONES */}
                <td>

                  <div className="d-flex gap-2 flex-wrap">

                    {/* MARCAR SALIDA */}
                    {!detalle.hora_salida && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() =>
                          abrirModalSalida(detalle)
                        }
                      >
                        <i className="bi bi-box-arrow-right me-1"></i>
                        Salida
                      </Button>
                    )}

                    {/* ELIMINAR */}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        eliminarAsistencia(
                          detalle.id_asistencia
                        )
                      }
                    >
                      <i className="bi bi-trash-fill"></i>
                    </Button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </Table>

      )}

      {/* ========================================= */}
      {/* MODAL MARCAR SALIDA */}
      {/* ========================================= */}
      <ModalMarcarSalida
        show={showSalida}
        handleClose={() => setShowSalida(false)}
        asistencia={asistenciaSeleccionada}
        onSalidaRegistrada={cargarDetalle}
      />

    </>
  );
};

export default TablaDetalleAsistencia;
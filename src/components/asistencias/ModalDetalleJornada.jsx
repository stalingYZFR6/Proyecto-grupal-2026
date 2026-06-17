import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Table,
  Spinner,
  Alert,
  Badge,
  Image,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import Swal from "sweetalert2";
import { supabase } from "../../database/supabaseconfig";

import ModalMarcarEntrada from "./ModalMarcarEntrada.jsx";
import ConfirmacionModal from "../ui/ConfirmacionModal.jsx";

const ModalDetalleJornada = ({
  show,
  handleClose,
  jornada,
  onActualizar,
}) => {

  const [loading, setLoading] = useState(false);
  const [detalles, setDetalles] = useState([]);
  const [error, setError] = useState("");

  const [rolUsuarioActual, setRolUsuarioActual] = useState("");
  const [idEmpleadoActual, setIdEmpleadoActual] = useState("");

  // =====================================
  // MODALES
  // =====================================
  const [showEliminar, setShowEliminar] = useState(false);
  const [showCerrar, setShowCerrar] = useState(false);
  const [showSalida, setShowSalida] = useState(false);
  const [showRegistro, setShowRegistro] = useState(false);

  // =====================================
  // IDS
  // =====================================
  const [asistenciaEliminar, setAsistenciaEliminar] = useState(null);
  const [detalleSalida, setDetalleSalida] = useState(null);

  // =====================================
  // ESTADÍSTICAS
  // =====================================
  const [estadisticas, setEstadisticas] = useState({
    presentes: 0,
    trabajando: 0,
    completados: 0,
    salieronAntes: 0,
    horasExtras: 0,
  });

  // =====================================
  // CARGAR DETALLE Y PERFIL
  // =====================================
  useEffect(() => {
    if (show && jornada?.id_jornada) {
      obtenerPerfilYDetalle();
    }
  }, [show, jornada]);

  const obtenerPerfilYDetalle = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: perfil } = await supabase
          .from("usuarios")
          .select("rol, id_empleado")
          .eq("id_auth", user.id)
          .maybeSingle();
        if (perfil) {
          setRolUsuarioActual(perfil.rol);
          setIdEmpleadoActual(perfil.id_empleado);
        }
      }
      await cargarDetalle();
    } catch (err) {
      console.error(err);
    }
  };

  const cargarDetalle = async () => {
    try {
      setLoading(true);
      setError("");

      const { data, error } =
        await supabase
          .from("asistencias")
          .select(`
            *,
            empleado (
              nombre,
              apellido,
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
          .eq("id_jornada", jornada.id_jornada)
          .order("hora_entrada", { ascending: true });

      if (error) throw error;

      const asistencias = data || [];
      setDetalles(asistencias);
      calcularEstadisticas(asistencias);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // ESTADÍSTICAS
  // =====================================
  const calcularEstadisticas = (asistencias) => {
    const presentes = asistencias.length;
    const trabajando = asistencias.filter((a) => !a.hora_salida).length;
    const completados = asistencias.filter((a) => a.estado_salida === "turno_completado").length;
    const salieronAntes = asistencias.filter((a) => a.estado_salida === "salio_antes").length;
    const horasExtras = asistencias.filter((a) => a.estado_salida === "horas_extras").length;

    setEstadisticas({
      presentes,
      trabajando,
      completados,
      salieronAntes,
      horasExtras,
    });
  };

  // =====================================
  // FORMATEAR HORA
  // =====================================
  const formatearHora = (fechaHora) => {
    if (!fechaHora) return "----";
    return new Date(fechaHora).toLocaleTimeString("es-NI", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =====================================
  // FORMATEAR FECHA
  // =====================================
  const formatearFechaCompleta = (fechaHora) => {
    if (!fechaHora) return "----";
    return new Date(fechaHora).toLocaleString("es-NI", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  // =====================================
  // ELIMINAR REGISTRO
  // =====================================
  const eliminarRegistro = async () => {
    if (jornada?.estado === "cerrada" || rolUsuarioActual === "empleado") {
      return;
    }

    try {
      const { error } =
        await supabase
          .from("asistencias")
          .delete()
          .eq("id_asistencia", asistenciaEliminar);

      if (error) throw error;

      setShowEliminar(false);
      cargarDetalle();

      if (onActualizar) {
        onActualizar();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // =====================================
  // MARCAR SALIDA
  // =====================================
  const marcarSalida = async () => {
    if (jornada?.estado === "cerrada") {
      return;
    }

    if (!detalleSalida) return;

    try {
      // ======================================
      // VALIDAR RESTRICCIÓN POR IP
      // ======================================
      const { data: configIPActiva } = await supabase
        .from("configuracion")
        .select("valor")
        .eq("clave", "restriccion_ip_activa")
        .maybeSingle();

      if (configIPActiva?.valor === "true") {
        const { data: configIPAutorizada } = await supabase
          .from("configuracion")
          .select("valor")
          .eq("clave", "ip_autorizada")
          .maybeSingle();

        const ipAutorizada = configIPAutorizada?.valor;
        if (ipAutorizada) {
          try {
            const res = await fetch("https://api.ipify.org?format=json");
            const ipData = await res.json();
            const userIP = ipData.ip;
            if (userIP !== ipAutorizada) {
              Swal.fire({
                icon: "error",
                title: "Acceso denegado",
                text: `Solo puedes registrar asistencia conectado a la red autorizada de la empresa (Tu IP: ${userIP}, Autorizada: ${ipAutorizada})`
              });
              return;
            }
          } catch (ipErr) {
            Swal.fire({
              icon: "error",
              title: "Error de verificación",
              text: "No se pudo verificar tu dirección IP. Por favor, intenta de nuevo."
            });
            return;
          }
        }
      }

      const ahora = new Date();
      const entrada = new Date(detalleSalida.hora_entrada);

      // ===============================
      // HORAS TRABAJADAS
      // ===============================
      const diferenciaMs = ahora - entrada;
      const horas = diferenciaMs / (1000 * 60 * 60);

      // ===============================
      // ESTADO SALIDA
      // ===============================
      let estadoSalida = "turno_completado";
      const horaFinTurno = detalleSalida.turnos?.hora_fin;

      if (horaFinTurno) {
        const [hora, minuto] = horaFinTurno.split(":");
        const salidaEsperada = new Date(ahora);
        salidaEsperada.setHours(parseInt(hora), parseInt(minuto), 0);

        // ===========================
        // SALIÓ ANTES
        // ===========================
        const limiteMinimo = new Date(salidaEsperada.getTime() - 45 * 60000);
        if (ahora < limiteMinimo) {
          estadoSalida = "salio_antes";
        }

        // ===========================
        // HORAS EXTRAS
        // ===========================
        if (ahora > salidaEsperada) {
          const diferenciaExtra = ahora - salidaEsperada;
          const horasExtra = diferenciaExtra / (1000 * 60 * 60);
          if (horasExtra >= 1) {
            estadoSalida = "horas_extras";
          }
        }
      }

      // ===============================
      // ACTUALIZAR
      // ===============================
      const { error } =
        await supabase
          .from("asistencias")
          .update({
            hora_salida: ahora.toISOString(),
            horas_trabajadas: horas.toFixed(2),
            estado_salida: estadoSalida,
          })
          .eq("id_asistencia", detalleSalida.id_asistencia);

      if (error) throw error;

      setShowSalida(false);
      cargarDetalle();

      if (onActualizar) {
        onActualizar();
      }

    } catch (err) {
      console.error(err);
    }
  };

  // =====================================
  // CERRAR JORNADA
  // =====================================
  const cerrarJornada = async () => {
    if (rolUsuarioActual === "empleado") return;

    try {
      const pendientes = detalles.filter((d) => !d.hora_salida);

      if (pendientes.length > 0) {
        Swal.fire({
          icon: "warning",
          title: "Salidas pendientes",
          html: `
            Hay 
            <b>${pendientes.length}</b>
            empleado(s) que aún no han marcado salida.
            <br/><br/>
            ¿Deseas cerrar la jornada igualmente?
          `,
          showCancelButton: true,
          confirmButtonText: "Sí, cerrar",
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#f59e0b",
          cancelButtonColor: "#6c757d",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await confirmarCerrarJornada();
          }
        });
        return;
      }

      await confirmarCerrarJornada();

    } catch (err) {
      console.error(err);
    }
  };

  // =====================================
  // CONFIRMAR CIERRE
  // =====================================
  const confirmarCerrarJornada = async () => {
    try {
      const { error } =
        await supabase
          .from("jornadas_asistencia")
          .update({ estado: "cerrada" })
          .eq("id_jornada", jornada.id_jornada);

      if (error) throw error;

      setShowCerrar(false);
      cargarDetalle();

      if (onActualizar) {
        onActualizar();
      }

      Swal.fire({
        icon: "success",
        title: "Jornada cerrada",
        text: "La jornada fue cerrada correctamente.",
        timer: 1800,
        showConfirmButton: false,
      });

    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cerrar la jornada.",
      });
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-calendar3 me-2"></i>
            Detalle Jornada
            {jornada?.fecha && (
              <Badge
                bg={jornada.estado === "cerrada" ? "danger" : "success"}
                className="ms-3"
              >
                {jornada.fecha}
              </Badge>
            )}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* ================================= */}
          {/* JORNADA CERRADA */}
          {/* ================================= */}
          {jornada?.estado === "cerrada" && (
            <Alert variant="danger">
              <strong>Jornada cerrada</strong>
              <hr />
              Ya NO se pueden registrar entradas, salidas o eliminar asistencias.
            </Alert>
          )}

          {/* ================================= */}
          {/* DASHBOARD */}
          {/* ================================= */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="shadow-sm border-0 bg-primary text-white">
                <Card.Body className="text-center">
                  <h3>{estadisticas.presentes}</h3>
                  <div>Presentes</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm border-0 bg-warning text-dark">
                <Card.Body className="text-center">
                  <h3>{estadisticas.trabajando}</h3>
                  <div>Trabajando</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm border-0 bg-success text-white">
                <Card.Body className="text-center">
                  <h3>{estadisticas.completados}</h3>
                  <div>Completados</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm border-0 bg-danger text-white">
                <Card.Body className="text-center">
                  <h3>{estadisticas.salieronAntes}</h3>
                  <div>Salieron antes</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* ================================= */}
          {/* BOTÓN REGISTRAR */}
          {/* ================================= */}
          {jornada?.estado !== "cerrada" && (
            <div className="mb-3 d-flex justify-content-end">
              <Button
                variant="success"
                onClick={() => setShowRegistro(true)}
              >
                <i className="bi bi-person-plus-fill me-2"></i>
                {rolUsuarioActual === "empleado" ? "Marcar mi Entrada" : "Registrar empleado"}
              </Button>
            </div>
          )}

          {/* ================================= */}
          {/* ERROR */}
          {/* ================================= */}
          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}

          {/* ================================= */}
          {/* LOADING */}
          {/* ================================= */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : detalles.length === 0 ? (
            <Alert variant="warning">
              No hay asistencias registradas.
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
                  <th>Entrada</th>
                  <th>Salida</th>
                  <th>Horas</th>
                  <th>Estado salida</th>
                  <th>Incidencia</th>
                  <th width="240">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {detalles.map((detalle) => {
                  const esSuPropioRegistro = detalle.id_empleado === idEmpleadoActual;
                  const esEmpleado = rolUsuarioActual === "empleado";

                  // Si es empleado, solo mostramos su propio registro en la tabla
                  if (esEmpleado && !esSuPropioRegistro) return null;

                  return (
                    <tr key={detalle.id_asistencia}>
                      {/* FOTO */}
                      <td className="text-center">
                        <Image
                          src={detalle.empleado?.url_imagen || "https://via.placeholder.com/50"}
                          roundedCircle
                          width={50}
                          height={50}
                          style={{ objectFit: "cover" }}
                        />
                      </td>

                      {/* EMPLEADO */}
                      <td>
                        <strong>{detalle.empleado?.nombre}</strong>
                        <br />
                        {detalle.empleado?.apellido}
                      </td>

                      {/* TURNO */}
                      <td>
                        <Badge bg="info">
                          {detalle.turnos?.tipo_turno}
                        </Badge>
                      </td>

                      {/* ENTRADA */}
                      <td>
                        <div>{formatearHora(detalle.hora_entrada)}</div>
                        <small className="text-muted">
                          {formatearFechaCompleta(detalle.hora_entrada)}
                        </small>
                      </td>

                      {/* SALIDA */}
                      <td>
                        {detalle.hora_salida ? (
                          <>
                            <div>{formatearHora(detalle.hora_salida)}</div>
                            <small className="text-muted">
                              {formatearFechaCompleta(detalle.hora_salida)}
                            </small>
                          </>
                        ) : (
                          <Badge bg="warning">Pendiente</Badge>
                        )}
                      </td>

                      {/* HORAS */}
                      <td>
                        {detalle.horas_trabajadas
                          ? `${parseFloat(detalle.horas_trabajadas).toFixed(2)} h`
                          : "----"}
                      </td>

                      {/* ESTADO */}
                      <td>
                        {!detalle.hora_salida ? (
                          <Badge bg="warning">Trabajando</Badge>
                        ) : detalle.estado_salida === "salio_antes" ? (
                          <Badge bg="danger">Salió antes</Badge>
                        ) : detalle.estado_salida === "horas_extras" ? (
                          <Badge bg="primary">Horas extras</Badge>
                        ) : (
                          <Badge bg="success">Turno completado</Badge>
                        )}
                      </td>

                      {/* INCIDENCIA */}
                      <td>
                        {detalle.Incidencias?.tipo_incidencia ? (
                          <Badge bg="danger">
                            {detalle.Incidencias.tipo_incidencia}
                          </Badge>
                        ) : (
                          "Sin incidencia"
                        )}
                      </td>

                      {/* ACCIONES */}
                      <td>
                        <div className="d-flex gap-2 flex-wrap justify-content-center">
                          {!detalle.hora_salida &&
                            jornada?.estado !== "cerrada" &&
                            (!esEmpleado || esSuPropioRegistro) && (
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => {
                                  setDetalleSalida(detalle);
                                  setShowSalida(true);
                                }}
                              >
                                <i className="bi bi-box-arrow-right me-1"></i>
                                Salida
                              </Button>
                            )}

                          {jornada?.estado !== "cerrada" && !esEmpleado && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => {
                                setAsistenciaEliminar(detalle.id_asistencia);
                                setShowEliminar(true);
                              }}
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Modal.Body>

        <Modal.Footer>
          {jornada?.estado !== "cerrada" && rolUsuarioActual !== "empleado" && (
            <Button
              variant="warning"
              onClick={() => setShowCerrar(true)}
            >
              <i className="bi bi-lock-fill me-2"></i>
              Cerrar Jornada
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={handleClose}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ===================================== */}
      {/* MODAL REGISTRAR */}
      {/* ===================================== */}
      <ModalMarcarEntrada
        show={showRegistro}
        handleClose={() => setShowRegistro(false)}
        jornada={jornada}
        onRegistroExitoso={() => {
          cargarDetalle();
          if (onActualizar) {
            onActualizar();
          }
        }}
      />

      {/* ===================================== */}
      {/* MODAL ELIMINAR */}
      {/* ===================================== */}
      <ConfirmacionModal
        show={showEliminar}
        onHide={() => setShowEliminar(false)}
        onConfirm={eliminarRegistro}
        titulo="Eliminar asistencia"
        mensaje="¿Deseas eliminar esta asistencia?"
        variant="danger"
        textoBoton="Eliminar"
      />

      {/* ===================================== */}
      {/* MODAL CERRAR */}
      {/* ===================================== */}
      <ConfirmacionModal
        show={showCerrar}
        onHide={() => setShowCerrar(false)}
        onConfirm={cerrarJornada}
        titulo="Cerrar jornada"
        mensaje="Luego ya NO podrás registrar entradas, registrar salidas o eliminar asistencias."
        variant="warning"
        textoBoton="Cerrar Jornada"
      />

      {/* ===================================== */}
      {/* MODAL SALIDA */}
      {/* ===================================== */}
      <ConfirmacionModal
        show={showSalida}
        onHide={() => setShowSalida(false)}
        onConfirm={marcarSalida}
        titulo="Marcar salida"
        mensaje="¿Deseas marcar la salida de este empleado?"
        variant="success"
        textoBoton="Marcar Salida"
      />
    </>
  );
};

export default ModalDetalleJornada;
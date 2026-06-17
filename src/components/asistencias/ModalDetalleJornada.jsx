import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Spinner, Alert, Badge, Image, Row, Col, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import { supabase } from "../../database/supabaseconfig";
import ModalMarcarEntrada from "./ModalMarcarEntrada.jsx";
import ConfirmacionModal from "../ui/ConfirmacionModal.jsx";

const ModalDetalleJornada = ({ show, handleClose, jornada, onActualizar }) => {
  const [loading, setLoading] = useState(false);
  const [detalles, setDetalles] = useState([]);
  const [error, setError] = useState("");
  const [showEliminar, setShowEliminar] = useState(false);
  const [showCerrar, setShowCerrar] = useState(false);
  const [showSalida, setShowSalida] = useState(false);
  const [showRegistro, setShowRegistro] = useState(false);
  const [asistenciaEliminar, setAsistenciaEliminar] = useState(null);
  const [detalleSalida, setDetalleSalida] = useState(null);
  const [estadisticas, setEstadisticas] = useState({ presentes: 0, trabajando: 0, completados: 0, salieronAntes: 0, horasExtras: 0 });

  const userRole = localStorage.getItem("user-role");
  const userEmpId = localStorage.getItem("user-emp-id");

  useEffect(() => {
    if (show && jornada?.id_jornada) { cargarDetalle(); }
  }, [show, jornada]);

  const cargarDetalle = async () => {
    try {
      setLoading(true);
      let query = supabase.from("asistencias").select(`*, empleado (nombre, apellido, url_imagen), turnos (tipo_turno, hora_inicio, hora_fin), Incidencias (tipo_incidencia)`).eq("id_jornada", jornada.id_jornada);
      
      // Restricción para empleado
      if (userRole === "empleado" && userEmpId) {
        query = query.eq("id_empleado", parseInt(userEmpId));
      }

      const { data, error } = await query.order("hora_entrada", { ascending: true });
      if (error) throw error;
      setDetalles(data || []);
      calcularEstadisticas(data || []);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const calcularEstadisticas = (asistencias) => {
    setEstadisticas({
      presentes: asistencias.length,
      trabajando: asistencias.filter((a) => !a.hora_salida).length,
      completados: asistencias.filter((a) => a.estado_salida === "turno_completado").length,
      salieronAntes: asistencias.filter((a) => a.estado_salida === "salio_antes").length,
      horasExtras: asistencias.filter((a) => a.estado_salida === "horas_extras").length,
    });
  };

  const formatearHora = (fechaHora) => {
    if (!fechaHora) return "----";
    return new Date(fechaHora).toLocaleTimeString("es-NI", { hour: "2-digit", minute: "2-digit" });
  };

  const eliminarRegistro = async () => {
    try {
      const { error } = await supabase.from("asistencias").delete().eq("id_asistencia", asistenciaEliminar);
      if (error) throw error;
      setShowEliminar(false);
      cargarDetalle();
      if (onActualizar) onActualizar();
    } catch (err) { console.error(err); }
  };

  const marcarSalida = async () => {
    if (!detalleSalida) return;
    try {
      const ahora = new Date();
      const entrada = new Date(detalleSalida.hora_entrada);
      const horas = (ahora - entrada) / (1000 * 60 * 60);
      let estadoSalida = "turno_completado";
      const { error } = await supabase.from("asistencias").update({ hora_salida: ahora.toISOString(), horas_trabajadas: horas.toFixed(2), estado_salida }).eq("id_asistencia", detalleSalida.id_asistencia);
      if (error) throw error;
      setShowSalida(false);
      cargarDetalle();
      if (onActualizar) onActualizar();
    } catch (err) { console.error(err); }
  };

  const cerrarJornada = async () => {
    const { error } = await supabase.from("jornadas_asistencia").update({ estado: "cerrada" }).eq("id_jornada", jornada.id_jornada);
    if (!error) { setShowCerrar(false); cargarDetalle(); if (onActualizar) onActualizar(); }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title><i className="bi bi-calendar3 me-2"></i>Detalle Jornada <Badge bg={jornada?.estado === "cerrada" ? "danger" : "success"} className="ms-3">{jornada?.fecha}</Badge></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {jornada?.estado === "cerrada" && <Alert variant="danger"><strong>Jornada cerrada</strong>. No se permiten más modificaciones.</Alert>}
          <Row className="mb-4">
            <Col md={3}><Card className="shadow-sm border-0 bg-primary text-white"><Card.Body className="text-center"><h3>{estadisticas.presentes}</h3><div>Presentes</div></Card.Body></Card></Col>
            <Col md={3}><Card className="shadow-sm border-0 bg-warning text-dark"><Card.Body className="text-center"><h3>{estadisticas.trabajando}</h3><div>Trabajando</div></Card.Body></Card></Col>
            <Col md={3}><Card className="shadow-sm border-0 bg-success text-white"><Card.Body className="text-center"><h3>{estadisticas.completados}</h3><div>Completados</div></Card.Body></Card></Col>
            <Col md={3}><Card className="shadow-sm border-0 bg-danger text-white"><Card.Body className="text-center"><h3>{estadisticas.salieronAntes}</h3><div>Salieron antes</div></Card.Body></Card></Col>
          </Row>
          {jornada?.estado !== "cerrada" && (
            <div className="mb-3 d-flex justify-content-end">
              <Button variant="success" onClick={() => setShowRegistro(true)}><i className="bi bi-person-plus-fill me-2"></i>Registrar asistencia</Button>
            </div>
          )}
          {loading ? <div className="text-center py-5"><Spinner animation="border" /></div> : detalles.length === 0 ? <Alert variant="warning">No hay asistencias registradas.</Alert> : (
            <Table striped bordered hover responsive className="align-middle">
              <thead className="table-dark">
                <tr><th>Foto</th><th>Empleado</th><th>Turno</th><th>Entrada</th><th>Salida</th><th>Horas</th><th>Estado</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {detalles.map((detalle) => (
                  <tr key={detalle.id_asistencia}>
                    <td className="text-center"><Image src={detalle.empleado?.url_imagen || "https://via.placeholder.com/50"} roundedCircle width={50} height={50} style={{ objectFit: "cover" }} /></td>
                    <td><strong>{detalle.empleado?.nombre}</strong><br />{detalle.empleado?.apellido}</td>
                    <td><Badge bg="info">{detalle.turnos?.tipo_turno}</Badge></td>
                    <td><div>{formatearHora(detalle.hora_entrada)}</div></td>
                    <td>{detalle.hora_salida ? <div>{formatearHora(detalle.hora_salida)}</div> : <Badge bg="warning">Pendiente</Badge>}</td>
                    <td>{detalle.horas_trabajadas ? `${parseFloat(detalle.horas_trabajadas).toFixed(2)} h` : "----"}</td>
                    <td><Badge bg={!detalle.hora_salida ? "warning" : "success"}>{!detalle.hora_salida ? "Trabajando" : "Completado"}</Badge></td>
                    <td>
                      <div className="d-flex gap-2">
                        {!detalle.hora_salida && jornada?.estado !== "cerrada" && <Button variant="success" size="sm" onClick={() => { setDetalleSalida(detalle); setShowSalida(true); }}>Salida</Button>}
                        {userRole !== "empleado" && jornada?.estado !== "cerrada" && <Button variant="outline-danger" size="sm" onClick={() => { setAsistenciaEliminar(detalle.id_asistencia); setShowEliminar(true); }}><i className="bi bi-trash"></i></Button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          {userRole !== "empleado" && jornada?.estado !== "cerrada" && <Button variant="warning" onClick={() => setShowCerrar(true)}><i className="bi bi-lock-fill me-2"></i>Cerrar Jornada</Button>}
          <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
      <ModalMarcarEntrada show={showRegistro} handleClose={() => setShowRegistro(false)} jornada={jornada} onRegistroExitoso={() => { cargarDetalle(); if (onActualizar) onActualizar(); }} />
      <ConfirmacionModal show={showEliminar} onHide={() => setShowEliminar(false)} onConfirm={eliminarRegistro} titulo="Eliminar asistencia" mensaje="¿Deseas eliminar esta asistencia?" variant="danger" textoBoton="Eliminar" />
      <ConfirmacionModal show={showCerrar} onHide={() => setShowCerrar(false)} onConfirm={cerrarJornada} titulo="Cerrar jornada" mensaje="Luego ya no podrás modificar registros." variant="warning" textoBoton="Cerrar Jornada" />
      <ConfirmacionModal show={showSalida} onHide={() => setShowSalida(false)} onConfirm={marcarSalida} titulo="Marcar salida" mensaje="¿Deseas marcar la salida?" variant="success" textoBoton="Marcar Salida" />
    </>
  );
};

export default ModalDetalleJornada;
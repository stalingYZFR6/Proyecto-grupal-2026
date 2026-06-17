import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Alert, Spinner } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const ModalMarcarEntrada = ({ show, handleClose, onRegistroExitoso }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [empleados, setEmpleados] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [incidencias, setIncidencias] = useState([]);

  const userRole = localStorage.getItem("user-role");
  const userEmpId = localStorage.getItem("user-emp-id");

  const [formData, setFormData] = useState({
    id_empleado: userRole === "empleado" ? userEmpId : "",
    id_turno: "",
    id_incidencia: "",
    estado_asistencia: "Presente",
  });

  useEffect(() => {
    if (show) {
      cargarDatos();
      if (userRole === "empleado" && userEmpId) {
        setFormData(prev => ({ ...prev, id_empleado: userEmpId }));
      }
    }
  }, [show]);

  const cargarDatos = async () => {
    try {
      const { data: empleadosData } = await supabase.from("empleado").select("*").order("nombre");
      const { data: turnosData } = await supabase.from("turnos").select("*");
      const { data: incidenciasData } = await supabase.from("Incidencias").select("*");
      setEmpleados(empleadosData || []);
      setTurnos(turnosData || []);
      setIncidencias(incidenciasData || []);
    } catch (err) { setError("Error cargando datos"); }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const ahora = new Date();
      const fecha = ahora.toISOString().split("T")[0];
      let { data: jornada } = await supabase.from("jornadas_asistencia").select("*").eq("fecha", fecha).maybeSingle();

      if (!jornada) {
        const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const { data: nuevaJornada, error: cErr } = await supabase.from("jornadas_asistencia").insert([{ fecha, estado: "abierta", dia_semana: dias[ahora.getDay()] }]).select().single();
        if (cErr) throw cErr;
        jornada = nuevaJornada;
      }

      const { data: existe } = await supabase.from("asistencias").select("id_asistencia").eq("id_jornada", jornada.id_jornada).eq("id_empleado", formData.id_empleado);
      if (existe.length > 0) { setError("Ya tienes entrada registrada hoy"); setLoading(false); return; }

      const { data, error } = await supabase.from("asistencias").insert([{
        id_empleado: formData.id_empleado, id_turno: formData.id_turno, id_incidencia: formData.id_incidencia || null,
        estado_as<dyad-write path="src/components/asistencias/ModalMarcarEntrada.jsx" description="Completando el modal de registro de entrada con restricciones de rol para empleados.">
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Alert, Spinner } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const ModalMarcarEntrada = ({ show, handleClose, onRegistroExitoso }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [empleados, setEmpleados] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [incidencias, setIncidencias] = useState([]);

  const userRole = localStorage.getItem("user-role");
  const userEmpId = localStorage.getItem("user-emp-id");

  const [formData, setFormData] = useState({
    id_empleado: "",
    id_turno: "",
    id_incidencia: "",
    estado_asistencia: "Presente",
  });

  useEffect(() => {
    if (show) {
      cargarDatos();
      if (userRole === "empleado" && userEmpId) {
        setFormData(prev => ({ ...prev, id_empleado: userEmpId }));
      }
    }
  }, [show, userRole, userEmpId]);

  const cargarDatos = async () => {
    try {
      const { data: empleadosData } = await supabase.from("empleado").select("*").order("nombre");
      const { data: turnosData } = await supabase.from("turnos").select("*");
      const { data: incidenciasData } = await supabase.from("Incidencias").select("*");
      setEmpleados(empleadosData || []);
      setTurnos(turnosData || []);
      setIncidencias(incidenciasData || []);
    } catch (err) { setError("Error cargando datos"); }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const ahora = new Date();
      const fecha = ahora.toISOString().split("T")[0];
      let { data: jornada } = await supabase.from("jornadas_asistencia").select("*").eq("fecha", fecha).maybeSingle();

      if (!jornada) {
        const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const { data: nuevaJornada, error: cErr } = await supabase.from("jornadas_asistencia").insert([{ fecha, estado: "abierta", dia_semana: dias[ahora.getDay()] }]).select().single();
        if (cErr) throw cErr;
        jornada = nuevaJornada;
      }

      const { data: existe } = await supabase.from("asistencias").select("id_asistencia").eq("id_jornada", jornada.id_jornada).eq("id_empleado", formData.id_empleado);
      
      if (existe && existe.length > 0) { 
        setError("Ya tienes una entrada registrada en la jornada de hoy."); 
        setLoading(false); 
        return; 
      }

      const { data, error } = await supabase.from("asistencias").insert([{
        id_empleado: parseInt(formData.id_empleado), 
        id_turno: parseInt(formData.id_turno), 
        id_incidencia: formData.id_incidencia ? parseInt(formData.id_incidencia) : null,
        estado_asistencia: formData.estado_asistencia,
        hora_entrada: ahora.toISOString(),
        id_jornada: jornada.id_jornada
      }]).select().single();

      if (error) throw error;

      if (onRegistroExitoso) onRegistroExitoso(data);
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title><i className="bi bi-box-arrow-in-right me-2"></i>Marcar Entrada</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Empleado</Form.Label>
                <Form.Select 
                  name="id_empleado" 
                  value={formData.id_empleado} 
                  onChange={handleChange} 
                  required 
                  disabled={userRole === "empleado"}
                >
                  <option value="">Seleccione empleado</option>
                  {empleados.map(emp => (
                    <option key={emp.id_empleado} value={emp.id_empleado}>{emp.nombre} {emp.apellido}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Turno</Form.Label>
                <Form.Select name="id_turno" value={formData.id_turno} onChange={handleChange} required>
                  <option value="">Seleccione turno</option>
                  {turnos.map(t => (
                    <option key={t.id_turno} value={t.id_turno}>{t.tipo_turno}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select name="estado_asistencia" value={formData.estado_asistencia} onChange={handleChange}>
                  <option value="Presente">Presente</option>
                  <option value="Tardanza">Tardanza</option>
                  <option value="Permiso">Permiso</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Incidencia (Opcional)</Form.Label>
                <Form.Select name="id_incidencia" value={formData.id_incidencia} onChange={handleChange}>
                  <option value="">Ninguna</option>
                  {incidencias.map(inc => (
                    <option key={inc.id_incidencia} value={inc.id_incidencia}>{inc.tipo_incidencia}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button type="submit" variant="success" disabled={loading}>
            {loading ? <Spinner size="sm" className="me-2" /> : <i className="bi bi-check2-circle me-2"></i>}
            Registrar Entrada
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalMarcarEntrada;
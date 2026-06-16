import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Alert, Spinner } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const ModalMarcarEntrada = ({ show, handleClose, onRegistroExitoso }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [empleados, setEmpleados] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [incidencias, setIncidencias] = useState([]);
  const [perfilUsuario, setPerfilUsuario] = useState(null);

  const [formData, setFormData] = useState({
    id_empleado: "",
    id_turno: "",
    id_incidencia: "",
    estado_asistencia: "Presente",
  });

  useEffect(() => {
    const stored = localStorage.getItem("usuario-supabase");
    if (stored) {
      const parsed = JSON.parse(stored);
      setPerfilUsuario(parsed);
      if (parsed.rol === "empleado" && parsed.id_empleado) {
        setFormData(prev => ({ ...prev, id_empleado: parsed.id_empleado }));
      }
    }
  }, [show]);

  useEffect(() => {
    if (show) cargarDatos();
  }, [show]);

  const cargarDatos = async () => {
    try {
      const { data: empData } = await supabase.from("empleado").select("*").order("nombre");
      const { data: turnData } = await supabase.from("turnos").select("*");
      const { data: incData } = await supabase.from("Incidencias").select("*");

      setEmpleados(empData || []);
      setTurnos(turnData || []);
      setIncidencias(incData || []);
    } catch (err) {
      setError("Error cargando datos");
    }
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
      const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

      let { data: jornada } = await supabase
        .from("jornadas_asistencia")
        .select("*")
        .eq("fecha", fecha)
        .maybeSingle();

      if (!jornada) {
        const { data: nuevaJ } = await supabase.from("jornadas_asistencia")
          .insert([{ fecha, estado: "abierta", dia_semana: dias[ahora.getDay()] }])
          .select().single();
        jornada = nuevaJ;
      }

      const { data: existe } = await supabase.from("asistencias")
        .select("id_asistencia")
        .eq("id_jornada", jornada.id_jornada)
        .eq("id_empleado", formData.id_empleado);

      if (existe?.length > 0) {
        setError("Ya tienes una entrada registrada hoy.");
        setLoading(false);
        return;
      }

      const { data, error: insError } = await supabase.from("asistencias")
        .insert([{
          id_empleado: formData.id_empleado,
          id_turno: formData.id_turno,
          id_incidencia: formData.id_incidencia || null,
          estado_asistencia: formData.estado_asistencia,
          hora_entrada: ahora.toISOString(),
          id_jornada: jornada.id_jornada,
        }]).select();

      if (insError) throw insError;
      onRegistroExitoso(data[0]);
      handleClose();
    } catch (err) {
      setError(err.message || "Error registrando asistencia");
    } finally {
      setLoading(false);
    }
  };

  const esEmpleado = perfilUsuario?.rol === "empleado";

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
                <Form.Select name="id_empleado" value={formData.id_empleado} onChange={handleChange} required disabled={esEmpleado}>
                  <option value="">Seleccione...</option>
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
                  <option value="">Seleccione...</option>
                  {turnos.map(t => <option key={t.id_turno} value={t.id_turno}>{t.tipo_turno}</option>)}
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
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button type="submit" variant="success" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Registrar Entrada"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalMarcarEntrada;
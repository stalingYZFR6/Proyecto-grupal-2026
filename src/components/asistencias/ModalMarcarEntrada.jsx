import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";

import { supabase } from "../../database/supabaseconfig";

const ModalMarcarEntrada = ({
  show,
  handleClose,
  onRegistroExitoso,
}) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [empleados, setEmpleados] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [incidencias, setIncidencias] = useState([]);

  const [rolUsuarioActual, setRolUsuarioActual] = useState("");
  const [idEmpleadoActual, setIdEmpleadoActual] = useState("");
  const [nombreEmpleadoActual, setNombreEmpleadoActual] = useState("");

  const [formData, setFormData] = useState({
    id_empleado: "",
    id_turno: "",
    id_incidencia: "",
    estado_asistencia: "Presente",
  });

  useEffect(() => {
    if (show) {
      cargarDatos();
    }
  }, [show]);

  const cargarDatos = async () => {
    try {
      // OBTENER PERFIL DE USUARIO LOGUEADO
      const { data: { user } } = await supabase.auth.getUser();
      let rol = "";
      let idEmp = "";
      let nombreEmp = "";

      if (user) {
        const { data: perfil } = await supabase
          .from("usuarios")
          .select("rol, id_empleado, empleado(nombre, apellido)")
          .eq("id_auth", user.id)
          .maybeSingle();
        if (perfil) {
          rol = perfil.rol;
          setRolUsuarioActual(perfil.rol);
          if (perfil.rol === "empleado") {
            idEmp = perfil.id_empleado;
            nombreEmp = `${perfil.empleado?.nombre} ${perfil.empleado?.apellido}`;
            setIdEmpleadoActual(perfil.id_empleado);
            setNombreEmpleadoActual(nombreEmp);
            setFormData(prev => ({
              ...prev,
              id_empleado: perfil.id_empleado
            }));
          }
        }
      }

      // EMPLEADOS (Solo si no es empleado)
      if (rol !== "empleado") {
        const { data: empleadosData, error: empError } =
          await supabase
            .from("empleado")
            .select("*")
            .order("nombre");

        if (empError) throw empError;
        setEmpleados(empleadosData || []);
      }

      // TURNOS
      const { data: turnosData, error: turnosError } =
        await supabase
          .from("turnos")
          .select("*");

      if (turnosError) throw turnosError;

      // INCIDENCIAS
      const { data: incidenciasData, error: incidenciasError } =
        await supabase
          .from("Incidencias")
          .select("*");

      if (incidenciasError) throw incidenciasError;

      setTurnos(turnosData || []);
      setIncidencias(incidenciasData || []);

    } catch (err) {
      console.error(err);
      setError("Error cargando datos");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const limpiarFormulario = () => {
    setFormData({
      id_empleado: rolUsuarioActual === "empleado" ? idEmpleadoActual : "",
      id_turno: "",
      id_incidencia: "",
      estado_asistencia: "Presente",
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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
              setError(`Acceso denegado: Solo puedes registrar asistencia conectado a la red autorizada de la empresa (Tu IP: ${userIP}, Autorizada: ${ipAutorizada})`);
              setLoading(false);
              return;
            }
          } catch (ipErr) {
            console.error("Error al obtener IP:", ipErr);
            setError("No se pudo verificar tu dirección IP. Por favor, intenta de nuevo.");
            setLoading(false);
            return;
          }
        }
      }

      const ahora = new Date();
      const fecha = ahora.toISOString().split("T")[0];
      const dias = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
      ];
      const dia_semana = dias[ahora.getDay()];

      // ======================================
      // BUSCAR JORNADA DEL DÍA
      // ======================================
      let { data: jornada, error: jornadaError } =
        await supabase
          .from("jornadas_asistencia")
          .select("*")
          .eq("fecha", fecha)
          .maybeSingle();

      if (jornadaError) throw jornadaError;

      // ======================================
      // SI NO EXISTE -> CREARLA
      // ======================================
      if (!jornada) {
        const { data: nuevaJornada, error: crearError } =
          await supabase
            .from("jornadas_asistencia")
            .insert([
              {
                fecha,
                estado: "abierta",
                dia_semana,
              },
            ])
            .select()
            .single();

        if (crearError) throw crearError;
        jornada = nuevaJornada;
      }

      // ======================================
      // VALIDAR DUPLICADO
      // ======================================
      const { data: existe } =
        await supabase
          .from("asistencias")
          .select("id_asistencia")
          .eq("id_jornada", jornada.id_jornada)
          .eq("id_empleado", formData.id_empleado);

      if (existe.length > 0) {
        setError(
          "Este empleado ya tiene entrada registrada hoy"
        );
        setLoading(false);
        return;
      }

      // ======================================
      // REGISTRAR ENTRADA
      // ======================================
      const asistenciaData = {
        id_empleado: formData.id_empleado,
        id_turno: formData.id_turno,
        id_incidencia: formData.id_incidencia || null,
        estado_asistencia: formData.estado_asistencia,
        hora_entrada: ahora.toISOString(),
        id_jornada: jornada.id_jornada,
      };

      const { data, error } =
        await supabase
          .from("asistencias")
          .insert([asistenciaData])
          .select(`
            *,
            empleado (
              nombre,
              apellido,
              url_imagen
            ),
            turnos (
              tipo_turno
            )
          `);

      if (error) throw error;

      if (onRegistroExitoso) {
        onRegistroExitoso(data[0]);
      }

      limpiarFormulario();
      handleClose();

    } catch (err) {
      console.error(err);
      setError(
        err.message ||
        "Error registrando asistencia"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        limpiarFormulario();
        handleClose();
      }}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-box-arrow-in-right me-2"></i>
          Marcar Entrada
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}

          <Row>
            <Col md={6}>
              {rolUsuarioActual === "empleado" ? (
                <Form.Group className="mb-3">
                  <Form.Label>Empleado</Form.Label>
                  <Form.Control
                    type="text"
                    value={nombreEmpleadoActual}
                    disabled
                  />
                </Form.Group>
              ) : (
                <Form.Group className="mb-3">
                  <Form.Label>Empleado</Form.Label>
                  <Form.Select
                    name="id_empleado"
                    value={formData.id_empleado}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Seleccione un empleado
                    </option>
                    {empleados.map((emp) => (
                      <option
                        key={emp.id_empleado}
                        value={emp.id_empleado}
                      >
                        {emp.nombre} {emp.apellido}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Turno</Form.Label>
                <Form.Select
                  name="id_turno"
                  value={formData.id_turno}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Seleccione un turno
                  </option>
                  {turnos.map((turno) => (
                    <option
                      key={turno.id_turno}
                      value={turno.id_turno}
                    >
                      {turno.tipo_turno}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  name="estado_asistencia"
                  value={formData.estado_asistencia}
                  onChange={handleChange}
                >
                  <option value="Presente">
                    Presente
                  </option>
                  <option value="Tardanza">
                    Tardanza
                  </option>
                  <option value="Permiso">
                    Permiso
                  </option>
                  <option value="Ausente">
                    Ausente
                  </option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Incidencia</Form.Label>
                <Form.Select
                  name="id_incidencia"
                  value={formData.id_incidencia}
                  onChange={handleChange}
                >
                  <option value="">
                    Sin incidencia
                  </option>
                  {incidencias.map((inc) => (
                    <option
                      key={inc.id_incidencia}
                      value={inc.id_incidencia}
                    >
                      {inc.tipo_incidencia}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              limpiarFormulario();
              handleClose();
            }}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="success"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  animation="border"
                  size="sm"
                  className="me-2"
                />
                Guardando...
              </>
            ) : (
              <>
                <i className="bi bi-save me-2"></i>
                Registrar Entrada
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalMarcarEntrada;
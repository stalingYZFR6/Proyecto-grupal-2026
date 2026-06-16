import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Badge } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import Swal from "sweetalert2";
import ModalEliminacionEmpleado from "../components/empleados/ModalEliminacionEmpleado";
import ModalEdicionEmpleado from "../components/empleados/ModalEdicionEmpleado";
import ModalRegistroEmpleado from "../components/empleados/ModalRegistroEmpleado";
import TarjetaEmpleado from "../components/empleados/TarjetaEmpleado";

const Empleados = () => {
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({ nombre: "", apellido: "", cedula: "", correo: "", telefono: "", direccion: "", archivo_imagen: null, preview_imagen: "", url_imagen: "", });
  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [empleadoEditar, setEmpleadoEditar] = useState(null);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);
  const userData = JSON.parse(localStorage.getItem("usuario-supabase") || "{}");
  const userId = userData.id_empleado; // ID of the logged-in employee
  const isAdmin = userData.rol === "admin";

  const obtenerEmpleados = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase.from("empleado").select("*").order("nombre", { ascending: true });
      if (error) throw error;
      setEmpleados(data || []);
    } catch (error) {
      console.error("Error al cargar empleados:", error);
      setToast({ mostrar: true, mensaje: "Error al cargar empleados.", tipo: "error" });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  // Filter employees to only show the logged-in employee's record
  const misEmpleados = empleados.filter(emp => emp.id_empleado === userId);
  const empleadosFiltrados = misEmpleados.filter((emp) => `${emp.nombre} ${emp.apellido}`.toLowerCase().includes(busqueda.toLowerCase()) || emp.cedula.includes(busqueda));

  return (
    <Container className="py-5 mt-4">
      <div className="mb-5">
        <Row className="align-items-end g-4">
          <Col lg={6}>
            <div className="d-flex align-items-center gap-3 mb-2">
              <div className="bg-primary bg-opacity-10 p-3 rounded-4">
                <i className="bi bi-people-fill text-primary fs-3"></i>
              </div>
              <div>
                <h2 className="fw-bold mb-0">Gestión de Personal</h2>
                <p className="text-muted mb-0">Administra y supervisa a tu equipo de trabajo</p>
              </div>
            </div>
          </Col>
          <Col lg={6} className="text-lg-end">
            {isAdmin && (
              <Button onClick={() => setMostrarModal(true)} className="btn-premium-primary shadow-sm">
                <i className="bi bi-person-plus-fill me-2"></i> Registrar Nuevo Empleado
              </Button>
            )}
          </Col>
        </Row>
      </div>

      <div className="mb-4">
        <Row className="g-3 align-items-center">
          <Col md={8} lg={6}>
            <div className="search-container">
              <i className="bi bi-search search-icon"></i>
              <Form.Control type="text" placeholder="Buscar por nombre, apellido o cédula..." className="search-input" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </div>
          </Col>
          <Col md={4} lg={6} className="text-md-end">
            <Badge bg="primary" className="bg-opacity-10 text-primary border-0 rounded-pill px-4 py-2 fs-6 fw-semibold">
              {empleadosFiltrados.length} Colaboradores
            </Badge>
          </Col>
        </Row>
      </div>

      {cargando ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted fw-medium">Sincronizando datos...</p>
        </div>
      ) : (
        <div className="fade-in">
          <div className="mb-4">
            <Badge bg="primary" className="bg-opacity-10 text-primary border-0 rounded-pill px-4 py-2 fs-6 fw-semibold">
              {empleadosFiltrados.length} Colaboradores Registrados
            </Badge>
          </div>
          {empleadosFiltrados.length > 0 ? (
            <Row className="g-4">
              {empleadosFiltrados.map((empleado) => (
                <Col key={empleado.id_empleado} xs={12} sm={6} lg={4} xl={3}>
                  <TarjetaEmpleado
                    empleados={[empleado]}
                    abrirModalEdicion={(emp) => { setEmpleadoEditar(emp); setMostrarModalEdicion(true); }}
                    abrirModalEliminacion={(emp) => { setEmpleadoAEliminar(emp); setMostrarModalEliminacion(true); }}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-5 bg-premium-light rounded-4 border border-dashed">
              <i className="bi bi-person-x display-4 text-muted mb-3"></i>
              <h5 className="text-muted">No se encontraron coincidencias</h5>
            </div>
          )}
        </div>
    </Container>
  );
};

export default Empleados;
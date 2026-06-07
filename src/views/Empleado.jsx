import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Badge, Form } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import ModalEliminacionEmpleado from "../components/empleados/ModalEliminacionEmpleado";
import ModalEdicionEmpleado from "../components/empleados/ModalEdicionEmpleado";
import ModalRegistroEmpleado from "../components/empleados/ModalRegistroEmpleado";
import TarjetaEmpleado from "../components/empleados/TarjetaEmpleado";
import TablaEmpleados from "../components/empleados/TablaEmpleados";
import NotificacionOperacion from "../components/NotificacionOperacion";

const Empleados = () => {
    const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
    const [mostrarModal, setMostrarModal] = useState(false);
    const [nuevoEmpleado, setNuevoEmpleado] = useState({
        nombre: "", apellido: "", cedula: "", correo: "", telefono: "", direccion: "",
        archivo_imagen: null, preview_imagen: "", url_imagen: "",
    });
    const [empleados, setEmpleados] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    const [empleadoEditar, setEmpleadoEditar] = useState(null);
    const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
    const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);

    const cargarEmpleados = async () => {
        try {
            setCargando(true);
            const { data, error } = await supabase.from("empleado").select("*").order("id_empleado", { ascending: true });
            if (error) throw error;
            setEmpleados(data || []);
        } catch (err) {
            setToast({ mostrar: true, mensaje: "Error al cargar empleados.", tipo: "error" });
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => { cargarEmpleados(); }, []);

    const empleadosFiltrados = empleados.filter((emp) =>
        `${emp.nombre} ${emp.apellido}`.toLowerCase().includes(busqueda.toLowerCase()) ||
        emp.cedula.toLowerCase().includes(busqueda.toLowerCase())
    );

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
                        <Button onClick={() => setMostrarModal(true)} className="btn-premium-primary shadow-sm">
                            <i className="bi bi-person-plus-fill me-2"></i>
                            Registrar Nuevo Empleado
                        </Button>
                    </Col>
                </Row>
            </div>

            <div className="mb-5">
                <Row className="g-3 align-items-center">
                    <Col md={8} lg={6}>
                        <div className="search-container">
                            <i className="bi bi-search search-icon"></i>
                            <Form.Control
                                type="text"
                                placeholder="Buscar por nombre, apellido o cédula..."
                                className="search-input"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
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
                    <TarjetaEmpleado
                        empleados={empleadosFiltrados}
                        abrirModalEdicion={(emp) => { setEmpleadoEditar(emp); setMostrarModalEdicion(true); }}
                        abrirModalEliminacion={(emp) => { setEmpleadoAEliminar(emp); setMostrarModalEliminacion(true); }}
                    />
                </div>
            )}

            <ModalRegistroEmpleado mostrarModal={mostrarModal} setMostrarModal={setMostrarModal} nuevoEmpleado={nuevoEmpleado} setNuevoEmpleado={setNuevoEmpleado} manejoCambioInput={(e) => setNuevoEmpleado({...nuevoEmpleado, [e.target.name]: e.target.value})} agregarEmpleado={cargarEmpleados} />
            <ModalEdicionEmpleado mostrarModalEdicion={mostrarModalEdicion} setMostrarModalEdicion={setMostrarModalEdicion} empleadoEditar={empleadoEditar} setEmpleadoEditar={setEmpleadoEditar} manejoCambioInputEdicion={(e) => setEmpleadoEditar({...empleadoEditar, [e.target.name]: e.target.value})} actualizarEmpleado={cargarEmpleados} />
            <ModalEliminacionEmpleado mostrarModalEliminacion={mostrarModalEliminacion} setMostrarModalEliminacion={setMostrarModalEliminacion} eliminarEmpleado={cargarEmpleados} empleado={empleadoAEliminar} />
            <NotificacionOperacion mostrar={toast.mostrar} mensaje={toast.mensaje} tipo={toast.tipo} onCerrar={() => setToast({ ...toast, mostrar: false })} />
        </Container>
    );
};

export default Empleados;
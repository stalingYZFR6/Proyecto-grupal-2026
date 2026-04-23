import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Card, Badge, Form } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

// Importa tus componentes adaptados
import ModalEliminacionEmpleado from "../components/empleados/ModalEliminacionEmpleado";
import ModalEdicionEmpleado from "../components/empleados/ModalEdicionEmpleado";
import ModalRegistroEmpleado from "../components/empleados/ModalRegistroEmpleado";
import TarjetaEmpleado from "../components/empleados/TarjetaEmpleado";
import TablaEmpleados from "../components/empleados/TablaEmpleados";
import NotificacionOperacion from "../components/NotificacionOperacion";

const Empleados = () => {

    const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
    const [mostrarModal, setMostrarModal] = useState(false);

    // Estado para nuevo empleado
    const [nuevoEmpleado, setNuevoEmpleado] = useState({
        nombre: "",
        apellido: "",
        cedula: "",
        correo: "",
        telefono: "",
        direccion: "",
    });

    const [empleados, setEmpleados] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState("");   // ← Añadido para búsqueda

    // Estados para edición y eliminación (por si los necesitas después)
    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
    const [empleadoEditar, setEmpleadoEditar] = useState(null);
    const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);

    // Manejo de cambios en los inputs del modal
    const manejoCambioInput = (e) => {
        const { name, value } = e.target;
        setNuevoEmpleado((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 👇 AGREGA ESTE JUSTO DEBAJO
    const manejoCambioInputEdicion = (e) => {
        const { name, value } = e.target;
        setEmpleadoEditar((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    // Función para agregar empleado
    const agregarEmpleado = async () => {
        try {
            if (!nuevoEmpleado.nombre.trim() ||
                !nuevoEmpleado.apellido.trim() ||
                !nuevoEmpleado.cedula.trim()) {
                setToast({
                    mostrar: true,
                    mensaje: "Los campos Nombre, Apellido y Cédula son obligatorios.",
                    tipo: "advertencia",
                });
                return;
            }

            const { error } = await supabase
                .from("Empleado")
                .insert([
                    {
                        nombre: nuevoEmpleado.nombre,
                        apellido: nuevoEmpleado.apellido,
                        cedula: nuevoEmpleado.cedula,
                        correo: nuevoEmpleado.correo || null,
                        telefono: nuevoEmpleado.telefono || null,
                        direccion: nuevoEmpleado.direccion || null,
                    },
                ]);

            if (error) {
                console.error("Error al agregar empleado:", error.message);
                setToast({
                    mostrar: true,
                    mensaje: "Error al registrar el empleado. Verifique la cédula (debe ser única).",
                    tipo: "error",
                });
                return;
            }

            // Éxito
            setToast({
                mostrar: true,
                mensaje: `Empleado ${nuevoEmpleado.nombre} ${nuevoEmpleado.apellido} registrado exitosamente.`,
                tipo: "exito",
            });

            // Limpiar formulario y cerrar modal
            setNuevoEmpleado({
                nombre: "",
                apellido: "",
                cedula: "",
                correo: "",
                telefono: "",
                direccion: "",
            });
            setMostrarModal(false);

            await cargarEmpleados();

        } catch (err) {
            console.error("Excepción al agregar empleado:", err.message);
            setToast({
                mostrar: true,
                mensaje: "Error inesperado al registrar el empleado.",
                tipo: "error",
            });
        }
    };

     // Función para editar empleado
    const actualizarEmpleado = async () => {
    try {
        if (!empleadoEditar) return;

        const { error } = await supabase
            .from("Empleado")
            .update({
                nombre: empleadoEditar.nombre,
                apellido: empleadoEditar.apellido,
                cedula: empleadoEditar.cedula,
                correo: empleadoEditar.correo || null,
                telefono: empleadoEditar.telefono || null,
                direccion: empleadoEditar.direccion || null,
            })
            .eq("id_empleado", empleadoEditar.id_empleado);

        if (error) {
            setToast({
                mostrar: true,
                mensaje: "Error al actualizar el empleado.",
                tipo: "error",
            });
            return;
        }

        setToast({
            mostrar: true,
            mensaje: "Empleado actualizado correctamente.",
            tipo: "exito",
        });

        setMostrarModalEdicion(false);
        setEmpleadoEditar(null);
        await cargarEmpleados();

    } catch (err) {
        setToast({
            mostrar: true,
            mensaje: "Error inesperado al actualizar.",
            tipo: "error",
        });
    }
};


    // Función para eliminar empleado
    const eliminarEmpleado = async () => {
        try {
            if (!empleadoAEliminar) return;

            const { error } = await supabase
                .from("Empleado")
                .delete()
                .eq("id_empleado", empleadoAEliminar.id_empleado);

            if (error) {
                setToast({
                    mostrar: true,
                    mensaje: "Error al eliminar el empleado.",
                    tipo: "error",
                });
                return;
            }

            setToast({
                mostrar: true,
                mensaje: "Empleado eliminado correctamente.",
                tipo: "exito",
            });

            setMostrarModalEliminacion(false);
            setEmpleadoAEliminar(null);
            await cargarEmpleados();

        } catch (err) {
            setToast({
                mostrar: true,
                mensaje: "Error inesperado al eliminar.",
                tipo: "error",
            });
        }
    };

    // Función para cargar empleados
    const cargarEmpleados = async () => {
        try {
            setCargando(true);
            const { data, error } = await supabase
                .from("Empleado")
                .select("*")
                .order("id_empleado", { ascending: true });

            if (error) {
                console.error("Error al cargar empleados:", error.message);
                setToast({
                    mostrar: true,
                    mensaje: "Error al cargar la lista de empleados.",
                    tipo: "error",
                });
                return;
            }

            setEmpleados(data || []);
        } catch (err) {
            console.error("Excepción al cargar empleados:", err.message);
            setToast({
                mostrar: true,
                mensaje: "Error inesperado al cargar empleados.",
                tipo: "error",
            });
        } finally {
            setCargando(false);
        }
    };

    // Abrir modal de edición
    const abrirModalEdicion = (empleado) => {
        setEmpleadoEditar(empleado);
        setMostrarModalEdicion(true);
    };

    // Abrir modal de eliminación
    const abrirModalEliminacion = (empleado) => {
        setEmpleadoAEliminar(empleado);
        setMostrarModalEliminacion(true);
    };

    // Filtrado de empleados (mantengo la funcionalidad original)
    const empleadosFiltrados = empleados.filter((emp) =>
        `${emp.nombre} ${emp.apellido}`.toLowerCase().includes(busqueda.toLowerCase()) ||
        emp.cedula.toLowerCase().includes(busqueda.toLowerCase())
    );

    // Cargar empleados al montar el componente
    useEffect(() => {
        cargarEmpleados();
    }, []);

    return (
        <Container fluid className="py-4 px-3 px-md-4">
            {/* Header Moderno */}
            <Row className="align-items-center mb-4">
                <Col>
                    <div className="d-flex align-items-center gap-3">
                        <i className="bi bi-people-fill fs-1 text-primary"></i>
                        <div>
                            <h2 className="mb-1 fw-bold">Gestión de Empleados</h2>
                            <p className="text-muted mb-0">Administra el personal registrado en el sistema</p>
                        </div>
                    </div>
                </Col>
                <Col xs="auto">
                    <Col xs="auto">
                        <Button
                            onClick={() => setMostrarModal(true)}
                            variant="primary"
                            className="d-flex align-items-center justify-content-center gap-2 shadow-sm"
                            style={{ minWidth: "45px" }}
                        >
                            <i className="bi bi-plus-lg"></i>

                            {/* Texto solo en pantallas medianas o grandes */}
                            <span className="d-none d-md-inline">
                                Nuevo Empleado
                            </span>
                        </Button>
                    </Col>
                </Col>
            </Row>

            {/* Tarjeta Principal */}
            <Card className="shadow border-0 rounded-4">
                <Card.Body className="p-4 p-lg-5">
                    {/* Barra superior: Búsqueda + Contador */}
                    <Row className="mb-4 align-items-center">
                        <Col md={7}>
                            <Form.Control
                                type="text"
                                placeholder="Buscar por nombre o cédula..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="py-2"
                            />
                        </Col>
                        <Col md={5} className="text-md-end mt-3 mt-md-0">
                            <Badge bg="primary" pill className="fs-6 px-3 py-2">
                                {empleadosFiltrados.length} empleados
                            </Badge>
                        </Col>
                    </Row>

                    {/* Spinner de carga */}
                    {cargando && (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" size="lg" />
                            <p className="mt-3 text-muted">Cargando empleados...</p>
                        </div>
                    )}

                    {/* Tabla de empleados */}
                    {!cargando && (
                        <Row>

    {/* 📱 TARJETAS (MÓVIL) */}
    <Col xs={12} className="d-lg-none">
        {!cargando && (
            <TarjetaEmpleado
                empleados={empleadosFiltrados}
                abrirModalEdicion={abrirModalEdicion}
                abrirModalEliminacion={abrirModalEliminacion}
            />
        )}
    </Col>

    {/* 💻 TABLA (ESCRITORIO) */}
    <Col xs={12} className="d-none d-lg-block">
        {!cargando && (
            <TablaEmpleados
                empleados={empleadosFiltrados}
                abrirModalEdicion={abrirModalEdicion}
                abrirModalEliminacion={abrirModalEliminacion}
            />
        )}
    </Col>

</Row>
                    )}
                </Card.Body>
            </Card>

            {/* Modal de Registro de Empleado */}
            <ModalRegistroEmpleado
                mostrarModal={mostrarModal}
                setMostrarModal={setMostrarModal}
                nuevoEmpleado={nuevoEmpleado}
                manejoCambioInput={manejoCambioInput}
                agregarEmpleado={agregarEmpleado}
            />

            <ModalEliminacionEmpleado
                mostrarModalEliminacion={mostrarModalEliminacion}
                setMostrarModalEliminacion={setMostrarModalEliminacion}
                eliminarEmpleado={eliminarEmpleado}
                empleado={empleadoAEliminar}
            />

            <ModalEdicionEmpleado
                mostrarModalEdicion={mostrarModalEdicion}
                setMostrarModalEdicion={setMostrarModalEdicion}
                empleadoEditar={empleadoEditar}
                manejoCambioInputEdicion={manejoCambioInputEdicion}
                actualizarEmpleado={actualizarEmpleado}
            />

            {/* Notificación */}
            <NotificacionOperacion
                mostrar={toast.mostrar}
                mensaje={toast.mensaje}
                tipo={toast.tipo}
                onCerrar={() => setToast({ ...toast, mostrar: false })}
            />
        </Container>
    );
};

export default Empleados;

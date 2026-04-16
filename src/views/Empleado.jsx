import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

// Importa tus componentes adaptados
import ModalRegistroEmpleado from "../components/empleados/ModalRegistroEmpleado";
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

    // Cargar empleados al montar el componente
    useEffect(() => {
        cargarEmpleados();
    }, []);

    return (
        <Container className="mt-3">

            {/* Título y botón Nuevo Empleado */}
            <Row className="align-items-center mb-3">
                <Col xs={9} sm={7} md={8} className="d-flex align-items-center">
                    <h3 className="mb-0">
                        <i className="bi bi-people-fill me-2"></i> 
                        Gestión de Empleados
                    </h3>
                </Col>
                <Col xs={3} sm={5} md={4} className="text-end">
                    <Button
                        onClick={() => setMostrarModal(true)}
                        size="md"
                        variant="success"
                    >
                        <i className="bi bi-plus-lg"></i>
                        <span className="d-none d-sm-inline ms-2">Nuevo Empleado</span>
                    </Button>
                </Col>
            </Row>

            <hr />

            {/* Spinner de carga */}
            {cargando && (
                <Row className="text-center my-5">
                    <Col>
                        <Spinner animation="border" variant="primary" size="lg" />
                        <p className="mt-3 text-muted">Cargando empleados...</p>
                    </Col>
                </Row>
            )}

            {/* Tabla de empleados */}
            {!cargando && (
                <Row>
                    <Col lg={12}>
                        <TablaEmpleados
                            empleados={empleados}
                            abrirModalEdicion={abrirModalEdicion}
                            abrirModalEliminacion={abrirModalEliminacion}
                        />
                    </Col>
                </Row>
            )}

            {/* Modal de Registro de Empleado */}
            <ModalRegistroEmpleado
                mostrarModal={mostrarModal}
                setMostrarModal={setMostrarModal}
                nuevoEmpleado={nuevoEmpleado}
                manejoCambioInput={manejoCambioInput}
                agregarEmpleado={agregarEmpleado}
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


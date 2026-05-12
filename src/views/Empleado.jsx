import React, { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Button,
    Spinner,
    Card,
    Badge,
    Form,
} from "react-bootstrap";

import { supabase } from "../database/supabaseconfig";

// COMPONENTES
import ModalEliminacionEmpleado from "../components/empleados/ModalEliminacionEmpleado";
import ModalEdicionEmpleado from "../components/empleados/ModalEdicionEmpleado";
import ModalRegistroEmpleado from "../components/empleados/ModalRegistroEmpleado";
import TarjetaEmpleado from "../components/empleados/TarjetaEmpleado";
import TablaEmpleados from "../components/empleados/TablaEmpleados";
import NotificacionOperacion from "../components/NotificacionOperacion";

const Empleados = () => {

    const [toast, setToast] = useState({
        mostrar: false,
        mensaje: "",
        tipo: "",
    });

    const [mostrarModal, setMostrarModal] = useState(false);

    // NUEVO EMPLEADO
    const [nuevoEmpleado, setNuevoEmpleado] = useState({
        nombre: "",
        apellido: "",
        cedula: "",
        correo: "",
        telefono: "",
        direccion: "",
        archivo_imagen: null,
        preview_imagen: "",
        url_imagen: "",
    });

    // LISTA EMPLEADOS
    const [empleados, setEmpleados] = useState([]);

    const [cargando, setCargando] = useState(true);

    const [busqueda, setBusqueda] = useState("");

    // EDICIÓN
    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

    const [empleadoEditar, setEmpleadoEditar] = useState(null);

    // ELIMINACIÓN
    const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

    const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);

    // =========================
    // MANEJO INPUT REGISTRO
    // =========================
    const manejoCambioInput = (e) => {

        const { name, value } = e.target;

        setNuevoEmpleado((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================
    // MANEJO INPUT EDICIÓN
    // =========================
    const manejoCambioInputEdicion = (e) => {

        const { name, value } = e.target;

        setEmpleadoEditar((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================
    // SUBIR IMAGEN A SUPABASE
    // =========================
    const subirImagen = async (archivo) => {

        if (!archivo) return null;

        const nombreArchivo = `${Date.now()}-${archivo.name}`;

        const { error } = await supabase.storage
            .from("imagenes_empleados")
            .upload(nombreArchivo, archivo);

        if (error) {

            console.error("Error subiendo imagen:", error.message);

            return null;
        }

        const { data } = supabase.storage
            .from("imagenes_empleados")
            .getPublicUrl(nombreArchivo);

        return data.publicUrl;
    };

    // =========================
    // AGREGAR EMPLEADO
    // =========================
    const agregarEmpleado = async () => {

        try {

            if (
                !nuevoEmpleado.nombre.trim() ||
                !nuevoEmpleado.apellido.trim() ||
                !nuevoEmpleado.cedula.trim()
            ) {

                setToast({
                    mostrar: true,
                    mensaje: "Nombre, Apellido y Cédula son obligatorios.",
                    tipo: "advertencia",
                });

                return;
            }

            // SUBIR IMAGEN
            let imagenURL = null;

            if (nuevoEmpleado.archivo_imagen) {

                imagenURL = await subirImagen(
                    nuevoEmpleado.archivo_imagen
                );
            }

            const { error } = await supabase
                .from("empleado")
                .insert([
                    {
                        nombre: nuevoEmpleado.nombre,
                        apellido: nuevoEmpleado.apellido,
                        cedula: nuevoEmpleado.cedula,
                        correo: nuevoEmpleado.correo || null,
                        telefono: nuevoEmpleado.telefono || null,
                        direccion: nuevoEmpleado.direccion || null,
                        url_imagen: imagenURL,
                    },
                ]);

            if (error) {

                console.error(error);

                setToast({
                    mostrar: true,
                    mensaje: "Error al registrar empleado.",
                    tipo: "error",
                });

                return;
            }

            setToast({
                mostrar: true,
                mensaje: "Empleado registrado correctamente.",
                tipo: "exito",
            });

            // LIMPIAR
            setNuevoEmpleado({
                nombre: "",
                apellido: "",
                cedula: "",
                correo: "",
                telefono: "",
                direccion: "",
                archivo_imagen: null,
                preview_imagen: "",
                url_imagen: "",
            });

            setMostrarModal(false);

            await cargarEmpleados();

        } catch (err) {

            console.error(err);

            setToast({
                mostrar: true,
                mensaje: "Error inesperado.",
                tipo: "error",
            });
        }
    };

    // =========================
    // ACTUALIZAR EMPLEADO
    // =========================
    const actualizarEmpleado = async () => {

        try {

            if (!empleadoEditar) return;

            let imagenURL = empleadoEditar.url_imagen || null;

            // SI CAMBIÓ IMAGEN
            if (empleadoEditar.archivo_imagen) {

                imagenURL = await subirImagen(
                    empleadoEditar.archivo_imagen
                );
            }

            const { error } = await supabase
                .from("empleado")
                .update({
                    nombre: empleadoEditar.nombre,
                    apellido: empleadoEditar.apellido,
                    cedula: empleadoEditar.cedula,
                    correo: empleadoEditar.correo || null,
                    telefono: empleadoEditar.telefono || null,
                    direccion: empleadoEditar.direccion || null,
                    url_imagen: imagenURL,
                })
                .eq("id_empleado", empleadoEditar.id_empleado);

            if (error) {

                console.error(error);

                setToast({
                    mostrar: true,
                    mensaje: "Error al actualizar empleado.",
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

            console.error(err);

            setToast({
                mostrar: true,
                mensaje: "Error inesperado.",
                tipo: "error",
            });
        }
    };

    // =========================
    // ELIMINAR EMPLEADO
    // =========================
    const eliminarEmpleado = async () => {

        try {

            if (!empleadoAEliminar) return;

            const { error } = await supabase
                .from("empleado")
                .delete()
                .eq("id_empleado", empleadoAEliminar.id_empleado);

            if (error) {

                setToast({
                    mostrar: true,
                    mensaje: "Error al eliminar empleado.",
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

            console.error(err);

            setToast({
                mostrar: true,
                mensaje: "Error inesperado.",
                tipo: "error",
            });
        }
    };

    // =========================
    // CARGAR EMPLEADOS
    // =========================
    const cargarEmpleados = async () => {

        try {

            setCargando(true);

            const { data, error } = await supabase
                .from("empleado")
                .select("*")
                .order("id_empleado", {
                    ascending: true,
                });

            if (error) {

                console.error(error);

                setToast({
                    mostrar: true,
                    mensaje: "Error al cargar empleados.",
                    tipo: "error",
                });

                return;
            }

            setEmpleados(data || []);

        } catch (err) {

            console.error(err);

            setToast({
                mostrar: true,
                mensaje: "Error inesperado.",
                tipo: "error",
            });

        } finally {

            setCargando(false);
        }
    };

    // =========================
    // ABRIR MODALES
    // =========================
    const abrirModalEdicion = (empleado) => {

        setEmpleadoEditar(empleado);

        setMostrarModalEdicion(true);
    };

    const abrirModalEliminacion = (empleado) => {

        setEmpleadoAEliminar(empleado);

        setMostrarModalEliminacion(true);
    };

    // =========================
    // FILTRAR
    // =========================
    const empleadosFiltrados = empleados.filter((emp) =>
        `${emp.nombre} ${emp.apellido}`
            .toLowerCase()
            .includes(busqueda.toLowerCase()) ||
        emp.cedula
            .toLowerCase()
            .includes(busqueda.toLowerCase())
    );

    // =========================
    // INICIO
    // =========================
    useEffect(() => {

        cargarEmpleados();

    }, []);

    return (
        <Container fluid className="py-4 px-3 px-md-4">

            {/* HEADER */}
            <Row className="align-items-center mb-4">

                <Col>

                    <div className="d-flex align-items-center gap-3">

                        <i className="bi bi-people-fill fs-1 text-primary"></i>

                        <div>

                            <h2 className="mb-1 fw-bold">
                                Gestión de Empleados
                            </h2>

                            <p className="text-muted mb-0">
                                Administra el personal registrado
                            </p>

                        </div>

                    </div>

                </Col>

                <Col xs="auto">

                    <Button
                        onClick={() => setMostrarModal(true)}
                        variant="primary"
                        className="d-flex align-items-center gap-2 shadow-sm"
                    >

                        <i className="bi bi-plus-lg"></i>

                        <span className="d-none d-md-inline">
                            Nuevo Empleado
                        </span>

                    </Button>

                </Col>

            </Row>

            {/* CARD */}
            <Card className="shadow border-0 rounded-4">

                <Card.Body className="p-4 p-lg-5">

                    {/* BÚSQUEDA */}
                    <Row className="mb-4 align-items-center">

                        <Col md={7}>

                            <Form.Control
                                type="text"
                                placeholder="Buscar por nombre o cédula..."
                                value={busqueda}
                                onChange={(e) =>
                                    setBusqueda(e.target.value)
                                }
                            />

                        </Col>

                        <Col
                            md={5}
                            className="text-md-end mt-3 mt-md-0"
                        >

                            <Badge
                                bg="primary"
                                pill
                                className="fs-6 px-3 py-2"
                            >
                                {empleadosFiltrados.length} empleados
                            </Badge>

                        </Col>

                    </Row>

                    {/* LOADING */}
                    {cargando && (

                        <div className="text-center py-5">

                            <Spinner
                                animation="border"
                                variant="primary"
                            />

                            <p className="mt-3 text-muted">
                                Cargando empleados...
                            </p>

                        </div>
                    )}

                    {/* CONTENIDO */}
                    {!cargando && (

                        <Row>

                            {/* MOBILE */}
                            <Col
                                xs={12}
                                className="d-lg-none"
                            >

                                <TarjetaEmpleado
                                    empleados={empleadosFiltrados}
                                    abrirModalEdicion={abrirModalEdicion}
                                    abrirModalEliminacion={abrirModalEliminacion}
                                />

                            </Col>

                            {/* DESKTOP */}
                            <Col
                                xs={12}
                                className="d-none d-lg-block"
                            >

                                <TablaEmpleados
                                    empleados={empleadosFiltrados}
                                    abrirModalEdicion={abrirModalEdicion}
                                    abrirModalEliminacion={abrirModalEliminacion}
                                />

                            </Col>

                        </Row>
                    )}

                </Card.Body>

            </Card>

            {/* MODAL REGISTRO */}
            <ModalRegistroEmpleado
                mostrarModal={mostrarModal}
                setMostrarModal={setMostrarModal}
                nuevoEmpleado={nuevoEmpleado}
                setNuevoEmpleado={setNuevoEmpleado}
                manejoCambioInput={manejoCambioInput}
                agregarEmpleado={agregarEmpleado}
            />

            {/* MODAL EDICIÓN */}
            <ModalEdicionEmpleado
                mostrarModalEdicion={mostrarModalEdicion}
                setMostrarModalEdicion={setMostrarModalEdicion}
                empleadoEditar={empleadoEditar}
                setEmpleadoEditar={setEmpleadoEditar}
                manejoCambioInputEdicion={manejoCambioInputEdicion}
                actualizarEmpleado={actualizarEmpleado}
            />

            {/* MODAL ELIMINAR */}
            <ModalEliminacionEmpleado
                mostrarModalEliminacion={mostrarModalEliminacion}
                setMostrarModalEliminacion={setMostrarModalEliminacion}
                eliminarEmpleado={eliminarEmpleado}
                empleado={empleadoAEliminar}
            />

            {/* TOAST */}
            <NotificacionOperacion
                mostrar={toast.mostrar}
                mensaje={toast.mensaje}
                tipo={toast.tipo}
                onCerrar={() =>
                    setToast({
                        ...toast,
                        mostrar: false,
                    })
                }
            />

        </Container>
    );
};

export default Empleados;
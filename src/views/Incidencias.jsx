import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Card, Badge, Form } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

// Componentes adaptados
import ModalRegistroIncidencia from "../components/Incidencias/ModalRegistroIncidencia";
import ModalEliminacionIncidencia from "../components/Incidencias/ModalEliminacionIncidencia";
import ModalEdicionIncidencia from "../components/Incidencias/ModalEdicionIncidencia";
import TablaIncidencias from "../components/Incidencias/TablaIncidencia";
import NotificacionOperacion from "../components/NotificacionOperacion";

const Incidencias = () => {

    const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
    const [mostrarModal, setMostrarModal] = useState(false);

    // Estado nueva incidencia
    const [nuevaIncidencia, setNuevaIncidencia] = useState({
        tipo_incidencia: "",
        descripcion: "",
        fecha_incidencia: "",
    });

    const [incidencias, setIncidencias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState("");

    // Edición / Eliminación (preparado)
    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
    const [incidenciaEditar, setIncidenciaEditar] = useState(null);
    const [incidenciaAEliminar, setIncidenciaAEliminar] = useState(null);

    // Manejo de inputs
    const manejoCambioInput = (e) => {
        const { name, value } = e.target;
        setNuevaIncidencia((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

      // Manejo de inputsEdicion
    const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setIncidenciaEditar((prev) => ({
        ...prev,
        [name]: value,
    }));
};

    // Agregar incidencia
    const agregarIncidencia = async () => {
        try {
            if (!nuevaIncidencia.tipo_incidencia.trim() || !nuevaIncidencia.fecha_incidencia) {
                setToast({
                    mostrar: true,
                    mensaje: "El tipo y la fecha de la incidencia son obligatorios.",
                    tipo: "advertencia",
                });
                return;
            }

            const { error } = await supabase
                .from("Incidencias")
                .insert([{
                    tipo_incidencia: nuevaIncidencia.tipo_incidencia,
                    descripcion: nuevaIncidencia.descripcion || null,
                    fecha_incidencia: nuevaIncidencia.fecha_incidencia,
                }]);

            if (error) {
                console.error("Error:", error.message);
                setToast({
                    mostrar: true,
                    mensaje: "Error al registrar la incidencia.",
                    tipo: "error",
                });
                return;
            }

            setToast({
                mostrar: true,
                mensaje: "Incidencia registrada correctamente.",
                tipo: "exito",
            });

            setNuevaIncidencia({
                tipo_incidencia: "",
                descripcion: "",
                fecha_incidencia: "",
            });

            setMostrarModal(false);
            await cargarIncidencias();

        } catch (err) {
            console.error(err);
            setToast({
                mostrar: true,
                mensaje: "Error inesperado.",
                tipo: "error",
            });
        }
    };

    // editar incidencias
    const actualizarIncidencia = async () => {
        try {
            if (!incidenciaEditar) return;

            const { error } = await supabase
                .from("Incidencias")
                .update({
                    tipo_incidencia: incidenciaEditar.tipo_incidencia,
                    descripcion: incidenciaEditar.descripcion || null,
                    fecha_incidencia: incidenciaEditar.fecha_incidencia,
                })
                .eq("id_incidencia", incidenciaEditar.id_incidencia);

            if (error) {
                setToast({
                    mostrar: true,
                    mensaje: "Error al actualizar la incidencia.",
                    tipo: "error",
                });
                return;
            }

            setToast({
                mostrar: true,
                mensaje: "Incidencia actualizada correctamente.",
                tipo: "exito",
            });

            setMostrarModalEdicion(false);
            setIncidenciaEditar(null);
            await cargarIncidencias();

        } catch (err) {
            setToast({
                mostrar: true,
                mensaje: "Error inesperado al actualizar.",
                tipo: "error",
            });
        }
    };

    // eliminar incidencias
    const eliminarIncidencia = async () => {
        try {
        if (!incidenciaAEliminar) return;

        const { error } = await supabase
            .from("Incidencias")
            .delete()
            .eq("id_incidencia", incidenciaAEliminar.id_incidencia);

        if (error) {
            setToast({
                mostrar: true,
                mensaje: "Error al eliminar la incidencia.",
                tipo: "error",
            });
            return;
        }

        setToast({
            mostrar: true,
            mensaje: "Incidencia eliminada correctamente.",
            tipo: "exito",
        });

        setMostrarModalEliminacion(false);
        setIncidenciaAEliminar(null);
        await cargarIncidencias();

    } catch (err) {
        setToast({
            mostrar: true,
            mensaje: "Error inesperado al eliminar.",
            tipo: "error",
        });
    }
};

    // Cargar incidencias
    const cargarIncidencias = async () => {
        try {
            setCargando(true);

            const { data, error } = await supabase
                .from("Incidencias")
                .select("*")
                .order("id_incidencia", { ascending: true });

            if (error) {
                setToast({
                    mostrar: true,
                    mensaje: "Error al cargar incidencias.",
                    tipo: "error",
                });
                return;
            }

            setIncidencias(data || []);

        } catch (err) {
            setToast({
                mostrar: true,
                mensaje: "Error inesperado.",
                tipo: "error",
            });
        } finally {
            setCargando(false);
        }
    };

    // Modales
    const abrirModalEdicion = (inc) => {
        setIncidenciaEditar(inc);
        setMostrarModalEdicion(true);
    };

    const abrirModalEliminacion = (inc) => {
        setIncidenciaAEliminar(inc);
        setMostrarModalEliminacion(true);
    };

    // Filtro
    const incidenciasFiltradas = incidencias.filter((inc) =>
        inc.tipo_incidencia.toLowerCase().includes(busqueda.toLowerCase()) ||
        (inc.descripcion || "").toLowerCase().includes(busqueda.toLowerCase())
    );

    useEffect(() => {
        cargarIncidencias();
    }, []);

    return (
        <Container fluid className="py-4 px-3 px-md-4">

            {/* Header */}
            <Row className="align-items-center mb-4">
                <Col>
                    <div className="d-flex align-items-center gap-3">
                        <i className="bi bi-exclamation-triangle-fill fs-1 text-warning"></i>
                        <div>
                            <h2 className="mb-1 fw-bold">Gestión de Incidencias</h2>
                            <p className="text-muted mb-0">Administra las incidencias registradas</p>
                        </div>
                    </div>
                </Col>
                <Col xs="auto">
                    <Button
                        onClick={() => setMostrarModal(true)}
                        size="lg"
                        variant="warning"
                        className="d-flex align-items-center gap-2 shadow-sm"
                    >
                        <i className="bi bi-plus-lg"></i>
                        Nueva Incidencia
                    </Button>
                </Col>
            </Row>

            {/* Card */}
            <Card className="shadow border-0 rounded-4">
                <Card.Body className="p-4 p-lg-5">

                    {/* Búsqueda */}
                    <Row className="mb-4 align-items-center">
                        <Col md={7}>
                            <Form.Control
                                type="text"
                                placeholder="Buscar incidencia..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </Col>
                        <Col md={5} className="text-md-end mt-3 mt-md-0">
                            <Badge bg="warning" pill className="fs-6 px-3 py-2">
                                {incidenciasFiltradas.length} incidencias
                            </Badge>
                        </Col>
                    </Row>

                    {/* Loader */}
                    {cargando && (
                        <div className="text-center py-5">
                            <Spinner animation="border" />
                            <p className="mt-3 text-muted">Cargando incidencias...</p>
                        </div>
                    )}

                    {/* Tabla */}
                    {!cargando && (
                        <TablaIncidencias
                            incidencias={incidenciasFiltradas}
                            abrirModalEdicion={abrirModalEdicion}
                            abrirModalEliminacion={abrirModalEliminacion}
                        />
                    )}
                </Card.Body>
            </Card>

            {/* Modal */}
            <ModalRegistroIncidencia
                mostrarModal={mostrarModal}
                setMostrarModal={setMostrarModal}
                nuevaIncidencia={nuevaIncidencia}
                manejoCambioInput={manejoCambioInput}
                agregarIncidencia={agregarIncidencia}
            />

            <ModalEdicionIncidencia
                mostrarModalEdicion={mostrarModalEdicion}
                setMostrarModalEdicion={setMostrarModalEdicion}
                incidenciaEditar={incidenciaEditar}
                manejoCambioInputEdicion={manejoCambioInputEdicion}
                actualizarIncidencia={actualizarIncidencia}
            />

            <ModalEliminacionIncidencia
                mostrarModalEliminacion={mostrarModalEliminacion}
                setMostrarModalEliminacion={setMostrarModalEliminacion}
                eliminarIncidencia={eliminarIncidencia}
                incidencia={incidenciaAEliminar}
            />

            {/* Toast */}
            <NotificacionOperacion
                mostrar={toast.mostrar}
                mensaje={toast.mensaje}
                tipo={toast.tipo}
                onCerrar={() => setToast({ ...toast, mostrar: false })}
            />
        </Container>
    );
};

export default Incidencias;
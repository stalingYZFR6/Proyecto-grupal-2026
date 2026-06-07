import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Card, Badge, Form } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import ModalRegistroIncidencia from "../components/Incidencias/ModalRegistroIncidencia";
import ModalEliminacionIncidencia from "../components/Incidencias/ModalEliminacionIncidencia";
import ModalEdicionIncidencia from "../components/Incidencias/ModalEdicionIncidencia";
import TablaIncidencias from "../components/Incidencias/TablaIncidencia";
import NotificacionOperacion from "../components/NotificacionOperacion";
import TarjetaIncidencia from "../components/Incidencias/TarjetaIncidencia";

const Incidencias = () => {
    const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
    const [mostrarModal, setMostrarModal] = useState(false);
    const [nuevaIncidencia, setNuevaIncidencia] = useState({ tipo_incidencia: "", descripcion: "", fecha_incidencia: "" });
    const [incidencias, setIncidencias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
    const [incidenciaEditar, setIncidenciaEditar] = useState(null);
    const [incidenciaAEliminar, setIncidenciaAEliminar] = useState(null);

    const cargarIncidencias = async () => {
        try {
            setCargando(true);
            const { data, error } = await supabase.from("Incidencias").select("*").order("id_incidencia", { ascending: true });
            if (error) throw error;
            setIncidencias(data || []);
        } catch (err) {
            setToast({ mostrar: true, mensaje: "Error al cargar incidencias.", tipo: "error" });
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => { cargarIncidencias(); }, []);

    const incidenciasFiltradas = incidencias.filter((inc) =>
        inc.tipo_incidencia.toLowerCase().includes(busqueda.toLowerCase()) ||
        (inc.descripcion || "").toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <Container className="py-5 mt-4">
            <div className="mb-5">
                <Row className="align-items-end g-4">
                    <Col lg={6}>
                        <div className="d-flex align-items-center gap-3 mb-2">
                            <div className="bg-warning bg-opacity-10 p-3 rounded-4">
                                <i className="bi bi-exclamation-triangle-fill text-warning fs-3"></i>
                            </div>
                            <div>
                                <h2 className="fw-bold mb-0">Gestión de Incidencias</h2>
                                <p className="text-muted mb-0">Registro y seguimiento de novedades del personal</p>
                            </div>
                        </div>
                    </Col>
                    <Col lg={6} className="text-lg-end">
                        <Button onClick={() => setMostrarModal(true)} className="btn-premium-primary shadow-sm">
                            <i className="bi bi-plus-lg me-2"></i>
                            Registrar Incidencia
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
                                placeholder="Buscar por tipo o descripción..."
                                className="search-input"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>
                    </Col>
                    <Col md={4} lg={6} className="text-md-end">
                        <Badge bg="warning" className="bg-opacity-10 text-warning border-0 rounded-pill px-4 py-2 fs-6 fw-semibold">
                            {incidenciasFiltradas.length} Registros
                        </Badge>
                    </Col>
                </Row>
            </div>

            {cargando ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted fw-medium">Sincronizando incidencias...</p>
                </div>
            ) : (
                <Row className="g-4">
                    {incidenciasFiltradas.map((inc) => (
                        <Col key={inc.id_incidencia} xs={12} md={6} lg={4}>
                            <TarjetaIncidencia 
                                incidencia={inc} 
                                abrirModalEdicion={(i) => { setIncidenciaEditar(i); setMostrarModalEdicion(true); }}
                                abrirModalEliminacion={(i) => { setIncidenciaAEliminar(i); setMostrarModalEliminacion(true); }}
                            />
                        </Col>
                    ))}
                </Row>
            )}

            <ModalRegistroIncidencia mostrarModal={mostrarModal} setMostrarModal={setMostrarModal} nuevaIncidencia={nuevaIncidencia} manejoCambioInput={(e) => setNuevaIncidencia({...nuevaIncidencia, [e.target.name]: e.target.value})} agregarIncidencia={cargarIncidencias} />
            <ModalEdicionIncidencia mostrarModalEdicion={mostrarModalEdicion} setMostrarModalEdicion={setMostrarModalEdicion} incidenciaEditar={incidenciaEditar} manejoCambioInputEdicion={(e) => setIncidenciaEditar({...incidenciaEditar, [e.target.name]: e.target.value})} actualizarIncidencia={cargarIncidencias} />
            <ModalEliminacionIncidencia mostrarModalEliminacion={mostrarModalEliminacion} setMostrarModalEliminacion={setMostrarModalEliminacion} eliminarIncidencia={cargarIncidencias} incidencia={incidenciaAEliminar} />
            <NotificacionOperacion mostrar={toast.mostrar} mensaje={toast.mensaje} tipo={toast.tipo} onCerrar={() => setToast({ ...toast, mostrar: false })} />
        </Container>
    );
};

export default Incidencias;
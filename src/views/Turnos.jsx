import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Table, Spinner, Form, Badge, Pagination } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import ModalRegistroTurno from "../components/turnos/ModalRegistroTurnos";
import ModalEdicionTurno from "../components/turnos/ModalEdicionTurnos";
import ModalEliminacionTurnos from "../components/turnos/ModalEliminacionTurnos";

const Turnos = () => {
    const [turnos, setTurnos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
    const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const turnosPorPagina = 6;

    useEffect(() => {
        obtenerTurnos();
    }, []);

    const obtenerTurnos = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("turnos")
                .select("*")
                .order("id_turno", { ascending: true });
            if (error) throw error;
            setTurnos(data || []);
        } catch (err) {
            console.error("Error al cargar turnos.");
        } finally {
            setLoading(false);
        }
    };

    const formatearHora = (hora) => hora ? hora.slice(0, 5) : "--:--";

    const turnosFiltrados = turnos.filter((turno) =>
        turno.tipo_turno?.toLowerCase().includes(busqueda.toLowerCase())
    );

    const indiceUltimoTurno = paginaActual * turnosPorPagina;
    const indicePrimerTurno = indiceUltimoTurno - turnosPorPagina;
    const turnosPaginados = turnosFiltrados.slice(indicePrimerTurno, indiceUltimoTurno);
    const totalPaginas = Math.ceil(turnosFiltrados.length / turnosPorPagina);

    return (
        <Container className="py-5 mt-4">
            <div className="mb-5">
                <Row className="align-items-end g-4">
                    <Col lg={6}>
                        <div className="d-flex align-items-center gap-3 mb-2">
                            <div className="bg-info bg-opacity-10 p-3 rounded-4">
                                <i className="bi bi-clock-history text-info fs-3"></i>
                            </div>
                            <div>
                                <h2 className="fw-bold mb-0">Horarios y Turnos</h2>
                                <p className="text-muted mb-0">Configuración de jornadas laborales y rotaciones</p>
                            </div>
                        </div>
                    </Col>
                    <Col lg={6} className="text-lg-end">
                        <Button onClick={() => setMostrarModalRegistro(true)} className="btn-premium-primary shadow-sm">
                            <i className="bi bi-plus-circle me-2"></i>
                            Configurar Nuevo Turno
                        </Button>
                    </Col>
                </Row>
            </div>

            <Card className="premium-card border-0 p-4 mb-5">
                <Row className="g-3 align-items-center mb-4">
                    <Col md={6}>
                        <div className="search-container">
                            <i className="bi bi-search search-icon"></i>
                            <Form.Control
                                type="text"
                                placeholder="Filtrar por nombre de turno..."
                                className="search-input"
                                value={busqueda}
                                onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
                            />
                        </div>
                    </Col>
                    <Col md={6} className="text-md-end">
                        <Badge bg="info" className="bg-opacity-10 text-info border-0 rounded-pill px-4 py-2 fs-6 fw-semibold">
                            {turnosFiltrados.length} Turnos Activos
                        </Badge>
                    </Col>
                </Row>

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <Table responsive hover className="align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="border-0 rounded-start py-3 px-4">ID</th>
                                <th className="border-0 py-3">Tipo de Turno</th>
                                <th className="border-0 py-3">Entrada</th>
                                <th className="border-0 py-3">Salida</th>
                                <th className="border-0 rounded-end py-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {turnosPaginados.map((turno) => (
                                <tr key={turno.id_turno}>
                                    <td className="px-4 text-muted small">#{turno.id_turno}</td>
                                    <td><span className="fw-bold">{turno.tipo_turno}</span></td>
                                    <td><Badge bg="success" className="bg-opacity-10 text-success px-3 py-2 rounded-3">{formatearHora(turno.hora_inicio)}</Badge></td>
                                    <td><Badge bg="danger" className="bg-opacity-10 text-danger px-3 py-2 rounded-3">{formatearHora(turno.hora_fin)}</Badge></td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center gap-2">
                                            <Button variant="light" size="sm" className="rounded-3 p-2" onClick={() => { setTurnoSeleccionado(turno); setMostrarModalEdicion(true); }}>
                                                <i className="bi bi-pencil text-warning"></i>
                                            </Button>
                                            <Button variant="light" size="sm" className="rounded-3 p-2" onClick={() => { setTurnoSeleccionado(turno); setMostrarModalEliminar(true); }}>
                                                <i className="bi bi-trash text-danger"></i>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card>

            <ModalRegistroTurno show={mostrarModalRegistro} handleClose={() => setMostrarModalRegistro(false)} onRegistroExitoso={obtenerTurnos} />
            <ModalEdicionTurno show={mostrarModalEdicion} handleClose={() => setMostrarModalEdicion(false)} turno={turnoSeleccionado} onActualizacionExitosa={obtenerTurnos} />
            <ModalEliminacionTurnos show={mostrarModalEliminar} handleClose={() => setMostrarModalEliminar(false)} turno={turnoSeleccionado} onEliminacionExitosa={obtenerTurnos} />
        </Container>
    );
};

export default Turnos;
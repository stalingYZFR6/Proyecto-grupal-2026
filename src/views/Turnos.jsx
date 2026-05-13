import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Table,
    Spinner,
    Form,
    InputGroup,
    Pagination
} from "react-bootstrap";

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

    // Estados para Búsqueda y Paginación
    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const turnosPorPagina = 5;

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

    const prepararEdicion = (turno) => {
        setTurnoSeleccionado(turno);
        setMostrarModalEdicion(true);
    };

    const prepararEliminacion = (turno) => {
        setTurnoSeleccionado(turno);
        setMostrarModalEliminar(true);
    };

    const formatearHora = (hora) => {
        if (!hora) return "";
        return hora.slice(0, 5);
    };

    // LÓGICA DE FILTRADO Y PAGINACIÓN
    const turnosFiltrados = turnos.filter((turno) =>
        turno.tipo_turno.toLowerCase().includes(busqueda.toLowerCase())
    );

    const indiceUltimoTurno = paginaActual * turnosPorPagina;
    const indicePrimerTurno = indiceUltimoTurno - turnosPorPagina;
    const turnosPaginados = turnosFiltrados.slice(indicePrimerTurno, indiceUltimoTurno);
    const totalPaginas = Math.ceil(turnosFiltrados.length / turnosPorPagina);

    return (
        <Container fluid className="py-4 bg-dark-page" style={{ minHeight: "100vh" }}>
            <style>
                {`
                .bg-dark-page { background-color: #1a1d21; }
                .card-custom { background-color: #212529; border: 1px solid #2d3136; border-radius: 10px; }
                .table-custom { color: #dee2e6; }
                .search-input { background-color: #2d3136 !important; border: 1px solid #3d4248 !important; color: white !important; }
                .search-input::placeholder { color: #6c757d; }
                
                /* Botones personalizados */
                .btn-edit-custom, .btn-delete-custom {
                    width: 40px; height: 40px; display: inline-flex; align-items: center;
                    justify-content: center; background: transparent; border-radius: 8px; margin: 0 5px; transition: all 0.2s;
                }
                .btn-edit-custom { border: 2px solid #ffc107 !important; color: #ffc107 !important; }
                .btn-delete-custom { border: 2px solid #ff4d4d !important; color: #ff4d4d !important; }
                .btn-edit-custom:hover { background: rgba(255, 193, 7, 0.1); transform: scale(1.05); }
                .btn-delete-custom:hover { background: rgba(255, 77, 77, 0.1); transform: scale(1.05); }

                /* Estilo Paginación */
                .pagination .page-link { background-color: #212529; border-color: #3d4248; color: #ffc107; }
                .pagination .page-item.active .page-link { background-color: #ffc107; border-color: #ffc107; color: #212529; }
                .pagination .page-item.disabled .page-link { background-color: #1a1d21; border-color: #2d3136; color: #495057; }
                `}
            </style>

            <Row className="mb-3 align-items-center">
                <Col>
                    <h2 className="fw-bold text-white mb-0">Gestión de Turnos</h2>
                </Col>
                <Col xs="auto" className="text-end">
                    <Button variant="success" onClick={() => setMostrarModalRegistro(true)}>
                        <i className="bi bi-plus-lg me-2"></i> Nuevo Turno
                    </Button>
                </Col>
            </Row>

            {/* FILA 2: Barra de Búsqueda (Sola abajo) */}
            <Row className="mb-4">
                <Col md={6} lg={4}> {/* Ajusta el md={6} para que no sea tan ancha si prefieres */}
                    <InputGroup>
                        <InputGroup.Text className="search-input border-end-0">
                            <i className="bi bi-search text-warning"></i>
                        </InputGroup.Text>
                        <Form.Control
                            placeholder="Buscar turno por nombre..."
                            className="search-input border-start-0"
                            value={busqueda}
                            onChange={(e) => {
                                setBusqueda(e.target.value);
                                setPaginaActual(1);
                            }}
                        />
                    </InputGroup>
                </Col>
            </Row>

            <Card className="card-custom shadow-sm">
                <Card.Body>
                    {loading ? (
                        <div className="text-center py-5"><Spinner animation="border" variant="warning" /></div>
                    ) : (
                        <>
                            <Table responsive borderless className="table-custom align-middle">
                                <thead style={{ borderBottom: "1px solid #3d4248" }}>
                                    <tr>
                                        <th>#</th>
                                        <th>Tipo Turno</th>
                                        <th>Hora Inicio</th>
                                        <th>Hora Final</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {turnosPaginados.length > 0 ? (
                                        turnosPaginados.map((turno) => (
                                            <tr key={turno.id_turno} style={{ borderBottom: "1px solid #2d3136" }}>
                                                <td>{turno.id_turno}</td>
                                                <td className="fw-bold text-white">{turno.tipo_turno}</td>
                                                <td>{formatearHora(turno.hora_inicio)}</td>
                                                <td>{formatearHora(turno.hora_fin)}</td>
                                                <td className="text-center">
                                                    <button className="btn-edit-custom" onClick={() => prepararEdicion(turno)}>
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button className="btn-delete-custom" onClick={() => prepararEliminacion(turno)}>
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4 text-muted">
                                                No se encontraron turnos que coincidan con la búsqueda.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>

                            {/* CONTROLES DE PAGINACIÓN */}
                            {totalPaginas > 1 && (
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <small className="text-muted">
                                        Mostrando {turnosPaginados.length} de {turnosFiltrados.length} resultados
                                    </small>
                                    <Pagination className="mb-0">
                                        <Pagination.Prev
                                            disabled={paginaActual === 1}
                                            onClick={() => setPaginaActual(paginaActual - 1)}
                                        />
                                        {[...Array(totalPaginas)].map((_, index) => (
                                            <Pagination.Item
                                                key={index + 1}
                                                active={index + 1 === paginaActual}
                                                onClick={() => setPaginaActual(index + 1)}
                                            >
                                                {index + 1}
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Next
                                            disabled={paginaActual === totalPaginas}
                                            onClick={() => setPaginaActual(paginaActual + 1)}
                                        />
                                    </Pagination>
                                </div>
                            )}
                        </>
                    )}
                </Card.Body>
            </Card>

            {/* MODALES */}
            <ModalRegistroTurno
                show={mostrarModalRegistro}
                handleClose={() => setMostrarModalRegistro(false)}
                onRegistroExitoso={obtenerTurnos}
            />
            <ModalEdicionTurno
                show={mostrarModalEdicion}
                handleClose={() => { setMostrarModalEdicion(false); setTurnoSeleccionado(null); }}
                turno={turnoSeleccionado}
                onActualizacionExitosa={obtenerTurnos}
            />
            <ModalEliminacionTurnos
                show={mostrarModalEliminar}
                handleClose={() => { setMostrarModalEliminar(false); setTurnoSeleccionado(null); }}
                turno={turnoSeleccionado}
                onEliminacionExitosa={obtenerTurnos}
            />
        </Container>
    );
};

export default Turnos;
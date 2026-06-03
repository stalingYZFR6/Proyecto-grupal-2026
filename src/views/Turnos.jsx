import React, { useEffect, useState } from "react";
import {Container,Row,Col,Card,Button,Table,Spinner,Form,Badge,Pagination} from "react-bootstrap";

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
        turno.tipo_turno?.toLowerCase().includes(busqueda.toLowerCase())
    );

    const indiceUltimoTurno = paginaActual * turnosPorPagina;
    const indicePrimerTurno = indiceUltimoTurno - turnosPorPagina;
    const turnosPaginados = turnosFiltrados.slice(indicePrimerTurno, indiceUltimoTurno);
    const totalPaginas = Math.ceil(turnosFiltrados.length / turnosPorPagina);

    return (
        <Container fluid className="py-4 px-3 px-md-4">
            <style>
                {`
                /* Botones de acción dinámicos */
                .btn-edit-custom, .btn-delete-custom {
                    width: 38px; 
                    height: 38px; 
                    display: inline-flex; 
                    align-items: center;
                    justify-content: center; 
                    border-radius: 6px; 
                    margin: 0 4px; 
                }
                .btn-edit-custom { border: 1px solid #ffc107 !important; color: #ffc107 !important; }
                .btn-delete-custom { border: 1px solid #dc3545 !important; color: #dc3545 !important; }
                
                /* Efecto Hover sutil que se adapta al fondo */
                .btn-edit-custom:hover { background: rgba(255, 193, 7, 0.15) !important; transform: scale(1.05); }
                .btn-delete-custom:hover { background: rgba(220, 53, 69, 0.15) !important; transform: scale(1.05); }

                /* Forzar el encabezado oscuro clásico de la segunda imagen */
                .tabla-incidencias-style thead th {
                    background-color: #212529 !important;
                    color: #ffffff !important;
                    font-weight: 600;
                    border-bottom: none;
                }
                `}
            </style>

            {/* HEADER */}
            <Row className="align-items-center mb-4">
                <Col>
                    <div className="d-flex align-items-center gap-3">
                        <i className="bi bi-calendar-range-fill fs-1 text-primary"></i>
                        <div>
                            <h2 className="mb-1 fw-bold">Gestión de Turnos</h2>
                            <p className="text-muted mb-0">
                                Administra los horarios y jornadas laborales
                            </p>
                        </div>
                    </div>
                </Col>
                <Col xs="auto">
                    <Button
                        onClick={() => setMostrarModalRegistro(true)}
                        variant="primary"
                        className="d-flex align-items-center gap-2 shadow-sm"
                    >
                        <i className="bi bi-plus-lg"></i>
                        <span className="d-none d-md-inline">Nuevo Turno</span>
                    </Button>
                </Col>
            </Row>

            {/* CARD PRINCIPAL */}
            <Card className="shadow border-0 rounded-4">
                <Card.Body className="p-4 p-lg-5">
                    
                    {/* BUSCADOR */}
                    <Row className="mb-4 align-items-center">
                        <Col md={7}>
                            <Form.Control
                                type="text"
                                placeholder="Buscar por tipo de turno..."
                                value={busqueda}
                                onChange={(e) => {
                                    setBusqueda(e.target.value);
                                    setPaginaActual(1);
                                }}
                            />
                        </Col>
                        <Col md={5} className="text-md-end mt-3 mt-md-0">
                            <Badge
                                bg="primary"
                                pill
                                className="fs-6 px-3 py-2"
                            >
                                {turnosFiltrados.length} turnos
                            </Badge>
                        </Col>
                    </Row>

                    {/* LOADING */}
                    {loading && (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-3 text-muted">Cargando turnos...</p>
                        </div>
                    )}

                    {/* TABLA ESTILO INCIDENCIAS */}
                    {!loading && (
                        <>
                            <Table 
                                responsive 
                                striped 
                                bordered 
                                hover 
                                className="align-middle mb-0 tabla-incidencias-style"
                            >
                                <thead>
                                    <tr>
                                        <th style={{ width: "70px" }}>ID</th>
                                        <th>Tipo de Turno</th>
                                        <th>Hora Inicio</th>
                                        <th>Hora Final</th>
                                        <th className="text-center" style={{ width: "140px" }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {turnosPaginados.length > 0 ? (
                                        turnosPaginados.map((turno) => (
                                            <tr key={turno.id_turno}>
                                                <td>{turno.id_turno}</td>
                                                <td className="fw-bold">{turno.tipo_turno}</td>
                                                <td>{formatearHora(turno.hora_inicio)}</td>
                                                <td>{formatearHora(turno.hora_fin)}</td>
                                                <td className="text-center">
                                                    {/* bg-body cambia automáticamente según el tema */}
                                                    <button className="btn-edit-custom bg-body" onClick={() => prepararEdicion(turno)}>
                                                        <i className="bi bi-pencil-fill"></i>
                                                    </button>
                                                    <button className="btn-delete-custom bg-body" onClick={() => prepararEliminacion(turno)}>
                                                        <i className="bi bi-trash-fill"></i>
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

                            {/* PAGINACIÓN */}
                            {totalPaginas > 1 && (
                                <div className="d-flex justify-content-between align-items-center mt-4">
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
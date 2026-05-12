import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Table,
    Spinner,
} from "react-bootstrap";

import { supabase } from "../database/supabaseconfig";
import ModalRegistroTurno from "../components/turnos/ModalRegistroTurnos";
import ModalEdicionTurno from "../components/turnos/ModalEdicionTurnos";
import ModalEliminacionTurnos from "../components/turnos/ModalEliminacionTurnos"; // 1. Importación agregada

const Turnos = () => {
    const [turnos, setTurnos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false); // 2. Estado para el modal de eliminar
    const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);

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
            setError("Error al cargar turnos.");
        } finally {
            setLoading(false);
        }
    };

    const prepararEdicion = (turno) => {
        setTurnoSeleccionado(turno);
        setMostrarModalEdicion(true);
    };

    // 3. Función para preparar la eliminación
    const prepararEliminacion = (turno) => {
        setTurnoSeleccionado(turno);
        setMostrarModalEliminar(true);
    };

    const formatearHora = (hora) => {
        if (!hora) return "";
        return hora.slice(0, 5);
    };

    return (
        <Container fluid className="py-4 bg-dark-page" style={{ minHeight: "100vh" }}>
            <style>
                {`
                .bg-dark-page { background-color: #1a1d21; }
                .card-custom { background-color: #212529; border: 1px solid #2d3136; border-radius: 10px; }
                .table-custom { color: #dee2e6; }
                
                .btn-edit-custom, .btn-delete-custom {
                    width: 40px;
                    height: 40px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                    border-radius: 8px;
                    margin: 0 5px;
                    transition: all 0.2s;
                }

                .btn-edit-custom {
                    border: 2px solid #ffc107 !important;
                    color: #ffc107 !important;
                }
                .btn-edit-custom:hover {
                    background: rgba(255, 193, 7, 0.1);
                    transform: scale(1.05);
                }

                .btn-delete-custom {
                    border: 2px solid #ff4d4d !important;
                    color: #ff4d4d !important;
                }
                .btn-delete-custom:hover {
                    background: rgba(255, 77, 77, 0.1);
                    transform: scale(1.05);
                }
                
                .bi-pencil, .bi-trash { font-size: 1.2rem; }
                `}
            </style>

            <Row className="mb-4 align-items-center">
                <Col>
                    <h2 className="fw-bold text-white">Gestión de Turnos</h2>
                </Col>
                <Col xs="auto">
                    <Button variant="success" onClick={() => setMostrarModalRegistro(true)}>
                        <i className="bi bi-plus-lg me-2"></i> Nuevo Turno
                    </Button>
                </Col>
            </Row>

            <Card className="card-custom shadow-sm">
                <Card.Body>
                    {loading ? (
                        <div className="text-center py-5"><Spinner animation="border" variant="warning" /></div>
                    ) : (
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
                                {turnos.map((turno) => (
                                    <tr key={turno.id_turno} style={{ borderBottom: "1px solid #2d3136" }}>
                                        <td>{turno.id_turno}</td>
                                        <td className="fw-bold text-white">{turno.tipo_turno}</td>
                                        <td>{formatearHora(turno.hora_inicio)}</td>
                                        <td>{formatearHora(turno.hora_fin)}</td>
                                        <td className="text-center">
                                            <button 
                                                className="btn-edit-custom"
                                                onClick={() => prepararEdicion(turno)}
                                                title="Editar"
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            {/* 4. Botón de eliminar conectado */}
                                            <button 
                                                className="btn-delete-custom"
                                                onClick={() => prepararEliminacion(turno)}
                                                title="Eliminar"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            <ModalRegistroTurno
                show={mostrarModalRegistro}
                handleClose={() => setMostrarModalRegistro(false)}
                onRegistroExitoso={obtenerTurnos}
            />

            <ModalEdicionTurno
                show={mostrarModalEdicion}
                handleClose={() => {
                    setMostrarModalEdicion(false);
                    setTurnoSeleccionado(null);
                }}
                turno={turnoSeleccionado}
                onActualizacionExitosa={obtenerTurnos}
            />

            {/* 5. Componente del Modal de Eliminación agregado */}
            <ModalEliminacionTurnos
                show={mostrarModalEliminar}
                handleClose={() => {
                    setMostrarModalEliminar(false);
                    setTurnoSeleccionado(null);
                }}
                turno={turnoSeleccionado}
                onEliminacionExitosa={obtenerTurnos}
            />
        </Container>
    );
};

export default Turnos;
import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Table,
    Spinner,
    Alert,
    Badge,
} from "react-bootstrap";

import { supabase } from "../database/supabaseconfig";

import ModalRegistroTurno from "../components/turnos/ModalRegistroTurnos";

const Turnos = () => {

    const [turnos, setTurnos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [mostrarModal, setMostrarModal] = useState(false);

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

            console.error(err);
            setError("Error al cargar turnos.");

        } finally {

            setLoading(false);
        }
    };

    const formatearHora = (hora) => {

        if (!hora) return "";

        return hora.slice(0, 5);
    };

    return (
        <Container fluid className="py-4">

            {/* HEADER */}
            <Row className="mb-4 align-items-center">

                <Col>
                    <h2 className="fw-bold">
                        <i className="bi bi-clock-history me-2"></i>
                        Gestión de Turnos
                    </h2>

                    <p className="text-muted mb-0">
                        Administración de horarios laborales
                    </p>
                </Col>

                <Col xs="auto">
                    <Button
                        variant="success"
                        className="shadow-sm"
                        onClick={() => setMostrarModal(true)}
                    >
                        <i className="bi bi-plus-lg me-2"></i>
                        Nuevo Turno
                    </Button>
                </Col>

            </Row>

            {/* ERROR */}
            {error && (
                <Alert variant="danger">
                    {error}
                </Alert>
            )}

            {/* TABLA */}
            <Card className="shadow-sm border-0">

                <Card.Body>

                    {loading ? (

                        <div className="text-center py-5">
                            <Spinner animation="border" />
                        </div>

                    ) : turnos.length === 0 ? (

                        <Alert variant="light" className="mb-0">
                            No hay turnos registrados.
                        </Alert>

                    ) : (

                        <div className="table-responsive">

                            <Table hover align="middle">

                                <thead className="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Tipo Turno</th>
                                        <th>Hora Inicio</th>
                                        <th>Hora Final</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {turnos.map((turno) => (

                                        <tr key={turno.id_turno}>

                                            <td>
                                                {turno.id_turno}
                                            </td>

                                            <td>
                                                <div className="fw-semibold">
                                                    {turno.tipo_turno}
                                                </div>
                                            </td>

                                            <td>
                                                {formatearHora(turno.hora_inicio)}
                                            </td>

                                            <td>
                                                {formatearHora(turno.hora_fin)}
                                            </td>

                                            <td>
                                                <Badge bg="success">
                                                    Activo
                                                </Badge>
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </Table>

                        </div>

                    )}

                </Card.Body>

            </Card>

            {/* MODAL */}
            <ModalRegistroTurno
                show={mostrarModal}
                handleClose={() => setMostrarModal(false)}
                onRegistroExitoso={obtenerTurnos}
            />

        </Container>
    );
};

export default Turnos;
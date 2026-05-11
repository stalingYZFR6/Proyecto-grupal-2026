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

import ModalRegistroAsistencia from "../components/asistencias/ModalRegistroAsistencia";

const Asistencias = () => {

    const [asistencias, setAsistencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [mostrarModal, setMostrarModal] = useState(false);

    useEffect(() => {
        obtenerAsistencias();
    }, []);

    const obtenerAsistencias = async () => {

        setLoading(true);

        try {

            const { data, error } = await supabase
                .from("asistencias")
                .select(`
                    *,
                    empleado (
                        nombre,
                        apellido
                    ),
                    turnos (
                        tipo_turno
                    ),
                    tiempo (
                        fecha,
                        hora
                    ),
                    Incidencias (
                        tipo_incidencia
                    )
                `)
                .order("id_asistencia", { ascending: false });

            if (error) throw error;

            setAsistencias(data || []);

        } catch (err) {

            console.error(err);
            setError("Error al cargar asistencias.");

        } finally {

            setLoading(false);
        }
    };

    const obtenerBadge = (estado) => {

        switch (estado) {

            case "Presente":
                return "success";

            case "Ausente":
                return "danger";

            case "Tardanza":
                return "warning";

            case "Permiso":
                return "primary";

            default:
                return "secondary";
        }
    };

    return (
        <Container fluid className="py-4">

            {/* HEADER */}
            <Row className="mb-4 align-items-center">

                <Col>
                    <h2 className="fw-bold">
                        <i className="bi bi-calendar-check-fill me-2"></i>
                        Gestión de Asistencias
                    </h2>

                    <p className="text-muted mb-0">
                        Control y registro de asistencias de empleados
                    </p>
                </Col>

                <Col xs="auto">
                    <Button
                        variant="success"
                        onClick={() => setMostrarModal(true)}
                        className="shadow-sm"
                    >
                        <i className="bi bi-plus-lg me-2"></i>
                        Nueva Asistencia
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

                    ) : asistencias.length === 0 ? (

                        <Alert variant="light" className="mb-0">
                            No hay asistencias registradas.
                        </Alert>

                    ) : (

                        <div className="table-responsive">

                            <Table hover align="middle">

                                <thead className="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Empleado</th>
                                        <th>Fecha</th>
                                        <th>Hora</th>
                                        <th>Turno</th>
                                        <th>Estado</th>
                                        <th>Incidencia</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {asistencias.map((asis) => (

                                        <tr key={asis.id_asistencia}>

                                            <td>
                                                {asis.id_asistencia}
                                            </td>

                                            <td>
                                                <div className="fw-semibold">
                                                    {asis.empleado?.nombre}{" "}
                                                    {asis.empleado?.apellido}
                                                </div>
                                            </td>

                                            <td>
                                                {asis.tiempo?.fecha}
                                            </td>

                                            <td>
                                                {asis.tiempo?.hora}
                                            </td>

                                            <td>
                                                {asis.turnos?.tipo_turno}
                                            </td>

                                            <td>
                                                <Badge bg={obtenerBadge(asis.estado_asistencia)}>
                                                    {asis.estado_asistencia}
                                                </Badge>
                                            </td>

                                            <td>
                                                {asis.Incidencias?.tipo_incidencia || (
                                                    <span className="text-muted">
                                                        Sin incidencia
                                                    </span>
                                                )}
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
            <ModalRegistroAsistencia
                show={mostrarModal}
                handleClose={() => setMostrarModal(false)}
                onRegistroExitoso={obtenerAsistencias}
            />

        </Container>
    );
};

export default Asistencias;
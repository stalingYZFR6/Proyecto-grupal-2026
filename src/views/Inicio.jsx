import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    ProgressBar,
    Badge,
    Spinner,
} from "react-bootstrap";

import { supabase } from "../database/supabaseconfig";

const Inicio = () => {

    const [loading, setLoading] = useState(true);

    const [totalEmpleados, setTotalEmpleados] = useState(0);
    const [totalIncidencias, setTotalIncidencias] = useState(0);

    const [totalAsistencias, setTotalAsistencias] = useState(0);

    const [porcentajeAsistencia, setPorcentajeAsistencia] = useState(0);

    const [porcentajeTardanza, setPorcentajeTardanza] = useState(0);

    const [porcentajeAusencias, setPorcentajeAusencias] = useState(0);

    const [tardanzas, setTardanzas] = useState(0);
    const [ausencias, setAusencias] = useState(0);
    const [permisos, setPermisos] = useState(0);

    useEffect(() => {
        obtenerDashboard();
    }, []);

    const obtenerDashboard = async () => {

        setLoading(true);

        try {

            // EMPLEADOS
            const { count: empleadosCount } = await supabase
                .from("empleado")
                .select("*", {
                    count: "exact",
                    head: true,
                });

            setTotalEmpleados(empleadosCount || 0);

            // INCIDENCIAS
            const { count: incidenciasCount } = await supabase
                .from("Incidencias")
                .select("*", {
                    count: "exact",
                    head: true,
                });

            setTotalIncidencias(incidenciasCount || 0);

            // ASISTENCIAS
            const { data: asistenciasData, error } = await supabase
                .from("asistencias")
                .select("estado_asistencia");

            if (error) throw error;

            const total = asistenciasData?.length || 0;

            setTotalAsistencias(total);

            const presentes = asistenciasData.filter(
                (a) => a.estado_asistencia === "Presente"
            ).length;

            const tardanzaCantidad = asistenciasData.filter(
                (a) => a.estado_asistencia === "Tardanza"
            ).length;

            const ausenciaCantidad = asistenciasData.filter(
                (a) => a.estado_asistencia === "Ausente"
            ).length;

            const permisosCantidad = asistenciasData.filter(
                (a) => a.estado_asistencia === "Permiso"
            ).length;

            setTardanzas(tardanzaCantidad);
            setAusencias(ausenciaCantidad);
            setPermisos(permisosCantidad);

            // PORCENTAJES
            const asistenciaPorcentaje =
                total > 0
                    ? Math.round((presentes / total) * 100)
                    : 0;

            const tardanzaPorcentaje =
                total > 0
                    ? Math.round((tardanzaCantidad / total) * 100)
                    : 0;

            const ausenciaPorcentaje =
                total > 0
                    ? Math.round((ausenciaCantidad / total) * 100)
                    : 0;

            setPorcentajeAsistencia(asistenciaPorcentaje);

            setPorcentajeTardanza(tardanzaPorcentaje);

            setPorcentajeAusencias(ausenciaPorcentaje);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <Container className="mt-4">

            {/* HEADER */}
            <Row className="mb-4">
                <Col>
                    <h2 className="fw-bold">
                        <i className="bi bi-speedometer2 me-2"></i>
                        Panel de Control - AssisTech
                    </h2>

                    <p className="text-muted">
                        Monitoreo del personal y control de incidencias
                    </p>
                </Col>
            </Row>

            {/* KPIs */}
            <Row className="g-4 mb-4">

                {/* EMPLEADOS */}
                <Col md={4}>
                    <Card className="shadow-sm text-center h-100 border-0">
                        <Card.Body>

                            <i className="bi bi-people-fill fs-1 text-primary"></i>

                            <h5 className="mt-3">
                                Total Empleados
                            </h5>

                            <h1 className="fw-bold">
                                {totalEmpleados}
                            </h1>

                            <Badge bg="primary">
                                Registrados
                            </Badge>

                        </Card.Body>
                    </Card>
                </Col>

                {/* INCIDENCIAS */}
                <Col md={4}>
                    <Card className="shadow-sm text-center h-100 border-0">
                        <Card.Body>

                            <i className="bi bi-exclamation-triangle-fill fs-1 text-warning"></i>

                            <h5 className="mt-3">
                                Incidencias
                            </h5>

                            <h1 className="fw-bold">
                                {totalIncidencias}
                            </h1>

                            <Badge bg="warning">
                                Totales
                            </Badge>

                        </Card.Body>
                    </Card>
                </Col>

                {/* ASISTENCIA */}
                <Col md={4}>
                    <Card className="shadow-sm text-center h-100 border-0">
                        <Card.Body>

                            <i className="bi bi-calendar-check-fill fs-1 text-success"></i>

                            <h5 className="mt-3">
                                Asistencia
                            </h5>

                            <h1 className="fw-bold">
                                {porcentajeAsistencia}%
                            </h1>

                            <Badge bg="success">
                                General
                            </Badge>

                        </Card.Body>
                    </Card>
                </Col>

            </Row>

            {/* GRÁFICOS */}
            <Row className="g-4 mb-4">

                {/* PUNTUALIDAD */}
                <Col md={6}>
                    <Card className="shadow-sm border-0 h-100">

                        <Card.Body>

                            <h5 className="fw-bold mb-4">
                                <i className="bi bi-graph-up me-2"></i>
                                Resumen de asistencia
                            </h5>

                            <p className="mb-1">
                                Asistencia
                                <span className="float-end">
                                    {porcentajeAsistencia}%
                                </span>
                            </p>

                            <ProgressBar
                                now={porcentajeAsistencia}
                                className="mb-3"
                            />

                            <p className="mb-1">
                                Tardanzas
                                <span className="float-end">
                                    {porcentajeTardanza}%
                                </span>
                            </p>

                            <ProgressBar
                                now={porcentajeTardanza}
                                variant="warning"
                                className="mb-3"
                            />

                            <p className="mb-1">
                                Ausencias
                                <span className="float-end">
                                    {porcentajeAusencias}%
                                </span>
                            </p>

                            <ProgressBar
                                now={porcentajeAusencias}
                                variant="danger"
                            />

                        </Card.Body>

                    </Card>
                </Col>

                {/* INCIDENCIAS */}
                <Col md={6}>
                    <Card className="shadow-sm border-0 h-100">

                        <Card.Body>

                            <h5 className="fw-bold mb-4">
                                <i className="bi bi-pie-chart-fill me-2"></i>
                                Tipos de incidencias
                            </h5>

                            <p className="mb-1">
                                Tardanzas
                                <span className="float-end">
                                    {tardanzas}
                                </span>
                            </p>

                            <ProgressBar
                                now={tardanzas}
                                variant="warning"
                                className="mb-3"
                            />

                            <p className="mb-1">
                                Ausencias
                                <span className="float-end">
                                    {ausencias}
                                </span>
                            </p>

                            <ProgressBar
                                now={ausencias}
                                variant="danger"
                                className="mb-3"
                            />

                            <p className="mb-1">
                                Permisos
                                <span className="float-end">
                                    {permisos}
                                </span>
                            </p>

                            <ProgressBar
                                now={permisos}
                                variant="info"
                            />

                        </Card.Body>

                    </Card>
                </Col>

            </Row>

            {/* RESUMEN */}
            <Row>

                <Col>
                    <Card className="shadow-sm border-0">

                        <Card.Body>

                            <h5 className="fw-bold mb-4">
                                <i className="bi bi-bar-chart-line-fill me-2"></i>
                                Resumen general
                            </h5>

                            <Row className="text-center">

                                <Col>
                                    <h2 className="text-success fw-bold">
                                        {porcentajeAsistencia}%
                                    </h2>

                                    <p className="text-muted">
                                        Asistencia
                                    </p>
                                </Col>

                                <Col>
                                    <h2 className="text-warning fw-bold">
                                        {porcentajeTardanza}%
                                    </h2>

                                    <p className="text-muted">
                                        Retrasos
                                    </p>
                                </Col>

                                <Col>
                                    <h2 className="text-danger fw-bold">
                                        {porcentajeAusencias}%
                                    </h2>

                                    <p className="text-muted">
                                        Ausencias
                                    </p>
                                </Col>

                            </Row>

                        </Card.Body>

                    </Card>
                </Col>

            </Row>

        </Container>
    );
};

export default Inicio;
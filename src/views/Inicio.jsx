import React from "react";
import { Container, Row, Col, Card, ProgressBar, Badge } from "react-bootstrap";

const Inicio = () => {
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

                <Col md={4}>
                    <Card className="shadow-sm text-center">
                        <Card.Body>
                            <i className="bi bi-people fs-1 text-primary"></i>
                            <h5 className="mt-2">Total Empleados</h5>
                            <h2>3</h2>
                            <Badge bg="success">+5% este mes</Badge>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="shadow-sm text-center">
                        <Card.Body>
                            <i className="bi bi-exclamation-triangle fs-1 text-warning"></i>
                            <h5 className="mt-2">Incidencias</h5>
                            <h2>5</h2>
                            <Badge bg="danger">+2 hoy</Badge>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="shadow-sm text-center">
                        <Card.Body>
                            <i className="bi bi-clock-history fs-1 text-success"></i>
                            <h5 className="mt-2">Asistencia</h5>
                            <h2>92%</h2>
                            <Badge bg="primary">Alta</Badge>
                        </Card.Body>
                    </Card>
                </Col>

            </Row>

            {/* GRÁFICOS SIMPLES */}
            <Row className="g-4 mb-4">

                <Col md={6}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h5>
                                <i className="bi bi-graph-up me-2"></i>
                                Puntualidad semanal
                            </h5>

                            <p className="mt-3 mb-1">Lunes</p>
                            <ProgressBar now={80} />

                            <p className="mt-2 mb-1">Martes</p>
                            <ProgressBar now={70} variant="warning" />

                            <p className="mt-2 mb-1">Miércoles</p>
                            <ProgressBar now={90} variant="success" />

                            <p className="mt-2 mb-1">Jueves</p>
                            <ProgressBar now={85} />

                            <p className="mt-2 mb-1">Viernes</p>
                            <ProgressBar now={95} variant="success" />

                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h5>
                                <i className="bi bi-pie-chart me-2"></i>
                                Tipos de incidencias
                            </h5>

                            <div className="mt-3">

                                <p className="mb-1">
                                    Tardanzas <span className="float-end">40%</span>
                                </p>
                                <ProgressBar now={40} variant="warning" />

                                <p className="mt-3 mb-1">
                                    Ausencias <span className="float-end">35%</span>
                                </p>
                                <ProgressBar now={35} variant="danger" />

                                <p className="mt-3 mb-1">
                                    Permisos <span className="float-end">25%</span>
                                </p>
                                <ProgressBar now={25} variant="info" />

                            </div>
                        </Card.Body>
                    </Card>
                </Col>

            </Row>

            {/* RESUMEN GENERAL */}
            <Row>
                <Col>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h5>
                                <i className="bi bi-bar-chart-line me-2"></i>
                                Resumen general
                            </h5>

                            <Row className="text-center mt-3">

                                <Col>
                                    <h4 className="text-success">92%</h4>
                                    <p className="text-muted">Asistencia</p>
                                </Col>

                                <Col>
                                    <h4 className="text-warning">8%</h4>
                                    <p className="text-muted">Retrasos</p>
                                </Col>

                                <Col>
                                    <h4 className="text-danger">5%</h4>
                                    <p className="text-muted">Ausencias</p>
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
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, ProgressBar, Badge, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

const Inicio = () => {
    const [loading, setLoading] = useState(true);
    const [totalEmpleados, setTotalEmpleados] = useState(0);
    const [totalIncidencias, setTotalIncidencias] = useState(0);
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
            const { count: empleadosCount } = await supabase.from("empleado").select("*", { count: "exact", head: true });
            setTotalEmpleados(empleadosCount || 0);

            const { count: incidenciasCount } = await supabase.from("Incidencias").select("*", { count: "exact", head: true });
            setTotalIncidencias(incidenciasCount || 0);

            const { data: asistenciasData, error } = await supabase.from("asistencias").select("estado_asistencia");
            if (error) throw error;

            const total = asistenciasData?.length || 0;
            const presentes = asistenciasData.filter(a => a.estado_asistencia === "Presente").length;
            const tardanzaCantidad = asistenciasData.filter(a => a.estado_asistencia === "Tardanza").length;
            const ausenciaCantidad = asistenciasData.filter(a => a.estado_asistencia === "Ausente").length;
            const permisosCantidad = asistenciasData.filter(a => a.estado_asistencia === "Permiso").length;

            setTardanzas(tardanzaCantidad);
            setAusencias(ausenciaCantidad);
            setPermisos(permisosCantidad);

            setPorcentajeAsistencia(total > 0 ? Math.round((presentes / total) * 100) : 0);
            setPorcentajeTardanza(total > 0 ? Math.round((tardanzaCantidad / total) * 100) : 0);
            setPorcentajeAusencias(total > 0 ? Math.round((ausenciaCantidad / total) * 100) : 0);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5 mt-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Cargando panel de control...</p>
            </div>
        );
    }

    return (
        <Container className="py-5 mt-4">
            {/* HEADER */}
            <div className="mb-5">
                <h2 className="fw-bold mb-1">Panel de Control</h2>
                <p className="text-muted">Resumen operativo y métricas de rendimiento del personal</p>
            </div>

            {/* KPIs */}
            <Row className="g-4 mb-5">
                <Col md={4}>
                    <Card className="premium-card border-0 p-3">
                        <Card.Body className="d-flex align-items-center gap-4">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-4">
                                <i className="bi bi-people-fill fs-2 text-primary"></i>
                            </div>
                            <div>
                                <p className="text-muted small fw-bold mb-0 text-uppercase">Total Empleados</p>
                                <h2 className="fw-bold mb-0">{totalEmpleados}</h2>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="premium-card border-0 p-3">
                        <Card.Body className="d-flex align-items-center gap-4">
                            <div className="bg-warning bg-opacity-10 p-3 rounded-4">
                                <i className="bi bi-exclamation-triangle-fill fs-2 text-warning"></i>
                            </div>
                            <div>
                                <p className="text-muted small fw-bold mb-0 text-uppercase">Incidencias</p>
                                <h2 className="fw-bold mb-0">{totalIncidencias}</h2>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="premium-card border-0 p-3">
                        <Card.Body className="d-flex align-items-center gap-4">
                            <div className="bg-success bg-opacity-10 p-3 rounded-4">
                                <i className="bi bi-calendar-check-fill fs-2 text-success"></i>
                            </div>
                            <div>
                                <p className="text-muted small fw-bold mb-0 text-uppercase">Asistencia</p>
                                <h2 className="fw-bold mb-0">{porcentajeAsistencia}%</h2>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* GRÁFICOS Y DETALLES */}
            <Row className="g-4">
                <Col lg={8}>
                    <Card className="premium-card border-0 p-4 h-100">
                        <h5 className="fw-bold mb-4">Rendimiento de Asistencia</h5>
                        <div className="mb-4">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="fw-medium">Asistencia General</span>
                                <span className="fw-bold text-success">{porcentajeAsistencia}%</span>
                            </div>
                            <ProgressBar now={porcentajeAsistencia} variant="success" style={{ height: '8px' }} className="rounded-pill" />
                        </div>
                        <div className="mb-4">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="fw-medium">Tardanzas</span>
                                <span className="fw-bold text-warning">{porcentajeTardanza}%</span>
                            </div>
                            <ProgressBar now={porcentajeTardanza} variant="warning" style={{ height: '8px' }} className="rounded-pill" />
                        </div>
                        <div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="fw-medium">Ausencias</span>
                                <span className="fw-bold text-danger">{porcentajeAusencias}%</span>
                            </div>
                            <ProgressBar now={porcentajeAusencias} variant="danger" style={{ height: '8px' }} className="rounded-pill" />
                        </div>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className="premium-card border-0 p-4 h-100">
                        <h5 className="fw-bold mb-4">Distribución de Incidencias</h5>
                        <div className="d-flex flex-column gap-3">
                            <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-warning p-2 rounded-circle" style={{ width: '10px', height: '10px' }}></div>
                                    <span className="small fw-medium">Tardanzas</span>
                                </div>
                                <span className="fw-bold">{tardanzas}</span>
                            </div>
                            <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-danger p-2 rounded-circle" style={{ width: '10px', height: '10px' }}></div>
                                    <span className="small fw-medium">Ausencias</span>
                                </div>
                                <span className="fw-bold">{ausencias}</span>
                            </div>
                            <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-info p-2 rounded-circle" style={{ width: '10px', height: '10px' }}></div>
                                    <span className="small fw-medium">Permisos</span>
                                </div>
                                <span className="fw-bold">{permisos}</span>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Inicio;
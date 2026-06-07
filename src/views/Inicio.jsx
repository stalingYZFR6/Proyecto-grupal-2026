import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, ProgressBar, Badge, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

const Inicio = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0, incidencias: 0, asistencia: 0, tardanzas: 0, ausencias: 0, permisos: 0
    });

    useEffect(() => {
        obtenerDashboard();
    }, []);

    const obtenerDashboard = async () => {
        setLoading(true);
        try {
            const { count: empCount } = await supabase.from("empleado").select("*", { count: "exact", head: true });
            const { count: incCount } = await supabase.from("Incidencias").select("*", { count: "exact", head: true });
            const { data: asistData } = await supabase.from("asistencias").select("estado_asistencia");

            const total = asistData?.length || 0;
            const presentes = asistData?.filter(a => a.estado_asistencia === "Presente").length || 0;
            
            setStats({
                total: empCount || 0,
                incidencias: incCount || 0,
                asistencia: total > 0 ? Math.round((presentes / total) * 100) : 0,
                tardanzas: asistData?.filter(a => a.estado_asistencia === "Tardanza").length || 0,
                ausencias: asistData?.filter(a => a.estado_asistencia === "Ausente").length || 0,
                permisos: asistData?.filter(a => a.estado_asistencia === "Permiso").length || 0
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;

    return (
        <Container fluid>
            <div className="mb-5">
                <h2 className="fw-bold text-dark mb-1">Resumen Ejecutivo</h2>
                <p className="text-muted">Métricas clave del capital humano y rendimiento operativo.</p>
            </div>

            <Row className="g-4 mb-5">
                <Col md={3}>
                    <Card className="premium-card border-0 p-3">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="bg-primary bg-opacity-10 p-3 rounded-4">
                                    <i className="bi bi-people-fill fs-4 text-primary"></i>
                                </div>
                                <Badge bg="success" className="bg-opacity-10 text-success">+2.5%</Badge>
                            </div>
                            <h3 className="fw-bold mb-1">{stats.total}</h3>
                            <p className="text-muted small mb-0 fw-medium">Colaboradores Totales</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="premium-card border-0 p-3">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="bg-info bg-opacity-10 p-3 rounded-4">
                                    <i className="bi bi-calendar-check-fill fs-4 text-info"></i>
                                </div>
                                <Badge bg="info" className="bg-opacity-10 text-info">Hoy</Badge>
                            </div>
                            <h3 className="fw-bold mb-1">{stats.asistencia}%</h3>
                            <p className="text-muted small mb-0 fw-medium">Tasa de Asistencia</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="premium-card border-0 p-3">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="bg-warning bg-opacity-10 p-3 rounded-4">
                                    <i className="bi bi-exclamation-triangle-fill fs-4 text-warning"></i>
                                </div>
                                <Badge bg="warning" className="bg-opacity-10 text-warning">Pendientes</Badge>
                            </div>
                            <h3 className="fw-bold mb-1">{stats.incidencias}</h3>
                            <p className="text-muted small mb-0 fw-medium">Incidencias Activas</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="premium-card border-0 p-3">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="bg-danger bg-opacity-10 p-3 rounded-4">
                                    <i className="bi bi-person-x-fill fs-4 text-danger"></i>
                                </div>
                                <Badge bg="danger" className="bg-opacity-10 text-danger">Crítico</Badge>
                            </div>
                            <h3 className="fw-bold mb-1">{stats.ausencias}</h3>
                            <p className="text-muted small mb-0 fw-medium">Ausencias del Mes</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4">
                <Col lg={8}>
                    <Card className="premium-card border-0 p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0">Rendimiento de Asistencia</h5>
                            <button className="btn btn-light btn-sm rounded-pill px-3">Ver Reporte</button>
                        </div>
                        <div className="mb-4">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="fw-medium small">Asistencia General</span>
                                <span className="fw-bold text-success small">{stats.asistencia}%</span>
                            </div>
                            <ProgressBar now={stats.asistencia} variant="success" style={{ height: '6px' }} className="rounded-pill" />
                        </div>
                        <div className="mb-4">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="fw-medium small">Tardanzas</span>
                                <span className="fw-bold text-warning small">12%</span>
                            </div>
                            <ProgressBar now={12} variant="warning" style={{ height: '6px' }} className="rounded-pill" />
                        </div>
                        <div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="fw-medium small">Ausencias</span>
                                <span className="fw-bold text-danger small">5%</span>
                            </div>
                            <ProgressBar now={5} variant="danger" style={{ height: '6px' }} className="rounded-pill" />
                        </div>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className="premium-card border-0 p-4 h-100">
                        <h5 className="fw-bold mb-4">Distribución de Novedades</h5>
                        <div className="d-flex flex-column gap-3">
                            {[
                                { label: 'Tardanzas', val: stats.tardanzas, color: 'warning' },
                                { label: 'Ausencias', val: stats.ausencias, color: 'danger' },
                                { label: 'Permisos', val: stats.permisos, color: 'info' }
                            ].map((item, idx) => (
                                <div key={idx} className="d-flex align-items-center justify-content-between p-3 bg-light rounded-4">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className={`bg-${item.color} p-2 rounded-circle`} style={{ width: '10px', height: '10px' }}></div>
                                        <span className="small fw-semibold">{item.label}</span>
                                    </div>
                                    <span className="fw-bold">{item.val}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Inicio;
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, ProgressBar, Badge, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

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
    const COLORES = ["#28a745", "#ffc107", "#dc3545", "#17a2b8"];
    const [graficoAsistencias, setGraficoAsistencias] = useState([]);
const [graficoIncidencias, setGraficoIncidencias] = useState([]);

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
             
            setGraficoAsistencias([
    { name: "Presente", value: presentes },
    { name: "Tardanza", value: tardanzaCantidad },
    { name: "Ausente", value: ausenciaCantidad },
    { name: "Permiso", value: permisosCantidad },
]);

setGraficoIncidencias([
    { name: "Tardanzas", value: tardanzaCantidad },
    { name: "Ausencias", value: ausenciaCantidad },
    { name: "Permisos", value: permisosCantidad },
]);

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
            <Row className="g-4 mb-5">

    {/* 📈 Línea / barras de asistencias */}
    <Col lg={8}>
        <Card className="premium-card border-0 p-4">
            <h5 className="fw-bold mb-4">Resumen de Asistencias</h5>

            <ResponsiveContainer width="100%" height={320}>
                <LineChart data={graficoAsistencias}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#28a745"
                        strokeWidth={3}
                        dot={{ r: 5 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    </Col>

    {/* 🥧 Pie chart incidencias */}
    <Col lg={4}>
        <Card className="premium-card border-0 p-4">
            <h5 className="fw-bold mb-4">Distribución</h5>

            <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                    <Pie
                        data={graficoIncidencias}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                    >
                        {graficoIncidencias.map((_, i) => (
                            <Cell key={i} fill={COLORES[i % COLORES.length]} />
                        ))}
                    </Pie>

                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </Card>
    </Col>

</Row>
        </Container>
    );
};

export default Inicio;
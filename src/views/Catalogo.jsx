import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Form, Badge, InputGroup } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import TarjetaEmpleado from "../components/empleados/TarjetaEmpleado";

const Catalogo = () => {
    const [empleados, setEmpleados] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState("");

    const obtenerEmpleados = async () => {
        try {
            setCargando(true);
            const { data, error } = await supabase
                .from("empleado")
                .select("*")
                .order("nombre", { ascending: true });

            if (error) throw error;
            setEmpleados(data || []);
        } catch (error) {
            console.error("Error al cargar catálogo:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerEmpleados();
    }, []);

    const empleadosFiltrados = empleados.filter((emp) =>
        `${emp.nombre} ${emp.apellido}`.toLowerCase().includes(busqueda.toLowerCase()) ||
        emp.cedula.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <Container className="py-5 mt-4">
            {/* Header del Catálogo */}
            <div className="mb-5">
                <Row className="align-items-center g-4">
                    <Col lg={6}>
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-4">
                                <i className="bi bi-journal-bookmark-fill text-primary fs-3"></i>
                            </div>
                            <div>
                                <h2 className="fw-bold mb-0">Catálogo de Personal</h2>
                                <p className="text-muted mb-0">Directorio completo de colaboradores activos</p>
                            </div>
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="search-container">
                            <i className="bi bi-search search-icon"></i>
                            <Form.Control
                                type="text"
                                placeholder="Buscar por nombre o identificación..."
                                className="search-input"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Estadísticas Rápidas */}
            <Row className="mb-5 g-3">
                <Col md={4}>
                    <div className="bg-premium-light p-3 rounded-4 border d-flex justify-content-between align-items-center">
                        <span className="fw-medium text-muted">Total en Directorio</span>
                        <Badge bg="primary" className="rounded-pill px-3">{empleados.length}</Badge>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="bg-premium-light p-3 rounded-4 border d-flex justify-content-between align-items-center">
                        <span className="fw-medium text-muted">Resultados de Búsqueda</span>
                        <Badge bg="info" className="rounded-pill px-3">{empleadosFiltrados.length}</Badge>
                    </div>
                </Col>
            </Row>

            {/* Contenido */}
            {cargando ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted">Cargando directorio...</p>
                </div>
            ) : empleadosFiltrados.length === 0 ? (
                <Card className="premium-card border-0 p-5 text-center text-muted">
                    <i className="bi bi-person-x display-1 mb-3 opacity-25"></i>
                    <h5>No se encontraron coincidencias</h5>
                    <p>Intenta con otros términos de búsqueda</p>
                </Card>
            ) : (
                <div className="fade-in">
                    <TarjetaEmpleado 
                        empleados={empleadosFiltrados} 
                        // Pasamos funciones vacías o null si solo queremos visualización en el catálogo
                        abrirModalEdicion={() => {}} 
                        abrirModalEliminacion={() => {}} 
                    />
                </div>
            )}
        </Container>
    );
};

export default Catalogo;
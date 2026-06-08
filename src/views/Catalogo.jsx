import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Spinner, Badge } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import TarjetaCatalogo from "../components/empleados/TarjetaCatalogo";

const Catalogo = () => {
    const [empleados, setEmpleados] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);

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
            console.error("Error al cargar el catálogo:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerEmpleados();
    }, []);

    const empleadosFiltrados = empleados.filter((emp) =>
        `${emp.nombre} ${emp.apellido}`.toLowerCase().includes(busqueda.toLowerCase()) ||
        emp.cedula.includes(busqueda)
    );

    return (
        <Container className="py-5 mt-4">
            <div className="mb-5">
                <Row className="align-items-center g-4">
                    <Col md={6}>
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-4">
                                <i className="bi bi-journal-bookmark-fill text-primary fs-3"></i>
                            </div>
                            <div>
                                <h2 className="fw-bold mb-0">Catálogo de Personal</h2>
                                <p className="text-muted mb-0">Directorio visual de todos los colaboradores</p>
                            </div>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="search-container">
                            <i className="bi bi-search search-icon"></i>
                            <Form.Control
                                type="text"
                                placeholder="Buscar por nombre o identificación..."
                                className="search-input shadow-sm"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>
                    </Col>
                </Row>
            </div>

            {cargando ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted fw-medium">Cargando directorio...</p>
                </div>
            ) : (
                <>
                    <div className="mb-4">
                        <Badge bg="primary" className="bg-opacity-10 text-primary border-0 rounded-pill px-4 py-2 fs-6 fw-semibold">
                            {empleadosFiltrados.length} Colaboradores Registrados
                        </Badge>
                    </div>

                    {empleadosFiltrados.length > 0 ? (
                        <Row className="g-4">
                            {empleadosFiltrados.map((emp) => (
                                <Col key={emp.id_empleado} xs={12} sm={6} lg={4} xl={3}>
                                    <TarjetaCatalogo empleado={emp} />
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div className="text-center py-5 bg-premium-light rounded-4 border border-dashed">
                            <i className="bi bi-person-x display-4 text-muted mb-3"></i>
                            <h5 className="text-muted">No se encontraron coincidencias</h5>
                        </div>
                    )}
                </>
            )}
        </Container>
    );
};

export default Catalogo;
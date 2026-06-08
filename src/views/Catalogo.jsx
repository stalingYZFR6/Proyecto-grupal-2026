import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Spinner, Badge, InputGroup } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import TarjetaEmpleado from "../components/empleados/TarjetaEmpleado";

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

    // Filtrado en tiempo real
    const empleadosFiltrados = empleados.filter((emp) =>
        `${emp.nombre} ${emp.apellido}`.toLowerCase().includes(busqueda.toLowerCase()) ||
        emp.cedula.includes(busqueda)
    );

    return (
        <Container className="py-5 mt-4">
            {/* Encabezado del Catálogo */}
            <div className="mb-5">
                <Row className="align-items-center g-4">
                    <Col md={6}>
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

            {/* Estado de Carga */}
            {cargando ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted fw-medium">Cargando directorio...</p>
                </div>
            ) : (
                <>
                    {/* Contador de Resultados */}
                    <div className="mb-4 d-flex align-items-center gap-2">
                        <Badge bg="primary" className="bg-opacity-10 text-primary border-0 rounded-pill px-3 py-2">
                            {empleadosFiltrados.length} Colaboradores encontrados
                        </Badge>
                    </div>

                    {/* Grid de Tarjetas */}
                    {empleadosFiltrados.length > 0 ? (
                        <TarjetaEmpleado 
                            empleados={empleadosFiltrados} 
                            // En el catálogo ocultamos las acciones de edición/borrado pasando funciones vacías o manejándolas internamente
                            abrirModalEdicion={() => {}} 
                            abrirModalEliminacion={() => {}}
                        />
                    ) : (
                        <div className="text-center py-5 bg-premium-light rounded-4 border border-dashed">
                            <i className="bi bi-person-x display-4 text-muted mb-3"></i>
                            <h5 className="text-muted">No se encontraron coincidencias</h5>
                            <p className="small text-muted">Intenta con otro nombre o número de cédula</p>
                        </div>
                    )}
                </>
            )}
        </Container>
    );
};

export default Catalogo;
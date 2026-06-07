import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Form, Badge, Spinner, Pagination } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import TablaUsuarios from "../components/usuarios/TablaUsuarios";
import ModalRegistroUsuario from "../components/usuarios/ModalRegistroUsuario";
import ModalEditarUsuario from "../components/usuarios/ModalEditarUsuario";
import ModalEliminarUsuario from "../components/usuarios/ModalEliminarUsuario";

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const usuariosPorPagina = 8;

    // Modales
    const [showRegistro, setShowRegistro] = useState(false);
    const [showEditar, setShowEditar] = useState(false);
    const [showEliminar, setShowEliminar] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("usuarios")
                .select(`
                    *,
                    empleado (
                        nombre,
                        apellido,
                        correo,
                        url_imagen,
                        cedula
                    )
                `)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setUsuarios(data || []);
        } catch (err) {
            console.error("Error al cargar usuarios:", err);
        } finally {
            setLoading(false);
        }
    };

    const usuariosFiltrados = usuarios.filter(u => 
        `${u.empleado?.nombre} ${u.empleado?.apellido}`.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.empleado?.correo?.toLowerCase().includes(busqueda.toLowerCase())
    );

    // Paginación
    const indiceUltimo = paginaActual * usuariosPorPagina;
    const indicePrimer = indiceUltimo - usuariosPorPagina;
    const usuariosPaginados = usuariosFiltrados.slice(indicePrimer, indiceUltimo);
    const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);

    return (
        <Container className="py-5 mt-4">
            <div className="mb-5">
                <Row className="align-items-end g-4">
                    <Col lg={6}>
                        <div className="d-flex align-items-center gap-3 mb-2">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-4">
                                <i className="bi bi-shield-lock-fill text-primary fs-3"></i>
                            </div>
                            <div>
                                <h2 className="fw-bold mb-0">Gestión de Usuarios</h2>
                                <p className="text-muted mb-0">Control de accesos y permisos del sistema</p>
                            </div>
                        </div>
                    </Col>
                    <Col lg={6} className="text-lg-end">
                        <Button onClick={() => setShowRegistro(true)} className="btn-premium-primary shadow-sm">
                            <i className="bi bi-person-plus-fill me-2"></i>
                            Nuevo Acceso
                        </Button>
                    </Col>
                </Row>
            </div>

            <Card className="premium-card border-0 p-4 mb-5">
                <Row className="g-3 align-items-center mb-4">
                    <Col md={6}>
                        <div className="search-container">
                            <i className="bi bi-search search-icon"></i>
                            <Form.Control
                                type="text"
                                placeholder="Buscar por nombre o correo..."
                                className="search-input"
                                value={busqueda}
                                onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
                            />
                        </div>
                    </Col>
                    <Col md={6} className="text-md-end">
                        <Badge bg="primary" className="bg-opacity-10 text-primary border-0 rounded-pill px-4 py-2 fs-6 fw-semibold">
                            {usuariosFiltrados.length} Usuarios Registrados
                        </Badge>
                    </Col>
                </Row>

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3 text-muted">Sincronizando usuarios...</p>
                    </div>
                ) : (
                    <>
                        <TablaUsuarios 
                            usuarios={usuariosPaginados} 
                            abrirEditar={(u) => { setUsuarioSeleccionado(u); setShowEditar(true); }}
                            abrirEliminar={(u) => { setUsuarioSeleccionado(u); setShowEliminar(true); }}
                        />

                        {totalPaginas > 1 && (
                            <div className="d-flex justify-content-center mt-4">
                                <Pagination>
                                    <Pagination.Prev 
                                        disabled={paginaActual === 1} 
                                        onClick={() => setPaginaActual(paginaActual - 1)} 
                                    />
                                    {[...Array(totalPaginas)].map((_, i) => (
                                        <Pagination.Item 
                                            key={i + 1} 
                                            active={i + 1 === paginaActual}
                                            onClick={() => setPaginaActual(i + 1)}
                                        >
                                            {i + 1}
                                        </Pagination.Item>
                                    ))}
                                    <Pagination.Next 
                                        disabled={paginaActual === totalPaginas} 
                                        onClick={() => setPaginaActual(paginaActual + 1)} 
                                    />
                                </Pagination>
                            </div>
                        )}
                    </>
                )}
            </Card>

            {/* Modales */}
            <ModalRegistroUsuario 
                show={showRegistro} 
                handleClose={() => setShowRegistro(false)} 
                onExito={cargarUsuarios} 
            />
            <ModalEditarUsuario 
                show={showEditar} 
                handleClose={() => setShowEditar(false)} 
                usuario={usuarioSeleccionado}
                onExito={cargarUsuarios} 
            />
            <ModalEliminarUsuario 
                show={showEliminar} 
                handleClose={() => setShowEliminar(false)} 
                usuario={usuarioSeleccionado}
                onExito={cargarUsuarios} 
            />
        </Container>
    );
};

export default Usuarios;
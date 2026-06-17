import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Image, Badge, Spinner, Modal, Form } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../database/supabaseconfig";
import Swal from "sweetalert2";
import ModalEdicionEmpleado from "../components/empleados/ModalEdicionEmpleado";

const MiPerfil = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const idEmpleadoParam = searchParams.get("id_empleado");

    const [loading, setLoading] = useState(true);
    const [empleado, setEmpleado] = useState(null);
    const [documentos, setDocumentos] = useState([]);
    const [rolUsuarioActual, setRolUsuarioActual] = useState("");
    const [idEmpleadoActual, setIdEmpleadoActual] = useState(null);

    // Modales
    const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
    const [mostrarModalDoc, setMostrarModalDoc] = useState(false);
    const [mostrarLightbox, setMostrarModalLightbox] = useState(false);

    // Formulario nuevo documento
    const [nuevoDoc, setNuevoDoc] = useState({ titulo: "", archivo: null });
    const [subiendoDoc, setSubiendoDoc] = useState(false);

    // Documento seleccionado para visor
    const [docSeleccionado, setDocSeleccionado] = useState(null);

    useEffect(() => {
        inicializarPerfil();
    }, [idEmpleadoParam]);

    const inicializarPerfil = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate("/login");
                return;
            }

            // Obtener rol e id_empleado del usuario logueado
            const { data: perfil } = await supabase
                .from("usuarios")
                .select("rol, id_empleado")
                .eq("id_auth", user.id)
                .maybeSingle();

            if (perfil) {
                setRolUsuarioActual(perfil.rol);
                setIdEmpleadoActual(perfil.id_empleado);
            }

            // Determinar qué empleado cargar
            let idCargar = perfil?.id_empleado;
            if (perfil?.rol === "Admin" && idEmpleadoParam) {
                idCargar = parseInt(idEmpleadoParam);
            }

            if (!idCargar) {
                Swal.fire("Error", "No se especificó un empleado válido.", "error");
                return;
            }

            // Cargar datos del empleado
            const { data: empData, error: empErr } = await supabase
                .from("empleado")
                .select("*")
                .eq("id_empleado", idCargar)
                .single();

            if (empErr) throw empErr;
            setEmpleado(empData);

            // Cargar documentos
            await cargarDocumentos(idCargar);

        } catch (err) {
            console.error(err);
            Swal.fire("Error", "No se pudo cargar el expediente digital.", "error");
        } finally {
            setLoading(false);
        }
    };

    const cargarDocumentos = async (idEmp) => {
        const { data, error } = await supabase
            .from("documentos_empleado")
            .select("*")
            .eq("id_empleado", idEmp)
            .order("created_at", { ascending: false });

        if (error) console.error("Error cargando documentos:", error);
        setDocumentos(data || []);
    };

    const esPropietario = idEmpleadoActual === empleado?.id_empleado;

    const handleSubirDocumento = async (e) => {
        e.preventDefault();
        if (!nuevoDoc.archivo || !nuevoDoc.titulo.trim()) return;

        try {
            setSubiendoDoc(true);
            const archivo = nuevoDoc.archivo;
            const extension = archivo.name.split('.').pop() || 'png';
            const nombreArchivo = `${empleado.id_empleado}_doc_${Date.now()}.${extension}`;

            // Subir a storage
            const { error: uploadErr } = await supabase.storage
                .from("imagenes_empleados")
                .upload(nombreArchivo, archivo, {
                    cacheControl: '3600',
                    upsert: true,
                    contentType: archivo.type
                });

            if (uploadErr) throw uploadErr;

            const { data: urlData } = supabase.storage
                .from("imagenes_empleados")
                .getPublicUrl(nombreArchivo);

            const tipo = archivo.type.includes("pdf") ? "pdf" : "image";

            // Registrar en base de datos
            const { error: dbErr } = await supabase
                .from("documentos_empleado")
                .insert([{
                    id_empleado: empleado.id_empleado,
                    titulo_personalizado: nuevoDoc.titulo,
                    url_archivo: urlData.publicUrl,
                    tipo_archivo: tipo
                }]);

            if (dbErr) throw dbErr;

            Swal.fire({ icon: "success", title: "Documento añadido", timer: 1500, showConfirmButton: false });
            setMostrarModalDoc(false);
            setNuevoDoc({ titulo: "", archivo: null });
            await cargarDocumentos(empleado.id_empleado);

        } catch (err) {
            console.error(err);
            Swal.fire("Error", "No se pudo subir el documento.", "error");
        } finally {
            setSubiendoDoc(false);
        }
    };

    const handleEliminarDocumento = async (doc) => {
        const result = await Swal.fire({
            title: "¿Eliminar documento?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
            try {
                const { error } = await supabase
                    .from("documentos_empleado")
                    .delete()
                    .eq("id_documento", doc.id_documento);

                if (error) throw error;

                Swal.fire({ icon: "success", title: "Eliminado", timer: 1500, showConfirmButton: false });
                setMostrarModalLightbox(false);
                await cargarDocumentos(empleado.id_empleado);
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "No se pudo eliminar el documento.", "error");
            }
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5 mt-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Cargando expediente digital...</p>
            </div>
        );
    }

    return (
        <Container className="py-5 mt-4">
            <div className="mb-5">
                <h2 className="fw-bold mb-1">Expediente Digital</h2>
                <p className="text-muted">Visualización y gestión de documentos oficiales del colaborador</p>
            </div>

            <Row className="g-4">
                {/* SECCIÓN IZQUIERDA: DATOS BÁSICOS */}
                <Col lg={4}>
                    <Card className="premium-card border-0 p-4 text-center">
                        <div className="position-relative d-inline-block mx-auto mb-4">
                            <Image
                                src={empleado?.url_imagen || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                roundedCircle
                                width={150}
                                height={120}
                                className="border border-4 border-white shadow-sm object-fit-cover"
                            />
                        </div>

                        <h4 className="fw-bold mb-1">{empleado?.nombre} {empleado?.apellido}</h4>
                        <Badge bg="primary" className="bg-opacity-10 text-primary border-0 rounded-pill px-3 py-1 mb-4">
                            ID Colaborador: #{empleado?.id_empleado}
                        </Badge>

                        <hr className="my-4 opacity-10" />

                        <div className="text-start space-y-3">
                            <div className="mb-3">
                                <small className="text-muted d-block">Cédula / Identificación</small>
                                <span className="fw-semibold">{empleado?.cedula}</span>
                            </div>
                            <div className="mb-3">
                                <small className="text-muted d-block">Correo Electrónico</small>
                                <span className="fw-semibold text-truncate d-block">{empleado?.correo || "Sin correo"}</span>
                            </div>
                            <div className="mb-3">
                                <small className="text-muted d-block">Teléfono de Contacto</small>
                                <span className="fw-semibold">{empleado?.telefono || "Sin teléfono"}</span>
                            </div>
                            <div className="mb-3">
                                <small className="text-muted d-block">Dirección Domiciliar</small>
                                <span className="fw-semibold">{empleado?.direccion || "Sin dirección"}</span>
                            </div>
                        </div>

                        {esPropietario && (
                            <Button 
                                variant="outline-primary" 
                                className="w-100 rounded-3 py-2 mt-4 fw-bold border-2"
                                onClick={() => setMostrarModalEditar(true)}
                            >
                                <i className="bi bi-pencil-square me-2"></i>
                                Editar Datos Básicos
                            </Button>
                        )}
                    </Card>
                </Col>

                {/* SECCIÓN DERECHA: EXPEDIENTE POR TARJETAS */}
                <Col lg={8}>
                    <Card className="premium-card border-0 p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0">Documentos Adjuntos</h5>
                            {esPropietario && (
                                <Button 
                                    variant="primary" 
                                    className="btn-premium-primary shadow-sm py-2"
                                    onClick={() => setMostrarModalDoc(true)}
                                >
                                    <i className="bi bi-plus-lg me-2"></i>
                                    Añadir Documento
                                </Button>
                            )}
                        </div>

                        {documentos.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <i className="bi bi-folder-x display-3 mb-3"></i>
                                <h5>No hay documentos en el expediente</h5>
                                <p className="small">Sube copias de tu cédula, currículum u otros archivos importantes.</p>
                            </div>
                        ) : (
                            <Row className="g-3">
                                {documentos.map((doc) => (
                                    <Col key={doc.id_documento} sm={6}>
                                        <Card 
                                            className="bg-light border-0 rounded-3 p-3 h-100 cursor-pointer hover-shadow transition-all"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => {
                                                setDocSeleccionado(doc);
                                                setMostrarModalLightbox(true);
                                            }}
                                        >
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="bg-white p-3 rounded-3 shadow-sm">
                                                    <i className={`bi ${doc.tipo_archivo === "pdf" ? "bi-file-earmark-pdf text-danger" : "bi-file-earmark-image text-primary"} fs-3`}></i>
                                                </div>
                                                <div className="overflow-hidden">
                                                    <h6 className="fw-bold mb-1 text-truncate">{doc.titulo_personalizado}</h6>
                                                    <small className="text-muted text-capitalize">{doc.tipo_archivo.toUpperCase()}</small>
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Card>
                </Col>
            </Row>

            {/* MODAL: EDITAR DATOS BÁSICOS */}
            {empleado && (
                <ModalEdicionEmpleado
                    mostrarModalEdicion={mostrarModalEditar}
                    setMostrarModalEdicion={setMostrarModalEditar}
                    empleadoEditar={empleado}
                    setEmpleadoEditar={setEmpleado}
                    manejoCambioInputEdicion={(e) => setEmpleado({ ...empleado, [e.target.name]: e.target.value })}
                    actualizarEmpleado={async () => {
                        const { error } = await supabase
                            .from("empleado")
                            .update({
                                telefono: empleado.telefono,
                                direccion: empleado.direccion
                            })
                            .eq("id_empleado", empleado.id_empleado);

                        if (error) {
                            Swal.fire("Error", "No se pudieron guardar los cambios.", "error");
                        } else {
                            Swal.fire({ icon: "success", title: "Datos actualizados", timer: 1500, showConfirmButton: false });
                            setMostrarModalEditar(false);
                        }
                    }}
                />
            )}

            {/* MODAL: AÑADIR DOCUMENTO */}
            <Modal show={mostrarModalDoc} onHide={() => setMostrarModalDoc(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Añadir Documento al Expediente</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubirDocumento}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Título del Documento</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ej: Cédula - Frente, CV Actualizado"
                                value={nuevoDoc.titulo}
                                onChange={(e) => setNuevoDoc({ ...nuevoDoc, titulo: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Seleccionar Archivo</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => setNuevoDoc({ ...nuevoDoc, archivo: e.target.files[0] })}
                                required
                            />
                            <Form.Text className="text-muted">Acepta imágenes (PNG, JPG) y documentos PDF.</Form.Text>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setMostrarModalDoc(false)} disabled={subiendoDoc}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" disabled={subiendoDoc}>
                            {subiendoDoc ? "Subiendo..." : "Subir Archivo"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* MODAL: VISOR DE DOCUMENTO (LIGHTBOX) */}
            <Modal show={mostrarLightbox} onHide={() => setMostrarModalLightbox(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>{docSeleccionado?.titulo_personalizado}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center p-0 bg-dark d-flex align-items-center justify-content-center" style={{ minHeight: "450px" }}>
                    {docSeleccionado?.tipo_archivo === "pdf" ? (
                        <iframe
                            src={docSeleccionado?.url_archivo}
                            title={docSeleccionado?.titulo_personalizado}
                            width="100%"
                            height="600px"
                            style={{ border: "none" }}
                        />
                    ) : (
                        <Image
                            src={docSeleccionado?.url_archivo}
                            alt={docSeleccionado?.titulo_personalizado}
                            fluid
                            style={{ maxHeight: "600px", objectFit: "contain" }}
                        />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <a 
                        href={docSeleccionado?.url_archivo} 
                        download 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn btn-primary"
                    >
                        <i className="bi bi-download me-2"></i>
                        Descargar Archivo
                    </a>
                    {esPropietario && (
                        <Button variant="danger" onClick={() => handleEliminarDocumento(docSeleccionado)}>
                            <i className="bi bi-trash me-2"></i>
                            Eliminar
                        </Button>
                    )}
                    <Button variant="secondary" onClick={() => setMostrarModalLightbox(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default MiPerfil;
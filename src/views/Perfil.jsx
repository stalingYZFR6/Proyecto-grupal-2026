import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Image, Spinner, Alert, Modal } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import Swal from "sweetalert2";

const Perfil = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const docInputRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [empleado, setEmpleado] = useState(null);
    const [documentos, setDocumentos] = useState([]);
    const [rolUsuarioActual, setRolUsuarioActual] = useState("");
    const [idEmpleadoActual, setIdEmpleadoActual] = useState(null);

    // Estados de Edición
    const [modoEdicion, setModoEdicion] = useState(false);
    const [formDatos, setFormData] = useState({ telefono: "", direccion: "", preview_imagen: "", archivo_imagen: null });
    const [nuevoDoc, setNuevoDoc] = useState({ titulo: "", archivo: null });
    const [subiendoDoc, setSubiendoDoc] = useState(false);

    // Estados de Lightbox
    const [docSeleccionado, setDocSeleccionado] = useState(null);
    const [mostrarLightbox, setMostrarLightbox] = useState(false);

    useEffect(() => {
        obtenerDatos();
    }, [id]);

    const obtenerDatos = async () => {
        try {
            setLoading(true);
            setError(null);

            // 1. Obtener usuario logueado
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate("/login");
                return;
            }

            const { data: perfil } = await supabase
                .from("usuarios")
                .select("rol, id_empleado")
                .eq("id_auth", user.id)
                .maybeSingle();

            if (!perfil) throw new Error("No se encontró el perfil de usuario.");

            setRolUsuarioActual(perfil.rol);
            setIdEmpleadoActual(perfil.id_empleado);

            // 2. Determinar qué empleado cargar
            let targetId = id ? parseInt(id) : perfil.id_empleado;

            if (!targetId) {
                throw new Error("No se especificó un ID de empleado válido.");
            }

            // 3. Cargar datos del empleado
            const { data: empData, error: empError } = await supabase
                .from("empleado")
                .select("*")
                .eq("id_empleado", targetId)
                .single();

            if (empError) throw empError;
            setEmpleado(empData);
            setFormData({
                telefono: empData.telefono || "",
                direccion: empData.direccion || "",
                preview_imagen: empData.url_imagen || "",
                archivo_imagen: null
            });

            // 4. Cargar documentos del expediente
            const { data: docsData, error: docsError } = await supabase
                .from("documentos_empleado")
                .select("*")
                .eq("id_empleado", targetId)
                .order("created_at", { ascending: false });

            if (docsError) throw docsError;
            setDocumentos(docsData || []);

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const subirImagen = async (archivo) => {
        if (!archivo) return null;
        const extension = archivo.name.split('.').pop() || 'png';
        const nombreArchivo = `${Date.now()}.${extension}`;

        const { data, error } = await supabase.storage
            .from("imagenes_empleados")
            .upload(nombreArchivo, archivo, {
                cacheControl: '3600',
                upsert: true,
                contentType: archivo.type
            });

        if (error) throw error;

        const { data: urlData } = supabase.storage
            .from("imagenes_empleados")
            .getPublicUrl(nombreArchivo);

        return urlData.publicUrl;
    };

    const handleGuardarCambios = async () => {
        try {
            setLoading(true);
            let urlImagen = empleado.url_imagen;

            if (formDatos.archivo_imagen) {
                const nuevaUrl = await subirImagen(formDatos.archivo_imagen);
                if (nuevaUrl) urlImagen = nuevaUrl;
            }

            const { error } = await supabase
                .from("empleado")
                .update({
                    telefono: formDatos.telefono,
                    direccion: formDatos.direccion,
                    url_imagen: urlImagen
                })
                .eq("id_empleado", empleado.id_empleado);

            if (error) throw error;

            Swal.fire({
                icon: "success",
                title: "Perfil Actualizado",
                text: "Tus datos personales han sido actualizados correctamente.",
                timer: 1500,
                showConfirmButton: false
            });

            setModoEdicion(false);
            obtenerDatos();
        } catch (err) {
            console.error(err);
            Swal.fire("Error", err.message || "No se pudieron guardar los cambios.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSubirDocumento = async (e) => {
        e.preventDefault();
        if (!nuevoDoc.titulo.trim() || !nuevoDoc.archivo) {
            Swal.fire("Advertencia", "Por favor escribe un título y selecciona un archivo.", "warning");
            return;
        }

        try {
            setSubiendoDoc(true);
            const archivo = nuevoDoc.archivo;
            const extension = archivo.name.split('.').pop() || 'png';
            const nombreArchivo = `docs/${Date.now()}_${Math.random().toString(36).substring(7)}.${extension}`;

            // Subir a Supabase Storage
            const { data, error: uploadError } = await supabase.storage
                .from("imagenes_empleados")
                .upload(nombreArchivo, archivo, {
                    cacheControl: '3600',
                    upsert: true,
                    contentType: archivo.type
                });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from("imagenes_empleados")
                .getPublicUrl(nombreArchivo);

            const tipo = archivo.type.includes("pdf") ? "pdf" : "imagen";

            // Registrar en la base de datos
            const { error: dbError } = await supabase
                .from("documentos_empleado")
                .insert([{
                    id_empleado: empleado.id_empleado,
                    url_archivo: urlData.publicUrl,
                    titulo_personalizado: nuevoDoc.titulo,
                    tipo_archivo: tipo
                }]);

            if (dbError) throw dbError;

            Swal.fire({
                icon: "success",
                title: "Documento Subido",
                text: "El documento se ha agregado a tu expediente digital.",
                timer: 1500,
                showConfirmButton: false
            });

            setNuevoDoc({ titulo: "", archivo: null });
            if (docInputRef.current) docInputRef.current.value = "";
            obtenerDatos();
        } catch (err) {
            console.error(err);
            Swal.fire("Error", err.message || "No se pudo subir el documento.", "error");
        } finally {
            setSubiendoDoc(false);
        }
    };

    const handleEliminarDocumento = async (idDoc) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción eliminará permanentemente el documento de tu expediente.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
            try {
                setLoading(true);
                const { error } = await supabase
                    .from("documentos_empleado")
                    .delete()
                    .eq("id_documento", idDoc);

                if (error) throw error;

                Swal.fire({
                    icon: "success",
                    title: "Documento Eliminado",
                    timer: 1500,
                    showConfirmButton: false
                });

                setMostrarLightbox(false);
                obtenerDatos();
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "No se pudo eliminar el documento.", "error");
            } finally {
                setLoading(false);
            }
        }
    };

    const abrirDocumento = (doc) => {
        setDocSeleccionado(doc);
        setMostrarLightbox(true);
    };

    if (loading && !empleado) {
        return (
            <div className="text-center py-5 mt-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Cargando expediente digital...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Container className="py-5 mt-4">
                <Alert variant="danger">
                    <Alert.Heading>Error al cargar el perfil</Alert.Heading>
                    <p>{error}</p>
                    <Button variant="outline-danger" onClick={() => navigate("/")}>Volver al Inicio</Button>
                </Alert>
            </Container>
        );
    }

    const esAdmin = rolUsuarioActual === "Admin";
    const esPropietario = idEmpleadoActual === empleado?.id_empleado;

    return (
        <Container className="py-5 mt-4">
            {/* HEADER */}
            <div className="mb-5">
                <Row className="align-items-center g-4">
                    <Col md={8}>
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-4">
                                <i className="bi bi-file-earmark-person text-primary fs-3"></i>
                            </div>
                            <div>
                                <h2 className="fw-bold mb-0">Expediente Digital Modular</h2>
                                <p className="text-muted mb-0">
                                    {esAdmin ? `Supervisión del expediente de ${empleado.nombre} ${empleado.apellido}` : "Gestiona tus documentos personales y credenciales"}
                                </p>
                            </div>
                        </div>
                    </Col>
                    <Col md={4} className="text-md-end">
                        {!esAdmin && esPropietario && !modoEdicion && (
                            <Button 
                                onClick={() => setModoEdicion(true)} 
                                className="btn-premium-primary shadow-sm"
                            >
                                <i className="bi bi-pencil-square me-2"></i>
                                Editar Perfil y Documentos
                            </Button>
                        )}
                        {modoEdicion && (
                            <div className="d-flex gap-2 justify-content-md-end">
                                <Button variant="outline-secondary" onClick={() => setModoEdicion(false)}>
                                    Cancelar
                                </Button>
                                <Button variant="success" onClick={handleGuardarCambios}>
                                    Guardar Cambios
                                </Button>
                            </div>
                        )}
                    </Col>
                </Row>
            </div>

            {/* CUERPO PRINCIPAL */}
            <Row className="g-4">
                {/* BLOQUE DE DATOS PERSONALES */}
                <Col lg={4}>
                    <Card className="premium-card border-0 p-4 h-100">
                        <div className="text-center mb-4">
                            <div className="position-relative d-inline-block">
                                <Image
                                    src={formDatos.preview_imagen || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                    roundedCircle
                                    width={150}
                                    height={150}
                                    className="border border-4 border-white shadow object-fit-cover"
                                />
                                {modoEdicion && (
                                    <Button 
                                        variant="primary" 
                                        size="sm" 
                                        className="position-absolute bottom-0 end-0 rounded-circle p-2"
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        <i className="bi bi-camera-fill"></i>
                                    </Button>
                                )}
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    accept="image/*" 
                                    style={{ display: "none" }} 
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setFormData({
                                                ...formDatos,
                                                archivo_imagen: file,
                                                preview_imagen: URL.createObjectURL(file)
                                            });
                                        }
                                    }}
                                />
                            </div>
                            <h4 className="fw-bold mt-3 mb-1">{empleado.nombre} {empleado.apellido}</h4>
                            <Badge bg="primary" className="bg-opacity-10 text-primary border-0 rounded-pill px-3 py-1">
                                ID: #{empleado.id_empleado}
                            </Badge>
                        </div>

                        <hr className="my-4 opacity-10" />

                        {modoEdicion ? (
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Teléfono</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={formDatos.telefono} 
                                        onChange={(e) => setFormData({ ...formDatos, telefono: e.target.value })}
                                        placeholder="Ej: 88888888"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Dirección</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows={3} 
                                        value={formDatos.direccion} 
                                        onChange={(e) => setFormData({ ...formDatos, direccion: e.target.value })}
                                        placeholder="Dirección completa"
                                    />
                                </Form.Group>
                            </Form>
                        ) : (
                            <div className="space-y-4">
                                <div className="mb-3">
                                    <span className="text-muted small d-block">Cédula / Identificación</span>
                                    <strong className="text-premium-main">{empleado.cedula}</strong>
                                </div>
                                <div className="mb-3">
                                    <span className="text-muted small d-block">Correo Electrónico</span>
                                    <strong className="text-premium-main">{empleado.correo || "Sin correo"}</strong>
                                </div>
                                <div className="mb-3">
                                    <span className="text-muted small d-block">Teléfono</span>
                                    <strong className="text-premium-main">{empleado.telefono || "Sin teléfono"}</strong>
                                </div>
                                <div className="mb-3">
                                    <span className="text-muted small d-block">Dirección</span>
                                    <strong className="text-premium-main">{empleado.direccion || "Sin dirección"}</strong>
                                </div>
                            </div>
                        )}
                    </Card>
                </Col>

                {/* SECCIÓN DEL EXPEDIENTE MODULAR */}
                <Col lg={8}>
                    {/* Formulario de carga de documentos (Solo en Modo Edición) */}
                    {modoEdicion && !esAdmin && (
                        <Card className="premium-card border-0 p-4 mb-4">
                            <h5 className="fw-bold mb-3">
                                <i className="bi bi-cloud-arrow-up-fill text-primary me-2"></i>
                                Añadir Documento al Expediente
                            </h5>
                            <Form onSubmit={handleSubirDocumento}>
                                <Row className="g-3">
                                    <Col md={5}>
                                        <Form.Group>
                                            <Form.Control 
                                                type="text" 
                                                placeholder="Título (ej: Currículum Vitae, Cédula)" 
                                                value={nuevoDoc.titulo}
                                                onChange={(e) => setNuevoDoc({ ...nuevoDoc, titulo: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={5}>
                                        <Form.Group>
                                            <Form.Control 
                                                type="file" 
                                                ref={docInputRef}
                                                accept="image/*,application/pdf"
                                                onChange={(e) => setNuevoDoc({ ...nuevoDoc, archivo: e.target.files[0] })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Button type="submit" variant="primary" className="w-100" disabled={subiendoDoc}>
                                            {subiendoDoc ? <Spinner size="sm" /> : "Subir"}
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                    )}

                    {/* Cuadrícula de Documentos */}
                    <h5 className="fw-bold mb-4">Documentos Registrados</h5>
                    {documentos.length === 0 ? (
                        <div className="text-center py-5 bg-premium-light rounded-4 border border-dashed">
                            <i className="bi bi-folder-x display-4 text-muted mb-3"></i>
                            <h5 className="text-muted">Expediente Vacío</h5>
                            <p className="text-muted small">No se han cargado documentos en este expediente digital.</p>
                        </div>
                    ) : (
                        <Row className="g-3">
                            {documentos.map((doc) => (
                                <Col key={doc.id_documento} sm={6}>
                                    <Card 
                                        className="premium-card border-0 h-100 cursor-pointer hover-zoom"
                                        onClick={() => abrirDocumento(doc)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <Card.Body className="p-3 d-flex align-items-center gap-3">
                                            <div className="bg-primary bg-opacity-10 p-3 rounded-3">
                                                <i className={`bi ${doc.tipo_archivo === "pdf" ? "bi-file-earmark-pdf-fill text-danger" : "bi-file-earmark-image-fill text-success"} fs-3`}></i>
                                            </div>
                                            <div className="overflow-hidden">
                                                <h6 className="fw-bold mb-1 text-truncate">{doc.titulo_personalizado}</h6>
                                                <span className="text-muted small text-uppercase">{doc.tipo_archivo}</span>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Col>
            </Row>

            {/* LIGHTBOX / VISOR DE DOCUMENTOS */}
            {docSeleccionado && (
                <Modal 
                    show={mostrarLightbox} 
                    onHide={() => setMostrarLightbox(false)} 
                    size="lg" 
                    centered
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title className="fw-bold">{docSeleccionado.titulo_personalizado}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-0 text-center bg-dark d-flex align-items-center justify-content-center" style={{ minHeight: "450px" }}>
                        {docSeleccionado.tipo_archivo === "pdf" ? (
                            <iframe 
                                src={docSeleccionado.url_archivo} 
                                width="100%" 
                                height="600px" 
                                title={docSeleccionado.titulo_personalizado}
                                style={{ border: "none" }}
                            />
                        ) : (
                            <Image 
                                src={docSeleccionado.url_archivo} 
                                fluid 
                                style={{ maxHeight: "80vh", objectFit: "contain" }}
                            />
                        )}
                    </Modal.Body>
                    <Modal.Footer className="justify-content-between">
                        <div>
                            {!esAdmin && esPropietario && (
                                <Button 
                                    variant="outline-danger" 
                                    onClick={() => handleEliminarDocumento(docSeleccionado.id_documento)}
                                >
                                    <i className="bi bi-trash3 me-2"></i>
                                    Eliminar Documento
                                </Button>
                            )}
                        </div>
                        <div className="d-flex gap-2">
                            <Button variant="secondary" onClick={() => setMostrarLightbox(false)}>
                                Cerrar
                            </Button>
                            <a 
                                href={docSeleccionado.url_archivo} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn btn-primary"
                                download
                            >
                                <i className="bi bi-download me-2"></i>
                                Descargar Archivo
                            </a>
                        </div>
                    </Modal.Footer>
                </Modal>
            )}
        </Container>
    );
};

export default Perfil;
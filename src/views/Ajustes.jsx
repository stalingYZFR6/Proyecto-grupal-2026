import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Form, Button, Spinner, Image } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import Swal from "sweetalert2";

const Ajustes = () => {
    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [restaurando, setRestaurando] = useState(false);
    const [rolUsuarioActual, setRolUsuarioActual] = useState("");
    const fileInputRef = useRef(null);

    const [config, setConfig] = useState({
        nombre_empresa: "AssisTech",
        url_logo: "",
        color_primario: "#0f172a",
        color_secundario: "#64748b",
        color_fondo: "#f8fafc",
        es_tema_personalizado: false,
        preview_logo: ""
    });

    useEffect(() => {
        obtenerConfiguracion();
    }, []);

    const obtenerConfiguracion = async () => {
        try {
            setLoading(true);
            
            // Verificar rol
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: perfil } = await supabase
                    .from("usuarios")
                    .select("rol")
                    .eq("id_auth", user.id)
                    .maybeSingle();
                if (perfil) {
                    setRolUsuarioActual(perfil.rol);
                }
            }

            const { data, error } = await supabase
                .from("configuracion_sistema")
                .select("*")
                .eq("id", 1)
                .single();

            if (error) throw error;

            if (data) {
                setConfig({
                    ...data,
                    preview_logo: data.url_logo || ""
                });
            }
        } catch (err) {
            console.error("Error al obtener configuración:", err);
        } finally {
            setLoading(false);
        }
    };

    const manejarCambioColor = (e) => {
        setConfig({
            ...config,
            [e.target.name]: e.target.value,
            es_tema_personalizado: true
        });
    };

    const manejarCambioTexto = (e) => {
        setConfig({
            ...config,
            [e.target.name]: e.target.value
        });
    };

    const manejarLogo = (e) => {
        const archivo = e.target.files[0];
        if (archivo) {
            setConfig({
                ...config,
                archivo_logo: archivo,
                preview_logo: URL.createObjectURL(archivo)
            });
        }
    };

    const subirLogo = async (archivo) => {
        if (!archivo) return null;
        const extension = archivo.name.split('.').pop() || 'png';
        const nombreArchivo = `logo_${Date.now()}.${extension}`;

        const { data, error } = await supabase.storage
            .from("logos_sistema")
            .upload(nombreArchivo, archivo, {
                cacheControl: '3600',
                upsert: true,
                contentType: archivo.type
            });

        if (error) throw error;

        const { data: urlData } = supabase.storage
            .from("logos_sistema")
            .getPublicUrl(nombreArchivo);

        return urlData.publicUrl;
    };

    const guardarConfiguracion = async (e) => {
        e.preventDefault();
        try {
            setGuardando(true);
            let urlLogoFinal = config.url_logo;

            if (config.archivo_logo) {
                urlLogoFinal = await subirLogo(config.archivo_logo);
            }

            const { error } = await supabase
                .from("configuracion_sistema")
                .update({
                    nombre_empresa: config.nombre_empresa,
                    url_logo: urlLogoFinal,
                    color_primario: config.color_primario,
                    color_secundario: config.color_secundario,
                    color_fondo: config.color_fondo,
                    es_tema_personalizado: true
                })
                .eq("id", 1);

            if (error) throw error;

            Swal.fire({
                icon: "success",
                title: "Identidad Visual Actualizada",
                text: "La marca blanca se ha aplicado correctamente en todo el sistema.",
                timer: 2000,
                showConfirmButton: false
            });

            // Despachar evento global para actualizar componentes en tiempo real
            window.dispatchEvent(new Event("system-config-changed"));
            obtenerConfiguracion();
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "No se pudo guardar la configuración.", "error");
        } finally {
            setGuardando(false);
        }
    };

    const restaurarValoresPorDefecto = async () => {
        const result = await Swal.fire({
            title: "¿Restaurar tema original?",
            text: "Se restablecerán los colores y el nombre de marca por defecto de AssisTech.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0f172a",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, restaurar",
            cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
            try {
                setRestaurando(true);
                const { error } = await supabase
                    .from("configuracion_sistema")
                    .update({
                        nombre_empresa: "AssisTech",
                        url_logo: null,
                        color_primario: "#0f172a",
                        color_secundario: "#64748b",
                        color_fondo: "#f8fafc",
                        es_tema_personalizado: false
                    })
                    .eq("id", 1);

                if (error) throw error;

                Swal.fire({
                    icon: "success",
                    title: "Tema Restaurado",
                    text: "Se ha restablecido la identidad visual original.",
                    timer: 1500,
                    showConfirmButton: false
                });

                window.dispatchEvent(new Event("system-config-changed"));
                obtenerConfiguracion();
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "No se pudo restaurar el tema.", "error");
            } finally {
                setRestaurando(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5 mt-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Cargando panel de personalización...</p>
            </div>
        );
    }

    if (rolUsuarioActual?.toLowerCase() !== "admin") {
        return (
            <Container className="py-5 mt-4 text-center">
                <div className="bg-danger bg-opacity-10 p-4 rounded-4 d-inline-block mb-4">
                    <i className="bi bi-shield-slash text-danger display-1"></i>
                </div>
                <h2 className="fw-bold">Acceso Denegado</h2>
                <p className="text-muted">No tienes permisos para acceder a la configuración de marca blanca.</p>
            </Container>
        );
    }

    return (
        <Container className="py-5 mt-4">
            <div className="mb-5">
                <div className="d-flex align-items-center gap-3">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-4">
                        <i className="bi bi-palette-fill text-primary fs-3"></i>
                    </div>
                    <div>
                        <h2 className="fw-bold mb-0">Personalización de Marca Blanca</h2>
                        <p className="text-muted mb-0">Adapta la identidad visual de AssisTech a tu empresa o institución</p>
                    </div>
                </div>
            </div>

            <Row className="g-4">
                {/* FORMULARIO DE CONFIGURACIÓN */}
                <Col lg={8}>
                    <Card className="premium-card border-0 p-4">
                        <Form onSubmit={guardarConfiguracion}>
                            <h5 className="fw-bold mb-4">Identidad Corporativa</h5>
                            
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold">Nombre de la Empresa / Institución</Form.Label>
                                <Form.Control 
                                    type="text"
                                    name="nombre_empresa"
                                    value={config.nombre_empresa}
                                    onChange={manejarCambioTexto}
                                    placeholder="Ej: Mi Empresa S.A."
                                    required
                                />
                            </Form.Group>

                            <hr className="my-4 opacity-10" />

                            <h5 className="fw-bold mb-4">Paleta de Colores</h5>
                            <Row className="g-3 mb-4">
                                <Col md={4}>
                                    <Form.Group className="text-center">
                                        <Form.Label className="fw-semibold d-block mb-2">Color de Fondo</Form.Label>
                                        <div className="d-flex align-items-center justify-content-center gap-2 border rounded-3 p-2 bg-premium-light">
                                            <Form.Control 
                                                type="color"
                                                name="color_fondo"
                                                value={config.color_fondo}
                                                onChange={manejarCambioColor}
                                                style={{ width: "50px", height: "40px", padding: "0", border: "none", cursor: "pointer" }}
                                            />
                                            <span className="small text-monospace">{config.color_fondo}</span>
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="text-center">
                                        <Form.Label className="fw-semibold d-block mb-2">Color Primario</Form.Label>
                                        <div className="d-flex align-items-center justify-content-center gap-2 border rounded-3 p-2 bg-premium-light">
                                            <Form.Control 
                                                type="color"
                                                name="color_primario"
                                                value={config.color_primario}
                                                onChange={manejarCambioColor}
                                                style={{ width: "50px", height: "40px", padding: "0", border: "none", cursor: "pointer" }}
                                            />
                                            <span className="small text-monospace">{config.color_primario}</span>
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="text-center">
                                        <Form.Label className="fw-semibold d-block mb-2">Color Secundario</Form.Label>
                                        <div className="d-flex align-items-center justify-content-center gap-2 border rounded-3 p-2 bg-premium-light">
                                            <Form.Control 
                                                type="color"
                                                name="color_secundario"
                                                value={config.color_secundario}
                                                onChange={manejarCambioColor}
                                                style={{ width: "50px", height: "40px", padding: "0", border: "none", cursor: "pointer" }}
                                            />
                                            <span className="small text-monospace">{config.color_secundario}</span>
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <div className="d-flex gap-3 justify-content-end mt-5">
                                <Button 
                                    type="button" 
                                    variant="outline-danger" 
                                    onClick={restaurarValoresPorDefecto}
                                    disabled={restaurando || guardando}
                                >
                                    {restaurando ? <Spinner size="sm" /> : "🔄 Volver al Tema Original"}
                                </Button>
                                <Button 
                                    type="submit" 
                                    variant="primary"
                                    disabled={guardando || restaurando}
                                >
                                    {guardando ? <Spinner size="sm" /> : "Guardar Identidad Visual"}
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </Col>

                {/* PREVISUALIZACIÓN DEL LOGO */}
                <Col lg={4}>
                    <Card className="premium-card border-0 p-4 text-center h-100 d-flex flex-column justify-content-between">
                        <div>
                            <h5 className="fw-bold mb-4">Logo de la Empresa</h5>
                            <div className="border rounded-4 p-4 mb-3 bg-premium-light d-flex align-items-center justify-content-center" style={{ height: "200px" }}>
                                {config.preview_logo ? (
                                    <Image 
                                        src={config.preview_logo} 
                                        fluid 
                                        style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} 
                                    />
                                ) : (
                                    <div className="text-muted">
                                        <i className="bi bi-image display-4 d-block mb-2"></i>
                                        <span>Sin logo personalizado</span>
                                    </div>
                                )}
                            </div>
                            <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="w-100"
                                onClick={() => fileInputRef.current.click()}
                            >
                                <i className="bi bi-upload me-2"></i>
                                Seleccionar Imagen de Logo
                            </Button>
                            <input 
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={manejarLogo}
                            />
                        </div>
                        <div className="text-muted small mt-4">
                            <i className="bi bi-info-circle me-1"></i>
                            Se recomienda usar imágenes en formato PNG con fondo transparente.
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Ajustes;
import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Form, Button, Spinner, Image } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import Swal from "sweetalert2";

const Ajustes = ({ config, recargarConfig }) => {
    const [loading, setLoading] = useState(false);
    const [nombreEmpresa, setNombreEmpresa] = useState(config?.nombre_empresa || "AssisTech");
    const [colorFondo, setColorFondo] = useState(config?.color_fondo || "#0f172a");
    const [colorPrimario, setColorPrimario] = useState(config?.color_primario || "#1e293b");
    const [colorSecundario, setColorSecundario] = useState(config?.color_secundario || "#38bdf8");
    const [logoPreview, setLogoPreview] = useState(config?.url_logo || null);
    const [archivoLogo, setArchivoLogo] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (config) {
            setNombreEmpresa(config.nombre_empresa);
            setColorFondo(config.color_fondo);
            setColorPrimario(config.color_primario);
            setColorSecundario(config.color_secundario);
            setLogoPreview(config.url_logo);
        }
    }, [config]);

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

    const handleGuardarAjustes = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let urlLogo = logoPreview;

            if (archivoLogo) {
                urlLogo = await subirLogo(archivoLogo);
            }

            const { error } = await supabase
                .from("configuracion_sistema")
                .update({
                    nombre_empresa: nombreEmpresa,
                    url_logo: urlLogo,
                    color_fondo: colorFondo,
                    color_primario: colorPrimario,
                    color_secundario: colorSecundario,
                    es_tema_personalizado: true
                })
                .eq("id", 1);

            if (error) throw error;

            Swal.fire({
                icon: "success",
                title: "Ajustes Guardados",
                text: "La personalización de marca blanca se ha aplicado correctamente.",
                timer: 2000,
                showConfirmButton: false
            });

            setArchivoLogo(null);
            await recargarConfig();
        } catch (err) {
            console.error(err);
            Swal.fire("Error", err.message || "No se pudieron guardar los ajustes.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleRestaurarTema = async () => {
        const result = await Swal.fire({
            title: "¿Restaurar tema original?",
            text: "Se restablecerán los colores oscuros y el logo por defecto de AssisTech.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#38bdf8",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, restaurar",
            cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
            setLoading(true);
            try {
                const { error } = await supabase
                    .from("configuracion_sistema")
                    .update({
                        nombre_empresa: "AssisTech",
                        url_logo: null,
                        color_fondo: "#0f172a",
                        color_primario: "#1e293b",
                        color_secundario: "#38bdf8",
                        es_tema_personalizado: false
                    })
                    .eq("id", 1);

                if (error) throw error;

                Swal.fire({
                    icon: "success",
                    title: "Tema Restaurado",
                    text: "Se ha restablecido el diseño original de AssisTech.",
                    timer: 2000,
                    showConfirmButton: false
                });

                setArchivoLogo(null);
                await recargarConfig();
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "No se pudo restaurar el tema.", "error");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Container className="py-5 mt-4">
            <div className="mb-5">
                <div className="d-flex align-items-center gap-3">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-4">
                        <i className="bi bi-sliders text-primary fs-3"></i>
                    </div>
                    <div>
                        <h2 className="fw-bold mb-0">Personalización de Marca Blanca</h2>
                        <p className="text-muted mb-0">Adapta el entorno visual de AssisTech a la identidad de tu empresa</p>
                    </div>
                </div>
            </div>

            <Row className="g-4">
                <Col lg={8}>
                    <Card className="premium-card border-0 p-4">
                        <Form onSubmit={handleGuardarAjustes}>
                            <h5 className="fw-bold mb-4">Identidad Corporativa</h5>
                            
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold">Nombre de la Empresa</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={nombreEmpresa} 
                                    onChange={(e) => setNombreEmpresa(e.target.value)}
                                    placeholder="Ej: Mi Empresa S.A."
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold">Logo de la Empresa (PNG recomendado)</Form.Label>
                                <div className="d-flex align-items-center gap-4">
                                    {logoPreview ? (
                                        <div className="p-3 bg-premium-light rounded-3 border d-flex align-items-center justify-content-center" style={{ minWidth: "120px", height: "80px" }}>
                                            <Image 
                                                src={logoPreview} 
                                                alt="Vista previa logo" 
                                                style={{ maxHeight: "60px", maxWidth: "100px", objectFit: "contain" }} 
                                            />
                                        </div>
                                    ) : (
                                        <div className="p-3 bg-premium-light rounded-3 border text-center text-muted small d-flex align-items-center justify-content-center" style={{ minWidth: "120px", height: "80px" }}>
                                            Sin Logo
                                        </div>
                                    )}
                                    <div>
                                        <Button 
                                            variant="outline-primary" 
                                            size="sm" 
                                            onClick={() => fileInputRef.current.click()}
                                        >
                                            <i className="bi bi-upload me-2"></i> Seleccionar Archivo
                                        </Button>
                                        <Form.Text className="text-muted d-block mt-2">
                                            Sube un logo en formato PNG transparente para una mejor integración visual.
                                        </Form.Text>
                                    </div>
                                </div>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    accept="image/png, image/jpeg" 
                                    style={{ display: "none" }} 
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setArchivoLogo(file);
                                            setLogoPreview(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                            </Form.Group>

                            <hr className="my-4 opacity-10" />

                            <h5 className="fw-bold mb-4">Paleta de Colores</h5>
                            <Row className="g-3 mb-4">
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold d-block">Color de Fondo</Form.Label>
                                        <div className="d-flex align-items-center gap-2">
                                            <Form.Control 
                                                type="color" 
                                                value={colorFondo} 
                                                onChange={(e) => setColorFondo(e.target.value)}
                                                style={{ width: "50px", height: "40px", padding: "0", border: "none" }}
                                            />
                                            <span className="small text-muted">{colorFondo}</span>
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold d-block">Color Primario (Paneles)</Form.Label>
                                        <div className="d-flex align-items-center gap-2">
                                            <Form.Control 
                                                type="color" 
                                                value={colorPrimario} 
                                                onChange={(e) => setColorPrimario(e.target.value)}
                                                style={{ width: "50px", height: "40px", padding: "0", border: "none" }}
                                            />
                                            <span className="small text-muted">{colorPrimario}</span>
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold d-block">Color Secundario (Acentos)</Form.Label>
                                        <div className="d-flex align-items-center gap-2">
                                            <Form.Control 
                                                type="color" 
                                                value={colorSecundario} 
                                                onChange={(e) => setColorSecundario(e.target.value)}
                                                style={{ width: "50px", height: "40px", padding: "0", border: "none" }}
                                            />
                                            <span className="small text-muted">{colorSecundario}</span>
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <div className="d-flex gap-3 mt-5">
                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    disabled={loading}
                                    className="px-4"
                                >
                                    {loading ? <Spinner size="sm" /> : "Guardar Cambios"}
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="outline-danger" 
                                    onClick={handleRestaurarTema}
                                    disabled={loading}
                                >
                                    🔄 Volver al Tema Original
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="premium-card border-0 p-4 h-100 bg-premium-light">
                        <h5 className="fw-bold mb-3">¿Cómo funciona?</h5>
                        <p className="text-muted small">
                            La personalización de marca blanca te permite adaptar la interfaz de AssisTech a la identidad visual de tu empresa.
                        </p>
                        <ul className="text-muted small ps-3">
                            <li className="mb-2">El <strong>Nombre de la Empresa</strong> reemplazará a "AssisTech" en los títulos y correos.</li>
                            <li className="mb-2">El <strong>Logo</strong> se mostrará en la barra de navegación superior y en la pantalla de inicio de sesión.</li>
                            <li className="mb-2">Los <strong>Colores</strong> se aplicarán dinámicamente a los fondos, tarjetas, botones y acentos de todo el sistema.</li>
                        </ul>
                        <div className="mt-4 p-3 bg-warning bg-opacity-10 rounded-3 border border-warning border-opacity-25">
                            <span className="small text-warning d-block fw-bold mb-1">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i> Nota de Diseño
                            </span>
                            <span className="small text-muted d-block">
                                Los cambios se aplican en tiempo real para todos los usuarios del sistema. Puedes restaurar el tema original en cualquier momento.
                            </span>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Ajustes;
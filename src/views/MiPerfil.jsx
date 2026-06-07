import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Image, Spinner, Badge } from "react-bootstrap";
import Swal from "sweetalert2";
import { supabase } from "../database/supabaseconfig";
import { obtenerUsuario } from "../utils/auth";

const MiPerfil = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [empleado, setEmpleado] = useState(null);
    const [formData, setFormData] = useState({
        correo: "",
        telefono: "",
        direccion: ""
    });

    useEffect(() => {
        cargarDatosPerfil();
    }, []);

    const cargarDatosPerfil = async () => {
        const user = obtenerUsuario();
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from("empleado")
                .select("*")
                .eq("id_empleado", user.id_empleado)
                .single();

            if (error) throw error;
            setEmpleado(data);
            setFormData({
                correo: data.correo || "",
                telefono: data.telefono || "",
                direccion: data.direccion || ""
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { error } = await supabase
                .from("empleado")
                .update(formData)
                .eq("id_empleado", empleado.id_empleado);

            if (error) throw error;

            Swal.fire({
                icon: 'success',
                title: 'Perfil Actualizado',
                text: 'Tus datos han sido guardados correctamente.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err) {
            Swal.fire('Error', err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-5 mt-5"><Spinner animation="border" variant="primary" /></div>;

    return (
        <Container className="py-5 mt-4">
            <Row className="justify-content-center">
                <Col lg={8}>
                    <Card className="premium-card border-0 overflow-hidden">
                        <div className="bg-primary bg-opacity-10 py-5 text-center">
                            <Image 
                                src={empleado?.url_imagen || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                                roundedCircle 
                                width={120} 
                                height={120} 
                                className="border border-4 border-white shadow-sm object-fit-cover mb-3"
                            />
                            <h3 className="fw-bold mb-1">{empleado?.nombre} {empleado?.apellido}</h3>
                            <Badge bg="primary" className="bg-opacity-10 text-primary border-0 rounded-pill px-3 py-2">
                                {obtenerUsuario()?.rol.toUpperCase()}
                            </Badge>
                        </div>
                        <Card.Body className="p-4 p-md-5">
                            <Form onSubmit={handleSubmit}>
                                <h5 className="fw-bold mb-4 border-bottom pb-2">Información Personal</h5>
                                <Row className="g-4">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-muted">Cédula / DNI</Form.Label>
                                            <Form.Control value={empleado?.cedula} disabled className="bg-light rounded-3 border-0" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-muted">Correo Electrónico</Form.Label>
                                            <Form.Control 
                                                name="correo" 
                                                value={formData.correo} 
                                                onChange={handleChange} 
                                                className="rounded-3"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-muted">Teléfono</Form.Label>
                                            <Form.Control 
                                                name="telefono" 
                                                value={formData.telefono} 
                                                onChange={handleChange} 
                                                className="rounded-3"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-muted">Dirección</Form.Label>
                                            <Form.Control 
                                                name="direccion" 
                                                value={formData.direccion} 
                                                onChange={handleChange} 
                                                className="rounded-3"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="text-end mt-5">
                                    <Button 
                                        type="submit" 
                                        variant="primary" 
                                        disabled={saving}
                                        className="px-5 rounded-pill fw-bold shadow-sm"
                                    >
                                        {saving ? <Spinner size="sm" /> : "Guardar Cambios"}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MiPerfil;
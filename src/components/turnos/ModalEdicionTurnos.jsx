import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const ModalEdicionTurnos = ({ show, handleClose, turno, onActualizacionExitosa }) => {
    const [formData, setFormData] = useState({
        tipo_turno: "",
        hora_inicio: "",
        hora_fin: "",
    });

    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState(null);

    // Sincronizar el estado interno con el turno que llega por props
    useEffect(() => {
        if (turno) {
            setFormData({
                tipo_turno: turno.tipo_turno || "",
                hora_inicio: turno.hora_inicio || "",
                hora_fin: turno.hora_fin || "",
            });
            setError(null);
        }
    }, [turno, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnviando(true);
        setError(null);

        try {
            const { error: supabaseError } = await supabase
                .from("turnos")
                .update({
                    tipo_turno: formData.tipo_turno,
                    hora_inicio: formData.hora_inicio,
                    hora_fin: formData.hora_fin,
                })
                .eq("id_turno", turno.id_turno); // Coincide con tu PK id_turno

            if (supabaseError) throw supabaseError;

            onActualizacionExitosa(); 
            handleClose(); 
        } catch (err) {
            console.error("Error al actualizar turno:", err);
            setError("No se pudo actualizar el turno. Intenta de nuevo.");
        } finally {
            setEnviando(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered backdrop="static">
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>
                    <i className="bi bi-pencil-square me-2"></i>
                    Editar Turno #{turno?.id_turno}
                </Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Nombre del Turno</Form.Label>
                        <Form.Control
                            type="text"
                            name="tipo_turno"
                            value={formData.tipo_turno}
                            onChange={handleChange}
                            placeholder="Ej: Matutino, Vespertino..."
                            required
                        />
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Hora Inicio</Form.Label>
                                <Form.Control
                                    type="time"
                                    name="hora_inicio"
                                    value={formData.hora_inicio}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Hora Fin</Form.Label>
                                <Form.Control
                                    type="time"
                                    name="hora_fin"
                                    value={formData.hora_fin}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClose} disabled={enviando}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit" disabled={enviando}>
                        {enviando ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Actualizando...
                            </>
                        ) : (
                            "Guardar Cambios"
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalEdicionTurnos;
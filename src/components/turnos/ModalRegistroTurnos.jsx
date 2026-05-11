import React, { useState } from "react";
import {
    Modal,
    Button,
    Form,
    Row,
    Col,
    Alert,
    Spinner,
} from "react-bootstrap";

import { supabase } from "../../database/supabaseconfig";

const ModalRegistroTurno = ({
    show,
    handleClose,
    onRegistroExitoso,
}) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        tipo_turno: "",
        hora_inicio: "",
        hora_fin: "",
    });

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const limpiarFormulario = () => {

        setFormData({
            tipo_turno: "",
            hora_inicio: "",
            hora_fin: "",
        });

        setError("");
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError("");

        try {

            // Validaciones
            if (
                !formData.tipo_turno ||
                !formData.hora_inicio ||
                !formData.hora_fin
            ) {
                setError("Complete todos los campos.");
                setLoading(false);
                return;
            }

            if (formData.hora_inicio >= formData.hora_fin) {
                setError("La hora de inicio debe ser menor que la hora final.");
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("turnos")
                .insert([formData])
                .select();

            if (error) throw error;

            if (onRegistroExitoso) {
                onRegistroExitoso(data[0]);
            }

            limpiarFormulario();
            handleClose();

        } catch (err) {

            console.error(err);
            setError(err.message);

        } finally {

            setLoading(false);
        }
    };

    return (
        <Modal
            show={show}
            onHide={() => {
                limpiarFormulario();
                handleClose();
            }}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="bi bi-clock-fill me-2"></i>
                    Registrar Turno
                </Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>

                <Modal.Body>

                    {error && (
                        <Alert variant="danger">
                            {error}
                        </Alert>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>
                            Tipo de Turno
                        </Form.Label>

                        <Form.Control
                            type="text"
                            name="tipo_turno"
                            value={formData.tipo_turno}
                            onChange={handleChange}
                            placeholder="Ej: Mañana"
                        />
                    </Form.Group>

                    <Row>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Hora Inicio
                                </Form.Label>

                                <Form.Control
                                    type="time"
                                    name="hora_inicio"
                                    value={formData.hora_inicio}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Hora Final
                                </Form.Label>

                                <Form.Control
                                    type="time"
                                    name="hora_fin"
                                    value={formData.hora_fin}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>

                    </Row>

                </Modal.Body>

                <Modal.Footer>

                    <Button
                        variant="secondary"
                        onClick={() => {
                            limpiarFormulario();
                            handleClose();
                        }}
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="submit"
                        variant="success"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Spinner
                                    animation="border"
                                    size="sm"
                                    className="me-2"
                                />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-save me-2"></i>
                                Registrar
                            </>
                        )}
                    </Button>

                </Modal.Footer>

            </Form>
        </Modal>
    );
};

export default ModalRegistroTurno;
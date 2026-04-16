import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroIncidencia = ({
    mostrarModal,
    setMostrarModal,
    nuevaIncidencia,
    manejoCambioInput,
    agregarIncidencia,
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleRegistrar = async () => {
        if (deshabilitado) return;
        setDeshabilitado(true);

        await agregarIncidencia();

        setDeshabilitado(false);
    };

    return (
        <Modal
            show={mostrarModal}
            onHide={() => setMostrarModal(false)}
            backdrop="static"
            keyboard={false}
            centered
            size="lg"
        >
            <Modal.Header closeButton>
                <Modal.Title>Registrar Incidencia</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>

                    {/* Tipo de Incidencia */}
                    <Form.Group className="mb-3">
                        <Form.Label>Tipo de Incidencia *</Form.Label>
                        <Form.Control
                            type="text"
                            name="tipo_incidencia"
                            value={nuevaIncidencia.tipo_incidencia || ""}
                            onChange={manejoCambioInput}
                            placeholder="Ej: Tardanza, Falta, Permiso"
                            required
                        />
                    </Form.Group>

                    {/* Descripción */}
                    <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="descripcion"
                            value={nuevaIncidencia.descripcion || ""}
                            onChange={manejoCambioInput}
                            placeholder="Detalle de la incidencia"
                        />
                    </Form.Group>

                    {/* Fecha */}
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha de Incidencia *</Form.Label>
                        <Form.Control
                            type="date"
                            name="fecha_incidencia"
                            value={nuevaIncidencia.fecha_incidencia || ""}
                            onChange={manejoCambioInput}
                            required
                        />
                    </Form.Group>

                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => setMostrarModal(false)}>
                    Cancelar
                </Button>

                <Button
                    variant="primary"
                    onClick={handleRegistrar}
                    disabled={
                        !nuevaIncidencia.tipo_incidencia?.trim() ||
                        !nuevaIncidencia.fecha_incidencia ||
                        deshabilitado
                    }
                >
                    {deshabilitado ? "Guardando..." : "Guardar Incidencia"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalRegistroIncidencia;
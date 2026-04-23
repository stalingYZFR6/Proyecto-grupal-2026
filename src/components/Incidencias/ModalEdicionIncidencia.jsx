import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionIncidencia = ({
    mostrarModalEdicion,
    setMostrarModalEdicion,
    incidenciaEditar,
    manejoCambioInputEdicion,
    actualizarIncidencia,
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleActualizar = async () => {
        if (deshabilitado) return;

        setDeshabilitado(true);
        await actualizarIncidencia();
        setDeshabilitado(false);
    };

    return (
        <Modal
            show={mostrarModalEdicion}
            onHide={() => setMostrarModalEdicion(false)}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Editar Incidencia</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Tipo de incidencia</Form.Label>
                        <Form.Control
                            type="text"
                            name="tipo_incidencia"
                            value={incidenciaEditar?.tipo_incidencia || ""}
                            onChange={manejoCambioInputEdicion}
                            placeholder="Ej: Falta, Llegada tardía..."
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="descripcion"
                            value={incidenciaEditar?.descripcion || ""}
                            onChange={manejoCambioInputEdicion}
                            placeholder="Detalle de la incidencia"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Fecha</Form.Label>
                        <Form.Control
                            type="date"
                            name="fecha_incidencia"
                            value={incidenciaEditar?.fecha_incidencia || ""}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => setMostrarModalEdicion(false)}
                >
                    Cancelar
                </Button>

                <Button
                    variant="warning"
                    onClick={handleActualizar}
                    disabled={
                        !incidenciaEditar?.tipo_incidencia?.trim() ||
                        !incidenciaEditar?.fecha_incidencia ||
                        deshabilitado
                    }
                >
                    {deshabilitado ? "Actualizando..." : "Actualizar"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEdicionIncidencia;
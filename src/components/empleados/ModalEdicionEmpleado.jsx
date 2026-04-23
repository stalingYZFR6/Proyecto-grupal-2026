import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionEmpleado = ({
    mostrarModalEdicion,
    setMostrarModalEdicion,
    empleadoEditar,
    manejoCambioInputEdicion,
    actualizarEmpleado,
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleActualizar = async () => {
        if (deshabilitado) return;

        setDeshabilitado(true);
        await actualizarEmpleado();
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
                <Modal.Title>Editar Empleado</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            value={empleadoEditar?.nombre || ""}
                            onChange={manejoCambioInputEdicion}
                            placeholder="Ingresa el nombre"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Apellido</Form.Label>
                        <Form.Control
                            type="text"
                            name="apellido"
                            value={empleadoEditar?.apellido || ""}
                            onChange={manejoCambioInputEdicion}
                            placeholder="Ingresa el apellido"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Cédula</Form.Label>
                        <Form.Control
                            type="text"
                            name="cedula"
                            value={empleadoEditar?.cedula || ""}
                            onChange={manejoCambioInputEdicion}
                            placeholder="Ingresa la cédula"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Correo</Form.Label>
                        <Form.Control
                            type="email"
                            name="correo"
                            value={empleadoEditar?.correo || ""}
                            onChange={manejoCambioInputEdicion}
                            placeholder="Ingresa el correo"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control
                            type="text"
                            name="telefono"
                            value={empleadoEditar?.telefono || ""}
                            onChange={manejoCambioInputEdicion}
                            placeholder="Ingresa el teléfono"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Dirección</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="direccion"
                            value={empleadoEditar?.direccion || ""}
                            onChange={manejoCambioInputEdicion}
                            placeholder="Ingresa la dirección"
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
                    variant="primary"
                    onClick={handleActualizar}
                    disabled={
                        !empleadoEditar?.nombre?.trim() ||
                        !empleadoEditar?.apellido?.trim() ||
                        !empleadoEditar?.cedula?.trim() ||
                        deshabilitado
                    }
                >
                    {deshabilitado ? "Actualizando..." : "Actualizar"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEdicionEmpleado;
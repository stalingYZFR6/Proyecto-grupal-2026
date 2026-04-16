import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroEmpleado = ({
    mostrarModal,
    setMostrarModal,
    nuevoEmpleado,
    manejoCambioInput,
    agregarEmpleado,
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleRegistrar = async () => {
        if (deshabilitado) return;
        setDeshabilitado(true);
        
        await agregarEmpleado();
        
        setDeshabilitado(false);
    };

    return (
        <Modal
            show={mostrarModal}
            onHide={() => setMostrarModal(false)}
            backdrop="static"
            keyboard={false}
            centered
            size="lg"   // Más grande porque tiene más campos
        >
            <Modal.Header closeButton>
                <Modal.Title>Registrar Nuevo Empleado</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    value={nuevoEmpleado.nombre || ""}
                                    onChange={manejoCambioInput}
                                    placeholder="Ej: Juan"
                                    required
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Apellido *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="apellido"
                                    value={nuevoEmpleado.apellido || ""}
                                    onChange={manejoCambioInput}
                                    placeholder="Ej: Pérez"
                                    required
                                />
                            </Form.Group>
                        </div>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label>Cédula / DNI *</Form.Label>
                        <Form.Control
                            type="text"
                            name="cedula"
                            value={nuevoEmpleado.cedula || ""}
                            onChange={manejoCambioInput}
                            placeholder="Ej: 001-123456-0001X"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Correo Electrónico</Form.Label>
                        <Form.Control
                            type="email"
                            name="correo"
                            value={nuevoEmpleado.correo || ""}
                            onChange={manejoCambioInput}
                            placeholder="ejemplo@correo.com"
                        />
                    </Form.Group>

                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Teléfono</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="telefono"
                                    value={nuevoEmpleado.telefono || ""}
                                    onChange={manejoCambioInput}
                                    placeholder="Ej: 505 1234-5678"
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Dirección</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="direccion"
                                    value={nuevoEmpleado.direccion || ""}
                                    onChange={manejoCambioInput}
                                    placeholder="Dirección completa"
                                />
                            </Form.Group>
                        </div>
                    </div>
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
                        !nuevoEmpleado.nombre?.trim() || 
                        !nuevoEmpleado.apellido?.trim() || 
                        !nuevoEmpleado.cedula?.trim() ||
                        deshabilitado
                    }
                >
                    {deshabilitado ? "Guardando..." : "Guardar Empleado"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalRegistroEmpleado;
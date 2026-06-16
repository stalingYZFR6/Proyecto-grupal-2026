import React, { useState } from "react";
import { Modal, Form, Button, Image } from "react-bootstrap";

const ModalRegistroEmpleado = ({
    mostrarModal,
    setMostrarModal,
    nuevoEmpleado,
    setNuevoEmpleado,
    manejoCambioInput,
    agregarEmpleado,
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);

    // MANEJAR IMAGEN DESDE ARCHIVO
    const manejarImagen = (e) => {
        const archivo = e.target.files[0];
        procesarArchivoImagen(archivo);
    };

    // MANEJAR PEGADO (CTRL+V)
    const manejarPegado = (e) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                const archivo = items[i].getAsFile();
                procesarArchivoImagen(archivo);
                break;
            }
        }
    };

    const procesarArchivoImagen = (archivo) => {
        if (!archivo) return;

        // Liberar preview anterior
        if (nuevoEmpleado?.preview_imagen) {
            URL.revokeObjectURL(nuevoEmpleado.preview_imagen);
        }

        // Nuevo preview temporal
        const preview = URL.createObjectURL(archivo);

        setNuevoEmpleado({
            ...nuevoEmpleado,
            archivo_imagen: archivo,
            preview_imagen: preview,
        });
    };

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
            size="lg"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Registrar Nuevo Empleado
                </Modal.Title>
            </Modal.Header>

            <Modal.Body onPaste={manejarPegado}>
                <Form>
                    {/* FOTO */}
                    <div className="text-center mb-4">
                        <Image
                            src={
                                nuevoEmpleado.preview_imagen ||
                                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }
                            roundedCircle
                            width={120}
                            height={120}
                            className="border shadow-sm mb-2"
                            style={{ objectFit: "cover" }}
                        />
                        <div className="text-muted x-small mb-3">
                            <i className="bi bi-info-circle me-1"></i>
                            Puedes seleccionar un archivo o <strong>pegar una imagen (Ctrl+V)</strong> aquí.
                        </div>

                        <Form.Group className="mt-2">
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={manejarImagen}
                                className="w-50 mx-auto"
                            />
                        </Form.Group>
                    </div>

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
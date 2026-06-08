import React, { useState } from "react";
import { Modal, Form, Button, Image } from "react-bootstrap";

const ModalEdicionEmpleado = ({
    mostrarModalEdicion,
    setMostrarModalEdicion,
    empleadoEditar,
    setEmpleadoEditar,
    manejoCambioInputEdicion,
    actualizarEmpleado,
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);

    // MANEJAR IMAGEN
    const manejarImagen = (e) => {

    const archivo = e.target.files[0];

    if (!archivo) return;

    // Liberar preview anterior
    if (empleadoEditar?.preview_imagen) {
        URL.revokeObjectURL(empleadoEditar.preview_imagen);
    }

    // Nuevo preview
    const preview = URL.createObjectURL(archivo);

    setEmpleadoEditar({
        ...empleadoEditar,

        // Archivo real
        archivo_imagen: archivo,

        // Solo preview visual
        preview_imagen: preview,
    });
};

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
            size="lg"
        >

            <Modal.Header closeButton>
                <Modal.Title>
                    Editar Empleado
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <Form>

                    {/* FOTO */}
                    <div className="text-center mb-4">

                        <Image
                            src={
                                empleadoEditar?.preview_imagen
                                    ? empleadoEditar.preview_imagen
                                    : empleadoEditar?.url_imagen &&
                                        !empleadoEditar.url_imagen.startsWith("blob:")
                                        ? empleadoEditar.url_imagen
                                        : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }
                            roundedCircle
                            width={120}
                            height={120}
                            className="border shadow-sm"
                            style={{
                                objectFit: "cover"
                            }}
                        />

                        <Form.Group className="mt-3">

                            <Form.Label>
                                Cambiar Imagen
                            </Form.Label>

                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={manejarImagen}
                            />

                        </Form.Group>

                    </div>

                    <div className="row">

                        <div className="col-md-6">

                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Nombre
                                </Form.Label>

                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    value={empleadoEditar?.nombre || ""}
                                    onChange={manejoCambioInputEdicion}
                                    placeholder="Ingresa el nombre"
                                />

                            </Form.Group>

                        </div>

                        <div className="col-md-6">

                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Apellido
                                </Form.Label>

                                <Form.Control
                                    type="text"
                                    name="apellido"
                                    value={empleadoEditar?.apellido || ""}
                                    onChange={manejoCambioInputEdicion}
                                    placeholder="Ingresa el apellido"
                                />

                            </Form.Group>

                        </div>

                    </div>

                    <Form.Group className="mb-3">

                        <Form.Label>
                            Cédula
                        </Form.Label>

                        <Form.Control
                            type="text"
                            name="cedula"
                            value={empleadoEditar?.cedula || ""}
                            onChange={manejoCambioInputEdicion}
                            placeholder="Ingresa la cédula"
                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>
                            Correo
                        </Form.Label>

                        <Form.Control
                            type="email"
                            name="correo"
                            value={empleadoEditar?.correo || ""}
                            onChange={manejoCambioInputEdicion}
                            placeholder="Ingresa el correo"
                        />

                    </Form.Group>

                    <div className="row">

                        <div className="col-md-6">

                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Teléfono
                                </Form.Label>

                                <Form.Control
                                    type="text"
                                    name="telefono"
                                    value={empleadoEditar?.telefono || ""}
                                    onChange={manejoCambioInputEdicion}
                                    placeholder="Ingresa el teléfono"
                                />

                            </Form.Group>

                        </div>

                        <div className="col-md-6">

                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Dirección
                                </Form.Label>

                                <Form.Control
                                    type="text"
                                    name="direccion"
                                    value={empleadoEditar?.direccion || ""}
                                    onChange={manejoCambioInputEdicion}
                                    placeholder="Ingresa la dirección"
                                />

                            </Form.Group>

                        </div>

                    </div>

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
                    {deshabilitado
                        ? "Actualizando..."
                        : "Actualizar"}
                </Button>

            </Modal.Footer>

        </Modal>
    );
};

export default ModalEdicionEmpleado;
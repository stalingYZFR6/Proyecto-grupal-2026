import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionIncidencia = ({
    mostrarModalEliminacion,
    setMostrarModalEliminacion,
    eliminarIncidencia,
    incidencia,
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleEliminar = async () => {
        if (deshabilitado) return;

        setDeshabilitado(true);
        await eliminarIncidencia();
        setDeshabilitado(false);
    };

    return (
        <Modal
            show={mostrarModalEliminacion}
            onHide={() => setMostrarModalEliminacion(false)}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Confirmar Eliminación</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                ¿Estás seguro de eliminar la incidencia{" "}
                <strong>{incidencia?.tipo_incidencia}</strong>?
                <br />
                <small className="text-muted">
                    Esta acción no se puede deshacer.
                </small>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => setMostrarModalEliminacion(false)}
                >
                    Cancelar
                </Button>

                <Button
                    variant="danger"
                    onClick={handleEliminar}
                    disabled={deshabilitado}
                >
                    {deshabilitado ? "Eliminando..." : "Eliminar"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEliminacionIncidencia;
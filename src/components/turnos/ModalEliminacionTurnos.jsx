import React, { useState } from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const ModalEliminacionTurnos = ({ show, handleClose, turno, onEliminacionExitosa }) => {
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState(null);

    const handleEliminar = async () => {
        setEnviando(true);
        setError(null);

        try {
            const { error: supabaseError } = await supabase
                .from("turnos")
                .delete()
                .eq("id_turno", turno.id_turno); //

            if (supabaseError) {
                // Error común: llave foránea en tabla asistencias
                if (supabaseError.code === "23503") {
                    throw new Error("No se puede eliminar: Este turno tiene asistencias registradas.");
                }
                throw supabaseError;
            }

            onEliminacionExitosa();
            handleClose();
        } catch (err) {
            console.error("Error al eliminar:", err);
            setError(err.message || "No se pudo eliminar el turno.");
        } finally {
            setEnviando(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered backdrop="static">
            <Modal.Header className="bg-danger text-white border-0">
                <Modal.Title className="fs-5">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    Confirmar Eliminación
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="py-4">
                {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
                
                <p className="mb-1 text-muted small uppercase fw-bold">Atención</p>
                <h5 className="mb-3">
                    ¿Estás seguro de que deseas eliminar el turno <strong>{turno?.tipo_turno}</strong>?
                </h5>
                <p className="text-muted mb-0">
                    Esta acción es permanente y no se puede deshacer.
                </p>
            </Modal.Body>

            <Modal.Footer className="border-0">
                <Button 
                    variant="outline-secondary" 
                    onClick={handleClose} 
                    disabled={enviando}
                    className="px-4"
                >
                    Cancelar
                </Button>
                <Button 
                    variant="danger" 
                    onClick={handleEliminar} 
                    disabled={enviando}
                    className="px-4"
                >
                    {enviando ? (
                        <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Eliminando...
                        </>
                    ) : (
                        "Eliminar Turno"
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEliminacionTurnos;
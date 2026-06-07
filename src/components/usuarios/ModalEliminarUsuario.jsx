import React, { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { supabase } from "../../database/supabaseconfig";

const ModalEliminarUsuario = ({ show, handleClose, usuario, onExito }) => {
    const [loading, setLoading] = useState(false);

    const handleEliminar = async () => {
        setLoading(true);
        try {
            // Nota: En Supabase, eliminar de la tabla pública no elimina de Auth
            // a menos que tengas un trigger o uses la API de Admin.
            const { error } = await supabase
                .from("usuarios")
                .delete()
                .eq("id_usuario", usuario.id_usuario);

            if (error) throw error;

            Swal.fire({
                icon: 'success',
                title: 'Usuario eliminado',
                text: 'El registro ha sido removido correctamente.',
                timer: 2000,
                showConfirmButton: false
            });

            onExito();
            handleClose();
        } catch (err) {
            Swal.fire('Error', err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="border-0">
                <Modal.Title className="fw-bold">Confirmar Eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center py-4">
                <div className="mb-3">
                    <i className="bi bi-exclamation-triangle text-danger display-4"></i>
                </div>
                <h5>¿Estás seguro de eliminar a este usuario?</h5>
                <p className="text-muted">
                    Esta acción eliminará el acceso de <strong>{usuario?.empleado?.nombre} {usuario?.empleado?.apellido}</strong> al sistema.
                </p>
            </Modal.Body>
            <Modal.Footer className="border-0 justify-content-center pb-4">
                <Button variant="light" onClick={handleClose} className="px-4 rounded-pill">
                    Cancelar
                </Button>
                <Button 
                    variant="danger" 
                    onClick={handleEliminar} 
                    disabled={loading}
                    className="px-4 rounded-pill shadow-sm"
                >
                    {loading ? <Spinner size="sm" /> : "Eliminar Usuario"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEliminarUsuario;
import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { supabase } from "../../database/supabaseconfig";

const ModalEditarUsuario = ({ show, handleClose, usuario, onExito }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        rol: "empleado",
        activo: true
    });

    useEffect(() => {
        if (usuario) {
            setFormData({
                rol: usuario.rol,
                activo: usuario.activo
            });
        }
    }, [usuario]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from("usuarios")
                .update({
                    rol: formData.rol,
                    activo: formData.activo
                })
                .eq("id_usuario", usuario.id_usuario);

            if (error) throw error;

            Swal.fire({
                icon: 'success',
                title: 'Actualizado',
                text: 'Los permisos han sido actualizados.',
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
                <Modal.Title className="fw-bold">Editar Permisos</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body className="px-4">
                    <div className="text-center mb-4">
                        <img 
                            src={usuario?.empleado?.url_imagen || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                            alt="avatar" 
                            className="rounded-circle border shadow-sm mb-2"
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        />
                        <h6 className="fw-bold mb-0">{usuario?.empleado?.nombre} {usuario?.empleado?.apellido}</h6>
                        <small className="text-muted">{usuario?.empleado?.correo}</small>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold text-muted">Rol del Sistema</Form.Label>
                        <Form.Select 
                            name="rol" 
                            value={formData.rol} 
                            onChange={handleChange}
                            className="rounded-3 py-2"
                        >
                            <option value="empleado">Empleado</option>
                            <option value="administrador">Administrador</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Check 
                        type="switch"
                        id="edit-activo-switch"
                        label="Cuenta Activa"
                        name="activo"
                        checked={formData.activo}
                        onChange={handleChange}
                        className="fw-medium"
                    />
                </Modal.Body>
                <Modal.Footer className="border-0 px-4 pb-4">
                    <Button variant="light" onClick={handleClose} className="px-4 rounded-pill">
                        Cancelar
                    </Button>
                    <Button 
                        type="submit" 
                        variant="primary" 
                        disabled={loading}
                        className="px-4 rounded-pill shadow-sm"
                    >
                        {loading ? <Spinner size="sm" /> : "Guardar Cambios"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalEditarUsuario;
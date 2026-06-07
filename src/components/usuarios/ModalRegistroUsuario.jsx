import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col, Spinner, InputGroup } from "react-bootstrap";
import Swal from "sweetalert2";
import { supabase } from "../../database/supabaseconfig";

const ModalRegistroUsuario = ({ show, handleClose, onExito }) => {
    const [loading, setLoading] = useState(false);
    const [empleados, setEmpleados] = useState([]);
    const [verPassword, setVerPassword] = useState(false);
    
    const [formData, setFormData] = useState({
        id_empleado: "",
        email: "",
        password: "",
        rol: "empleado",
        activo: true
    });

    useEffect(() => {
        if (show) cargarEmpleadosSinUsuario();
    }, [show]);

    const cargarEmpleadosSinUsuario = async () => {
        try {
            // Obtenemos empleados que no tengan usuario asignado
            const { data: usuariosExistentes } = await supabase.from("usuarios").select("id_empleado");
            const idsExistentes = usuariosExistentes?.map(u => u.id_empleado) || [];

            const { data, error } = await supabase
                .from("empleado")
                .select("*")
                .order("nombre");

            if (error) throw error;
            
            // Filtrar empleados que ya tienen usuario
            setEmpleados(data.filter(e => !idsExistentes.includes(e.id_empleado)));
        } catch (err) {
            console.error(err);
        }
    };

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
            // 1. Crear en Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (authError) throw authError;

            // 2. Crear en tabla usuarios
            const { error: dbError } = await supabase
                .from("usuarios")
                .insert([{
                    id_empleado: formData.id_empleado,
                    id_auth: authData.user.id,
                    rol: formData.rol,
                    activo: formData.activo
                }]);

            if (dbError) throw dbError;

            Swal.fire({
                icon: 'success',
                title: 'Usuario Creado',
                text: 'El acceso ha sido configurado correctamente.',
                timer: 2000,
                showConfirmButton: false
            });

            onExito();
            handleClose();
            setFormData({ id_empleado: "", email: "", password: "", rol: "empleado", activo: true });
        } catch (err) {
            Swal.fire('Error', err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton className="border-0">
                <Modal.Title className="fw-bold">
                    <i className="bi bi-person-plus-fill me-2 text-primary"></i>
                    Nuevo Acceso de Usuario
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body className="px-4">
                    <Row className="g-3">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="small fw-bold text-muted">Vincular Empleado *</Form.Label>
                                <Form.Select 
                                    name="id_empleado" 
                                    value={formData.id_empleado} 
                                    onChange={handleChange} 
                                    required
                                    className="rounded-3 py-2"
                                >
                                    <option value="">Seleccione un empleado...</option>
                                    {empleados.map(emp => (
                                        <option key={emp.id_empleado} value={emp.id_empleado}>
                                            {emp.nombre} {emp.apellido} - {emp.cedula}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Text className="text-muted">Solo aparecen empleados sin cuenta activa.</Form.Text>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="small fw-bold text-muted">Correo Electrónico *</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    placeholder="ejemplo@empresa.com"
                                    required
                                    className="rounded-3 py-2"
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="small fw-bold text-muted">Contraseña *</Form.Label>
                                <InputGroup>
                                    <Form.Control 
                                        type={verPassword ? "text" : "password"} 
                                        name="password" 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                        placeholder="Mínimo 6 caracteres"
                                        required
                                        className="rounded-start-3 py-2"
                                    />
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={() => setVerPassword(!verPassword)}
                                        className="rounded-end-3"
                                    >
                                        <i className={`bi bi-eye${verPassword ? '-slash' : ''}`}></i>
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="small fw-bold text-muted">Rol de Usuario</Form.Label>
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
                        </Col>

                        <Col md={6} className="d-flex align-items-end">
                            <Form.Check 
                                type="switch"
                                id="activo-switch"
                                label="Usuario Activo"
                                name="activo"
                                checked={formData.activo}
                                onChange={handleChange}
                                className="mb-2 fw-medium"
                            />
                        </Col>
                    </Row>
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
                        {loading ? <Spinner size="sm" /> : "Crear Cuenta"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalRegistroUsuario;
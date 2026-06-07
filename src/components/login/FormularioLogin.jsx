import React from "react";
import { Form, Button, Alert } from "react-bootstrap";

const FormularioLogin = ({ usuario, contrasena, error, setUsuario, setContrasena, iniciarSesion }) => {
    return (
        <Form>
            {error && (
                <Alert variant="danger" className="border-0 rounded-3 py-2 small mb-4 d-flex align-items-center">
                    <i className="bi bi-exclamation-circle-fill me-2"></i>
                    {error}
                </Alert>
            )}
            
            <Form.Group className="mb-4" controlId="usuario">
                <Form.Label className="small fw-semibold text-muted mb-2">Correo Electrónico</Form.Label>
                <div className="position-relative">
                    <i className="bi bi-envelope position-absolute top-50 translate-middle-y ms-3 text-muted"></i>
                    <Form.Control
                        type="email"
                        placeholder="nombre@empresa.com"
                        className="py-2 ps-5 rounded-3 border-slate-200"
                        style={{ height: '50px' }}
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        required
                    />
                </div>
            </Form.Group>

            <Form.Group className="mb-4" controlId="contrasena">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <Form.Label className="small fw-semibold text-muted mb-0">Contraseña</Form.Label>
                    <a href="#" className="small text-decoration-none fw-medium">¿Olvidaste tu contraseña?</a>
                </div>
                <div className="position-relative">
                    <i className="bi bi-lock position-absolute top-50 translate-middle-y ms-3 text-muted"></i>
                    <Form.Control
                        type="password"
                        placeholder="••••••••"
                        className="py-2 ps-5 rounded-3 border-slate-200"
                        style={{ height: '50px' }}
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        required
                    />
                </div>
            </Form.Group>

            <Button 
                variant="primary" 
                className="w-100 py-3 rounded-3 fw-bold shadow-sm mt-2" 
                onClick={iniciarSesion}
                style={{ letterSpacing: '0.5px' }}
            >
                Iniciar Sesión
            </Button>
        </Form>
    );
};

export default FormularioLogin;
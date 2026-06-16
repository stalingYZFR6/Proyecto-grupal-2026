import { Container, Row, Col } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormularioLogin from "../components/login/FormularioLogin";
import { supabase } from "../database/supabaseconfig";

const Login = () => {
    const [usuario, setUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState(null);
    const navegar = useNavigate();

    const iniciarSesion = async () => {
        try {
            setError(null);
            const { data, error } = await supabase.auth.signInWithPassword({
                email: usuario,
                password: contrasena,
            });

            if (error) {
                if (error.message?.toLowerCase().includes("email not confirmed") || error.status === 400) {
                    setError("El correo electrónico no ha sido confirmado. Por favor, revisa tu bandeja de entrada para verificar tu cuenta.");
                } else {
                    setError("Credenciales no válidas. Por favor, verifica tus datos.");
                }
                return;
            }

            if (data.user) {
                localStorage.setItem("usuario-supabase", usuario);
                navegar("/");
            }
        } catch (err) {
            setError("Error de conexión con el servidor.");
        }
    };

    useEffect(() => {
        const usuarioGuardado = localStorage.getItem("usuario-supabase");
        if (usuarioGuardado) {
            navegar("/");
        }
    }, [navegar]);

    return (
        <div className="vh-100 w-100 position-fixed top-0 start-0 d-flex align-items-center justify-content-center overflow-hidden" style={{ background: "var(--bg-main)", zIndex: 1050 }}>
            <Container fluid className="p-0 h-100">
                <Row className="g-0 h-100">
                    {/* Lado Izquierdo: Decorativo */}
                    <Col lg={7} className="d-none d-lg-flex align-items-center justify-content-center position-relative" 
                         style={{ 
                             background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                             overflow: "hidden"
                         }}>
                        <div className="position-absolute w-100 h-100" style={{ opacity: 0.1 }}>
                            <div className="position-absolute" style={{ top: '-10%', left: '-10%', width: '40%', height: '40%', borderRadius: '50%', background: 'white', filter: 'blur(100px)' }}></div>
                            <div className="position-absolute" style={{ bottom: '-10%', right: '-10%', width: '40%', height: '40%', borderRadius: '50%', background: '#38bdf8', filter: 'blur(100px)' }}></div>
                        </div>
                        <div className="text-center text-white p-5 position-relative z-1">
                            <h1 className="display-3 fw-bold mb-4">AssisTech</h1>
                            <p className="fs-4 fw-light opacity-75">La nueva era en gestión de talento humano y control de asistencia inteligente.</p>
                        </div>
                    </Col>

                    {/* Lado Derecho: Formulario */}
                    <Col lg={5} xs={12} className="d-flex align-items-center justify-content-center" style={{ background: "var(--bg-card)" }}>
                        <div className="w-100 px-4 px-md-5" style={{ maxWidth: "480px" }}>
                            <div className="text-center mb-5">
                                <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-4 p-3 mb-4">
                                    <i className="bi bi-shield-lock-fill text-primary fs-2"></i>
                                </div>
                                <h2 className="fw-bold text-premium-main">Bienvenido de nuevo</h2>
                                <p className="text-premium-muted">Ingresa tus credenciales para acceder al panel</p>
                            </div>
                            
                            <FormularioLogin
                                usuario={usuario}
                                contrasena={contrasena}
                                error={error}
                                setUsuario={setUsuario}
                                setContrasena={setContrasena}
                                iniciarSesion={iniciarSesion}
                            />
                            
                            <p className="text-center mt-5 text-premium-muted small">
                                &copy; 2026 AssisTech Enterprise. Todos los derechos reservados.
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;
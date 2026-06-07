import { Container, Row, Col, Card } from "react-bootstrap";
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
            const { data, error } = await supabase.auth.signInWithPassword({
                email: usuario,
                password: contrasena,
            });

            if (error) {
                setError("Credenciales no válidas. Por favor, verifica tus datos.");
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
        <div className="vh-100 d-flex align-items-center justify-content-center" style={{ background: "#f1f5f9" }}>
            <Container fluid className="p-0 h-100">
                <Row className="g-0 h-100">
                    {/* Lado Visual: Branding & Narrative */}
                    <Col lg={7} className="d-none d-lg-flex align-items-center justify-content-center position-relative" 
                         style={{ 
                             background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                             overflow: "hidden"
                         }}>
                        <div className="position-absolute w-100 h-100" style={{ opacity: 0.15 }}>
                            <div className="position-absolute" style={{ top: '10%', left: '10%', width: '300px', height: '300px', borderRadius: '50%', background: '#2563eb', filter: 'blur(80px)' }}></div>
                            <div className="position-absolute" style={{ bottom: '10%', right: '10%', width: '400px', height: '400px', borderRadius: '50%', background: '#06b6d4', filter: 'blur(100px)' }}></div>
                        </div>
                        
                        <div className="text-center text-white p-5 position-relative z-1" style={{ maxWidth: '600px' }}>
                            <div className="mb-4">
                                <i className="bi bi-rocket-takeoff-fill display-1 text-primary"></i>
                            </div>
                            <h1 className="display-4 fw-bold mb-3">AssisTech Enterprise</h1>
                            <p className="fs-4 fw-light opacity-75 mb-5">
                                La plataforma inteligente para la gestión de talento humano y control de asistencia en tiempo real.
                            </p>
                            <div className="d-flex justify-content-center gap-4">
                                <div className="text-center">
                                    <h4 className="fw-bold mb-0">100%</h4>
                                    <small className="opacity-50">Seguro</small>
                                </div>
                                <div className="vr opacity-25"></div>
                                <div className="text-center">
                                    <h4 className="fw-bold mb-0">Cloud</h4>
                                    <small className="opacity-50">Basado</small>
                                </div>
                                <div className="vr opacity-25"></div>
                                <div className="text-center">
                                    <h4 className="fw-bold mb-0">AI</h4>
                                    <small className="opacity-50">Powered</small>
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* Lado Formulario: Clean & Professional */}
                    <Col lg={5} xs={12} className="d-flex align-items-center justify-content-center bg-white">
                        <div className="w-100 px-4 px-md-5" style={{ maxWidth: "480px" }}>
                            <div className="mb-5">
                                <h2 className="fw-bold text-dark mb-2">Iniciar Sesión</h2>
                                <p className="text-muted">Bienvenido de nuevo. Por favor ingresa tus datos.</p>
                            </div>
                            
                            <FormularioLogin
                                usuario={usuario}
                                contrasena={contrasena}
                                error={error}
                                setUsuario={setUsuario}
                                setContrasena={setContrasena}
                                iniciarSesion={iniciarSesion}
                            />
                            
                            <div className="mt-5 text-center">
                                <p className="text-muted small">
                                    ¿Problemas para acceder? <a href="#" className="text-primary fw-bold text-decoration-none">Contactar Soporte</a>
                                </p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;
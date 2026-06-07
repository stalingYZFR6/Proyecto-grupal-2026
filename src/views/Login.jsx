import { Container, Row, Col } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormularioLogin from "../components/login/FormularioLogin";
import { supabase } from "../database/supabaseconfig";
import Swal from "sweetalert2";

const Login = () => {
    const [usuario, setUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState(null);
    const navegar = useNavigate();

    const iniciarSesion = async () => {
        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: usuario,
                password: contrasena,
            });

            if (authError) {
                setError("Credenciales no válidas. Por favor, verifica tus datos.");
                return;
            }

            // Obtener datos adicionales del usuario desde la tabla pública
            const { data: userData, error: dbError } = await supabase
                .from("usuarios")
                .select("*")
                .eq("id_auth", data.user.id)
                .single();

            if (dbError || !userData) {
                await supabase.auth.signOut();
                setError("No se encontró información de perfil para este usuario.");
                return;
            }

            if (!userData.activo) {
                await supabase.auth.signOut();
                Swal.fire('Cuenta Inactiva', 'Tu acceso ha sido deshabilitado por el administrador.', 'warning');
                return;
            }

            // Guardar sesión y datos de rol
            localStorage.setItem("usuario-supabase", usuario);
            localStorage.setItem("usuario-data", JSON.stringify(userData));
            
            navegar("/");
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
        <div className="vh-100 d-flex align-items-center justify-content-center overflow-hidden" style={{ background: "var(--bg-main)" }}>
            <Container fluid className="p-0 h-100">
                <Row className="g-0 h-100">
                    <Col lg={7} className="d-none d-lg-flex align-items-center justify-content-center position-relative" 
                         style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", overflow: "hidden" }}>
                        <div className="text-center text-white p-5 position-relative z-1">
                            <h1 className="display-3 fw-bold mb-4">AssisTech</h1>
                            <p className="fs-4 fw-light opacity-75">La nueva era en gestión de talento humano y control de asistencia inteligente.</p>
                        </div>
                    </Col>
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
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;
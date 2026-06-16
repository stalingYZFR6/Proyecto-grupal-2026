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
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: usuario,
                password: contrasena,
            });

            if (authError) {
                if (authError.message?.toLowerCase().includes("email not confirmed") || authError.status === 400) {
                    setError("El correo electrónico no ha sido confirmado.");
                } else {
                    setError("Credenciales no válidas.");
                }
                return;
            }

            if (authData.user) {
                // Buscamos el perfil en nuestra tabla de usuarios
                const { data: perfil, error: perfilError } = await supabase
                    .from("usuarios")
                    .select("rol, id_empleado")
                    .eq("id_auth", authData.user.id)
                    .maybeSingle();

                if (perfilError) throw perfilError;

                const datosUsuario = {
                    email: usuario,
                    rol: perfil?.rol || "empleado",
                    id_empleado: perfil?.id_empleado || null,
                    id_auth: authData.user.id
                };

                localStorage.setItem("usuario-supabase", JSON.stringify(datosUsuario));
                navegar("/");
            }
        } catch (err) {
            console.error(err);
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
                         style={{ 
                             background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                             overflow: "hidden"
                         }}>
                        <div className="text-center text-white p-5 position-relative z-1">
                            <h1 className="display-3 fw-bold mb-4">AssisTech</h1>
                            <p className="fs-4 fw-light opacity-75">La nueva era en gestión de talento humano inteligente.</p>
                        </div>
                    </Col>

                    <Col lg={5} xs={12} className="d-flex align-items-center justify-content-center" style={{ background: "var(--bg-card)" }}>
                        <div className="w-100 px-4 px-md-5" style={{ maxWidth: "480px" }}>
                            <div className="text-center mb-5">
                                <h2 className="fw-bold text-premium-main">Bienvenido</h2>
                                <p className="text-premium-muted">Ingresa para acceder al panel</p>
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
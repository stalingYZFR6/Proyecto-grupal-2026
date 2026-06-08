import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import logo from "../../assets/logo.jpg";
import { supabase } from "../../database/supabaseconfig";
import "bootstrap-icons/font/bootstrap-icons.css";
import ChatIA from "../ia/ChatIA";
import MascotaChibi from "../MascotaChibi";

const NavbarModaExpress = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [mostrarChatIA, setMostrarChatIA] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const NOMBRE_MARCA = "AssisTech";

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem("darkMode", newMode.toString());
        document.documentElement.setAttribute("data-bs-theme", newMode ? "dark" : "light");
    };

    useEffect(() => {
        const savedMode = localStorage.getItem("darkMode");
        const shouldBeDark = savedMode !== null ? savedMode === "true" : true;
        setIsDarkMode(shouldBeDark);
        document.documentElement.setAttribute("data-bs-theme", shouldBeDark ? "dark" : "light");
    }, []);

    const manejarNavegacion = (ruta) => {
        navigate(ruta);
    };

    const cerrarSesion = async () => {
        try {
            await supabase.auth.signOut();
            localStorage.removeItem("usuario-supabase");
            navigate("/login");
        } catch (err) {
            console.error("Error cerrando sesión:", err.message);
        }
    };

    const rutas = [
        { path: "/", label: "Inicio", icon: "bi-grid-1x2" },
        { path: "/dashboard", label: "Estadísticas", icon: "bi-bar-chart" },
        { path: "/empleados", label: "Personal", icon: "bi-people" },
        { path: "/catalogo", label: "Catálogo", icon: "bi-journal-bookmark" },
        { path: "/incidencias", label: "Incidencias", icon: "bi-exclamation-circle" },
        { path: "/asistencias", label: "Asistencia", icon: "bi-calendar-check" },
        { path: "/turnos", label: "Turnos", icon: "bi-clock" },
    ];

    if (location.pathname === "/login") return null;

    return (
        <>
            <MascotaChibi />
            <Navbar expand="lg" fixed="top" className="glass-nav py-2" style={{ zIndex: 1030 }}>
                <Container>
                    {/* Logo y Marca */}
                    <Navbar.Brand 
                        onClick={() => manejarNavegacion("/")} 
                        className="d-flex align-items-center gap-2" 
                        style={{ cursor: 'pointer' }}
                    >
                        <img src={logo} alt="logo" width="36" height="36" className="rounded-circle border border-2 border-primary border-opacity-25" />
                        <span className="fw-bold fs-5 text-gradient" style={{ background: 'linear-gradient(45deg, var(--text-main), #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {NOMBRE_MARCA}
                        </span>
                    </Navbar.Brand>

                    {/* Navegación Central */}
                    <div className="d-flex flex-grow-1 justify-content-center overflow-auto no-scrollbar mx-2">
                        <Nav className="flex-row gap-1 flex-nowrap">
                            {rutas.map((item) => (
                                <Nav.Link 
                                    key={item.path} 
                                    onClick={() => manejarNavegacion(item.path)}
                                    className={`px-3 py-2 rounded-pill small fw-medium transition-all d-flex align-items-center ${location.pathname === item.path ? 'bg-primary bg-opacity-10 text-primary' : 'text-muted hover:bg-light'}`}
                                >
                                    <i className={`bi ${item.icon} ${location.pathname === item.path ? '' : 'me-lg-2'}`}></i>
                                    <span className="d-none d-lg-inline">{item.label}</span>
                                </Nav.Link>
                            ))}
                        </Nav>
                    </div>

                    {/* Acciones Finales */}
                    <div className="d-flex align-items-center gap-1 gap-md-2">
                        <Nav.Link onClick={() => setMostrarChatIA(true)} className="p-2 text-muted hover:text-primary transition-all">
                            <i className="bi bi-robot fs-5"></i>
                        </Nav.Link>
                        <Nav.Link onClick={toggleDarkMode} className="p-2 text-muted hover:text-primary transition-all">
                            <i className={`bi ${isDarkMode ? "bi-sun" : "bi-moon"} fs-5`}></i>
                        </Nav.Link>
                        <div className="vr mx-2 d-none d-md-block" style={{ height: '24px', alignSelf: 'center' }}></div>
                        <Nav.Link 
                            onClick={cerrarSesion} 
                            className="p-2 text-danger opacity-75 hover:opacity-100 transition-all d-flex align-items-center gap-2"
                        >
                            <i className="bi bi-box-arrow-right fs-5"></i>
                            <span className="d-none d-xl-inline small fw-bold">Salir</span>
                        </Nav.Link>
                    </div>
                </Container>
            </Navbar>
            <ChatIA mostrar={mostrarChatIA} onCerrar={() => setMostrarChatIA(false)} />
        </>
    );
};

export default NavbarModaExpress;
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import logo from "../../assets/logo.jpg";
import { supabase } from "../../database/supabaseconfig";
import "bootstrap-icons/font/bootstrap-icons.css";
import ChatIA from "../ia/ChatIA";
import MascotaChibi from "../MascotaChibi";

const NavbarModaExpress = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [mostrarMenu, setMostrarMenu] = useState(false);
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
        setMostrarMenu(false); // Cerrar menú primero
        navigate(ruta);
    };

    const cerrarSesion = async () => {
        try {
            setMostrarMenu(false); // Cerrar menú primero
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
                    <Navbar.Brand onClick={() => manejarNavegacion("/")} className="d-flex align-items-center gap-2 cursor-pointer">
                        <img src={logo} alt="logo" width="36" height="36" className="rounded-circle border border-2 border-primary border-opacity-25" />
                        <span className="fw-bold fs-5 text-gradient" style={{ background: 'linear-gradient(45deg, var(--text-main), #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {NOMBRE_MARCA}
                        </span>
                    </Navbar.Brand>

                    <div className="d-flex align-items-center gap-2 order-lg-last">
                        <Nav.Link onClick={() => setMostrarChatIA(true)} className="p-2 text-muted hover:text-primary transition-all">
                            <i className="bi bi-robot fs-5"></i>
                        </Nav.Link>
                        <Nav.Link onClick={toggleDarkMode} className="p-2 text-muted hover:text-primary transition-all">
                            <i className={`bi ${isDarkMode ? "bi-sun" : "bi-moon"} fs-5`}></i>
                        </Nav.Link>
                        <Navbar.Toggle onClick={() => setMostrarMenu(true)} className="border-0 p-2 shadow-none" />
                    </div>

                    <Navbar.Collapse className="d-none d-lg-flex">
                        <Nav className="mx-auto gap-1">
                            {rutas.map((item) => (
                                <Nav.Link 
                                    key={item.path} 
                                    onClick={() => manejarNavegacion(item.path)}
                                    className={`px-3 py-2 rounded-pill small fw-medium transition-all ${location.pathname === item.path ? 'bg-primary bg-opacity-10 text-primary' : 'text-muted hover:bg-light'}`}
                                >
                                    <i className={`bi ${item.icon} me-2`}></i>
                                    {item.label}
                                </Nav.Link>
                            ))}
                        </Nav>
                        <Nav.Link onClick={cerrarSesion} className="small fw-semibold text-danger opacity-75 hover:opacity-100 transition-all">
                            Cerrar Sesión
                        </Nav.Link>
                    </Navbar.Collapse>

                    <Navbar.Offcanvas 
                        show={mostrarMenu} 
                        onHide={() => setMostrarMenu(false)} 
                        placement="end" 
                        className="border-0"
                        style={{ zIndex: 1050 }}
                    >
                        <Offcanvas.Header closeButton className="border-bottom">
                            <Offcanvas.Title className="fw-bold">{NOMBRE_MARCA}</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body className="p-4">
                            <Nav className="flex-column gap-3">
                                {rutas.map((item) => (
                                    <Nav.Link 
                                        key={item.path} 
                                        onClick={() => manejarNavegacion(item.path)} 
                                        className="d-flex align-items-center fs-6 fw-medium text-muted"
                                    >
                                        <div className="bg-light rounded-3 p-2 me-3 text-dark">
                                            <i className={`bi ${item.icon}`}></i>
                                        </div>
                                        {item.label}
                                    </Nav.Link>
                                ))}
                                <hr className="my-4 opacity-10" />
                                <Nav.Link onClick={cerrarSesion} className="text-danger fw-bold d-flex align-items-center">
                                    <div className="bg-danger bg-opacity-10 rounded-3 p-2 me-3 text-danger">
                                        <i className="bi bi-box-arrow-right"></i>
                                    </div>
                                    Cerrar Sesión
                                </Nav.Link>
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
            <ChatIA mostrar={mostrarChatIA} onCerrar={() => setMostrarChatIA(false)} />
        </>
    );
};

export default NavbarModaExpress;
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, Offcanvas, Button, NavDropdown } from "react-bootstrap";
import logo from "../../assets/logo.jpg";
import { supabase } from "../../database/supabaseconfig";
import "bootstrap-icons/font/bootstrap-icons.css";
import ChatIA from "../ia/ChatIA";
import MascotaChibi from "../MascotaChibi";

const NavbarModaExpress = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [mostrarChatIA, setMostrarChatIA] = useState(false);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [userRole, setUserRole] = useState("empleado");
    
    const navigate = useNavigate();
    const location = useLocation();
    const NOMBRE_MARCA = "AssisTech";

    useEffect(() => {
        const storedUser = localStorage.getItem("usuario-supabase");
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setUserRole(parsed.rol || "empleado");
            } catch (e) {
                setUserRole("empleado");
            }
        }
    }, [location]);

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
        setMenuAbierto(false);
    };

    const cerrarSesion = async () => {
        try {
            await supabase.auth.signOut();
            localStorage.removeItem("usuario-supabase");
            setMenuAbierto(false);
            navigate("/login");
        } catch (err) {
            console.error("Error cerrando sesión:", err.message);
        }
    };

    const esAdmin = userRole === "admin";

    // Rutas principales
    const rutasPrincipales = [
        { path: "/", label: "Inicio", icon: "bi-grid-1x2" },
        { path: "/asistencias", label: "Mi Asistencia", icon: "bi-calendar-check" },
        { path: "/catalogo", label: "Catálogo", icon: "bi-journal-bookmark" },
        { path: "/empleados", label: "Mi Perfil", icon: "bi-person" },
    ];

    if (esAdmin) {
        rutasPrincipales.splice(1, 0, { path: "/dashboard", label: "Estadísticas", icon: "bi-bar-chart" });
    }

    const rutasGestion = [
        { path: "/empleados", label: "Personal", icon: "bi-people" },
        { path: "/incidencias", label: "Incidencias", icon: "bi-exclamation-circle" },
        { path: "/turnos", label: "Turnos", icon: "bi-clock" },
        { path: "/usuarios", label: "Usuarios", icon: "bi-person-gear" },
    ];

    if (location.pathname === "/login") return null;

    return (
        <>
            <MascotaChibi />
            <Navbar expand="lg" fixed="top" className="glass-nav py-2" style={{ zIndex: 1030 }}>
                <Container>
                    <Navbar.Brand onClick={() => manejarNavegacion("/")} className="d-flex align-items-center gap-2 me-4" style={{ cursor: 'pointer' }}>
                        <img src={logo} alt="logo" width="36" height="36" className="rounded-circle border border-2 border-primary border-opacity-25" />
                        <span className="fw-bold fs-5 text-gradient" style={{ background: 'linear-gradient(45deg, var(--text-main), #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {NOMBRE_MARCA}
                        </span>
                    </Navbar.Brand>

                    <div className="d-none d-lg-flex flex-grow-1 align-items-center">
                        <Nav className="me-auto gap-1">
                            {rutasPrincipales.map((item) => (
                                <Nav.Link 
                                    key={item.path} 
                                    onClick={() => manejarNavegacion(item.path)}
                                    className={`px-3 py-2 rounded-pill small fw-medium transition-all d-flex align-items-center ${location.pathname === item.path ? 'bg-primary bg-opacity-10 text-primary' : 'text-muted hover:bg-light'}`}
                                >
                                    <i className={`bi ${item.icon} me-2`}></i>
                                    <span>{item.label}</span>
                                </Nav.Link>
                            ))}

                            {esAdmin && (
                                <NavDropdown title={<><i className="bi bi-layers me-2"></i>Gestión</>} id="nav-gestion-dropdown" className="px-2 small fw-medium text-muted rounded-pill hover:bg-light">
                                    {rutasGestion.map((item) => (
                                        <NavDropdown.Item key={item.path} onClick={() => manejarNavegacion(item.path)}>
                                            <i className={`bi ${item.icon} me-2`}></i>{item.label}
                                        </NavDropdown.Item>
                                    ))}
                                </NavDropdown>
                            )}
                        </Nav>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <NavDropdown align="end" title={<i className="bi bi-gear fs-5 text-muted"></i>} id="nav-settings-dropdown" className="no-caret-dropdown">
                            <NavDropdown.Header className="small text-uppercase fw-bold opacity-50">Herramientas</NavDropdown.Header>
                            <NavDropdown.Item onClick={() => setMostrarChatIA(true)}><i className="bi bi-robot text-primary me-2"></i> Asistente IA</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={toggleDarkMode}><i className={`bi ${isDarkMode ? "bi-sun" : "bi-moon"} me-2`}></i> Modo {isDarkMode ? "Claro" : "Oscuro"}</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={cerrarSesion} className="text-danger"><i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión</NavDropdown.Item>
                        </NavDropdown>

                        <Button variant="link" className="d-lg-none p-2 text-muted border-0" onClick={() => setMenuAbierto(true)}>
                            <i className="bi bi-list fs-3"></i>
                        </Button>
                    </div>
                </Container>
            </Navbar>

            <Offcanvas show={menuAbierto} onHide={() => setMenuAbierto(false)} placement="end" className="d-lg-none">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className="fw-bold">{NOMBRE_MARCA}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column gap-1">
                        {rutasPrincipales.map((item) => (
                            <Nav.Link key={item.path} onClick={() => manejarNavegacion(item.path)} className="d-flex align-items-center gap-3 py-2 text-muted">
                                <i className={`bi ${item.icon} fs-5`}></i>{item.label}
                            </Nav.Link>
                        ))}
                        {esAdmin && (
                            <>
                                <hr />
                                <div className="text-uppercase x-small fw-bold text-muted mb-2 px-2">Gestión</div>
                                {rutasGestion.map((item) => (
                                    <Nav.Link key={item.path} onClick={() => manejarNavegacion(item.path)} className="d-flex align-items-center gap-3 py-2 text-muted">
                                        <i className={`bi ${item.icon} fs-5`}></i>{item.label}
                                    </Nav.Link>
                                ))}
                            </>
                        )}
                    </Nav>
                    <div className="mt-auto">
                        <Button variant="danger" className="w-100 py-2 mt-4" onClick={cerrarSesion}>Cerrar Sesión</Button>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            <ChatIA mostrar={mostrarChatIA} onCerrar={() => setMostrarChatIA(false)} />
        </>
    );
};

export default NavbarModaExpress;
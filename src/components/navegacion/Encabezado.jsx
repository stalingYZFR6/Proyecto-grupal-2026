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

    const manejarTeclaEscape = useCallback((evento) => {
        if (evento.key === "Escape") {
            setMenuAbierto(false);
        }
    }, []);

    useEffect(() => {
        window.addEventListener("keydown", manejarTeclaEscape);
        return () => window.removeEventListener("keydown", manejarTeclaEscape);
    }, [manejarTeclaEscape]);

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

    // Navegación principal (Lado Izquierdo)
    const rutasPrincipales = [
        { path: "/dashboard", label: "Estadísticas", icon: "bi-bar-chart-line" },
        { path: "/empleados", label: "Personal", icon: "bi-people" },
        { path: "/incidencias", label: "Incidencias", icon: "bi-exclamation-triangle" },
        { path: "/asistencias", label: "Asistencia", icon: "bi-calendar-check" },
        { path: "/turnos", label: "Turnos", icon: "bi-clock" },
    ];

    // Navegación de configuración (Dropdown Derecha)
    const rutasConfiguracion = [
        { path: "/catalogo", label: "Catálogo", icon: "bi-journal-bookmark" },
        { path: "/usuarios", label: "Gestión de Usuarios", icon: "bi-person-gear" },
    ];

    if (location.pathname === "/login") return null;

    return (
        <>
            <MascotaChibi />
            <Navbar expand="lg" fixed="top" className="glass-nav py-2 border-b border-white/5" style={{ zIndex: 1030 }}>
                <Container className="flex items-center justify-between">
                    
                    {/* IZQUIERDA: Logo y Navegación Principal */}
                    <div className="flex items-center gap-4 flex-1 overflow-hidden">
                        <Navbar.Brand 
                            onClick={() => manejarNavegacion("/")} 
                            className="flex items-center gap-2 m-0 shrink-0 cursor-pointer"
                        >
                            <img src={logo} alt="logo" width="36" height="36" className="rounded-full border-2 border-primary/25 shadow-sm" />
                            <span className="hidden md:inline fw-bold fs-5 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-400">
                                {NOMBRE_MARCA}
                            </span>
                        </Navbar.Brand>

                        {/* Menú Principal Desktop */}
                        <Nav className="hidden lg:flex flex-row gap-1 items-center no-scrollbar overflow-x-auto">
                            {rutasPrincipales.map((item) => (
                                <Nav.Link 
                                    key={item.path} 
                                    onClick={() => manejarNavegacion(item.path)}
                                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all flex items-center whitespace-nowrap ${
                                        location.pathname === item.path 
                                        ? 'bg-primary/10 text-primary' 
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <i className={`bi ${item.icon} me-2`}></i>
                                    <span>{item.label}</span>
                                </Nav.Link>
                            ))}
                        </Nav>
                    </div>

                    {/* DERECHA: Acciones Globales */}
                    <div className="flex items-center gap-2">
                        {/* Asistente IA */}
                        <Nav.Link 
                            onClick={() => setMostrarChatIA(true)} 
                            className="p-2 text-slate-400 hover:text-primary transition-colors flex items-center"
                            title="Asistente IA"
                        >
                            <i className="bi bi-robot text-xl"></i>
                        </Nav.Link>

                        {/* Conmutador Tema */}
                        <Nav.Link 
                            onClick={toggleDarkMode} 
                            className="p-2 text-slate-400 hover:text-amber-400 transition-colors flex items-center"
                            title="Cambiar Tema"
                        >
                            <i className={`bi ${isDarkMode ? "bi-sun" : "bi-moon"} text-xl`}></i>
                        </Nav.Link>

                        {/* Dropdown Configuración (NUEVO) */}
                        <NavDropdown 
                            title={<i className="bi bi-gear text-xl"></i>}
                            id="nav-dropdown-config"
                            align="end"
                            className="custom-dropdown text-slate-400 hover:text-white transition-colors flex items-center"
                        >
                            <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Administración
                            </div>
                            {rutasConfiguracion.map((item) => (
                                <NavDropdown.Item 
                                    key={item.path}
                                    onClick={() => manejarNavegacion(item.path)}
                                    className="flex items-center gap-3 py-2 px-4 hover:bg-primary/10 transition-colors"
                                >
                                    <i className={`bi ${item.icon} text-primary`}></i>
                                    <span className="text-sm font-medium">{item.label}</span>
                                </NavDropdown.Item>
                            ))}
                        </NavDropdown>

                        <div className="hidden md:block w-px h-6 bg-white/10 mx-1"></div>

                        {/* Botón Salir */}
                        <Nav.Link 
                            onClick={cerrarSesion} 
                            className="hidden md:flex p-2 text-rose-400/80 hover:text-rose-500 transition-colors items-center gap-2"
                        >
                            <i className="bi bi-box-arrow-right text-xl"></i>
                            <span className="text-xs font-bold uppercase tracking-tight">Salir</span>
                        </Nav.Link>

                        {/* Botón Menú Móvil */}
                        <Button 
                            variant="link" 
                            className="lg:hidden p-2 text-slate-400 hover:text-white transition-all border-0"
                            onClick={() => setMenuAbierto(true)}
                        >
                            <i className="bi bi-grid-fill text-2xl"></i>
                        </Button>
                    </div>
                </Container>
            </Navbar>

            {/* PANEL LATERAL MÓVIL */}
            <Offcanvas 
                show={menuAbierto} 
                onHide={() => setMenuAbierto(false)} 
                placement="end"
                className="lg:hidden"
                style={{ background: "var(--bg-card)", color: "var(--text-main)" }}
            >
                <Offcanvas.Header closeButton className="border-b border-white/5">
                    <Offcanvas.Title className="flex items-center gap-2">
                        <img src={logo} alt="logo" width="30" height="30" className="rounded-full" />
                        <span className="font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-400">
                            {NOMBRE_MARCA}
                        </span>
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="flex flex-column h-full">
                    <Nav className="flex-column gap-2">
                        <div className="uppercase text-[10px] font-bold text-slate-500 mb-2 px-2 tracking-[2px]">
                            Navegación
                        </div>
                        {[...rutasPrincipales, ...rutasConfiguracion].map((item) => (
                            <Nav.Link 
                                key={item.path} 
                                onClick={() => manejarNavegacion(item.path)}
                                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                                    location.pathname === item.path 
                                    ? 'bg-primary/10 text-primary shadow-sm' 
                                    : 'text-slate-400 hover:bg-white/5'
                                }`}
                            >
                                <i className={`bi ${item.icon} text-lg`}></i>
                                <span>{item.label}</span>
                            </Nav.Link>
                        ))}
                    </Nav>

                    <div className="mt-auto pt-6 border-t border-white/5 space-y-3">
                        <Button 
                            variant="light" 
                            className="w-full py-2.5 rounded-xl flex items-center gap-3 bg-primary/10 border-0 text-primary font-semibold text-sm"
                            onClick={() => {
                                setMenuAbierto(false);
                                setMostrarChatIA(true);
                            }}
                        >
                            <i className="bi bi-robot text-lg"></i>
                            <span>Consultas Inteligentes IA</span>
                        </Button>

                        <Button 
                            variant="danger" 
                            className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-rose-900/20"
                            onClick={cerrarSesion}
                        >
                            <i className="bi bi-box-arrow-right text-lg"></i>
                            <span>Cerrar Sesión</span>
                        </Button>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            <ChatIA mostrar={mostrarChatIA} onCerrar={() => setMostrarChatIA(false)} />
        </>
    );
};

export default NavbarModaExpress;
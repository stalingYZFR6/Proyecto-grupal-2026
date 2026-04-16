import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, NavLink, Offcanvas } from "react-bootstrap";
import logo from "../../assets/logo.jpg";
import { supabase } from "../../database/supabaseconfig";
import "bootstrap-icons/font/bootstrap-icons.css";

const NavbarModaExpress = () => {
    const [mostrarMenu, setMostrarMenu] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true); // Por defecto oscuro

    const navigate = useNavigate();
    const location = useLocation();

    const NOMBRE_MARCA = "Assis Tech";

    // ==================== Toggle Dark Mode ====================
    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem("darkMode", newMode);
        
        // Aplicar clase al body (para que afecte toda la app)
        if (newMode) {
            document.documentElement.setAttribute('data-bs-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-bs-theme', 'light');
        }
    };

    // Cargar preferencia guardada al montar
    useEffect(() => {
        const savedMode = localStorage.getItem("darkMode");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        
        const shouldBeDark = savedMode !== null ? savedMode === "true" : prefersDark;
        
        setIsDarkMode(shouldBeDark);
        document.documentElement.setAttribute('data-bs-theme', shouldBeDark ? 'dark' : 'light');
    }, []);

    const manejarToggle = () => setMostrarMenu(!mostrarMenu);

    const manejarNavegacion = (ruta) => {
        navigate(ruta);
        setMostrarMenu(false);
    };

    const cerrarSesion = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            localStorage.removeItem("usuario-supabase");
            setMostrarMenu(false);
            navigate("/login");
        } catch (err) {
            console.error("Error cerrando sesión:", err.message);
        }
    };

    // Detectar rutas especiales
    const esLogin = location.pathname === "/login";
    const esCatalogo = location.pathname === "/catalogo" && 
                       localStorage.getItem("usuario-supabase") === null;

    // ==================== CONTENIDO DEL MENÚ ====================
    let contenidoMenu;

    if (esLogin) {
        contenidoMenu = (
            <Nav className="ms-auto pe-2">
                <Nav.Link onClick={() => manejarNavegacion("/login")} className="text-white">
                    <i className="bi bi-person-fill-lock me-2"></i>
                    Iniciar sesión
                </Nav.Link>
            </Nav>
        );
    } else if (esCatalogo) {
        contenidoMenu = (
            <Nav className="ms-auto pe-2">
                <Nav.Link onClick={() => manejarNavegacion("/catalogo")} className="text-white">
                    <i className="bi bi-images me-2"></i>
                    <strong>Catálogo</strong>
                </Nav.Link>
            </Nav>
        );
    } else {
        contenidoMenu = (
            <Nav className="ms-auto pe-2">
                <Nav.Link onClick={() => manejarNavegacion("/")} className="text-white">
                    {mostrarMenu && <i className="bi bi-house-fill me-2"></i>}
                    <strong>Inicio</strong>
                </Nav.Link>

                <Nav.Link onClick={() => manejarNavegacion("/empleados")} className="text-white">
                    {mostrarMenu && <i className="bi bi-people-fill me-2"></i>}
                    <strong>Empleados</strong>
                </Nav.Link>

                <Nav.Link onClick={() => manejarNavegacion("/productos")} className="text-white">
                    {mostrarMenu && <i className="bi bi-bag-heart-fill me-2"></i>}
                    <strong>Productos</strong>
                </Nav.Link>

                <Nav.Link onClick={() => manejarNavegacion("/catalogo")} className="text-white">
                    {mostrarMenu && <i className="bi bi-images me-2"></i>}
                    <strong>Catálogo</strong>
                </Nav.Link>

                {/* Botón Dark Mode */}
                <Nav.Link onClick={toggleDarkMode} className="text-white" title="Cambiar tema">
                    <i className={`bi ${isDarkMode ? 'bi-sun-fill' : 'bi-moon-fill'} me-2`}></i>
                    {mostrarMenu && (isDarkMode ? "Modo Claro" : "Modo Oscuro")}
                </Nav.Link>

                {mostrarMenu ? null : (
                    <NavLink onClick={cerrarSesion} className="text-white">
                        <i className="bi bi-box-arrow-right me-2"></i>
                    </NavLink>
                )}

                {mostrarMenu && (
                    <div className="mt-3 p-3 rounded bg-dark text-white border border-secondary">
                        <p className="mb-2">
                            <i className="bi bi-envelope-fill me-2"></i>
                            {localStorage.getItem("usuario-supabase")?.toLowerCase() || "Usuario"}
                        </p>
                        <button
                            className="btn btn-outline-danger mt-3 w-100"
                            onClick={cerrarSesion}
                        >
                            <i className="bi bi-box-arrow-right me-2"></i>
                            Cerrar sesión
                        </button>
                    </div>
                )}
            </Nav>
        );
    }

    return (
        <Navbar
            expand="md"
            fixed="top"
            className="shadow-lg"
            variant="dark"
            bg="dark"                    // ← Forza fondo oscuro
            data-bs-theme="dark"         // ← Importante para Bootstrap 5
        >
            <Container>
                <Navbar.Brand
                    onClick={() => manejarNavegacion(esCatalogo ? "/catalogo" : "/")}
                    className="text-white fw-bold d-flex align-items-center"
                    style={{ cursor: "pointer" }}
                >
                    <img
                        alt={`Logo ${NOMBRE_MARCA}`}
                        src={logo}
                        width="45"
                        height="45"
                        className="d-inline-block me-2 rounded"
                    />
                    <strong>
                        <h4 className="mb-0">{NOMBRE_MARCA}</h4>
                    </strong>
                </Navbar.Brand>

                {!esLogin && (
                    <Navbar.Toggle
                        aria-controls="menu-offcanvas"
                        onClick={manejarToggle}
                    />
                )}

                <Navbar.Offcanvas
                    id="menu-offcanvas"
                    placement="end"
                    show={mostrarMenu}
                    onHide={() => setMostrarMenu(false)}
                    className="bg-dark text-white"   // Fondo oscuro en móvil
                >
                    <Offcanvas.Header closeButton closeVariant="white">
                        <Offcanvas.Title>Menú {NOMBRE_MARCA}</Offcanvas.Title>
                    </Offcanvas.Header>

                    <Offcanvas.Body>
                        {contenidoMenu}
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>
    );
};

export default NavbarModaExpress;
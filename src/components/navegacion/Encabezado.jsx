import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, NavLink, Offcanvas } from "react-bootstrap";
import logo from "../../assets/logo.jpg";
import { supabase } from "../../database/supabaseconfig";
import "bootstrap-icons/font/bootstrap-icons.css";

// 👇 IMPORTAR LA MASCOTA
import MascotaChibi from "../MascotaChibi";

const NavbarModaExpress = () => {
    const [mostrarMenu, setMostrarMenu] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    const NOMBRE_MARCA = "Assis Tech";

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem("darkMode", newMode);

        document.documentElement.setAttribute(
            "data-bs-theme",
            newMode ? "dark" : "light"
        );
    };

    useEffect(() => {
        const savedMode = localStorage.getItem("darkMode");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        const shouldBeDark = savedMode !== null ? savedMode === "true" : prefersDark;

        setIsDarkMode(shouldBeDark);
        document.documentElement.setAttribute(
            "data-bs-theme",
            shouldBeDark ? "dark" : "light"
        );
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
            navigate("/login");
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <>
            {/* 🧸 MASCOTA */}
            <MascotaChibi />

            <Navbar
                expand="md"
                fixed="top"
                className="shadow-lg"
                variant="dark"
                bg="dark"
            >
                <Container>
                    <Navbar.Brand
                        onClick={() => manejarNavegacion("/")}
                        className="text-white fw-bold d-flex align-items-center"
                        style={{ cursor: "pointer" }}
                    >
                        <img
                            alt="logo"
                            src={logo}
                            width="45"
                            height="45"
                            className="me-2 rounded"
                        />
                        <h4 className="mb-0">{NOMBRE_MARCA}</h4>
                    </Navbar.Brand>

                    <Navbar.Toggle onClick={manejarToggle} />

                    <Navbar.Offcanvas
                        show={mostrarMenu}
                        onHide={() => setMostrarMenu(false)}
                        placement="end"
                        className="bg-dark text-white"
                    >
                        <Offcanvas.Header closeButton closeVariant="white">
                            <Offcanvas.Title>Menú</Offcanvas.Title>
                        </Offcanvas.Header>

                        <Offcanvas.Body>
                            <Nav className="ms-auto">

                                <Nav.Link onClick={() => manejarNavegacion("/")}>
                                    Inicio
                                </Nav.Link>

                                <Nav.Link onClick={() => manejarNavegacion("/empleados")}>
                                    Empleados
                                </Nav.Link>

                                <Nav.Link onClick={() => manejarNavegacion("/incidencias")}>
                                    Incidencias
                                </Nav.Link>

                                <Nav.Link onClick={() => manejarNavegacion("/productos")}>
                                    Productos
                                </Nav.Link>

                                <Nav.Link onClick={() => manejarNavegacion("/catalogo")}>
                                    Catálogo
                                </Nav.Link>

                                <Nav.Link onClick={toggleDarkMode}>
                                    {isDarkMode ? "Modo Claro" : "Modo Oscuro"}
                                </Nav.Link>

                                <NavLink onClick={cerrarSesion}>
                                    Cerrar sesión
                                </NavLink>

                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </>
    );
};

export default NavbarModaExpress;
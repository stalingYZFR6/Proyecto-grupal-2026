import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import logo from "../../assets/logo.jpg";
import { supabase } from "../../database/supabaseconfig";
import "bootstrap-icons/font/bootstrap-icons.css";

import MascotaChibi from "../MascotaChibi";

const NavbarModaExpress = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const navigate = useNavigate();

    const NOMBRE_MARCA = "Assis Tech";

    // ================= DARK MODE =================
    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem("darkMode", newMode.toString());
        document.documentElement.setAttribute(
            "data-bs-theme",
            newMode ? "dark" : "light"
        );
    };

    useEffect(() => {
        const savedMode = localStorage.getItem("darkMode");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        const shouldBeDark =
            savedMode !== null ? savedMode === "true" : prefersDark;

        setIsDarkMode(shouldBeDark);
        document.documentElement.setAttribute(
            "data-bs-theme",
            shouldBeDark ? "dark" : "light"
        );
    }, []);

    const manejarNavegacion = (ruta) => {
        navigate(ruta);
    };

    const cerrarSesion = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            localStorage.removeItem("usuario-supabase");
            navigate("/login");
        } catch (err) {
            console.error("Error cerrando sesión:", err.message);
        }
    };

    const rutas = [
        { path: "/", label: "Inicio", icon: "bi-house-door" },
        { path: "/empleados", label: "Empleados", icon: "bi-people" },
        { path: "/incidencias", label: "Incidencias", icon: "bi-exclamation-triangle" },
        { path: "/productos", label: "Productos", icon: "bi-box-seam" },
        { path: "/catalogo", label: "Catálogo", icon: "bi-images" },
    ];

    return (
        <>
            <MascotaChibi />

            <Navbar
                expand="sm" // 🔥 CLAVE
                fixed="top"
                bg="dark"
                variant="dark"
                className="shadow-lg"
            >
                <Container>

                    {/* LOGO */}
                    <Navbar.Brand
                        onClick={() => manejarNavegacion("/")}
                        style={{ cursor: "pointer" }}
                        className="d-flex align-items-center gap-2 text-white fw-bold"
                    >
                        <img
                            src={logo}
                            alt="logo"
                            width="48"
                            height="48"
                            className="rounded-3"
                        />
                        <span className="d-none d-lg-inline">
                            {NOMBRE_MARCA}
                        </span>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="offcanvas-main" />

                    {/* 🔥 BARRA NORMAL */}
                    <Navbar.Collapse
                        id="offcanvas-main"
                        className="d-none d-sm-flex"
                    >
                        <Nav className="ms-auto align-items-center gap-4">

                            {rutas.map((item) => (
                                <Nav.Link
                                    key={item.path}
                                    onClick={() => manejarNavegacion(item.path)}
                                >
                                    <i className={`bi ${item.icon} fs-5`}></i>
                                    <span className="ms-2 d-none d-lg-inline">
                                        {item.label}
                                    </span>
                                </Nav.Link>
                            ))}

                            {/* DARK MODE */}
                            <Nav.Link onClick={toggleDarkMode}>
                                <i
                                    className={`bi ${
                                        isDarkMode ? "bi-sun" : "bi-moon"
                                    } fs-5`}
                                ></i>
                                <span className="ms-2 d-none d-lg-inline">
                                    {isDarkMode ? "Claro" : "Oscuro"}
                                </span>
                            </Nav.Link>

                            {/* LOGOUT */}
                            <Nav.Link
                                onClick={cerrarSesion}
                                className="text-danger"
                            >
                                <i className="bi bi-box-arrow-right fs-5"></i>
                                <span className="ms-2 d-none d-lg-inline">
                                    Salir
                                </span>
                            </Nav.Link>

                        </Nav>
                    </Navbar.Collapse>

                    {/* 🔥 OFFCANVAS SOLO MÓVIL */}
                    <Navbar.Offcanvas
                        id="offcanvas-main"
                        placement="end"
                        className="d-sm-none"
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>
                                {NOMBRE_MARCA}
                            </Offcanvas.Title>
                        </Offcanvas.Header>

                        <Offcanvas.Body>
                            <Nav className="flex-column">

                                {rutas.map((item) => (
                                    <Nav.Link
                                        key={item.path}
                                        onClick={() =>
                                            manejarNavegacion(item.path)
                                        }
                                    >
                                        <i
                                            className={`bi ${item.icon} me-3`}
                                        ></i>
                                        {item.label}
                                    </Nav.Link>
                                ))}

                                <Nav.Link onClick={toggleDarkMode}>
                                    <i
                                        className={`bi ${
                                            isDarkMode ? "bi-sun" : "bi-moon"
                                        } me-3`}
                                    ></i>
                                    {isDarkMode
                                        ? "Modo Claro"
                                        : "Modo Oscuro"}
                                </Nav.Link>

                                <Nav.Link
                                    onClick={cerrarSesion}
                                    className="text-danger mt-3"
                                >
                                    <i className="bi bi-box-arrow-right me-3"></i>
                                    Cerrar sesión
                                </Nav.Link>

                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>

                </Container>
            </Navbar>
        </>
    );
};

export default NavbarModaExpress;
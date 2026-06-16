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

  // Get user data from localStorage for role check
  const userData = JSON.parse(localStorage.getItem("usuario-supabase") || "{}");
  const isAdmin = userData.rol === "admin";

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

  const rutasPrincipales = [
    { path: "/", label: "Inicio", icon: "bi-grid-1x2" },
    { path: "/dashboard", label: "Estadísticas", icon: "bi-bar-chart" },
    { path: "/asistencias", label: "Asistencia", icon: "bi-calendar-check" },
  ];

  const rutasGestion = [
    { path: "/empleados", label: "Personal", icon: "bi-people", adminOnly: false },
    { path: "/catalogo", label: "Catálogo", icon: "bi-journal-bookmark", adminOnly: false },
    { path: "/incidencias", label: "Incidencias", icon: "bi-exclamation-circle", adminOnly: false },
    { path: "/turnos", label: "Turnos", icon: "bi-clock", adminOnly: false },
    { path: "/usuarios", label: "Usuarios", icon: "bi-person-gear", adminOnly: true },
  ];

  if (location.pathname === "/login") return null;

  return (
    <>
      <MascotaChibi />
      <Navbar expand="lg" fixed="top" className="glass-nav py-2" style={{ zIndex: 1030 }}>
        <Container className="d-flex justify-content-between align-items-center">
          {/* Logo y Marca */}
          <Navbar.Brand onClick={() => manejarNavegacion("/")} className="d-flex align-items-center gap-2 me-4" style={{ cursor: 'pointer' }}>
            <img src={logo} alt="logo" width="36" height="36" className="rounded-circle border border-2 border-primary border-opacity-25" />
            <span className="fw-bold fs-5 text-gradient" style={{ background: 'linear-gradient(45deg, var(--text-main), #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {NOMBRE_MARCA}
            </span>
          </Navbar.Brand>

          {/* NAVEGACIÓN ESCRITORIO */}
          <div className="d-none d-lg-flex flex-grow-1 align-items-center">
            <Nav className="me-auto gap-1">
              {rutasPrincipales.map((item) => (
                <Nav.Link key={item.path} onClick={() => manejarNavegacion(item.path)} className={`px-3 py-2 rounded-pill small fw-medium transition-all d-flex align-items-center ${location.pathname === item.path ? 'bg-primary bg-opacity-10 text-primary' : 'text-muted hover:bg-light'}`}>
                  <i className={`bi ${item.icon} me-2`}></i>
                  <span>{item.label}</span>
                </Nav.Link>
              ))}
              {/* Dropdown de Gestión */}
              {isAdmin && (
                <NavDropdown title={<i className="bi bi-layers me-2"></i>Gestión} id="nav-gestion-dropdown" className="px-2 small fw-medium text-muted rounded-pill hover:bg-light transition-all">
                  {rutasGestion.map((item) => (
                    <NavDropdown.Item key={item.path} onClick={() => manejarNavegacion(item.path)} className={`d-flex align-items-center gap-2 py-2 ${location.pathname === item.path ? 'text-primary fw-bold' : ''}`}>
                      <i className={`bi ${item.icon}`}></i> {item.label}
                    </NavDropdown.Item>
                  ))}
              )}
            </NavDropdown>
            {/* Mostrar Usuarios solo para admin */}
            {isAdmin && (
              <NavDropdown title={<i className="bi bi-person-gear fs-5 text-muted hover:text-primary transition-all"></i>Usuarios} id="nav-usuarios-dropdown" className="px-2 small fw-medium text-muted rounded-pill hover:bg-light transition-all">
                <NavDropdown.Item key="usuarios" onClick={() => manejarNavegacion('/usuarios')} className="d-flex align-items-center gap-2 py-2">
                  <i className="bi bi-person-gear"></i> Usuarios
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </div>

          {/* ACCIONES Y AJUSTES */}
          <div className="d-none d-lg-flex align-items-center gap-2">
            <NavDropdown align="end" title={<i className="bi bi-gear fs-5 text-muted hover:text-primary transition-all"></i>} id="nav-settings-dropdown" className="no-caret-dropdown">
              <NavDropdown.Header className="small text-uppercase fw-bold opacity-50">Herramientas</NavDropdown.Header>
              <NavDropdown.Item onClick={() => setMostrarChatIA(true)} className="d-flex align-items-center gap-2 py-2">
                <i className="bi bi-robot text-primary"></i> Asistente IA
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Header className="small text-uppercase fw-bold opacity-50">Preferencias</NavDropdown.Header>
              <NavDropdown.Item onClick={toggleDarkMode} className="d-flex align-items-center gap-2 py-2">
                <i className={`bi ${isDarkMode ? "bi-sun text-warning" : "bi-moon text-info"}`}></i>
                Modo {isDarkMode ? "Claro" : "Oscuro"}
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={cerrarSesion} className="d-flex align-items-center gap-2 py-2 text-danger">
                <i className="bi bi-box-arrow-right"></i>
                Cerrar Sesión
              </NavDropdown.Item>
            </NavDropdown>
          </div>

          {/* BOTÓN MENÚ MÓVIL */}
          <Button variant="link" className="d-lg-none p-2 text-muted hover:text-primary transition-all border-0" onClick={() => setMenuAbierto(true)} aria-label="Abrir menú">
            <i className="bi bi-list fs-3"></i>
          </Button>
        </Container>
      </Navbar>

      <Offcanvas show={menuAbierto} onHide={() => setMenuAbierto(false)} placement="end" className="d-lg-none" style={{ background: "var(--bg-card)", color: "var(--text-main)" }}>
        <Offcanvas.Header closeButton className="border-bottom border-opacity-10">
          <Offcanvas.Title className="d-flex align-items-center gap-2">
            <img src={logo} alt="logo" width="30" height="30" className="rounded-circle" />
            <span className="fw-bold text-gradient" style={{ background: 'linear-gradient(45deg, var(--text-main), #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {NOMBRE_MARCA}
            </span>
          </Offcanvas.Header>
          <Offcanvas.Body className="d-flex flex-column">
            <Nav className="flex-column gap-1">
              <div className="text-uppercase x-small fw-bold text-muted mb-2 px-2 mt-2" style={{ letterSpacing: "1px", fontSize: '0.7rem' }}>
                Navegación Principal
              </div>
              {[...rutasPrincipales, ...rutasGestion].map((item) => (
                <Nav.Link key={item.path} onClick={() => manejarNavegacion(item.path)} className={`px-3 py-2.5 rounded-3 small fw-medium transition-all d-flex align-items-center gap-3 ${location.pathname === item.path ? 'bg-primary bg-opacity-10 text-primary' : 'text-muted hover:bg-light'}`}>
                  <i className={`bi ${item.icon} fs-5`}></i>
                  <span>{item.label}</span>
                </Nav.Link>
              ))}
            </div>
            <div className="mt-auto pt-4 border-top border-opacity-10">
              <Button variant="light" className="w-100 mb-2 py-2.5 rounded-3 d-flex align-items-center justify-content-start gap-3 bg-premium-light border-0 text-premium-main" onClick={() => { setMenuAbierto(false); setMostrarChatIA(true); }}>
                <i className="bi bi-robot fs-5 text-primary"></i>
                <span className="small fw-semibold">Asistente IA</span>
              </Button>
              <Button variant="light" className="w-100 mb-3 py-2.5 rounded-3 d-flex align-items-center justify-content-start gap-3 bg-premium-light border-0 text-premium-main" onClick={toggleDarkMode}>
                <i className={`bi ${isDarkMode ? "bi-sun" : "bi-moon"} fs-5 text-warning`}></i>
                <span className="small fw-semibold">Modo {isDarkMode ? "Claro" : "Oscuro"}</span>
              </Button>
              <Button variant="danger" className="w-100 py-2.5 rounded-3 d-flex align-items-center justify-content-center gap-2 fw-bold" onClick={cerrarSesion}>
                <i className="bi bi-box-arrow-right fs-5"></i>
                <span>Cerrar Sesión</span>
              </Button>
            </div>
        </Offcanvas.Body>
      </Offcanvas.Body>
    </Offcanvas>
      <ChatIA mostrar={mostrarChatIA} onCerrar={() => setMostrarChatIA(false)} />
    </>
  );
};

export default NavbarModaExpress;
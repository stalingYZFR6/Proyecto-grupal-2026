import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";
import logo from "../../assets/logo.jpg";
import { supabase } from "../../database/supabaseconfig";
import "bootstrap-icons/font/bootstrap-icons.css";
import ChatIA from "../ia/ChatIA";
import MascotaChibi from "../MascotaChibi";

const NavbarAssisTech = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mostrarChatIA, setMostrarChatIA] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [dropdownConfiguracion, setDropdownConfiguracion] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const NOMBRE_MARCA = "AssisTech";

  // Toggle de tema
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
    document.documentElement.setAttribute("data-bs-theme", newMode ? "dark" : "light");
  };

  // Inicializar tema
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    const shouldBeDark = savedMode !== null ? savedMode === "true" : true;
    setIsDarkMode(shouldBeDark);
    document.documentElement.setAttribute("data-bs-theme", shouldBeDark ? "dark" : "light");
  }, []);

  // Control de teclado (Escape)
  const manejarTeclaEscape = useCallback((evento) => {
    if (evento.key === "Escape") {
      setMenuAbierto(false);
      setDropdownConfiguracion(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", manejarTeclaEscape);
    return () => window.removeEventListener("keydown", manejarTeclaEscape);
  }, [manejarTeclaEscape]);

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-config')) {
        setDropdownConfiguracion(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const manejarNavegacion = (ruta) => {
    navigate(ruta);
    setMenuAbierto(false);
    setDropdownConfiguracion(false);
  };

  const cerrarSesion = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("usuario-supabase");
      setMenuAbierto(false);
      setDropdownConfiguracion(false);
      navigate("/login");
    } catch (err) {
      console.error("Error cerrando sesión:", err.message);
    }
  };

  // Enlaces principales (operativos)
  const rutasPrincipales = [
    { path: "/dashboard", label: "Estadísticas", icon: "bi-bar-chart" },
    { path: "/empleados", label: "Personal", icon: "bi-people" },
    { path: "/incidencias", label: "Incidencias", icon: "bi-exclamation-circle" },
    { path: "/asistencias", label: "Asistencia", icon: "bi-calendar-check" },
    { path: "/turnos", label: "Turnos", icon: "bi-clock" },
  ];

  // Enlaces administrativos (en dropdown)
  const rutasAdministrativas = [
    { path: "/catalogo", label: "Catálogo", icon: "bi-journal-bookmark" },
    { path: "/usuarios", label: "Usuarios", icon: "bi-person-gear" },
  ];

  if (location.pathname === "/login") return null;

  return (
    <>
      <MascotaChibi />
      <nav className="fixed top-0 left-0 right-0 z-[1030] flex justify-between items-center h-16 px-4 shadow-lg backdrop-blur-sm bg-[#0f172a]/95 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div 
            onClick={() => manejarNavegacion("/")} 
            className="flex items-center gap-2 cursor-pointer"
          >
            <img src={logo} alt="logo" width="32" height="32" className="rounded-full border-2 border-slate-600" />
            <span className="font-bold text-lg text-white tracking-tight">
              {NOMBRE_MARCA}
            </span>
          </div>

          {/* Enlaces principales - Escritorio */}
          <div className="hidden lg:flex items-center gap-1">
            {rutasPrincipales.map((item) => (
              <button
                key={item.path}
                onClick={() => manejarNavegacion(item.path)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  location.pathname === item.path
                    ? 'bg-sky-500/20 text-sky-400'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <i className={`bi ${item.icon} text-base`}></i>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Acciones - Escritorio */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Botón de chat IA */}
          <button
            onClick={() => setMostrarChatIA(true)}
            className="p-2 text-slate-400 hover:text-sky-400 hover:bg-slate-800/50 rounded-lg transition-all duration-200"
            title="Asistente IA"
          >
            <i className="bi bi-robot text-xl"></i>
          </button>

          {/* Toggle de tema */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-slate-400 hover:text-yellow-400 hover:bg-slate-800/50 rounded-lg transition-all duration-200"
            title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            <i className={`bi ${isDarkMode ? "bi-sun" : "bi-moon"} text-xl`}></i>
          </button>

          {/* Botón de configuración (Dropdown) */}
          <div className="relative dropdown-config">
            <button
              onClick={() => setDropdownConfiguracion(!dropdownConfiguracion)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
              title="Configuración"
            >
              <i className="bi bi-gear text-xl"></i>
            </button>

            {/* Dropdown */}
            {dropdownConfiguracion && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-850 border border-slate-700 rounded-lg shadow-xl py-1 z-[1031]">
                {rutasAdministrativas.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => manejarNavegacion(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'bg-sky-500/20 text-sky-400'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <i className={`bi ${item.icon}`}></i>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Separador */}
          <div className="w-px h-6 bg-slate-700 mx-2"></div>

          {/* Botón de salir */}
          <button
            onClick={cerrarSesion}
            className="flex items-center gap-2 px-3 py-1.5 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-all duration-200 text-sm font-medium"
            title="Cerrar sesión"
          >
            <i className="bi bi-box-arrow-right text-lg"></i>
            <span className="hidden xl:inline">Salir</span>
          </button>
        </div>

        {/* Botón menú móvil */}
        <button
          className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
          onClick={() => setMenuAbierto(true)}
          aria-label="Abrir menú"
        >
          <i className="bi bi-three-dots-vertical text-xl"></i>
        </button>
      </nav>

      {/* Panel móvil */}
      <div className={`lg:hidden fixed top-0 right-0 w-full h-screen bg-black/50 z-[1029] transition-opacity duration-300 ${menuAbierto ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setMenuAbierto(false)}>
        <div className={`absolute top-0 right-0 w-80 max-w-[85vw] h-screen bg-[#0f172a] shadow-2xl border-l border-slate-700 transform transition-transform duration-300 ${menuAbierto ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={logo} alt="logo" width="28" height="28" className="rounded-full" />
                <span className="font-bold text-white">{NOMBRE_MARCA}</span>
              </div>
              <button onClick={() => setMenuAbierto(false)} className="p-2 text-slate-400 hover:text-white">
                <i className="bi bi-x text-xl"></i>
              </button>
            </div>
          </div>

          <div className="p-4 space-y-2">
            {/* Enlaces principales */}
            <div className="mb-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Navegación</p>
              {rutasPrincipales.map((item) => (
                <button
                  key={item.path}
                  onClick={() => manejarNavegacion(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-sky-500/20 text-sky-400'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <i className={`bi ${item.icon} text-lg`}></i>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Enlaces administrativos */}
            <div className="mb-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Administración</p>
              {rutasAdministrativas.map((item) => (
                <button
                  key={item.path}
                  onClick={() => manejarNavegacion(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-sky-500/20 text-sky-400'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <i className={`bi ${item.icon} text-lg`}></i>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Acciones */}
            <div className="border-t border-slate-700 pt-4">
              <div className="flex gap-2">
                <button
                  onClick={() => { setMenuAbierto(false); setMostrarChatIA(true); }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                >
                  <i className="bi bi-robot"></i>
                  <span className="text-sm">IA</span>
                </button>
                
                <button
                  onClick={toggleDarkMode}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                >
                  <i className={`bi ${isDarkMode ? 'bi-sun' : 'bi-moon'}`}></i>
                  <span className="text-sm">{isDarkMode ? 'Claro' : 'Oscuro'}</span>
                </button>
              </div>

              <button
                onClick={cerrarSesion}
                className="w-full flex items-center justify-center gap-2 mt-4 px-3 py-2.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-200"
              >
                <i className="bi bi-box-arrow-right"></i>
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ChatIA mostrar={mostrarChatIA} onCerrar={() => setMostrarChatIA(false)} />
    </div>
  );
};

export default NavbarAssisTech;
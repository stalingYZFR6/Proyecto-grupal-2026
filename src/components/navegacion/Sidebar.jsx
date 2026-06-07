import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../database/supabaseconfig";
import logo from "../../assets/logo.jpg";

const Sidebar = () => {
    const navigate = useNavigate();

    const cerrarSesion = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem("usuario-supabase");
        navigate("/login");
    };

    const menuItems = [
        { path: "/", label: "Dashboard", icon: "bi-grid-1x2-fill" },
        { path: "/dashboard", label: "Estadísticas", icon: "bi-bar-chart-line-fill" },
        { path: "/empleados", label: "Colaboradores", icon: "bi-people-fill" },
        { path: "/asistencias", label: "Asistencia", icon: "bi-calendar-check-fill" },
        { path: "/incidencias", label: "Incidencias", icon: "bi-exclamation-diamond-fill" },
        { path: "/turnos", label: "Horarios", icon: "bi-clock-fill" },
    ];

    return (
        <div className="sidebar d-none d-lg-flex">
            <div className="d-flex align-items-center gap-3 mb-5 px-2">
                <img src={logo} alt="logo" width="40" height="40" className="rounded-3 shadow-sm" />
                <div className="lh-1">
                    <h5 className="fw-bold mb-0 text-white">AssisTech</h5>
                    <small className="text-white-50">Enterprise Pro</small>
                </div>
            </div>

            <nav className="flex-grow-1">
                {menuItems.map((item) => (
                    <NavLink 
                        key={item.path} 
                        to={item.path} 
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <i className={`bi ${item.icon}`}></i>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto pt-4 border-top border-white border-opacity-10">
                <button 
                    onClick={cerrarSesion}
                    className="sidebar-link w-100 border-0 bg-transparent text-danger"
                >
                    <i className="bi bi-box-arrow-left"></i>
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
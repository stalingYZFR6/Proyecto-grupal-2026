import { supabase } from "../database/supabaseconfig";

export const obtenerUsuarioSesion = () => {
    const sesion = localStorage.getItem("usuario-sesion");
    return sesion ? JSON.parse(sesion) : null;
};

export const esAdmin = () => {
    const usuario = obtenerUsuarioSesion();
    return usuario?.rol === 'administrador';
};

export const cerrarSesionApp = async (navigate) => {
    await supabase.auth.signOut();
    localStorage.removeItem("usuario-supabase");
    localStorage.removeItem("usuario-sesion");
    navigate("/login");
};
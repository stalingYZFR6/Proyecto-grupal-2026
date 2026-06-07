import { supabase } from "../database/supabaseconfig";

/**
 * Obtiene los datos del usuario guardados en localStorage
 */
export const obtenerUsuario = () => {
    const data = localStorage.getItem("usuario-data");
    return data ? JSON.parse(data) : null;
};

/**
 * Verifica si el usuario actual es administrador
 */
export const esAdmin = () => {
    const usuario = obtenerUsuario();
    return usuario?.rol === 'administrador';
};

/**
 * Cierra la sesión del usuario
 */
export const cerrarSesion = async (navigate) => {
    try {
        await supabase.auth.signOut();
        localStorage.removeItem("usuario-supabase");
        localStorage.removeItem("usuario-data");
        if (navigate) navigate("/login");
    } catch (err) {
        console.error("Error al cerrar sesión:", err);
    }
};
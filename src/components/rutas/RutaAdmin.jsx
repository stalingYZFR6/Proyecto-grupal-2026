import React from "react";
import { Navigate } from "react-router-dom";
import { esAdmin, obtenerUsuario } from "../../utils/auth";

const RutaAdmin = ({ children }) => {
    const usuario = obtenerUsuario();
    const autorizado = esAdmin();

    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    if (!autorizado) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RutaAdmin;
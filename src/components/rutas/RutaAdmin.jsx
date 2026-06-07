import React from "react";
import { Navigate } from "react-router-dom";
import { esAdmin } from "../../utils/auth";

const RutaAdmin = ({ children }) => {
    const admin = esAdmin();
    
    if (!admin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RutaAdmin;
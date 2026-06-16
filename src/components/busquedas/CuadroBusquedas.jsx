import React from "react";
import { Form } from "react-bootstrap";

const CuadroBusquedas = ({ textoBusqueda, manejarCambioBusqueda }) => {
    return (
        <div className="search-container">
            <i className="bi bi-search search-icon"></i>
            <Form.Control
                type="text"
                placeholder="Buscar usuario..."
                className="search-input"
                value={textoBusqueda}
                onChange={manejarCambioBusqueda}
            />
        </div>
    );
};

export default CuadroBusquedas;
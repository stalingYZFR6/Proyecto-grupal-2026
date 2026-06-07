import React from "react";
import { Card, Badge, Button } from "react-bootstrap";

const TarjetaIncidencia = ({ incidencia, abrirModalEdicion, abrirModalEliminacion }) => {
    const obtenerColor = (tipo) => {
        const valor = tipo?.toLowerCase();
        if (valor.includes("retraso") || valor.includes("tardanza")) return "warning";
        if (valor.includes("falta") || valor.includes("ausencia")) return "danger";
        if (valor.includes("permiso")) return "info";
        return "secondary";
    };

    return (
        <Card className="premium-card h-100 border-0">
            <Card.Body className="p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <Badge bg={obtenerColor(incidencia.tipo_incidencia)} className="bg-opacity-10 text-capitalize px-3 py-2 rounded-pill mb-2" style={{ color: `var(--bs-${obtenerColor(incidencia.tipo_incidencia)})` }}>
                            {incidencia.tipo_incidencia}
                        </Badge>
                        <h5 className="fw-bold mb-0">{incidencia.tipo_incidencia}</h5>
                    </div>
                    <div className="bg-light p-2 rounded-3">
                        <i className="bi bi-exclamation-circle text-muted"></i>
                    </div>
                </div>

                <div className="mb-4 flex-grow-1">
                    <p className="text-muted small mb-0 line-clamp-3">
                        {incidencia.descripcion || "Sin descripción detallada."}
                    </p>
                </div>

                <div className="d-flex align-items-center gap-2 mb-4 text-muted small">
                    <i className="bi bi-calendar3"></i>
                    <span className="fw-medium">{incidencia.fecha_incidencia}</span>
                </div>

                <div className="d-flex gap-2 mt-auto">
                    <Button 
                        variant="link" 
                        className="w-100 text-decoration-none text-muted hover:text-primary p-2 bg-light rounded-3 transition-all"
                        onClick={() => abrirModalEdicion(incidencia)}
                    >
                        <i className="bi bi-pencil-square me-2"></i>
                        Editar
                    </Button>
                    <Button 
                        variant="link" 
                        className="w-100 text-decoration-none text-muted hover:text-danger p-2 bg-light rounded-3 transition-all"
                        onClick={() => abrirModalEliminacion(incidencia)}
                    >
                        <i className="bi bi-trash3 me-2"></i>
                        Eliminar
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default TarjetaIncidencia;
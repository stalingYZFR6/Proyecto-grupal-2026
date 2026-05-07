import React from "react";
import { Card, Badge, Button } from "react-bootstrap";

const TarjetaIncidencia = ({
    incidencia,
    abrirModalEdicion,
    abrirModalEliminacion,
}) => {

    // Color dinámico según tipo
    const obtenerColor = (tipo) => {
        const valor = tipo?.toLowerCase();

        if (valor.includes("retraso")) return "warning";
        if (valor.includes("falta")) return "danger";
        if (valor.includes("permiso")) return "info";
        if (valor.includes("accidente")) return "dark";

        return "secondary";
    };

    return (
        <Card className="shadow-sm border-0 rounded-4 h-100">
            <Card.Body className="d-flex flex-column">

                {/* Header */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h5 className="fw-bold mb-1">
                            {incidencia.tipo_incidencia}
                        </h5>

                        <Badge bg={obtenerColor(incidencia.tipo_incidencia)}>
                            {incidencia.tipo_incidencia}
                        </Badge>
                    </div>

                    <div className="bg-warning bg-opacity-10 p-2 rounded-circle">
                        <i className="bi bi-exclamation-triangle-fill text-warning"></i>
                    </div>
                </div>

                {/* Descripción */}
                <div className="mb-3 flex-grow-1">
                    <small className="text-muted d-block mb-1">
                        Descripción
                    </small>

                    <p className="mb-0">
                        {incidencia.descripcion || "Sin descripción"}
                    </p>
                </div>

                {/* Fecha */}
                <div className="mb-4">
                    <small className="text-muted d-block mb-1">
                        Fecha de incidencia
                    </small>

                    <span className="fw-semibold">
                        {incidencia.fecha_incidencia}
                    </span>
                </div>

                {/* Botones */}
                <div className="d-flex gap-2 mt-auto">
                    <Button
                        variant="outline-primary"
                        className="w-100 rounded-pill"
                        onClick={() => abrirModalEdicion(incidencia)}
                    >
                        <i className="bi bi-pencil-square me-2"></i>
                        Editar
                    </Button>

                    <Button
                        variant="outline-danger"
                        className="w-100 rounded-pill"
                        onClick={() => abrirModalEliminacion(incidencia)}
                    >
                        <i className="bi bi-trash me-2"></i>
                        Eliminar
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default TarjetaIncidencia;
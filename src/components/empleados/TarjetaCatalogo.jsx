import React from "react";
import { Card, Badge } from "react-bootstrap";
import ImagenEmpleado from "./ImagenEmpleado";

const TarjetaCatalogo = ({ empleado }) => {
    return (
        <Card className="premium-card h-100 overflow-hidden border-0 shadow-sm">
            {/* Imagen Superior */}
            <div className="position-relative" style={{ height: "220px", overflow: "hidden" }}>
                <ImagenEmpleado
                    src={empleado.url_imagen}
                    className="w-100 h-100 transition-all hover-zoom"
                    style={{ objectFit: "cover" }}
                    alt={`${empleado.nombre} ${empleado.apellido}`}
                />
                <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-gradient-dark text-white">
                    <Badge bg="primary" className="rounded-pill px-3 py-1 shadow-sm">
                        ID: #{empleado.id_empleado}
                    </Badge>
                </div>
            </div>

            <Card.Body className="p-4">
                <h5 className="fw-bold mb-1 text-premium-main">
                    {empleado.nombre} {empleado.apellido}
                </h5>
                <p className="text-muted small mb-3">
                    <i className="bi bi-card-text me-2"></i>
                    {empleado.cedula}
                </p>

                <hr className="my-3 opacity-10" />

                <div className="space-y-2">
                    <div className="d-flex align-items-center gap-2 text-premium-muted small mb-2">
                        <i className="bi bi-envelope text-primary"></i>
                        <span className="text-truncate">{empleado.correo || "Sin correo"}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-premium-muted small">
                        <i className="bi bi-telephone text-primary"></i>
                        <span>{empleado.telefono || "Sin teléfono"}</span>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default TarjetaCatalogo;
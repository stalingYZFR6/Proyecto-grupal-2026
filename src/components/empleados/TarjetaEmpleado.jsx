import React from "react";
import { Card, Button } from "react-bootstrap";

const TarjetaEmpleado = ({ empleados, abrirModalEdicion, abrirModalEliminacion }) => {
    return (
        <>
            {empleados.map((emp) => (
                <Card key={emp.id_empleado} className="mb-3 shadow-sm border-0 rounded-4">
                    <Card.Body>
                        <h5 className="fw-bold mb-1">
                            {emp.nombre} {emp.apellido}
                        </h5>

                        <p className="mb-1"><strong>Cédula:</strong> {emp.cedula}</p>
                        <p className="mb-1"><strong>Correo:</strong> {emp.correo || "—"}</p>
                        <p className="mb-1"><strong>Teléfono:</strong> {emp.telefono || "—"}</p>

                        <div className="d-flex gap-2 mt-3">
                            <Button
                                size="sm"
                                variant="warning"
                                onClick={() => abrirModalEdicion(emp)}
                            >
                                <i className="bi bi-pencil"></i>
                            </Button>

                            <Button
                                size="sm"
                                variant="danger"
                                onClick={() => abrirModalEliminacion(emp)}
                            >
                                <i className="bi bi-trash"></i>
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            ))}
        </>
    );
};

export default TarjetaEmpleado;
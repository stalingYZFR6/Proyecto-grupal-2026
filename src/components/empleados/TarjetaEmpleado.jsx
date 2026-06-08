import React from "react";
import { Card, Button, Image, Badge } from "react-bootstrap";

const TarjetaEmpleado = ({ empleados, abrirModalEdicion, abrirModalEliminacion }) => {
    return (
        <div className="row g-4">
            {empleados.map((emp) => (
                <div key={emp.id_empleado} className="col-12 col-md-6 col-xl-4">
                    <Card className="premium-card h-100 overflow-hidden">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-start justify-content-between mb-4">
                                <div className="d-flex align-items-center gap-3">
                                    <Image
                                        src={emp.url_imagen || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                        roundedCircle
                                        width={64}
                                        height={64}
                                        className="border border-3 border-white shadow-sm object-fit-cover"
                                    />
                                    <div>
                                        <h5 className="fw-bold mb-0 text-truncate text-premium-main" style={{ maxWidth: '180px' }}>
                                            {emp.nombre} {emp.apellido}
                                        </h5>
                                        <Badge bg="primary" className="bg-opacity-10 text-primary border-0 rounded-pill px-2 py-1 small mt-1">
                                            ID: #{emp.id_empleado}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="d-flex gap-1">
                                    <Button 
                                        variant="link" 
                                        className="p-2 text-premium-muted hover:text-warning transition-all"
                                        onClick={() => abrirModalEdicion(emp)}
                                    >
                                        <i className="bi bi-pencil-square fs-5"></i>
                                    </Button>
                                    <Button 
                                        variant="link" 
                                        className="p-2 text-premium-muted hover:text-danger transition-all"
                                        onClick={() => abrirModalEliminacion(emp)}
                                    >
                                        <i className="bi bi-trash3 fs-5"></i>
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="d-flex align-items-center gap-3 text-premium-muted mb-2">
                                    <div className="bg-premium-light rounded-3 p-2"><i className="bi bi-card-text"></i></div>
                                    <span className="small fw-medium">{emp.cedula}</span>
                                </div>
                                <div className="d-flex align-items-center gap-3 text-premium-muted mb-2">
                                    <div className="bg-premium-light rounded-3 p-2"><i className="bi bi-envelope"></i></div>
                                    <span className="small text-truncate">{emp.correo || "Sin correo"}</span>
                                </div>
                                <div className="d-flex align-items-center gap-3 text-premium-muted">
                                    <div className="bg-premium-light rounded-3 p-2"><i className="bi bi-telephone"></i></div>
                                    <span className="small">{emp.telefono || "Sin teléfono"}</span>
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Footer className="bg-transparent border-0 p-4 pt-0">
                            <Button variant="outline-primary" className="w-100 rounded-3 py-2 small fw-bold border-2">
                                Ver Expediente Completo
                            </Button>
                        </Card.Footer>
                    </Card>
                </div>
            ))}
        </div>
    );
};

export default TarjetaEmpleado;
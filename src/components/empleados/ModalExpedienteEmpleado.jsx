import React, { useEffect, useState } from "react";
import { Modal, Table, Badge, Spinner, Alert, Button } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const ModalExpedienteEmpleado = ({ show, handleClose, empleado }) => {
    const [asistencias, setAsistencias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (show && empleado?.id_empleado) {
            obtenerHistorial();
        }
    }, [show, empleado]);

    const obtenerHistorial = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: dbError } = await supabase
                .from("asistencias")
                .select(`
                    id_asistencia,
                    hora_entrada,
                    hora_salida,
                    horas_trabajadas,
                    estado_asistencia,
                    estado_salida,
                    jornadas_asistencia (fecha),
                    turnos (tipo_turno)
                `)
                .eq("id_empleado", empleado.id_empleado)
                .order("hora_entrada", { ascending: false });

            if (dbError) throw dbError;
            setAsistencias(data || []);
        } catch (err) {
            console.error("Error al obtener historial:", err);
            setError("No se pudo cargar el historial de asistencias.");
        } finally {
            setLoading(false);
        }
    };

    const formatearHora = (fechaISO) => {
        if (!fechaISO) return "---";
        return new Date(fechaISO).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const obtenerColorEstado = (estado) => {
        switch (estado) {
            case "Presente": return "success";
            case "Tardanza": return "warning";
            case "Ausente": return "danger";
            case "Permiso": return "info";
            default: return "secondary";
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="xl" centered scrollable>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>
                    <i className="bi bi-file-earmark-person me-2"></i>
                    Expediente de Asistencia: {empleado?.nombre} {empleado?.apellido}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2 text-muted">Consultando historial...</p>
                    </div>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : asistencias.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <i className="bi bi-calendar-x display-4 mb-3"></i>
                        <h5>Sin registros de asistencia</h5>
                        <p>Este empleado aún no tiene asistencias registradas en el sistema.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <Table hover className="align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Fecha</th>
                                    <th>Turno</th>
                                    <th>Entrada</th>
                                    <th>Salida</th>
                                    <th>Horas</th>
                                    <th>Estado</th>
                                    <th>Resultado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {asistencias.map((reg) => (
                                    <tr key={reg.id_asistencia}>
                                        <td className="fw-bold">{reg.jornadas_asistencia?.fecha || "---"}</td>
                                        <td>
                                            <Badge bg="light" className="text-dark border">
                                                {reg.turnos?.tipo_turno || "N/A"}
                                            </Badge>
                                        </td>
                                        <td className="text-success fw-medium">
                                            {formatearHora(reg.hora_entrada)}
                                        </td>
                                        <td className="text-danger fw-medium">
                                            {formatearHora(reg.hora_salida)}
                                        </td>
                                        <td>
                                            {reg.horas_trabajadas ? (
                                                <span className="fw-bold">{Number(reg.horas_trabajadas).toFixed(2)}h</span>
                                            ) : "---"}
                                        </td>
                                        <td>
                                            <Badge bg={obtenerColorEstado(reg.estado_asistencia)}>
                                                {reg.estado_asistencia}
                                            </Badge>
                                        </td>
                                        <td>
                                            <small className="text-muted text-capitalize">
                                                {reg.estado_salida?.replace(/_/g, " ") || "En curso"}
                                            </small>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar Expediente
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalExpedienteEmpleado;
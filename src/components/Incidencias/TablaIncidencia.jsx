import React, { useState, useEffect } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaIncidencias = ({
    incidencias,
    abrirModalEdicion,
    abrirModalEliminacion
}) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (incidencias && incidencias.length > 0) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [incidencias]);

    return (
        <>
            {loading ? (
                <div className="text-center py-4">
                    <h4>Cargando incidencias...</h4>
                    <Spinner animation="border" variant="primary" role="status" />
                </div>
            ) : incidencias.length === 0 ? (
                <div className="text-center py-5 text-muted">
                    <i className="bi bi-exclamation-triangle display-1 mb-3"></i>
                    <h5>No hay incidencias registradas</h5>
                    <p>Agrega una nueva incidencia usando el botón superior.</p>
                </div>
            ) : (
                <Table striped bordered hover responsive size="sm">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Tipo de Incidencia</th>
                            <th className="d-none d-md-table-cell">Descripción</th>
                            <th>Fecha</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incidencias.map((incidencia) => (
                            <tr key={incidencia.id_incidencia}>
                                <td>{incidencia.id_incidencia}</td>
                                <td>
                                    <strong>{incidencia.tipo_incidencia}</strong>
                                </td>
                                <td
                                    className="d-none d-md-table-cell text-truncate"
                                    style={{ maxWidth: "250px" }}
                                >
                                    {incidencia.descripcion || (
                                        <span className="text-muted">—</span>
                                    )}
                                </td>
                                <td>
                                    {incidencia.fecha_incidencia || (
                                        <span className="text-muted">—</span>
                                    )}
                                </td>
                                <td className="text-center">
                                    <Button
                                        variant="outline-warning"
                                        size="sm"
                                        className="m-1"
                                        onClick={() => abrirModalEdicion(incidencia)}
                                        title="Editar incidencia"
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        className="m-1"
                                        onClick={() => abrirModalEliminacion(incidencia)}
                                        title="Eliminar incidencia"
                                    >
                                        <i className="bi bi-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    );
};

export default TablaIncidencias;
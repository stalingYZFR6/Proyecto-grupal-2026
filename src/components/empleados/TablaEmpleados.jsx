import React, { useState, useEffect } from "react";
import { Table, Spinner, Button, Image } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaEmpleados = ({
    empleados,
    abrirModalEdicion,
    abrirModalEliminacion
}) => {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (empleados) {
            setLoading(false);
        }
    }, [empleados]);

    return (
        <>
            {loading ? (
                <div className="text-center py-4">
                    <h4>Cargando empleados...</h4>

                    <Spinner
                        animation="border"
                        variant="primary"
                        role="status"
                    />
                </div>
            ) : empleados.length === 0 ? (

                <div className="text-center py-5 text-muted">
                    <i className="bi bi-people display-1 mb-3"></i>

                    <h5>No hay empleados registrados</h5>

                    <p>
                        Agrega un nuevo empleado usando el botón superior.
                    </p>
                </div>

            ) : (

                <Table
                    striped
                    bordered
                    hover
                    responsive
                    size="sm"
                    className="align-middle"
                >

                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Foto</th>
                            <th>Nombre Completo</th>
                            <th>Cédula</th>
                            <th className="d-none d-lg-table-cell">
                                Correo
                            </th>

                            <th className="d-none d-md-table-cell">
                                Teléfono
                            </th>

                            <th className="d-none d-xl-table-cell">
                                Dirección
                            </th>

                            <th className="text-center">
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <tbody>

                        {empleados.map((empleado) => (

                            <tr key={empleado.id_empleado}>

                                <td>
                                    {empleado.id_empleado}
                                </td>

                                {/* FOTO */}
                                <td className="text-center">

                                    <Image
                                        src={
                                            empleado.url_imagen &&
                                                !empleado.url_imagen.startsWith("blob:")
                                                ? empleado.url_imagen
                                                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                        }
                                        roundedCircle
                                        width={50}
                                        height={50}
                                        className="border shadow-sm"
                                        style={{
                                            objectFit: "cover"
                                        }}
                                    />

                                </td>

                                <td>
                                    <strong>
                                        {empleado.nombre}{" "}
                                        {empleado.apellido}
                                    </strong>
                                </td>

                                <td>
                                    {empleado.cedula}
                                </td>

                                <td className="d-none d-lg-table-cell">
                                    {empleado.correo || (
                                        <span className="text-muted">
                                            —
                                        </span>
                                    )}
                                </td>

                                <td className="d-none d-md-table-cell">
                                    {empleado.telefono || (
                                        <span className="text-muted">
                                            —
                                        </span>
                                    )}
                                </td>

                                <td
                                    className="d-none d-xl-table-cell text-truncate"
                                    style={{ maxWidth: "200px" }}
                                >
                                    {empleado.direccion || (
                                        <span className="text-muted">
                                            —
                                        </span>
                                    )}
                                </td>

                                <td className="text-center">

                                    <Button
                                        variant="outline-warning"
                                        size="sm"
                                        className="m-1"
                                        onClick={() =>
                                            abrirModalEdicion(empleado)
                                        }
                                        title="Editar empleado"
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </Button>

                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        className="m-1"
                                        onClick={() =>
                                            abrirModalEliminacion(empleado)
                                        }
                                        title="Eliminar empleado"
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

export default TablaEmpleados;
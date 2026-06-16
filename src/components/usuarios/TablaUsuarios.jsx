import React from "react";
import { Table, Spinner, Button, Badge } from "react-bootstrap";

const TablaUsuarios = ({
  usuarios,
  cargando,
  setMostrarModalEditar,
  setMostrarModalEliminar,
  setUsuarioSeleccionado
}) => {
  if (cargando) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Table striped bordered hover responsive className="align-middle text-center">
      <thead className="table-dark">
        <tr>
          <th>ID</th>
          <th>Empleado</th>
          <th>Correo / Login</th>
          <th>Rol Aplicación</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((usuario) => (
          <tr key={usuario.id_usuario}>
            <td>#{usuario.id_usuario}</td>
            <td>
              {usuario.empleado ? (
                <strong>{usuario.empleado.nombre} {usuario.empleado.apellido}</strong>
              ) : (
                <span className="text-muted">Sin empleado</span>
              )}
            </td>
            <td>{usuario.empleado?.correo || usuario.login || "—"}</td>
            <td>
              <Badge bg="info" className="text-capitalize">
                {usuario.rol}
              </Badge>
            </td>
            <td>
              <Badge bg={usuario.activo ? "success" : "danger"}>
                {usuario.activo ? "Activo" : "Inactivo"}
              </Badge>
            </td>
            <td>
              <Button
                variant="outline-warning"
                size="sm"
                className="me-2"
                onClick={() => {
                  setUsuarioSeleccionado(usuario);
                  setMostrarModalEditar(true);
                }}
              >
                <i className="bi bi-pencil"></i> Editar
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => {
                  setUsuarioSeleccionado(usuario);
                  setMostrarModalEliminar(true);
                }}
              >
                <i className="bi bi-trash"></i> Eliminar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TablaUsuarios;
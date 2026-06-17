import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEditarUsuario = ({
  mostrarModal,
  setMostrarModal,
  usuarioSeleccionado,
  rolUsuarioActual,
  guardarCambios,
  empleados
}) => {
  const [usuarioEdit, setUsuarioEdit] = useState({
    id_empleado: "",
    rol: "",
    activo: true
  });
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (usuarioSeleccionado) {
      setUsuarioEdit({
        id_usuario: usuarioSeleccionado.id_usuario,
        id_empleado: usuarioSeleccionado.id_empleado || "",
        rol: usuarioSeleccionado.rol || "",
        activo: usuarioSeleccionado.activo !== false
      });
    }
  }, [usuarioSeleccionado]);

  if (!usuarioSeleccionado) return null;

  const handleGuardar = async () => {
    setEnviando(true);
    await guardarCambios(usuarioEdit);
    setEnviando(false);
  };

  const esEmpleado = rolUsuarioActual === "empleado";

  return (
    <Modal
      backdrop="static"
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-pencil-square me-2"></i>
          Editar Usuario
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {/* Empleado */}
          <Form.Group className="mb-3" controlId="empleado">
            <Form.Label className="fw-semibold">Empleado</Form.Label>
            <Form.Select
              name="id_empleado"
              value={usuarioEdit.id_empleado}
              onChange={(e) =>
                setUsuarioEdit({ ...usuarioEdit, id_empleado: e.target.value })
              }
              disabled={esEmpleado}
              required
            >
              <option value="">Seleccione un empleado</option>
              {empleados?.map((emp) => (
                <option key={emp.id_empleado} value={emp.id_empleado}>
                  {emp.nombre} {emp.apellido}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Rol */}
          <Form.Group className="mb-3" controlId="rol">
            <Form.Label className="fw-semibold">Rol Aplicación</Form.Label>
            <Form.Select
              name="rol"
              value={usuarioEdit.rol || ""}
              onChange={(e) =>
                setUsuarioEdit({ ...usuarioEdit, rol: e.target.value })
              }
              disabled={esEmpleado}
              required
            >
              <option value="">Seleccione un rol</option>
              <option value="admin">Administrador</option>
              <option value="supervisor">Supervisor</option>
              <option value="empleado">Empleado</option>
            </Form.Select>
          </Form.Group>

          {/* Activo */}
          <Form.Group className="mb-3" controlId="activo">
            <Form.Check
              type="switch"
              id="activo-switch"
              label="Usuario Activo"
              checked={usuarioEdit.activo}
              disabled={esEmpleado}
              onChange={(e) =>
                setUsuarioEdit({ ...usuarioEdit, activo: e.target.checked })
              }
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)} disabled={enviando}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleGuardar}
          disabled={
            !usuarioEdit.id_empleado ||
            !usuarioEdit.rol ||
            enviando
          }
        >
          {enviando ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEditarUsuario;
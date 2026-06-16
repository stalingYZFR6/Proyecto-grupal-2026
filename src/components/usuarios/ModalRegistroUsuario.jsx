import React, { useState } from "react";
import { Modal, Form, Button, InputGroup } from "react-bootstrap";

const ModalRegistroUsuario = ({ mostrarModal, setMostrarModal, nuevoUsuario, manejarCambioInput, agregarEmpleado, empleados = [] }) => {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const userData = JSON.parse(localStorage.getItem("usuario-supabase") || "{}");
  const isAdmin = userData.rol === "admin";

  const handleGuardar = async () => {
    if (!isAdmin) {
      Swal.fire("Advertencia", "Solo los administradores pueden registrar nuevos usuarios.", "warning");
      return;
    }
    setEnviando(true);
    await agregarEmpleado();
    setEnviando(false);
  };

  return (
    <Modal backdrop="static" show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title><i className="bi bi-person-plus-fill me-2"></i> Agregar Nuevo Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Selección de empleado (solo admin) */}
          {isAdmin && (
            <Form.Group className="mb-3" controlId="empleado">
              <Form.Label className="fw-semibold">Empleado</Form.Label>
              <Form.Select name="id_empleado" value={nuevoUsuario.id_empleado} onChange={manejarCambioInput} required>
                <option value="">Seleccione un empleado</option>
                {empleados.map(emp => (
                  <option key={emp.id_empleado} value={emp.id_empleado}>
                    {emp.nombre} {emp.apellido} ({emp.correo})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}

          {/* Correo Electrónico / Login */}
          <Form.Group className="mb-3" controlId="login">
            <Form.Label className="fw-semibold">Correo Electrónico (Login)</Form.Label>
            <Form.Control type="email" name="login" value={nuevoUsuario.login} onChange={manejarCambioInput} placeholder="ejemplo@empresa.com" required />
            <Form.Text className="text-muted">Este correo se usará para iniciar sesión en el sistema.</Form.Text>
          </Form.Group>

          {/* Password con mostrar/ocultar */}
          <Form.Group className="mb-3" controlId="password">
            <Form.Label className="fw-semibold">Contraseña</Form.Label>
            <InputGroup>
              <Form.Control type={mostrarPassword ? "text" : "password"} name="password" value={nuevoUsuario.password} onChange={manejarCambioInput} placeholder="Mínimo 6 caracteres" required />
              <Button variant="outline-secondary" onClick={() => setMostrarPassword(!mostrarPassword)}>
                <i className={`bi bi-eye${mostrarPassword ? "-slash" : ""}`}></i>
              </Button>
            </InputGroup>
          </Form.Group>

          {/* Rol */}
          <Form.Group className="mb-3" controlId="rol">
            <Form.Label className="fw-semibold">Rol Aplicación</Form.Label>
            <Form.Select name="rol_aplicacion" value={nuevoUsuario.rol_aplicacion} onChange={manejarCambioInput} required>
              <option value="">Seleccione un rol</option>
              <option value="admin">Administrador</option>
              <option value="supervisor">Supervisor</option>
              <option value="empleado">Empleado</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)} disabled={enviando}>Cancelar</Button>
        <Button variant="primary" onClick={handleGuardar} disabled={ !nuevoUsuario.id_empleado || !nuevoUsuario.login || !nuevoUsuario.password || !nuevoUsuario.rol_aplicacion || enviando }>
          {enviando ? "Guardando..." : "Guardar Usuario"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroUsuario;
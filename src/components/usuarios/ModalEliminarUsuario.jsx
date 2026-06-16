import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminarUsuario = ({ mostrarModal, setMostrarModal, usuarioSeleccionado, eliminarUsuario }) => {
  const [enviando, setEnviando] = useState(false);
  const userData = JSON.parse(localStorage.getItem("usuario-supabase") || "{}");
  const isAdmin = userData.rol === "admin";

  const handleEliminar = async () => {
    setEnviando(true);
    await eliminarUsuario(usuarioSeleccionado.id_usuario);
    setEnviando(false);
    setMostrarModal(false);
  };

  return (
    <Modal backdrop="static" show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>¿Estás seguro que deseas eliminar al usuario de{" "} <strong> {usuarioSeleccionado?.empleado ? `${usuarioSeleccionado.empleado.nombre} ${usuarioSeleccionado.empleado.apellido}` : usuarioSeleccionado?.login || "este empleado"} </strong>? </p>
        <small className="text-muted"> Esta acción eliminará el registro de acceso de la base de datos. </small>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="secondary" onClick={() => setMostrarModal(false)} disabled={enviando}>Cancelar</Button>
        <Button variant="danger" onClick={handleEliminar} disabled={!isAdmin || enviando} className="px-4">
          {enviando ? "Eliminando..." : "Eliminar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminarUsuario;
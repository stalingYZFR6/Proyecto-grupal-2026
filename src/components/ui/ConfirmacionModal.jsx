import React from "react";
import {
  Modal,
  Button,
} from "react-bootstrap";

const ConfirmacionModal = ({
  show,
  onHide,
  onConfirm,
  titulo = "Confirmar acción",
  mensaje = "¿Deseas continuar?",
  variant = "danger",
  textoBoton = "Confirmar",
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
          {titulo}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="mb-0 fs-5">
          {mensaje}
        </p>
      </Modal.Body>

      <Modal.Footer>

        <Button
          variant="secondary"
          onClick={onHide}
        >
          Cancelar
        </Button>

        <Button
          variant={variant}
          onClick={onConfirm}
        >
          {textoBoton}
        </Button>

      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmacionModal;
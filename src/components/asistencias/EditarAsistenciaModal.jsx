// src/components/asistencia/EditarAsistenciaModal.jsx

import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";

import { supabase } from "../../database/supabaseconfig";

const EditarAsistenciaModal = ({
  show,
  handleClose,
  asistencia,
  onActualizado,
}) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    estado_asistencia: "",
    hora_entrada: "",
    hora_salida: "",
  });

  // =========================================
  // CARGAR DATOS
  // =========================================
  useEffect(() => {
    if (asistencia) {
      setForm({
        estado_asistencia: asistencia.estado_asistencia || "",
        hora_entrada: asistencia.hora_entrada
          ? new Date(asistencia.hora_entrada)
              .toTimeString()
              .slice(0, 5)
          : "",
        hora_salida: asistencia.hora_salida
          ? new Date(asistencia.hora_salida)
              .toTimeString()
              .slice(0, 5)
          : "",
      });
    }
  }, [asistencia]);

  // =========================================
  // HANDLE CHANGE
  // =========================================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================================
  // ACTUALIZAR
  // =========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      let horas_trabajadas = null;

      // calcular horas si hay entrada y salida
      if (form.hora_entrada && form.hora_salida) {
        const entrada = new Date(
          `1970-01-01T${form.hora_entrada}:00`
        );
        const salida = new Date(
          `1970-01-01T${form.hora_salida}:00`
        );

        horas_trabajadas =
          (salida - entrada) / (1000 * 60 * 60);

        if (horas_trabajadas < 0) {
          horas_trabajadas += 24;
        }
      }

      const { error } = await supabase
        .from("asistencias")
        .update({
          estado_asistencia: form.estado_asistencia,
          hora_entrada: form.hora_entrada
            ? `${asistencia.fecha || new Date()
                .toISOString()
                .split("T")[0]}T${form.hora_entrada}:00`
            : null,
          hora_salida: form.hora_salida
            ? `${asistencia.fecha || new Date()
                .toISOString()
                .split("T")[0]}T${form.hora_salida}:00`
            : null,
          horas_trabajadas,
        })
        .eq("id_asistencia", asistencia.id_asistencia);

      if (error) throw error;

      if (onActualizado) {
        onActualizado();
      }

      handleClose();

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
    >

      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-pencil-square me-2"></i>
          Editar Asistencia
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>

        <Modal.Body>

          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}

          <Row>

            {/* ESTADO */}
            <Col md={12}>
              <Form.Group className="mb-3">

                <Form.Label>
                  Estado
                </Form.Label>

                <Form.Select
                  name="estado_asistencia"
                  value={form.estado_asistencia}
                  onChange={handleChange}
                  required
                >
                  <option value="Presente">
                    Presente
                  </option>
                  <option value="Tardanza">
                    Tardanza
                  </option>
                  <option value="Ausente">
                    Ausente
                  </option>
                  <option value="Permiso">
                    Permiso
                  </option>
                </Form.Select>

              </Form.Group>
            </Col>

            {/* ENTRADA */}
            <Col md={6}>
              <Form.Group className="mb-3">

                <Form.Label>
                  Hora Entrada
                </Form.Label>

                <Form.Control
                  type="time"
                  name="hora_entrada"
                  value={form.hora_entrada}
                  onChange={handleChange}
                />

              </Form.Group>
            </Col>

            {/* SALIDA */}
            <Col md={6}>
              <Form.Group className="mb-3">

                <Form.Label>
                  Hora Salida
                </Form.Label>

                <Form.Control
                  type="time"
                  name="hora_salida"
                  value={form.hora_salida}
                  onChange={handleChange}
                />

              </Form.Group>
            </Col>

          </Row>

        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={handleClose}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  size="sm"
                  className="me-2"
                />
                Guardando...
              </>
            ) : (
              <>
                <i className="bi bi-save me-2"></i>
                Guardar
              </>
            )}
          </Button>

        </Modal.Footer>

      </Form>

    </Modal>
  );
};

export default EditarAsistenciaModal;
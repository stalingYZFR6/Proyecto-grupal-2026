// src/pages/asistencia/AsistenciaPage.jsx

import React, { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

import TablaJornadas from "../../components/asistencia/TablaJornadas";
import CardResumenAsistencia from "../../components/asistencia/CardResumenAsistencia";

import ModalRegistroAsistencia from "../../components/asistencia/ModalRegistroAsistencia";

const AsistenciaPage = () => {

  const [showRegistro, setShowRegistro] = useState(false);

  const [jornadaSeleccionada, setJornadaSeleccionada] =
    useState(null);

  // ===========================
  // ABRIR REGISTRO MANUAL
  // ===========================
  const abrirRegistroManual = () => {
    setShowRegistro(true);
  };

  return (
    <Container fluid className="py-4">

      {/* ========================= */}
      {/* RESUMEN */}
      {/* ========================= */}
      <Card className="mb-4 shadow border-0">

        <Card.Body>
          <CardResumenAsistencia />
        </Card.Body>

      </Card>

      {/* ========================= */}
      {/* BOTÓN ACCIÓN RÁPIDA */}
      {/* ========================= */}
      <Row className="mb-3">

        <Col className="d-flex justify-content-end">

          <button
            className="btn btn-dark"
            onClick={abrirRegistroManual}
          >
            <i className="bi bi-person-plus me-2"></i>
            Registrar Asistencia
          </button>

        </Col>

      </Row>

      {/* ========================= */}
      {/* TABLA PRINCIPAL */}
      {/* ========================= */}
      <TablaJornadas />

      {/* ========================= */}
      {/* MODAL REGISTRO MANUAL */}
      {/* ========================= */}
      <ModalRegistroAsistencia
        show={showRegistro}
        handleClose={() => setShowRegistro(false)}
        jornada={jornadaSeleccionada}
        onRegistroExitoso={() => {
          setShowRegistro(false);
        }}
      />

    </Container>
  );
};

export default AsistenciaPage;
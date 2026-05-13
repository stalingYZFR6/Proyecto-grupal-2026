// src/views/RegistroAsistencia.jsx

import { useState } from "react";
import { Container } from "react-bootstrap";

import TablaJornadas from "../components/asistencias/TablaJornadas.jsx";

const RegistroAsistencia = () => {

  return (
    <Container className="mt-4">

      <div className="mb-4">
        <h2 className="fw-bold">
          Control de Asistencia
        </h2>

        <p className="text-muted">
          Gestión de jornadas y asistencias
        </p>
      </div>

      <TablaJornadas />

    </Container>
  );
};

export default RegistroAsistencia;
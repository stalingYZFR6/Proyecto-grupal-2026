// src/components/asistencia/CardResumenAsistencia.jsx

import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";

import { supabase } from "../../database/supabaseconfig";

const CardResumenAsistencia = () => {

  const [loading, setLoading] = useState(false);

  const [resumen, setResumen] = useState({
    totalEmpleados: 0,
    presentes: 0,
    tardanzas: 0,
    ausentes: 0,
    permisos: 0,
    totalHoras: 0,
  });

  // =========================================
  // CARGAR RESUMEN
  // =========================================
  useEffect(() => {
    cargarResumen();
  }, []);

  const cargarResumen = async () => {

    try {

      setLoading(true);

      // Obtener asistencias del día actual
      const fechaActual = new Date()
        .toLocaleDateString("en-CA", {
          timeZone: "America/Managua",
        });

      const { data, error } = await supabase
        .from("asistencias")
        .select("*")
        .gte("hora_entrada", `${fechaActual}T00:00:00`)
        .lte("hora_entrada", `${fechaActual}T23:59:59`);

      if (error) throw error;

      const registros = data || [];

      // Agrupar datos
      const presentes = registros.filter(
        (r) => r.estado_asistencia === "Presente"
      ).length;

      const tardanzas = registros.filter(
        (r) => r.estado_asistencia === "Tardanza"
      ).length;

      const ausentes = registros.filter(
        (r) => r.estado_asistencia === "Ausente"
      ).length;

      const permisos = registros.filter(
        (r) => r.estado_asistencia === "Permiso"
      ).length;

      const totalHoras = registros.reduce(
        (acc, r) => acc + (r.horas_trabajadas || 0),
        0
      );

      // Total empleados únicos
      const empleadosUnicos = new Set(
        registros.map((r) => r.id_empleado)
      ).size;

      setResumen({
        totalEmpleados: empleadosUnicos,
        presentes,
        tardanzas,
        ausentes,
        permisos,
        totalHoras,
      });

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  // =========================================
  // CARD UI
  // =========================================
  return (
    <Row className="mb-4">

      {/* TOTAL EMPLEADOS */}
      <Col md={2}>
        <Card className="text-center shadow border-0">
          <Card.Body>

            <h6>Total Empleados</h6>

            {loading ? (
              <Spinner size="sm" />
            ) : (
              <h3>{resumen.totalEmpleados}</h3>
            )}

          </Card.Body>
        </Card>
      </Col>

      {/* PRESENTES */}
      <Col md={2}>
        <Card className="text-center shadow border-0 bg-success text-white">
          <Card.Body>

            <h6>Presentes</h6>

            {loading ? (
              <Spinner size="sm" />
            ) : (
              <h3>{resumen.presentes}</h3>
            )}

          </Card.Body>
        </Card>
      </Col>

      {/* TARDANZAS */}
      <Col md={2}>
        <Card className="text-center shadow border-0 bg-warning text-dark">
          <Card.Body>

            <h6>Tardanzas</h6>

            {loading ? (
              <Spinner size="sm" />
            ) : (
              <h3>{resumen.tardanzas}</h3>
            )}

          </Card.Body>
        </Card>
      </Col>

      {/* AUSENTES */}
      <Col md={2}>
        <Card className="text-center shadow border-0 bg-danger text-white">
          <Card.Body>

            <h6>Ausentes</h6>

            {loading ? (
              <Spinner size="sm" />
            ) : (
              <h3>{resumen.ausentes}</h3>
            )}

          </Card.Body>
        </Card>
      </Col>

      {/* PERMISOS */}
      <Col md={2}>
        <Card className="text-center shadow border-0 bg-secondary text-white">
          <Card.Body>

            <h6>Permisos</h6>

            {loading ? (
              <Spinner size="sm" />
            ) : (
              <h3>{resumen.permisos}</h3>
            )}

          </Card.Body>
        </Card>
      </Col>

      {/* HORAS TOTALES */}
      <Col md={2}>
        <Card className="text-center shadow border-0 bg-dark text-white">
          <Card.Body>

            <h6>Horas Totales</h6>

            {loading ? (
              <Spinner size="sm" />
            ) : (
              <h3>
                {resumen.totalHoras.toFixed(1)}
              </h3>
            )}

          </Card.Body>
        </Card>
      </Col>

    </Row>
  );
};

export default CardResumenAsistencia;
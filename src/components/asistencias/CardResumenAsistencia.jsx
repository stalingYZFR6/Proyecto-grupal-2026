import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const CardResumenAsistencia = () => {
  const [loading, setLoading] = useState(false);
  const [resumen, setResumen] = useState({
    totalEmpleados: 0, presentes: 0, tardanzas: 0, ausentes: 0, permisos: 0, totalHoras: 0,
  });

  useEffect(() => { cargarResumen(); }, []);

  const cargarResumen = async () => {
    try {
      setLoading(true);
      const fechaActual = new Date().toLocaleDateString("en-CA", { timeZone: "America/Managua" });
      const { data, error } = await supabase.from("asistencias").select("*")
        .gte("hora_entrada", `${fechaActual}T00:00:00`)
        .lte("hora_entrada", `${fechaActual}T23:59:59`);
      if (error) throw error;
      const registros = data || [];
      setResumen({
        totalEmpleados: new Set(registros.map((r) => r.id_empleado)).size,
        presentes: registros.filter((r) => r.estado_asistencia === "Presente").length,
        tardanzas: registros.filter((r) => r.estado_asistencia === "Tardanza").length,
        ausentes: registros.filter((r) => r.estado_asistencia === "Ausente").length,
        permisos: registros.filter((r) => r.estado_asistencia === "Permiso").length,
        totalHoras: registros.reduce((acc, r) => acc + (r.horas_trabajadas || 0), 0),
      });
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const MetricCard = ({ title, value, icon, color }) => (
    <Card className="premium-card border-0 h-100">
      <Card.Body className="p-3 d-flex align-items-center gap-3">
        <div className={`bg-${color} bg-opacity-10 p-3 rounded-4`}>
          <i className={`bi ${icon} text-${color} fs-4`}></i>
        </div>
        <div>
          <p className="text-muted small fw-bold mb-0 text-uppercase">{title}</p>
          <h4 className="fw-bold mb-0">{loading ? <Spinner size="sm" /> : value}</h4>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <Row className="g-3">
      <Col xs={6} md={4} lg={2}><MetricCard title="Personal" value={resumen.totalEmpleados} icon="bi-people" color="primary" /></Col>
      <Col xs={6} md={4} lg={2}><MetricCard title="Presentes" value={resumen.presentes} icon="bi-check-circle" color="success" /></Col>
      <Col xs={6} md={4} lg={2}><MetricCard title="Tardanzas" value={resumen.tardanzas} icon="bi-clock" color="warning" /></Col>
      <Col xs={6} md={4} lg={2}><MetricCard title="Ausentes" value={resumen.ausentes} icon="bi-x-circle" color="danger" /></Col>
      <Col xs={6} md={4} lg={2}><MetricCard title="Permisos" value={resumen.permisos} icon="bi-file-earmark-text" color="info" /></Col>
      <Col xs={6} md={4} lg={2}><MetricCard title="Horas" value={resumen.totalHoras.toFixed(1)} icon="bi-hourglass-split" color="dark" /></Col>
    </Row>
  );
};

export default CardResumenAsistencia;
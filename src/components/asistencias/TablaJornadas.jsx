import React, { useEffect, useState } from "react";
import { Table, Button, Badge, Spinner, Alert, Card, Row, Col } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";
import Swal from "sweetalert2";
import ModalDetalleJornada from "./ModalDetalleJornada.jsx";

const TablaJornadas = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [jornadas, setJornadas] = useState([]);
  const [showDetalle, setShowDetalle] = useState(false);
  const [jornadaSeleccionada, setJornadaSeleccionada] = useState(null);

  useEffect(() => { cargarJornadas(); }, []);

  const cargarJornadas = async () => {
    try {
      setLoading(true);
      const { data: jornadasData, error: jErr } = await supabase.from("jornadas_asistencia").select("*").order("fecha", { ascending: false });
      if (jErr) throw jErr;
      const { data: asistData, error: aErr } = await supabase.from("asistencias").select("id_jornada");
      if (aErr) throw aErr;
      setJornadas((jornadasData || []).map(j => ({
        ...j, total_marcas: asistData.filter(a => a.id_jornada === j.id_jornada).length
      })));
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const crearJornada = async () => {
    try {
      const fecha = new Date().toLocaleDateString("en-CA", { timeZone: "America/Managua" });
      const { data: existe } = await supabase.from("jornadas_asistencia").select("*").eq("fecha", fecha).maybeSingle();
      if (existe) return Swal.fire({ icon: "warning", title: "Jornada existente", text: "Ya existe una jornada para hoy." });
      const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      const { error } = await supabase.from("jornadas_asistencia").insert([{ fecha, estado: "abierta", dia_semana: dias[new Date().getDay()] }]);
      if (error) throw error;
      cargarJornadas();
      Swal.fire({ icon: "success", title: "Jornada abierta", timer: 1500, showConfirmButton: false });
    } catch (err) { Swal.fire({ icon: "error", title: "Error", text: err.message }); }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Historial de Jornadas</h4>
        <Button onClick={crearJornada} className="btn-premium-primary shadow-sm">
          <i className="bi bi-calendar-plus me-2"></i> Abrir Jornada de Hoy
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
      ) : jornadas.length === 0 ? (
        <Card className="premium-card border-0 p-5 text-center text-muted">
          <i className="bi bi-calendar-x display-4 mb-3"></i>
          <h5>No hay jornadas registradas</h5>
        </Card>
      ) : (
        <Row className="g-4">
          {jornadas.map((j) => (
            <Col key={j.id_jornada} md={6} lg={4}>
              <Card className="premium-card border-0 h-100">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="fw-bold mb-1">{j.fecha}</h5>
                      <span className="text-muted small">{j.dia_semana}</span>
                    </div>
                    <Badge bg={j.estado === "abierta" ? "success" : "danger"} className="bg-opacity-10 px-3 py-2 rounded-pill" style={{ color: j.estado === "abierta" ? "#198754" : "#dc3545" }}>
                      {j.estado.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="bg-premium-light rounded-3 p-3 mb-4 d-flex justify-content-between align-items-center">
                    <span className="small text-premium-muted">Registros de asistencia:</span>
                    <span className="fw-bold fs-5 text-premium-main">{j.total_marcas}</span>
                  </div>
                  <div className="d-flex gap-2">
                    <Button variant="outline-primary" className="w-100 rounded-3 py-2 fw-bold border-2" onClick={() => { setJornadaSeleccionada(j); setShowDetalle(true); }}>
                      <i className="bi bi-eye me-2"></i> Ver Detalle
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <ModalDetalleJornada show={showDetalle} handleClose={() => setShowDetalle(false)} jornada={jornadaSeleccionada} onActualizar={cargarJornadas} />
    </>
  );
};

export default TablaJornadas;
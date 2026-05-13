import React, { useEffect, useState } from "react";

import {
  Modal,
  Button,
  Form,
  Alert,
  Spinner,
  Card,
  Row,
  Col,
  Image,
} from "react-bootstrap";

import { supabase } from "../../database/supabaseconfig";

const ModalMarcarSalida = ({
  show,
  handleClose,
  onSalidaRegistrada,
}) => {

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [asistencias, setAsistencias] = useState([]);

  const [idSeleccionado, setIdSeleccionado] =
    useState("");

  const [asistenciaSeleccionada,
    setAsistenciaSeleccionada] =
    useState(null);

  // ============================================
  // CARGAR ASISTENCIAS ACTIVAS
  // ============================================

  useEffect(() => {

    if (show) {
      cargarAsistenciasPendientes();
    }

  }, [show]);

  const cargarAsistenciasPendientes =
    async () => {

    try {

      const fecha =
        new Date()
          .toISOString()
          .split("T")[0];

      // ========================================
      // BUSCAR JORNADA DEL DÍA
      // ========================================

      const {
        data: jornada,
        error: jornadaError
      } = await supabase
        .from("jornadas_asistencia")
        .select("*")
        .eq("fecha", fecha)
        .maybeSingle();

      if (jornadaError) throw jornadaError;

      if (!jornada) {
        setAsistencias([]);
        return;
      }

      // ========================================
      // OBTENER ASISTENCIAS SIN SALIDA
      // ========================================

      const {
        data,
        error
      } = await supabase
        .from("asistencias")
        .select(`
          *,
          empleado (
            nombre,
            apellido,
            url_imagen
          ),
          turnos (
            tipo_turno,
            hora_inicio,
            hora_fin
          )
        `)
        .eq("id_jornada",
          jornada.id_jornada)
        .is("hora_salida", null)
        .order("hora_entrada",
          { ascending: true });

      if (error) throw error;

      setAsistencias(data || []);

    } catch (err) {

      console.error(err);

      setError(
        "Error cargando asistencias"
      );
    }
  };

  // ============================================
  // CAMBIO SELECT
  // ============================================

  const handleSeleccion = (e) => {

    const id = e.target.value;

    setIdSeleccionado(id);

    const asistencia =
      asistencias.find(
        (a) =>
          a.id_asistencia === Number(id)
      );

    setAsistenciaSeleccionada(
      asistencia || null
    );
  };

  // ============================================
  // CALCULAR HORAS
  // ============================================

  const calcularHoras = (entrada) => {

    const inicio = new Date(entrada);

    const fin = new Date();

    let horas =
      (fin - inicio) /
      (1000 * 60 * 60);

    if (horas < 0) {
      horas += 24;
    }

    return Number(horas.toFixed(2));
  };

  // ============================================
  // MARCAR SALIDA
  // ============================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!asistenciaSeleccionada) {
      setError(
        "Seleccione un empleado"
      );
      return;
    }

    try {

      setLoading(true);

      const salida = new Date();

      const horasTrabajadas =
        calcularHoras(
          asistenciaSeleccionada.hora_entrada
        );

      // ========================================
      // ACTUALIZAR ASISTENCIA
      // ========================================

      const { error } =
        await supabase
          .from("asistencias")
          .update({

            hora_salida:
              salida.toISOString(),

            horas_trabajadas:
              horasTrabajadas,

          })
          .eq(
            "id_asistencia",
            asistenciaSeleccionada.id_asistencia
          );

      if (error) throw error;

      // ========================================
      // CALLBACK
      // ========================================

      if (onSalidaRegistrada) {

        onSalidaRegistrada({
          ...asistenciaSeleccionada,
          hora_salida:
            salida.toISOString(),
          horas_trabajadas:
            horasTrabajadas,
        });
      }

      // ========================================
      // LIMPIAR
      // ========================================

      setIdSeleccionado("");

      setAsistenciaSeleccionada(null);

      handleClose();

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Error al marcar salida"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
    >

      <Modal.Header closeButton>

        <Modal.Title>

          <i className="bi bi-box-arrow-left me-2"></i>

          Marcar Salida

        </Modal.Title>

      </Modal.Header>

      <Form onSubmit={handleSubmit}>

        <Modal.Body>

          {error && (

            <Alert variant="danger">

              {error}

            </Alert>
          )}

          {/* ============================= */}
          {/* SELECT EMPLEADO */}
          {/* ============================= */}

          <Form.Group className="mb-4">

            <Form.Label>

              Seleccione empleado

            </Form.Label>

            <Form.Select
              value={idSeleccionado}
              onChange={handleSeleccion}
              required
            >

              <option value="">
                Seleccione...
              </option>

              {asistencias.map((asistencia) => (

                <option
                  key={asistencia.id_asistencia}
                  value={asistencia.id_asistencia}
                >

                  {asistencia.empleado?.nombre}
                  {" "}
                  {asistencia.empleado?.apellido}

                  {" - "}

                  {asistencia.turnos?.tipo_turno}

                </option>
              ))}

            </Form.Select>

          </Form.Group>

          {/* ============================= */}
          {/* INFO EMPLEADO */}
          {/* ============================= */}

          {asistenciaSeleccionada && (

            <Card className="shadow-sm border-0">

              <Card.Body>

                <Row className="align-items-center">

                  <Col md={3} className="text-center">

                    <Image
                      src={
                        asistenciaSeleccionada
                          .empleado?.url_imagen ||
                        "https://via.placeholder.com/150"
                      }
                      roundedCircle
                      fluid
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                      }}
                    />

                  </Col>

                  <Col md={9}>

                    <h5>

                      {asistenciaSeleccionada
                        .empleado?.nombre}

                      {" "}

                      {asistenciaSeleccionada
                        .empleado?.apellido}

                    </h5>

                    <hr />

                    <p className="mb-2">

                      <strong>
                        Turno:
                      </strong>

                      {" "}

                      {
                        asistenciaSeleccionada
                          .turnos?.tipo_turno
                      }

                    </p>

                    <p className="mb-2">

                      <strong>
                        Hora entrada:
                      </strong>

                      {" "}

                      {
                        new Date(
                          asistenciaSeleccionada
                            .hora_entrada
                        ).toLocaleTimeString()
                      }

                    </p>

                    <p className="mb-2">

                      <strong>
                        Horas aproximadas:
                      </strong>

                      {" "}

                      {
                        calcularHoras(
                          asistenciaSeleccionada
                            .hora_entrada
                        )
                      }

                      h

                    </p>

                    <p className="mb-0">

                      <strong>
                        Estado:
                      </strong>

                      {" "}

                      {
                        asistenciaSeleccionada
                          .estado_asistencia
                      }

                    </p>

                  </Col>

                </Row>

              </Card.Body>

            </Card>
          )}

          {/* ============================= */}
          {/* VACÍO */}
          {/* ============================= */}

          {asistencias.length === 0 && (

            <Alert variant="warning">

              No hay empleados pendientes
              de salida hoy.

            </Alert>
          )}

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
            variant="danger"
            disabled={
              loading ||
              !asistenciaSeleccionada
            }
          >

            {loading ? (
              <>

                <Spinner
                  animation="border"
                  size="sm"
                  className="me-2"
                />

                Guardando...

              </>
            ) : (
              <>

                <i className="bi bi-check2-circle me-2"></i>

                Marcar Salida

              </>
            )}

          </Button>

        </Modal.Footer>

      </Form>

    </Modal>
  );
};

export default ModalMarcarSalida;
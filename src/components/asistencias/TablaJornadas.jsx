// src/components/asistencias/TablaJornadas.jsx

import React, { useEffect, useState } from "react";

import {
  Table,
  Button,
  Badge,
  Spinner,
  Alert,
  Card,
} from "react-bootstrap";

import { supabase } from "../../database/supabaseconfig";

import Swal from "sweetalert2";

import ModalDetalleJornada from "./ModalDetalleJornada.jsx";

const TablaJornadas = () => {

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [jornadas, setJornadas] = useState([]);

  const [showDetalle, setShowDetalle] =
    useState(false);

  const [jornadaSeleccionada,
    setJornadaSeleccionada] =
      useState(null);

  // =====================================
  // CARGAR JORNADAS
  // =====================================

  useEffect(() => {
    cargarJornadas();
  }, []);

  const cargarJornadas = async () => {

    try {

      setLoading(true);

      setError("");

      const { data: jornadasData,
        error: jornadasError } =
          await supabase
            .from("jornadas_asistencia")
            .select("*")
            .order("fecha", {
              ascending: false,
            });

      if (jornadasError)
        throw jornadasError;

      const { data: asistenciasData,
        error: asistenciasError } =
          await supabase
            .from("asistencias")
            .select(
              "id_asistencia, id_jornada"
            );

      if (asistenciasError)
        throw asistenciasError;

      const jornadasConConteo =
        (jornadasData || []).map(
          (jornada) => {

            const total_marcas =
              asistenciasData.filter(
                (a) =>
                  a.id_jornada ===
                  jornada.id_jornada
              ).length;

            return {
              ...jornada,
              total_marcas,
            };
          }
        );

      setJornadas(
        jornadasConConteo
      );

    } catch (err) {

      console.error(err);

      setError(err.message);

    } finally {

      setLoading(false);

    }
  };

  // =====================================
  // CREAR JORNADA
  // =====================================

  const crearJornada = async () => {

    try {

      const fechaActual =
        new Date();

      const fecha =
        fechaActual.toLocaleDateString(
          "en-CA",
          {
            timeZone:
              "America/Managua",
          }
        );

      // VALIDAR DUPLICADO
      const { data: existe } =
        await supabase
          .from(
            "jornadas_asistencia"
          )
          .select("*")
          .eq("fecha", fecha)
          .maybeSingle();

      if (existe) {

        Swal.fire({
          icon: "warning",
          title:
            "Jornada existente",
          text:
            "Ya existe una jornada creada para hoy.",
          confirmButtonColor:
            "#ffc107",
        });

        return;
      }

      const dias = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
      ];

      const nuevaJornada = {
        fecha,
        estado: "abierta",
        dia_semana:
          dias[
            fechaActual.getDay()
          ],
      };

      const { error } =
        await supabase
          .from(
            "jornadas_asistencia"
          )
          .insert([
            nuevaJornada,
          ]);

      if (error)
        throw error;

      cargarJornadas();

      Swal.fire({
        icon: "success",
        title:
          "Jornada creada",
        text:
          "La jornada fue abierta correctamente.",
        timer: 1800,
        showConfirmButton: false,
      });

    } catch (err) {

      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
      });

    }
  };

  // =====================================
  // ELIMINAR JORNADA
  // =====================================

  const eliminarJornada =
    async (id_jornada) => {

      const result =
        await Swal.fire({
          title:
            "Eliminar jornada",
          text:
            "Se eliminarán todas las asistencias relacionadas.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor:
            "#d33",
          cancelButtonColor:
            "#3085d6",
          confirmButtonText:
            "Eliminar",
          cancelButtonText:
            "Cancelar",
        });

      if (!result.isConfirmed)
        return;

      try {

        await supabase
          .from("asistencias")
          .delete()
          .eq(
            "id_jornada",
            id_jornada
          );

        const { error } =
          await supabase
            .from(
              "jornadas_asistencia"
            )
            .delete()
            .eq(
              "id_jornada",
              id_jornada
            );

        if (error)
          throw error;

        cargarJornadas();

        Swal.fire({
          icon: "success",
          title: "Eliminada",
          text:
            "La jornada fue eliminada.",
        });

      } catch (err) {

        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            "No se pudo eliminar.",
        });

      }
    };

  // =====================================
  // ABRIR DETALLE
  // =====================================

  const abrirDetalle = (
    jornada
  ) => {

    setJornadaSeleccionada(
      jornada
    );

    setShowDetalle(true);

  };

  return (
    <>

      <Card className="shadow border-0">

        <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">

          <div>

            <i className="bi bi-calendar-check-fill me-2"></i>

            Jornadas de Asistencia

          </div>

          <Button
            variant="success"
            onClick={crearJornada}
          >

            <i className="bi bi-plus-circle me-2"></i>

            Nueva Jornada

          </Button>

        </Card.Header>

        <Card.Body>

          {error && (

            <Alert variant="danger">
              {error}
            </Alert>

          )}

          {loading ? (

            <div className="text-center py-5">

              <Spinner
                animation="border"
              />

            </div>

          ) : jornadas.length === 0 ? (

            <Alert variant="warning">

              No hay jornadas registradas

            </Alert>

          ) : (

            <Table
              striped
              bordered
              hover
              responsive
              className="align-middle"
            >

              <thead className="table-dark">

                <tr>

                  <th>#</th>

                  <th>Fecha</th>

                  <th>Día</th>

                  <th>Estado</th>

                  <th>Total Marcas</th>

                  <th width="220">
                    Acciones
                  </th>

                </tr>

              </thead>

              <tbody>

                {jornadas.map(
                  (jornada, index) => (

                  <tr
                    key={
                      jornada.id_jornada
                    }
                  >

                    <td>
                      {index + 1}
                    </td>

                    <td>
                      <strong>
                        {
                          jornada.fecha
                        }
                      </strong>
                    </td>

                    <td>
                      {
                        jornada.dia_semana
                      }
                    </td>

                    <td>

                      <Badge
                        bg={
                          jornada.estado ===
                          "cerrada"
                            ? "danger"
                            : "success"
                        }
                      >

                        {
                          jornada.estado
                        }

                      </Badge>

                    </td>

                    <td>

                      <Badge bg="primary">

                        {
                          jornada.total_marcas
                        }

                      </Badge>

                    </td>

                    <td>

                      <div className="d-flex gap-2">

                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() =>
                            abrirDetalle(
                              jornada
                            )
                          }
                        >

                          <i className="bi bi-eye-fill me-1"></i>

                          Ver

                        </Button>

                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() =>
                            eliminarJornada(
                              jornada.id_jornada
                            )
                          }
                        >

                          <i className="bi bi-trash-fill"></i>

                        </Button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </Table>

          )}

        </Card.Body>

      </Card>

      {/* MODAL DETALLE */}

      <ModalDetalleJornada
        show={showDetalle}
        handleClose={() =>
          setShowDetalle(false)
        }
        jornada={
          jornadaSeleccionada
        }
        onActualizar={
          cargarJornadas
        }
      />

    </>
  );
};

export default TablaJornadas;
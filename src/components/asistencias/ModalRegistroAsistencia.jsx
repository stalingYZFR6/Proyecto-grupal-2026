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

const ModalRegistroAsistencia = ({
    show,
    handleClose,
    onRegistroExitoso,
}) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [empleados, setEmpleados] = useState([]);
    const [turnos, setTurnos] = useState([]);
    const [incidencias, setIncidencias] = useState([]);

    const [formData, setFormData] = useState({
        id_empleado: "",
        id_turno: "",
        id_incidencia: "",
        estado_asistencia: "Presente",
    });

    useEffect(() => {
        if (show) {
            obtenerDatos();
        }
    }, [show]);

    const obtenerDatos = async () => {
        try {

            const { data: empleadosData } = await supabase
                .from("empleado")
                .select("*")
                .order("nombre");

            const { data: turnosData } = await supabase
                .from("turnos")
                .select("*");

            const { data: incidenciasData } = await supabase
                .from("Incidencias")
                .select("*");

            setEmpleados(empleadosData || []);
            setTurnos(turnosData || []);
            setIncidencias(incidenciasData || []);

        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const limpiarFormulario = () => {
        setFormData({
            id_empleado: "",
            id_turno: "",
            id_incidencia: "",
            estado_asistencia: "Presente",
        });

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {

            // 1. Crear registro en tabla tiempo
            const fechaActual = new Date();

            const fecha = fechaActual.toISOString().split("T")[0];

            const hora = fechaActual.toLocaleTimeString("en-GB");

            const dias = [
                "Domingo",
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves",
                "Viernes",
                "Sábado",
            ];

            const meses = [
                "Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio",
                "Julio",
                "Agosto",
                "Septiembre",
                "Octubre",
                "Noviembre",
                "Diciembre",
            ];

            const tiempoData = {
                fecha,
                hora,
                dia_semana: dias[fechaActual.getDay()],
                mes: meses[fechaActual.getMonth()],
                anio: fechaActual.getFullYear(),
            };

            const { data: tiempoInsertado, error: tiempoError } =
                await supabase
                    .from("tiempo")
                    .insert([tiempoData])
                    .select();

            if (tiempoError) throw tiempoError;

            // 2. Registrar asistencia
            const asistenciaData = {
                id_empleado: formData.id_empleado,
                id_turno: formData.id_turno,
                id_tiempo: tiempoInsertado[0].id_tiempo,
                id_incidencia:
                    formData.id_incidencia || null,
                estado_asistencia:
                    formData.estado_asistencia,
            };

            const { data, error } = await supabase
                .from("asistencias")
                .insert([asistenciaData])
                .select();

            if (error) throw error;

            if (onRegistroExitoso) {
                onRegistroExitoso(data[0]);
            }

            limpiarFormulario();
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
            onHide={() => {
                limpiarFormulario();
                handleClose();
            }}
            centered
            size="lg"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="bi bi-calendar-check-fill me-2"></i>
                    Registrar Asistencia
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
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Empleado
                                </Form.Label>

                                <Form.Select
                                    name="id_empleado"
                                    value={formData.id_empleado}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        Seleccione un empleado
                                    </option>

                                    {empleados.map((emp) => (
                                        <option
                                            key={emp.id_empleado}
                                            value={emp.id_empleado}
                                        >
                                            {emp.nombre} {emp.apellido}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Turno
                                </Form.Label>

                                <Form.Select
                                    name="id_turno"
                                    value={formData.id_turno}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        Seleccione un turno
                                    </option>

                                    {turnos.map((turno) => (
                                        <option
                                            key={turno.id_turno}
                                            value={turno.id_turno}
                                        >
                                            {turno.tipo_turno}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Estado
                                </Form.Label>

                                <Form.Select
                                    name="estado_asistencia"
                                    value={formData.estado_asistencia}
                                    onChange={handleChange}
                                >
                                    <option value="Presente">
                                        Presente
                                    </option>

                                    <option value="Ausente">
                                        Ausente
                                    </option>

                                    <option value="Tardanza">
                                        Tardanza
                                    </option>

                                    <option value="Permiso">
                                        Permiso
                                    </option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Incidencia
                                </Form.Label>

                                <Form.Select
                                    name="id_incidencia"
                                    value={formData.id_incidencia}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        Sin incidencia
                                    </option>

                                    {incidencias.map((inc) => (
                                        <option
                                            key={inc.id_incidencia}
                                            value={inc.id_incidencia}
                                        >
                                            {inc.tipo_incidencia}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                </Modal.Body>

                <Modal.Footer>

                    <Button
                        variant="secondary"
                        onClick={() => {
                            limpiarFormulario();
                            handleClose();
                        }}
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="submit"
                        variant="success"
                        disabled={loading}
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
                                <i className="bi bi-save me-2"></i>
                                Registrar
                            </>
                        )}
                    </Button>

                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalRegistroAsistencia;
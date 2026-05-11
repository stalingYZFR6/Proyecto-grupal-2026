import React, { useEffect, useState } from "react";
import {
    Modal,
    Form,
    Button,
    Row,
    Col,
} from "react-bootstrap";

import { supabase } from "../../database/supabaseconfig";

const ModalEdicionIncidencia = ({
    mostrarModalEdicion,
    setMostrarModalEdicion,
    incidenciaEditar,
    manejoCambioInputEdicion,
    actualizarIncidencia,
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);

    const [empleados, setEmpleados] = useState([]);

    useEffect(() => {
        obtenerEmpleados();
    }, []);

    const obtenerEmpleados = async () => {

        try {

            const { data, error } = await supabase
                .from("empleado")
                .select("*")
                .order("nombre");

            if (error) throw error;

            setEmpleados(data || []);

        } catch (err) {

            console.error(err);
        }
    };

    const handleActualizar = async () => {

        if (deshabilitado) return;

        setDeshabilitado(true);

        await actualizarIncidencia();

        setDeshabilitado(false);
    };

    return (
        <Modal
            show={mostrarModalEdicion}
            onHide={() => setMostrarModalEdicion(false)}
            backdrop="static"
            keyboard={false}
            centered
            size="lg"
        >
            <Modal.Header closeButton>

                <Modal.Title>
                    <i className="bi bi-pencil-square me-2"></i>
                    Editar Incidencia
                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                <Form>

                    <Row>

                        {/* EMPLEADO */}
                        <Col md={6}>

                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Empleado
                                </Form.Label>

                                <Form.Select
                                    name="id_empleado"
                                    value={incidenciaEditar?.id_empleado || ""}
                                    onChange={manejoCambioInputEdicion}
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

                        {/* FECHA */}
                        <Col md={6}>

                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Fecha
                                </Form.Label>

                                <Form.Control
                                    type="date"
                                    name="fecha_incidencia"
                                    value={
                                        incidenciaEditar?.fecha_incidencia || ""
                                    }
                                    onChange={manejoCambioInputEdicion}
                                />

                            </Form.Group>

                        </Col>

                    </Row>

                    {/* TIPO */}
                    <Form.Group className="mb-3">

                        <Form.Label>
                            Tipo de incidencia
                        </Form.Label>

                        <Form.Control
                            type="text"
                            name="tipo_incidencia"
                            value={
                                incidenciaEditar?.tipo_incidencia || ""
                            }
                            onChange={manejoCambioInputEdicion}
                            placeholder="Ej: Falta, Llegada tardía..."
                        />

                    </Form.Group>

                    {/* DESCRIPCIÓN */}
                    <Form.Group className="mb-3">

                        <Form.Label>
                            Descripción
                        </Form.Label>

                        <Form.Control
                            as="textarea"
                            rows={4}
                            name="descripcion"
                            value={incidenciaEditar?.descripcion || ""}
                            onChange={manejoCambioInputEdicion}
                            placeholder="Detalle de la incidencia"
                        />

                    </Form.Group>

                </Form>

            </Modal.Body>

            <Modal.Footer>

                <Button
                    variant="secondary"
                    onClick={() => setMostrarModalEdicion(false)}
                >
                    Cancelar
                </Button>

                <Button
                    variant="warning"
                    onClick={handleActualizar}
                    disabled={
                        !incidenciaEditar?.id_empleado ||
                        !incidenciaEditar?.tipo_incidencia?.trim() ||
                        !incidenciaEditar?.fecha_incidencia ||
                        deshabilitado
                    }
                >
                    {deshabilitado
                        ? "Actualizando..."
                        : "Actualizar"}
                </Button>

            </Modal.Footer>

        </Modal>
    );
};

export default ModalEdicionIncidencia;
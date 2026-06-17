import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import Swal from "sweetalert2";

const Ajustes = () => {
    const [loading, setLoading] = useState(true);
    const [errorTabla, setErrorTabla] = useState(false);
    const [rolUsuarioActual, setRolUsuarioActual] = useState("");

    // Estados de las configuraciones
    const [ipActiva, setIpActiva] = useState(false);
    const [ipAutorizada, setIpAutorizada] = useState("");
    const [cierreActivo, setCierreActivo] = useState(false);

    // Estados de confirmación interactiva (UX)
    const [mostrarExplicacionIP, setMostrarExplicacionIP] = useState(false);
    const [mostrarExplicacionCierre, setMostrarExplicacionCierre] = useState(false);
    const [mostrarExplicacionRespaldo, setMostrarExplicacionRespaldo] = useState(false);

    const [guardandoIP, setGuardandoIP] = useState(false);
    const [exportando, setExportando] = useState(false);

    useEffect(() => {
        obtenerDatos();
    }, []);

    const obtenerDatos = async () => {
        try {
            setLoading(true);
            setErrorTabla(false);

            // 1. Verificar rol del usuario
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: perfil } = await supabase
                    .from("usuarios")
                    .select("rol")
                    .eq("id_auth", user.id)
                    .maybeSingle();
                if (perfil) {
                    setRolUsuarioActual(perfil.rol);
                }
            }

            // 2. Cargar configuraciones de la base de datos
            const { data, error } = await supabase
                .from("configuracion")
                .select("*");

            if (error) throw error;

            if (data) {
                const configIPActiva = data.find(c => c.clave === "restriccion_ip_activa");
                const configIPAutorizada = data.find(c => c.clave === "ip_autorizada");
                const configCierre = data.find(c => c.clave === "cierre_automatico_activo");

                setIpActiva(configIPActiva?.valor === "true");
                setIpAutorizada(configIPAutorizada?.valor || "");
                setCierreActivo(configCierre?.valor === "true");
            }

        } catch (err) {
            console.error("Error al cargar configuraciones:", err);
            setErrorTabla(true);
        } finally {
            setLoading(false);
        }
    };

    // --- UX: Manejo de Restricción por IP ---
    const handleToggleIP = (e) => {
        const checked = e.target.checked;
        if (checked) {
            setMostrarExplicacionIP(true);
        } else {
            desactivarIP();
        }
    };

    const confirmarActivacionIP = async () => {
        try {
            setLoading(true);
            const { error } = await supabase
                .from("configuracion")
                .upsert({ clave: "restriccion_ip_activa", valor: "true" });

            if (error) throw error;

            setIpActiva(true);
            setMostrarExplicacionIP(false);
            Swal.fire("Activado", "La restricción por IP ha sido pre-activada. Por favor, ingresa la IP autorizada.", "success");
        } catch (err) {
            Swal.fire("Error", "No se pudo activar la restricción por IP.", "error");
        } finally {
            setLoading(false);
        }
    };

    const desactivarIP = async () => {
        try {
            setLoading(true);
            const { error } = await supabase
                .from("configuracion")
                .upsert({ clave: "restriccion_ip_activa", valor: "false" });

            if (error) throw error;

            setIpActiva(false);
            setMostrarExplicacionIP(false);
            Swal.fire("Desactivado", "La restricción por IP ha sido deshabilitada por completo.", "info");
        } catch (err) {
            Swal.fire("Error", "No se pudo desactivar la restricción por IP.", "error");
        } finally {
            setLoading(false);
        }
    };

    const guardarIPAutorizada = async () => {
        if (!ipAutorizada.trim()) {
            Swal.fire("Advertencia", "Por favor ingresa una dirección IP válida.", "warning");
            return;
        }

        try {
            setGuardandoIP(true);
            const { error } = await supabase
                .from("configuracion")
                .upsert({ clave: "ip_autorizada", valor: ipAutorizada.trim() });

            if (error) throw error;

            Swal.fire("Guardado", "La dirección IP autorizada ha sido actualizada correctamente.", "success");
        } catch (err) {
            Swal.fire("Error", "No se pudo guardar la dirección IP.", "error");
        } finally {
            setGuardandoIP(false);
        }
    };

    // --- UX: Manejo de Cierre Automático ---
    const handleToggleCierre = (e) => {
        const checked = e.target.checked;
        if (checked) {
            setMostrarExplicacionCierre(true);
        } else {
            desactivarCierre();
        }
    };

    const confirmarActivacionCierre = async () => {
        try {
            setLoading(true);
            const { error } = await supabase
                .from("configuracion")
                .upsert({ clave: "cierre_automatico_activo", valor: "true" });

            if (error) throw error;

            setCierreActivo(true);
            setMostrarExplicacionCierre(false);
            Swal.fire("Activado", "El cierre automático de jornadas a la medianoche ha sido activado.", "success");
        } catch (err) {
            Swal.fire("Error", "No se pudo activar el cierre automático.", "error");
        } finally {
            setLoading(false);
        }
    };

    const desactivarCierre = async () => {
        try {
            setLoading(true);
            const { error } = await supabase
                .from("configuracion")
                .upsert({ clave: "cierre_automatico_activo", valor: "false" });

            if (error) throw error;

            setCierreActivo(false);
            setMostrarExplicacionCierre(false);
            Swal.fire("Desactivado", "El cierre automático de jornadas ha sido desactivado.", "info");
        } catch (err) {
            Swal.fire("Error", "No se pudo desactivar el cierre automático.", "error");
        } finally {
            setLoading(false);
        }
    };

    // --- UX: Exportación Masiva de Respaldos en PDF (Nativo) ---
    const exportarDatosMes = async () => {
        try {
            setExportando(true);

            const ahora = new Date();
            const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString().split("T")[0];
            const ultimoDiaMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0).toISOString().split("T")[0];

            const { data, error } = await supabase
                .from("asistencias")
                .select(`
                    id_asistencia,
                    hora_entrada,
                    hora_salida,
                    horas_trabajadas,
                    estado_asistencia,
                    estado_salida,
                    empleado (nombre, apellido, cedula),
                    turnos (tipo_turno)
                `)
                .gte("hora_entrada", `${primerDiaMes}T00:00:00`)
                .lte("hora_entrada", `${ultimoDiaMes}T23:59:59`);

            if (error) throw error;

            if (!data || data.length === 0) {
                Swal.fire("Sin datos", "No se encontraron registros de asistencia para el mes en curso.", "info");
                return;
            }

            // Crear una ventana de impresión con estilos profesionales
            const ventanaImpresion = window.open("", "_blank");
            
            const filasTabla = data.map(row => `
                <tr>
                    <td>#${row.id_asistencia}</td>
                    <td>${row.empleado ? `${row.empleado.nombre} ${row.empleado.apellido}` : "N/A"}</td>
                    <td>${row.empleado?.cedula || "N/A"}</td>
                    <td>${row.turnos?.tipo_turno || "N/A"}</td>
                    <td>${row.hora_entrada ? new Date(row.hora_entrada).toLocaleString() : "N/A"}</td>
                    <td>${row.hora_salida ? new Date(row.hora_salida).toLocaleString() : "N/A"}</td>
                    <td>${row.horas_trabajadas ? parseFloat(row.horas_trabajadas).toFixed(2) + "h" : "0.00h"}</td>
                    <td><span class="badge badge-${row.estado_asistencia?.toLowerCase()}">${row.estado_asistencia || "N/A"}</span></td>
                    <td>${row.estado_salida?.replace(/_/g, " ") || "Trabajando"}</td>
                </tr>
            `).join("");

            ventanaImpresion.document.write(`
                <html>
                <head>
                    <title>Reporte Consolidado de Asistencias - AssisTech</title>
                    <style>
                        body {
                            font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
                            color: #1e293b;
                            margin: 40px;
                            background-color: #fff;
                        }
                        .header {
                            margin-bottom: 30px;
                            border-bottom: 2px solid #e2e8f0;
                            padding-bottom: 20px;
                        }
                        .header h1 {
                            font-size: 24px;
                            margin: 0 0 8px 0;
                            color: #0f172a;
                        }
                        .header p {
                            font-size: 14px;
                            color: #64748b;
                            margin: 0;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 20px;
                        }
                        th, td {
                            border: 1px solid #cbd5e1;
                            padding: 10px 12px;
                            text-align: left;
                            font-size: 12px;
                        }
                        th {
                            background-color: #0f172a;
                            color: #ffffff;
                            font-weight: 600;
                        }
                        tr:nth-child(even) {
                            background-color: #f8fafc;
                        }
                        .badge {
                            display: inline-block;
                            padding: 4px 8px;
                            border-radius: 12px;
                            font-size: 10px;
                            font-weight: bold;
                            text-transform: uppercase;
                        }
                        .badge-presente { background-color: #dcfce7; color: #15803d; }
                        .badge-tardanza { background-color: #fef9c3; color: #a16207; }
                        .badge-ausente { background-color: #fee2e2; color: #b91c1c; }
                        .badge-permiso { background-color: #e0f2fe; color: #0369a1; }
                        @media print {
                            body { margin: 20px; }
                            button { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>AssisTech - Reporte Consolidado de Asistencias</h1>
                        <p>Periodo: ${primerDiaMes} al ${ultimoDiaMes}</p>
                        <p>Fecha de Generación: ${ahora.toLocaleString()}</p>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Empleado</th>
                                <th>Cédula</th>
                                <th>Turno</th>
                                <th>Entrada</th>
                                <th>Salida</th>
                                <th>Horas</th>
                                <th>Estado</th>
                                <th>Resultado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filasTabla}
                        </tbody>
                    </table>
                    <script>
                        window.onload = function() {
                            window.print();
                            setTimeout(function() { window.close(); }, 500);
                        };
                    </script>
                </body>
                </html>
            `);
            ventanaImpresion.document.close();

            Swal.fire("Reporte Generado", "Se ha abierto la ventana de impresión. Selecciona 'Guardar como PDF' para descargar el reporte.", "success");
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "No se pudo generar el reporte PDF.", "error");
        } finally {
            setExportando(false);
        }
    };

    if (loading && !ipAutorizada && !errorTabla) {
        return (
            <div className="text-center py-5 mt-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Cargando panel de ajustes...</p>
            </div>
        );
    }

    if (rolUsuarioActual?.toLowerCase() !== "admin") {
        return (
            <Container className="py-5 mt-4 text-center">
                <div className="bg-danger bg-opacity-10 p-4 rounded-4 d-inline-block mb-4">
                    <i className="bi bi-shield-slash text-danger display-1"></i>
                </div>
                <h2 className="fw-bold">Acceso Denegado</h2>
                <p className="text-muted">No tienes permisos de Administrador para acceder a la configuración del sistema.</p>
            </Container>
        );
    }

    return (
        <Container className="py-5 mt-4">
            {/* HEADER */}
            <div className="mb-5">
                <div className="d-flex align-items-center gap-3 mb-2">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-4">
                        <i className="bi bi-sliders text-primary fs-3"></i>
                    </div>
                    <div>
                        <h2 className="fw-bold mb-0">Ajustes Avanzados</h2>
                        <p className="text-muted mb-0">Configuración de seguridad, automatización y respaldos del sistema</p>
                    </div>
                </div>
            </div>

            {errorTabla && (
                <Alert variant="warning" className="mb-4">
                    <Alert.Heading>Tabla de Configuración Faltante</Alert.Heading>
                    <p>
                        Para habilitar estas funciones, debes ejecutar el script SQL de creación de la tabla <code>configuracion</code> en tu panel de Supabase.
                    </p>
                </Alert>
            )}

            <Row className="g-4">
                {/* 1. RESTRICCIÓN POR DIRECCIÓN IP */}
                <Col lg={6}>
                    <Card className="premium-card border-0 p-4 h-100">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h5 className="fw-bold mb-1">
                                    <i className="bi bi-shield-lock-fill text-primary me-2"></i>
                                    Restricción por Dirección IP
                                </h5>
                                <p className="text-muted small mb-0">Limita el marcado de asistencia a la red de la empresa</p>
                            </div>
                            <Form.Check 
                                type="switch"
                                id="ip-restriction-switch"
                                checked={ipActiva}
                                onChange={handleToggleIP}
                                disabled={errorTabla}
                                style={{ transform: "scale(1.2)" }}
                            />
                        </div>

                        {/* Panel Explicativo Interactivo */}
                        {mostrarExplicacionIP && (
                            <div className="bg-premium-light rounded-3 p-3 mb-3 border border-primary border-opacity-25">
                                <h6 className="fw-bold text-primary mb-2">¿Cómo funciona esta restricción?</h6>
                                <p className="small text-muted mb-3">
                                    Al activar esta función, los empleados <strong>SOLO</strong> podrán marcar su asistencia si están conectados a la red Wi-Fi o internet autorizado de la institución. Si intentan marcar desde sus casas o datos móviles, el sistema les bloqueará el acceso de inmediato.
                                </p>
                                <div className="d-flex gap-2">
                                    <Button variant="primary" size="sm" onClick={confirmarActivacionIP}>
                                        Sí, Activar
                                    </Button>
                                    <Button variant="outline-secondary" size="sm" onClick={() => setMostrarExplicacionIP(false)}>
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                        )}

                        {ipActiva && !mostrarExplicacionIP && (
                            <div className="mt-3">
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold small">Dirección IP Pública Autorizada</Form.Label>
                                    <Form.Control 
                                        type="text"
                                        placeholder="Ej: 190.212.45.10"
                                        value={ipAutorizada}
                                        onChange={(e) => setIpAutorizada(e.target.value)}
                                    />
                                    <Form.Text className="text-muted">
                                        Ingresa la IP pública de la red de la empresa. Los empleados deben coincidir con esta IP para marcar.
                                    </Form.Text>
                                </Form.Group>
                                <Button 
                                    variant="primary" 
                                    size="sm" 
                                    onClick={guardarIPAutorizada}
                                    disabled={guardandoIP}
                                >
                                    {guardandoIP ? "Guardando..." : "Guardar IP Autorizada"}
                                </Button>
                            </div>
                        )}
                    </Card>
                </Col>

                {/* 2. CIERRE AUTOMÁTICO DE JORNADAS */}
                <Col lg={6}>
                    <Card className="premium-card border-0 p-4 h-100">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h5 className="fw-bold mb-1">
                                    <i className="bi bi-calendar-range-fill text-success me-2"></i>
                                    Cierre Automático de Jornadas
                                </h5>
                                <p className="text-muted small mb-0">Clausura automática de jornadas olvidadas a la medianoche</p>
                            </div>
                            <Form.Check 
                                type="switch"
                                id="auto-close-switch"
                                checked={cierreActivo}
                                onChange={handleToggleCierre}
                                disabled={errorTabla}
                                style={{ transform: "scale(1.2)" }}
                            />
                        </div>

                        {/* Panel Explicativo Interactivo */}
                        {mostrarExplicacionCierre && (
                            <div className="bg-premium-light rounded-3 p-3 mb-3 border border-success border-opacity-25">
                                <h6 className="fw-bold text-success mb-2">¿Cómo funciona el cierre automático?</h6>
                                <p className="small text-muted mb-3">
                                    Al activar esta función, el sistema ejecutará un proceso automático a la medianoche (00:00) para revisar la tabla 'jornadas_asistencia'. Cualquier jornada que usted haya olvidado cerrar manualmente será clausurada por el sistema de forma automática, calculando las horas correspondientes para evitar datos incompletos.
                                </p>
                                <div className="d-flex gap-2">
                                    <Button variant="success" size="sm" onClick={confirmarActivacionCierre}>
                                        Sí, Activar
                                    </Button>
                                    <Button variant="outline-secondary" size="sm" onClick={() => setMostrarExplicacionCierre(false)}>
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                        )}

                        {cierreActivo && !mostrarExplicacionCierre && (
                            <Alert variant="success" className="mt-3 py-2 small border-0">
                                <i className="bi bi-check-circle-fill me-2"></i>
                                El cierre automático de jornadas está activo y se ejecutará diariamente a las 00:00.
                            </Alert>
                        )}
                    </Card>
                </Col>

                {/* 3. EXPORTACIÓN MASIVA DE RESPALDOS */}
                <Col lg={12}>
                    <Card className="premium-card border-0 p-4">
                        <h5 className="fw-bold mb-3">
                            <i className="bi bi-cloud-download-fill text-info me-2"></i>
                            Respaldos y Descargas Masivas
                        </h5>
                        
                        {!mostrarExplicacionRespaldo ? (
                            <div className="bg-premium-light rounded-3 p-4 text-center">
                                <i className="bi bi-file-earmark-pdf display-4 text-info mb-3"></i>
                                <h6>Generar Reporte Consolidado del Mes</h6>
                                <p className="small text-muted mb-4" style={{ maxWidth: "600px", margin: "0 auto" }}>
                                    Esta herramienta genera un respaldo completo en tiempo real de todo el historial de asistencias, entradas, salidas e incidencias de todos los empleados del mes en curso, listo para auditorías o el área de contabilidad.
                                </p>
                                <Button 
                                    variant="info" 
                                    className="text-white fw-bold px-4 py-2"
                                    onClick={() => setMostrarExplicacionRespaldo(true)}
                                >
                                    Iniciar Proceso de Respaldo
                                </Button>
                            </div>
                        ) : (
                            <div className="bg-premium-light rounded-3 p-4">
                                <h6 className="fw-bold text-info mb-2">Confirmación de Descarga de Datos</h6>
                                <p className="small text-muted mb-4">
                                    ¿Estás seguro de que deseas exportar y descargar el consolidado de asistencias del mes actual? Este proceso recopilará todas las marcas de entrada, salida, horas trabajadas e incidencias de todo el personal.
                                </p>
                                <div className="d-flex gap-2">
                                    <Button 
                                        variant="info" 
                                        className="text-white fw-bold"
                                        onClick={exportarDatosMes}
                                        disabled={exportando}
                                    >
                                        {exportando ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Generando...
                                            </>
                                        ) : (
                                            "Sí, Generar y Descargar PDF"
                                        )}
                                    </Button>
                                    <Button variant="outline-secondary" onClick={() => setMostrarExplicacionRespaldo(false)}>
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Ajustes;
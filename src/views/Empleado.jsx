import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Badge, Form } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import Swal from "sweetalert2";

import ModalEliminacionEmpleado from "../components/empleados/ModalEliminacionEmpleado";
import ModalEdicionEmpleado from "../components/empleados/ModalEdicionEmpleado";
import ModalRegistroEmpleado from "../components/empleados/ModalRegistroEmpleado";
import TarjetaEmpleado from "../components/empleados/TarjetaEmpleado";
import NotificacionOperacion from "../components/NotificacionOperacion";

const Empleados = () => {
    const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
    const [mostrarModal, setMostrarModal] = useState(false);
    const [nuevoEmpleado, setNuevoEmpleado] = useState({
        nombre: "", apellido: "", cedula: "", correo: "", telefono: "", direccion: "",
        archivo_imagen: null, preview_imagen: "", url_imagen: "",
    });
    const [empleados, setEmpleados] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    const [empleadoEditar, setEmpleadoEditar] = useState(null);
    const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
    const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);

    const cargarEmpleados = async () => {
        try {
            setCargando(true);
            const { data, error } = await supabase.from("empleado").select("*").order("id_empleado", { ascending: true });
            if (error) throw error;
            setEmpleados(data || []);
        } catch (err) {
            setToast({ mostrar: true, mensaje: "Error al cargar empleados.", tipo: "error" });
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => { cargarEmpleados(); }, []);

    // FUNCIÓN PARA SUBIR IMAGEN SANITIZADA AL BUCKET CORRECTO
    const subirImagen = async (archivo) => {
        if (!archivo) return null;
        
        // Sanitizar el nombre del archivo usando solo números y la extensión original
        const extension = archivo.name.split('.').pop() || 'png';
        const nombreArchivo = `${Date.now()}.${extension}`;

        const { data, error } = await supabase.storage
            .from("imagenes_empleados")
            .upload(nombreArchivo, archivo, {
                cacheControl: '3600',
                upsert: true,
                contentType: archivo.type
            });

        if (error) throw error;

        const { data: urlData } = supabase.storage
            .from("imagenes_empleados")
            .getPublicUrl(nombreArchivo);

        return urlData.publicUrl;
    };

    // AGREGAR EMPLEADO
    const handleAgregarEmpleado = async () => {
        try {
            let urlImagen = "";
            if (nuevoEmpleado.archivo_imagen) {
                try {
                    urlImagen = await subirImagen(nuevoEmpleado.archivo_imagen);
                } catch (uploadErr) {
                    console.error("Error al subir imagen:", uploadErr);
                    setToast({ 
                        mostrar: true, 
                        mensaje: "No se pudo subir la imagen al Storage. El empleado se creará con una foto por defecto.", 
                        tipo: "advertencia" 
                    });
                }
            }

            const { error } = await supabase.from("empleado").insert([{
                nombre: nuevoEmpleado.nombre,
                apellido: nuevoEmpleado.apellido,
                cedula: nuevoEmpleado.cedula,
                correo: nuevoEmpleado.correo,
                telefono: nuevoEmpleado.telefono,
                direccion: nuevoEmpleado.direccion,
                url_imagen: urlImagen || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }]);

            if (error) throw error;

            setToast({ mostrar: true, mensaje: "Empleado registrado con éxito", tipo: "exito" });
            setMostrarModal(false);
            setNuevoEmpleado({ nombre: "", apellido: "", cedula: "", correo: "", telefono: "", direccion: "", archivo_imagen: null, preview_imagen: "", url_imagen: "" });
            cargarEmpleados();
        } catch (err) {
            setToast({ mostrar: true, mensaje: "Error: " + err.message, tipo: "error" });
        }
    };

    // ACTUALIZAR EMPLEADO
    const handleActualizarEmpleado = async () => {
        try {
            let urlImagen = empleadoEditar.url_imagen;
            let subidaExitosa = true;
            
            if (empleadoEditar.archivo_imagen) {
                try {
                    const nuevaUrl = await subirImagen(empleadoEditar.archivo_imagen);
                    if (nuevaUrl) urlImagen = nuevaUrl;
                } catch (uploadErr) {
                    console.error("Error al subir imagen:", uploadErr);
                    subidaExitosa = false;
                    setToast({ 
                        mostrar: true, 
                        mensaje: "No se pudo subir la nueva imagen. Se actualizarán solo los datos de texto.", 
                        tipo: "advertencia" 
                    });
                }
            }

            const { error } = await supabase.from("empleado").update({
                nombre: empleadoEditar.nombre,
                apellido: empleadoEditar.apellido,
                cedula: empleadoEditar.cedula,
                correo: empleadoEditar.correo,
                telefono: empleadoEditar.telefono,
                direccion: empleadoEditar.direccion,
                url_imagen: urlImagen
            }).eq("id_empleado", empleadoEditar.id_empleado);

            if (error) throw error;

            if (subidaExitosa) {
                setToast({ mostrar: true, mensaje: "Empleado actualizado con éxito", tipo: "exito" });
            }
            setMostrarModalEdicion(false);
            cargarEmpleados();
        } catch (err) {
            setToast({ mostrar: true, mensaje: "Error: " + err.message, tipo: "error" });
        }
    };

    // ELIMINAR EMPLEADO
    const handleEliminarEmpleado = async () => {
        try {
            const { error } = await supabase.from("empleado").delete().eq("id_empleado", empleadoAEliminar.id_empleado);
            if (error) throw error;

            setToast({ mostrar: true, mensaje: "Empleado eliminado", tipo: "exito" });
            setMostrarModalEliminacion(false);
            cargarEmpleados();
        } catch (err) {
            setToast({ mostrar: true, mensaje: "Error al eliminar", tipo: "error" });
        }
    };

    const empleadosFiltrados = empleados.filter((emp) =>
        `${emp.nombre} ${emp.apellido}`.toLowerCase().includes(busqueda.toLowerCase()) ||
        emp.cedula.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <Container className="py-5 mt-4">
            <div className="mb-5">
                <Row className="align-items-end g-4">
                    <Col lg={6}>
                        <div className="d-flex align-items-center gap-3 mb-2">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-4">
                                <i className="bi bi-people-fill text-primary fs-3"></i>
                            </div>
                            <div>
                                <h2 className="fw-bold mb-0">Gestión de Personal</h2>
                                <p className="text-muted mb-0">Administra y supervisa a tu equipo de trabajo</p>
                            </div>
                        </div>
                    </Col>
                    <Col lg={6} className="text-lg-end">
                        <Button onClick={() => setMostrarModal(true)} className="btn-premium-primary shadow-sm">
                            <i className="bi bi-person-plus-fill me-2"></i>
                            Registrar Nuevo Empleado
                        </Button>
                    </Col>
                </Row>
            </div>

            <div className="mb-5">
                <Row className="g-3 align-items-center">
                    <Col md={8} lg={6}>
                        <div className="search-container">
                            <i className="bi bi-search search-icon"></i>
                            <Form.Control
                                type="text"
                                placeholder="Buscar por nombre, apellido o cédula..."
                                className="search-input"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>
                    </Col>
                    <Col md={4} lg={6} className="text-md-end">
                        <Badge bg="primary" className="bg-opacity-10 text-primary border-0 rounded-pill px-4 py-2 fs-6 fw-semibold">
                            {empleadosFiltrados.length} Colaboradores
                        </Badge>
                    </Col>
                </Row>
            </div>

            {cargando ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted fw-medium">Sincronizando datos...</p>
                </div>
            ) : (
                <div className="fade-in">
                    <TarjetaEmpleado
                        empleados={empleadosFiltrados}
                        abrirModalEdicion={(emp) => { setEmpleadoEditar(emp); setMostrarModalEdicion(true); }}
                        abrirModalEliminacion={(emp) => { setEmpleadoAEliminar(emp); setMostrarModalEliminacion(true); }}
                    />
                </div>
            )}

            <ModalRegistroEmpleado 
                mostrarModal={mostrarModal} 
                setMostrarModal={setMostrarModal} 
                nuevoEmpleado={nuevoEmpleado} 
                setNuevoEmpleado={setNuevoEmpleado} 
                manejoCambioInput={(e) => setNuevoEmpleado({...nuevoEmpleado, [e.target.name]: e.target.value})} 
                agregarEmpleado={handleAgregarEmpleado} 
            />
            
            <ModalEdicionEmpleado 
                mostrarModalEdicion={mostrarModalEdicion} 
                setMostrarModalEdicion={setMostrarModalEdicion} 
                empleadoEditar={empleadoEditar} 
                setEmpleadoEditar={setEmpleadoEditar} 
                manejoCambioInputEdicion={(e) => setEmpleadoEditar({...empleadoEditar, [e.target.name]: e.target.value})} 
                actualizarEmpleado={handleActualizarEmpleado} 
            />
            
            <ModalEliminacionEmpleado 
                mostrarModalEliminacion={mostrarModalEliminacion} 
                setMostrarModalEliminacion={setMostrarModalEliminacion} 
                eliminarEmpleado={handleEliminarEmpleado} 
                empleado={empleadoAEliminar} 
            />
            
            <NotificacionOperacion mostrar={toast.mostrar} mensaje={toast.mensaje} tipo={toast.tipo} onCerrar={() => setToast({ ...toast, mostrar: false })} />
        </Container>
    );
};

export default Empleados;
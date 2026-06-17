import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import Swal from "sweetalert2";
import { supabase } from "../database/supabaseconfig";

import TablaUsuarios from "../components/usuarios/TablaUsuarios";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalRegistroUsuario from "../components/usuarios/ModalRegistroUsuario";
import ModalEditarUsuario from "../components/usuarios/ModalEditarUsuario";
import ModalEliminarUsuario from "../components/usuarios/ModalEliminarUsuario";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [rolUsuarioActual, setRolUsuarioActual] = useState("");

  const [empleados, setEmpleados] = useState([]);
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    id_empleado: "",
    login: "",
    password: "",
    rol_aplicacion: ""
  });

  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  // --- Obtener rol del usuario actual ---
  const obtenerPerfilUsuarioActual = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: perfil } = await supabase
        .from("usuarios")
        .select("rol")
        .eq("id_auth", user.id)
        .maybeSingle();
      if (perfil) {
        setRolUsuarioActual(perfil.rol);
        return perfil.rol;
      }
    }
    return "";
  };

  // --- Obtener usuarios y empleados ---
  const obtenerUsuarios = async () => {
    try {
      setCargando(true);
      const rol = await obtenerPerfilUsuarioActual();
      const { data: { user } } = await supabase.auth.getUser();

      let query = supabase
        .from("usuarios")
        .select(`
          *,
          empleado (
            nombre,
            apellido,
            correo
          )
        `);

      if (rol === "empleado" && user) {
        query = query.eq("id_auth", user.id);
      } else {
        query = query.order("id_usuario", { ascending: true });
      }

      const { data, error } = await query;
      if (error) throw error;

      setUsuarios(data || []);
      setUsuariosFiltrados(data || []);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      Swal.fire("Error", "No se pudieron cargar los usuarios.", "error");
    } finally {
      setCargando(false);
    }
  };

  const obtenerEmpleados = async () => {
    try {
      const { data, error } = await supabase
        .from("empleado")
        .select("*")
        .order("nombre", { ascending: true });

      if (error) throw error;
      setEmpleados(data || []);
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
    obtenerEmpleados();
  }, []);

  // --- Manejo de inputs con autocompletado inteligente ---
  const manejarCambioInput = (e) => {
    const { name, value } = e.target;

    if (name === "id_empleado") {
      if (value === "") {
        setNuevoUsuario((prev) => ({
          ...prev,
          id_empleado: "",
          login: ""
        }));
      } else {
        const empSeleccionado = empleados.find(
          (emp) => emp.id_empleado === parseInt(value)
        );
        const correoAuto = empSeleccionado?.correo || "";

        setNuevoUsuario((prev) => ({
          ...prev,
          id_empleado: value,
          login: correoAuto
        }));
      }
    } else {
      setNuevoUsuario((prev) => ({ ...prev, [name]: value }));
    }
  };

  // --- Agregar usuario ---
  const agregarUsuario = async () => {
    if (!nuevoUsuario.id_empleado || !nuevoUsuario.login || !nuevoUsuario.password || !nuevoUsuario.rol_aplicacion) {
      Swal.fire("Advertencia", "Por favor complete todos los campos.", "warning");
      return;
    }

    try {
      const { error } = await supabase.rpc("crear_usuario_confirmado", {
        p_email: nuevoUsuario.login,
        p_password: nuevoUsuario.password,
        p_id_empleado: parseInt(nuevoUsuario.id_empleado),
        p_rol: nuevoUsuario.rol_aplicacion
      });

      if (error) throw error;

      Swal.fire({
        icon: "success",
        title: "Usuario Creado",
        text: "El usuario ha sido registrado y activado inmediatamente.",
        timer: 2000,
        showConfirmButton: false
      });

      setNuevoUsuario({ id_empleado: "", login: "", password: "", rol_aplicacion: "" });
      setMostrarModalAgregar(false);
      await obtenerUsuarios();
    } catch (error) {
      console.error("Error al agregar usuario:", error);
      Swal.fire("Error", error.message || "No se pudo registrar el usuario.", "error");
    }
  };

  // --- Editar usuario ---
  const guardarCambios = async (usuarioEdit) => {
    try {
      const { error } = await supabase
        .from("usuarios")
        .update({
          id_empleado: parseInt(usuarioEdit.id_empleado),
          rol: usuarioEdit.rol,
          activo: usuarioEdit.activo
        })
        .eq("id_usuario", usuarioEdit.id_usuario);

      if (error) throw error;

      Swal.fire({
        icon: "success",
        title: "Usuario Actualizado",
        text: "Los cambios se guardaron correctamente.",
        timer: 1500,
        showConfirmButton: false
      });

      await obtenerUsuarios();
      setMostrarModalEditar(false);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      Swal.fire("Error", "No se pudo actualizar el usuario.", "error");
    }
  };

  // --- Eliminar usuario completo (Pública + Auth) ---
  const eliminarUsuario = async (id) => {
    try {
      const { error } = await supabase.rpc("eliminar_usuario_completo", {
        p_id_usuario: id
      });

      if (error) throw error;

      Swal.fire({
        icon: "success",
        title: "Usuario Eliminado",
        text: "El registro de acceso y su cuenta de autenticación han sido eliminados por completo.",
        timer: 1500,
        showConfirmButton: false
      });

      await obtenerUsuarios();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      Swal.fire("Error", "No se pudo eliminar el usuario.", "error");
    }
  };

  // --- Busqueda ---
  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    
    const filtrados = usuarios.filter((u) => {
      const nombreCompleto = u.empleado 
        ? `${u.empleado.nombre} ${u.empleado.apellido}`.toLowerCase() 
        : "";
      const correo = u.empleado?.correo?.toLowerCase() || u.login?.toLowerCase() || "";
      const rol = u.rol?.toLowerCase() || "";
      
      return (
        nombreCompleto.includes(texto) ||
        correo.includes(texto) ||
        rol.includes(texto)
      );
    });
    
    setUsuariosFiltrados(filtrados);
  };

  return (
    <Container className="py-5 mt-4">
      <div className="mb-5">
        <Row className="align-items-end g-4">
          <Col lg={6}>
            <div className="d-flex align-items-center gap-3 mb-2">
              <div className="bg-primary bg-opacity-10 p-3 rounded-4">
                <i className="bi bi-person-gear text-primary fs-3"></i>
              </div>
              <div>
                <h2 className="fw-bold mb-0">Gestión de Usuarios</h2>
                <p className="text-muted mb-0">Control de accesos y roles del sistema</p>
              </div>
            </div>
          </Col>
          {rolUsuarioActual !== "empleado" && (
            <Col lg={6} className="text-lg-end">
              <Button
                onClick={() => setMostrarModalAgregar(true)}
                className="btn-premium-primary shadow-sm"
              >
                <i className="bi bi-person-plus-fill me-2"></i>
                Nuevo Usuario
              </Button>
            </Col>
          )}
        </Row>
      </div>

      <div className="mb-4">
        <Row className="g-3 align-items-center">
          <Col md={8} lg={6}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
            />
          </Col>
          <Col md={4} lg={6} className="text-md-end">
            <Badge bg="primary" className="bg-opacity-10 text-primary border-0 rounded-pill px-4 py-2 fs-6 fw-semibold">
              {usuariosFiltrados.length} Usuarios
            </Badge>
          </Col>
        </Row>
      </div>

      <TablaUsuarios
        usuarios={usuariosFiltrados}
        cargando={cargando}
        rolUsuarioActual={rolUsuarioActual}
        setMostrarModalEditar={setMostrarModalEditar}
        setMostrarModalEliminar={setMostrarModalEliminar}
        setUsuarioSeleccionado={setUsuarioSeleccionado}
      />

      <ModalRegistroUsuario
        mostrarModal={mostrarModalAgregar}
        setMostrarModal={setMostrarModalAgregar}
        nuevoUsuario={nuevoUsuario}
        manejarCambioInput={manejarCambioInput}
        agregarUsuario={agregarUsuario}
        empleados={empleados}
      />

      {usuarioSeleccionado && (
        <>
          <ModalEditarUsuario
            mostrarModal={mostrarModalEditar}
            setMostrarModal={setMostrarModalEditar}
            usuarioSeleccionado={usuarioSeleccionado}
            rolUsuarioActual={rolUsuarioActual}
            guardarCambios={guardarCambios}
            empleados={empleados}
          />

          <ModalEliminarUsuario
            mostrarModal={mostrarModalEliminar}
            setMostrarModal={setMostrarModalEliminar}
            usuarioSeleccionado={usuarioSeleccionado}
            eliminarUsuario={eliminarUsuario}
          />
        </>
      )}
    </Container>
  );
};

export default Usuarios;
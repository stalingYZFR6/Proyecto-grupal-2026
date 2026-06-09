function validacionRoles(usuario, ruta) {
  const { rol, activo } = usuario || {};

  if (!rol) {
    return { valido: false, mensaje: "El usuario debe tener un rol asignado." };
  }

  if (activo === false) {
    return { valido: false, mensaje: "El usuario se encuentra inactivo." };
  }

  // Rutas administrativas restringidas
  const rutasAdministrativas = ["/empleados", "/turnos", "/usuarios"];

  if (rutasAdministrativas.includes(ruta)) {
    if (rol.toLowerCase() !== "administrador") {
      return { valido: false, mensaje: "Acceso denegado. Se requieren permisos de administrador." };
    }
  }

  return { valido: true };
}

module.exports = validacionRoles;
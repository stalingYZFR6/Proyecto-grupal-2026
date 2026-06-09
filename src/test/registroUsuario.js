function registroUsuario(usuario) {
  const { correo, contrasena, rol } = usuario || {};

  // Validar campos requeridos
  if (!correo || !contrasena || !rol) {
    return { valido: false, mensaje: "Todos los campos requeridos deben estar llenos." };
  }

  // Validar formato de correo electrónico
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexCorreo.test(correo)) {
    return { valido: false, mensaje: "El correo electrónico no tiene un formato válido." };
  }

  // Validar longitud de la contraseña (mínimo 6 caracteres)
  if (contrasena.length < 6) {
    return { valido: false, mensaje: "La contraseña debe tener al menos 6 caracteres." };
  }

  // Validar roles permitidos
  const rolesPermitidos = ["administrador", "empleado"];
  if (!rolesPermitidos.includes(rol.toLowerCase())) {
    return { valido: false, mensaje: "El rol seleccionado no es válido." };
  }

  return { valido: true };
}

module.exports = registroUsuario;
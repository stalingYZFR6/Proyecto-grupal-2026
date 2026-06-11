function inicioSesion(credenciales) {
  const { correo, contrasena } = credenciales || {};

  // Validar campos requeridos
  if (!correo || !contrasena) {
    return { valido: false, mensaje: "Todos los campos requeridos deben estar llenos." };
  }

  // Validar formato de correo electrónico
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexCorreo.test(correo)) {
    return { valido: false, mensaje: "El correo electrónico no tiene un formato válido." };
  }

  return { valido: true };
}

module.exports = inicioSesion;
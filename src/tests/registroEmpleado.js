/**
 * Función para validar los datos de registro de un empleado.
 * Aplica análisis de valores límite y clases de equivalencia.
 * 
 * @param {Object} empleado - Objeto con los datos del empleado.
 * @returns {Object} Resultado de la validación { valido: boolean, mensaje?: string }
 */
function registroEmpleado(empleado) {
  const { nombre, apellido, cedula, correo, telefono } = empleado || {};

  // Validar campos requeridos
  if (!nombre || !apellido || !cedula) {
    return { valido: false, mensaje: "Todos los campos requeridos deben estar llenos." };
  }

  // Validar que nombre y apellido solo contengan letras
  const regexLetras = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
  if (!regexLetras.test(nombre) || !regexLetras.test(apellido)) {
    return { valido: false, mensaje: "El nombre y apellido solo deben contener letras." };
  }

  // Validar formato de cédula nicaragüense (ej: 001-123456-0001X)
  const regexCedula = /^\d{3}-\d{6}-\d{4}[A-Z]$/;
  if (!regexCedula.test(cedula)) {
    return { valido: false, mensaje: "La cédula no tiene un formato válido." };
  }

  // Validar correo si se proporciona
  if (correo) {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo)) {
      return { valido: false, mensaje: "El correo electrónico no tiene un formato válido." };
    }
  }

  // Validar teléfono si se proporciona (mínimo 8 dígitos)
  if (telefono) {
    const regexTelefono = /^\+?[\d\s-]{8,}$/;
    if (!regexTelefono.test(telefono)) {
      return { valido: false, mensaje: "El teléfono no tiene un formato válido." };
    }
  }

  return { valido: true };
}

module.exports = registroEmpleado;
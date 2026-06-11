/**
 * Función de validación para el Registro de Empleados (Caso de Prueba P07)
 * @param {Object} empleado - Datos del empleado a registrar
 * @param {Array} empleadosExistentes - Lista de empleados ya registrados para validar unicidad
 * @returns {Object} Resultado de la validación { valido: Boolean, mensaje: String }
 */
function registroEmpleado(empleado, empleadosExistentes = []) {
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

  // Validar formato de cédula nicaragüense (ej: 001-123456-0001X o 212-090606-4003G)
  const regexCedula = /^\d{3}-\d{6}-\d{4}[A-Z]$/;
  if (!regexCedula.test(cedula)) {
    return { valido: false, mensaje: "La cédula no tiene un formato válido." };
  }

  // Validar cédula única (no duplicada)
  const cedulaDuplicada = empleadosExistentes.some(
    (emp) => emp.cedula === cedula
  );
  if (cedulaDuplicada) {
    return { valido: false, mensaje: "La cédula ya se encuentra registrada en el sistema." };
  }

  // Validar correo si se proporciona
  if (correo) {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo)) {
      return { valido: false, mensaje: "El correo electrónico no tiene un formato válido." };
    }
  }

  // Validar teléfono si se proporciona (mínimo 8 dígitos, permitiendo espacios)
  if (telefono) {
    const regexTelefono = /^\+?[\d\s-]{8,}$/;
    if (!regexTelefono.test(telefono)) {
      return { valido: false, mensaje: "El teléfono no tiene un formato válido." };
    }
  }

  return { valido: true };
}

module.exports = registroEmpleado;
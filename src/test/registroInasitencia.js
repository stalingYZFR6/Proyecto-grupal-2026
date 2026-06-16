// test/registroIncidencia.js
function validarregistroIncidencia(incidencia) {
  const { idEmpleado, estado_asistencia, tipoIncidencia } = incidencia;

  // Paso 1: Validar que se seleccionó un empleado
  if (!idEmpleado) {
    return false;
  }

  // Paso 2: Verificar que el estado sea "Inasistente" antes de poder mutarlo
  if (estado_asistencia !== 'Inasistente') {
    return false; // Error: El empleado sí asistió o el estado es incorrecto
  }

  // Paso 3: Verificar el tipo de incidencia solicitado
  if (tipoIncidencia !== 'inasistencia') {
    return false; // Error: No es el tipo de registro correcto para esta acción
  }

  return true; // Exito: Pasa al Paso 4
}

module.exports = validarregistroIncidencia;
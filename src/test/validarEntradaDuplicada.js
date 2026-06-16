// test/validarEntradaDuplicada.js
function validarEntradaDuplicada(idEmpleado, asistenciasRegistradas = []) {
  // Paso 1: Seleccionar empleado válido
  if (!idEmpleado) {
    return { valido: false, mensaje: 'ID de empleado no proporcionado o inválido' };
  }

  // Paso 2 y 3: Detectar si ya existe la asistencia previa y bloquear
  if (asistenciasRegistradas.includes(idEmpleado)) {
    return { 
      valido: false, 
      mensaje: `¡Advertencia! El empleado con ID [${idEmpleado}] ya fue agregado a la asistencia el día de hoy.` 
    };
  }

  return { valido: true, mensaje: 'El sistema permite registrar la asistencia' };
}

module.exports = validarEntradaDuplicada;
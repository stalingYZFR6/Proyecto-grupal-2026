// crearJornada.js

/**
 * Función para crear una jornada laboral.
 * Valida la existencia de datos, coherencia de horarios y simula persistencia.
 */
function crearJornada(jornada) {
  const { fecha, descripcion, turno } = jornada;

  // 1. Validación de campos obligatorios
  if (!fecha || !descripcion || !turno) {
    return { valido: false, error: 'Campos requeridos faltantes' };
  }

  // 2. Validación lógica: La hora de inicio no puede ser igual o mayor a la de fin
  if (turno.hora_inicio >= turno.hora_fin) {
    return { valido: false, error: 'El turno debe tener una duración válida' };
  }

  // 3. Simulación de obtención de hora desde hardware
  const horaSistema = new Date().toLocaleTimeString();

  // 4. Retorno de estado exitoso
  return {
    valido: true,
    mensaje: `Jornada '${descripcion}' creada correctamente a las ${horaSistema}`,
    data: {
      ...jornada,
      creadaA: horaSistema,
      estado: 'activa'
    }
  };
}

module.exports = crearJornada;
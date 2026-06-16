function registrarAsistencia(asistencia) {

  const {
    id_empleado,
    id_turno,
    tiempo_entrada,
    tiempo_salida
  } = asistencia;

  if (!id_empleado) {
    return {
      valido: false,
      mensaje: 'id_empleado requerido'
    };
  }

  if (!id_turno) {
    return {
      valido: false,
      mensaje: 'id_turno requerido'
    };
  }

  if (!tiempo_entrada) {
    return {
      valido: false,
      mensaje: 'tiempo_entrada requerido'
    };
  }

  return {
    valido: true,
    mensaje: 'Asistencia registrada correctamente'
  };
}

module.exports = registrarAsistencia;
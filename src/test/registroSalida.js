// test/registroSalida.js
function registrarSalida(idEmpleado, historialAsistencias = []) {
  // Validación básica del ID
  if (!idEmpleado) {
    return { valido: false, mensaje: 'ID de empleado no proporcionado' };
  }

  // Paso 1: Buscar si el empleado tiene una entrada registrada hoy
  const registroPrevio = historialAsistencias.find(r => r.idEmpleado === idEmpleado);

  if (!registroPrevio || !registroPrevio.entrada) {
    return { valido: false, mensaje: 'Error: El empleado no cuenta con una entrada registrada.' };
  }

  // Paso 2 y 3: Si todo coincide, habilitar y confirmar la salida
  return { 
    valido: true, 
    mensaje: 'Salida registrada correctamente',
    horaSalida: new Date().toLocaleTimeString() // Simula el guardado en la tabla tiempo
  };
}

module.exports = registrarSalida;
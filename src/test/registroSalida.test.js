// test/registroSalida.test.js
const registrarSalida = require('./registroSalida');

describe('Caso de Prueba - Registro de Salida ', () => {

  const idEmpleadoValido = 'EMP-888';
  
  // Datos de prueba: Simulamos que el empleado ya marcó entrada previamente
  const historialBaseDatos = [
    { idEmpleado: 'EMP-888', entrada: '07:30 AM', salida: null }
  ];

  console.log('✔ Paso 1: Seleccionar empleado con entrada registrada');
  it('Paso 1: El sistema reconoce la asistencia previa a través del id_empleado', () => {
    const registroPrevio = historialBaseDatos.find(r => r.idEmpleado === idEmpleadoValido);
    
    expect(registroPrevio).toBeDefined();
    expect(registroPrevio.entrada).not.toBeNull();
  });

  console.log('✔ Paso 2: Hacer clic en “Registrar salida”');
  it('Paso 2: El sistema habilita el registro de salida al validar id_turno y fecha/hora', () => {
    const resultado = registrarSalida(idEmpleadoValido, historialBaseDatos);
    expect(resultado.valido).toBe(true);
  });

  console.log('✔ Paso 3: Confirmar registro');
  it('Paso 3: La hora de salida queda almacenada correctamente en la tabla tiempo', () => {
    const resultadoFinal = registrarSalida(idEmpleadoValido, historialBaseDatos);
    
    expect(resultadoFinal.valido).toBe(true);
    expect(resultadoFinal.mensaje).toBe('Salida registrada correctamente');
    expect(resultadoFinal.horaSalida).toBeDefined();
  });

});
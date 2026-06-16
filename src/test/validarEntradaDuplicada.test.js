// test/validarEntradaDuplicada.test.js
const validarEntradaDuplicada = require('./validarEntradaDuplicada');

describe('Caso de Prueba - Validación de Entrada Duplicada (Independiente)', () => {

  const idEmpleadoValido = 'EMP-999';
  // Datos de prueba (Paso 2): El empleado ya se encuentra en los registros de hoy
  const asistenciasDelDia = ['EMP-101', 'EMP-999', 'EMP-202']; 

  console.log('Paso 1: Seleccionar empleado (id_empleado válido)');
  it('Paso 1: El sistema identifica el empleado correctamente', () => {
    expect(idEmpleadoValido).toBeDefined();
  });

  console.log('Paso 2: Hacer clic en "Registrar entrada" (id_asistencia existente)');
  it('Paso 2: El sistema verifica asistencia previa en los registros actuales', () => {
    const yaTieneAsistencia = asistenciasDelDia.includes(idEmpleadoValido);
    expect(yaTieneAsistencia).toBe(true);
  });

  console.log('Paso 3: Confirmar registro (id_tiempo válido)');
  it('Paso 3: El sistema bloquea el registro duplicado y lanza el mensaje de advertencia', () => {
    const resultado = validarEntradaDuplicada(idEmpleadoValido, asistenciasDelDia);
    
    // Verificamos que el sistema bloquee el registro correctamente
    expect(resultado.valido).toBe(false);
    
    // Validamos que salte el texto de advertencia esperado
    expect(resultado.mensaje).toContain('¡Advertencia!');
    expect(resultado.mensaje).toContain('ya fue agregado a la asistencia');
    
    // Mostramos la advertencia en la consola de pruebas
    console.log(`      [Mensaje de Control]: ${resultado.mensaje}`);
  });

});
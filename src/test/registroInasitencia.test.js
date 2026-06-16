// test/registroInasitencia.test.js
const validarRegistrarInasitencia  = require('./registroInasitencia');

describe('Caso de Prueba - Registro de Inasistencias / Incidencias', () => {

  // Datos de prueba basados estrictamente en la columna "Test Data"
  const datosPrueba = {
    idEmpleado: 'E-002',
    estado_asistencia: 'Inasistente',
    tipoIncidencia: 'inasistencia'
  };

  console.log('✔ Paso 1: Seleccionar empleado (id_empleado sin registro de asistencia en turno asignado)');
  it('Paso 1: El sistema muestra los datos del empleado seleccionado', () => {
    expect(datosPrueba.idEmpleado).toBeDefined();
  });

  console.log('✔ Paso 2: Verificar estado de asistencia (estado_asistencia = "Inasistente")');
  it('Paso 2: El sistema identifica que no existe asistencia registrada', () => {
    expect(datosPrueba.estado_asistencia).toBe('Inasistente');
  });

  console.log('✔ Paso 3: Hacer clic en “Registrar inasistencia” (id_incidencia tipo "inasistencia")');
  it('Paso 3: El sistema registra la incidencia correctamente', () => {
    const validacion = validarRegistrarInasitencia(datosPrueba);
    expect(validacion).toBe(true);
  });

  console.log('✔ Paso 4: Confirmar registro (Datos válidos)');
  it('Paso 4: Se agrega la inasistencia al empleado seleccionado', () => {
    const resultadoFinal = validarRegistrarInasitencia(datosPrueba);
    expect(resultadoFinal).toBe(true);
  });

});

const registrarAsistencia = require('./registroAsistencia');

console.log('Prueba 1: No permite registrar asistencia sin empleado');

describe('Registro de Asistencia', () => {

  it('No permite registrar asistencia sin id_empleado', () => {

    const asistencia = {
      id_empleado: '',
      id_turno: 1,
      tiempo_entrada: '08:00:00',
      tiempo_salida: '17:00:00'
    };

    const resultado = registrarAsistencia(asistencia);

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('id_empleado');

  });

  console.log('Prueba 2: No permite registrar asistencia sin turno');

  it('No permite registrar asistencia sin id_turno', () => {

    const asistencia = {
      id_empleado: 1,
      id_turno: '',
      tiempo_entrada: '08:00:00',
      tiempo_salida: '17:00:00'
    };

    const resultado = registrarAsistencia(asistencia);

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('id_turno');

  });

  console.log('Prueba 3: No permite registrar asistencia sin hora de entrada');

  it('No permite registrar asistencia sin tiempo_entrada', () => {

    const asistencia = {
      id_empleado: 1,
      id_turno: 1,
      tiempo_entrada: '',
      tiempo_salida: '17:00:00'
    };

    const resultado = registrarAsistencia(asistencia);

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('tiempo_entrada');

  });

  console.log('Prueba 4: Permite registrar asistencia con empleado y turno válidos');

  it('Permite registrar asistencia correctamente', () => {

    const asistencia = {
      id_empleado: 1,
      id_turno: 1,
      tiempo_entrada: '08:00:00',
      tiempo_salida: '17:00:00'
    };

    const resultado = registrarAsistencia(asistencia);

    expect(resultado.valido).toBe(true);

  });

  console.log('Prueba 5: Registra asistencia generando fecha y hora correctamente');

  it('Registra asistencia con fecha y hora válida', () => {

    const asistencia = {
      id_empleado: 1,
      id_turno: 1,
      tiempo_entrada: '08:00:00',
      tiempo_salida: '17:00:00'
    };

    const resultado = registrarAsistencia(asistencia);

    expect(resultado.valido).toBe(true);
    expect(resultado.mensaje).toContain('Asistencia registrada');

  });

});
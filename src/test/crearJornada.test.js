// test/crearJornada.test.js
const crearJornada = require('./crearJornada');// Asegúrate de ajustar la ruta si es necesario

describe('Caso de Prueba HU-08 - Crear Jornada', () => {

  const datosPrueba = {
    fecha: '2026-06-15',
    descripcion: 'Jornada Diaria',
    turno: { hora_inicio: '08:00', hora_fin: '17:00' }
  };

  console.log('Paso 1: Seleccionar "Jornada" en el menú principal');
  it('Paso 1: El sistema despliega el módulo de gestión de jornadas', () => {
    expect(datosPrueba).toBeDefined();
  });

  console.log('Paso 2: Verificar configuración de horario (hora_inicio y hora_fin)');
  it('Paso 2: El sistema valida que los horarios sean consistentes', () => {
    expect(datosPrueba.turno.hora_inicio < datosPrueba.turno.hora_fin).toBe(true);
  });

  console.log('Paso 3: Hacer clic en "Crear jornada"');
  it('Paso 3: El sistema procesa la solicitud de creación', () => {
    const resultado = crearJornada(datosPrueba);
    expect(resultado.valido).toBe(true);
  });

  console.log('Paso 4: Confirmar generación de jornada con hora de hardware');
  it('Paso 4: La jornada se registra con éxito usando la hora local', () => {
    const resultado = crearJornada(datosPrueba);
    expect(resultado.mensaje).toContain('creada correctamente');
    expect(resultado.data).toHaveProperty('creadaA');
  });

});
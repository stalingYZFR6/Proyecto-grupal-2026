const registroEmpleado = require('./registroEmpleado');

/**
 * CASO DE PRUEBA: P07 - Registro de Empleados
 * Diseñado por: Equipo G6
 * Fecha de diseño: 06/05/2026
 * Método de prueba: Clases de equivalencia y análisis de valores límite
 * Descripción: Verificar que el administrador pueda registrar correctamente un nuevo empleado
 * en el sistema ingresando todos los datos obligatorios requeridos y validando la unicidad de la cédula.
 */
describe('Caso de Prueba P07: Registro de Empleados', () => {

  console.log('Iniciando suite de pruebas para P07: Registro de Empleados');

  // =========================================================================
  // PRUEBA 1: Registro exitoso con datos válidos (Representante del Caso de Prueba)
  // =========================================================================
  it('Debería registrar correctamente un empleado con todos los datos válidos', () => {
    console.log('Ejecutando Paso 1: Registro exitoso con datos válidos');

    // Datos de prueba basados en la tabla de variables del diseño de pruebas
    const nuevoEmpleado = {
      nombre: 'Gerson',
      apellido: 'Sequeira',
      cedula: '212-090606-4003G',
      correo: 'GersonSequeira@gmail.com',
      telefono: '5822 2227'
    };

    const empleadosExistentes = [
      { nombre: 'Staling', apellido: 'Urbina', cedula: '001-120395-0002A' }
    ];

    const resultado = registroEmpleado(nuevoEmpleado, empleadosExistentes);

    expect(resultado.valido).toBe(true);
    console.log('-> Paso 1 completado con éxito. Empleado registrado correctamente.');
  });

  // =========================================================================
  // PRUEBA 2: Rechazar cédulas duplicadas (Análisis de unicidad)
  // =========================================================================
  it('No debería permitir registrar un empleado con una cédula ya existente', () => {
    console.log('Ejecutando Paso 2: Validación de cédula duplicada');

    const nuevoEmpleado = {
      nombre: 'Gerson',
      apellido: 'Sequeira',
      cedula: '212-090606-4003G',
      correo: 'GersonSequeira@gmail.com',
      telefono: '5822 2227'
    };

    // Lista de empleados existentes que ya contiene la misma cédula
    const empleadosExistentes = [
      { nombre: 'Juan', apellido: 'Pérez', cedula: '212-090606-4003G' }
    ];

    const resultado = registroEmpleado(nuevoEmpleado, empleadosExistentes);

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('ya se encuentra registrada');
    console.log('-> Paso 2 completado con éxito. Cédula duplicada rechazada correctamente.');
  });

  // =========================================================================
  // PRUEBA 3: Validación de campos obligatorios vacíos
  // =========================================================================
  it('Debería rechazar el registro si faltan campos obligatorios', () => {
    console.log('Ejecutando Paso 3: Validación de campos obligatorios vacíos');

    const empleadoIncompleto = {
      nombre: '',
      apellido: 'Sequeira',
      cedula: '212-090606-4003G'
    };

    const resultado = registroEmpleado(empleadoIncompleto);

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('campos requeridos');
    console.log('-> Paso 3 completado con éxito. Registro incompleto bloqueado.');
  });

  // =========================================================================
  // PRUEBA 4: Validación de formato de correo electrónico
  // =========================================================================
  it('Debería rechazar el registro si el correo electrónico tiene un formato inválido', () => {
    console.log('Ejecutando Paso 4: Validación de formato de correo');

    const empleadoCorreoInvalido = {
      nombre: 'Gerson',
      apellido: 'Sequeira',
      cedula: '212-090606-4003G',
      correo: 'GersonSequeira_gmail.com' // Formato inválido
    };

    const resultado = registroEmpleado(empleadoCorreoInvalido);

    expect<dyad-write path="src/test/registroEmpleado.test.js" description="Crear las pruebas unitarias completas y documentadas para el Caso de Prueba P07 de Registro de Empleados">
const registroEmpleado = require('./registroEmpleado');

/**
 * CASO DE PRUEBA: P07 - Registro de Empleados
 * Diseñado por: Equipo G6
 * Fecha de diseño: 06/05/2026
 * Método de prueba: Clases de equivalencia y análisis de valores límite
 * Descripción: Verificar que el administrador pueda registrar correctamente un nuevo empleado
 * en el sistema ingresando todos los datos obligatorios requeridos y validando la unicidad de la cédula.
 */
describe('Caso de Prueba P07: Registro de Empleados', () => {

  console.log('Iniciando suite de pruebas para P07: Registro de Empleados');

  // =========================================================================
  // PRUEBA 1: Registro exitoso con datos válidos (Representante del Caso de Prueba)
  // =========================================================================
  it('Debería registrar correctamente un empleado con todos los datos válidos', () => {
    console.log('Ejecutando Paso 1: Registro exitoso con datos válidos');

    // Datos de prueba basados en la tabla de variables del diseño de pruebas
    const nuevoEmpleado = {
      nombre: 'Gerson',
      apellido: 'Sequeira',
      cedula: '212-090606-4003G',
      correo: 'GersonSequeira@gmail.com',
      telefono: '5822 2227'
    };

    const empleadosExistentes = [
      { nombre: 'Staling', apellido: 'Urbina', cedula: '001-120395-0002A' }
    ];

    const resultado = registroEmpleado(nuevoEmpleado, empleadosExistentes);

    expect(resultado.valido).toBe(true);
    console.log('-> Paso 1 completado con éxito. Empleado registrado correctamente.');
  });

  // =========================================================================
  // PRUEBA 2: Rechazar cédulas duplicadas (Análisis de unicidad)
  // =========================================================================
  it('No debería permitir registrar un empleado con una cédula ya existente', () => {
    console.log('Ejecutando Paso 2: Validación de cédula duplicada');

    const nuevoEmpleado = {
      nombre: 'Gerson',
      apellido: 'Sequeira',
      cedula: '212-090606-4003G',
      correo: 'GersonSequeira@gmail.com',
      telefono: '5822 2227'
    };

    // Lista de empleados existentes que ya contiene la misma cédula
    const empleadosExistentes = [
      { nombre: 'Juan', apellido: 'Pérez', cedula: '212-090606-4003G' }
    ];

    const resultado = registroEmpleado(nuevoEmpleado, empleadosExistentes);

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('ya se encuentra registrada');
    console.log('-> Paso 2 completado con éxito. Cédula duplicada rechazada correctamente.');
  });

  // =========================================================================
  // PRUEBA 3: Validación de campos obligatorios vacíos
  // =========================================================================
  it('Debería rechazar el registro si faltan campos obligatorios', () => {
    console.log('Ejecutando Paso 3: Validación de campos obligatorios vacíos');

    const empleadoIncompleto = {
      nombre: '',
      apellido: 'Sequeira',
      cedula: '212-090606-4003G'
    };

    const resultado = registroEmpleado(empleadoIncompleto);

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('campos requeridos');
    console.log('-> Paso 3 completado con éxito. Registro incompleto bloqueado.');
  });

  // =========================================================================
  // PRUEBA 4: Validación de formato de correo electrónico
  // =========================================================================
  it('Debería rechazar el registro si el correo electrónico tiene un formato inválido', () => {
    console.log('Ejecutando Paso 4: Validación de formato de correo');

    const empleadoCorreoInvalido = {
      nombre: 'Gerson',
      apellido: 'Sequeira',
      cedula: '212-090606-4003G',
      correo: 'GersonSequeira_gmail.com' // Formato inválido
    };

    const resultado = registroEmpleado(empleadoCorreoInvalido);

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('correo electrónico no tiene un formato válido');
    console.log('-> Paso 4 completado con éxito. Correo inválido rechazado.');
  });

  // =========================================================================
  // PRUEBA 5: Validación de formato de teléfono
  // =========================================================================
  it('Debería rechazar el registro si el teléfono tiene un formato inválido', () => {
    console.log('Ejecutando Paso 5: Validación de formato de teléfono');

    const empleadoTelefonoInvalido = {
      nombre: 'Gerson',
      apellido: 'Sequeira',
      cedula: '212-090606-4003G',
      telefono: '123' // Muy corto / inválido
    };

    const resultado = registroEmpleado(empleadoTelefonoInvalido);

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('teléfono no tiene un formato válido');
    console.log('-> Paso 5 completado con éxito. Teléfono inválido rechazado.');
  });
});
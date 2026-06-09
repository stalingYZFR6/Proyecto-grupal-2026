const registroEmpleado = require('./registroEmpleado');

/**
 * HISTORIA DE USUARIO: HU-04 - Registrar Empleado
 * OBJETIVO: Validar que la información de los nuevos empleados cumpla con las reglas
 * de negocio del departamento de Recursos Humanos (campos obligatorios, nombres válidos,
 * formato de cédula nicaragüense y datos de contacto correctos).
 */
describe('Validación de Registro de Empleado (HU-04)', () => {

  console.log('Iniciando suite de pruebas para HU-04: Registrar Empleado');

  // =========================================================================
  // PRUEBA 1: Validación de campos obligatorios vacíos
  // =========================================================================
  it('No permite guardar con campos vacíos', () => {
    console.log('Ejecutando Prueba 1: El empleado no se registra con campos vacíos');

    // 1. PREPARACIÓN (Arrange):
    // Creamos un objeto de empleado con campos obligatorios vacíos (nombre, apellido, cédula).
    const empleadoIncompleto = {
      nombre: '',
      apellido: '',
      cedula: ''
    };

    // 2. EJECUCIÓN (Act):
    // Invocamos la función de validación.
    const resultado = registroEmpleado(empleadoIncompleto);

    // 3. VERIFICACIÓN (Assert):
    // Comprobamos que el sistema rechace el registro por falta de datos obligatorios.
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('campos requeridos');

    console.log('-> Prueba 1 completada con éxito. Registro incompleto bloqueado.');
  });

  // =========================================================================
  // PRUEBA 2: Validación de caracteres en nombre y apellido
  // =========================================================================
  it('Debe rechazar nombres con números o caracteres especiales', () => {
    console.log('Ejecutando Prueba 2: El nombre y apellido solo deben contener letras');

    // 1. PREPARACIÓN (Arrange):
    // Definimos un empleado cuyo nombre contiene números ('Juan123').
    const empleadoNombreInvalido = {
      nombre: 'Juan123',
      apellido: 'Pérez',
      cedula: '001-120395-0002A'
    };

    // 2. EJECUCIÓN (Act):
    // Ejecutamos la validación.
    const resultado = registroEmpleado(empleadoNombreInvalido);

    // 3. VERIFICACIÓN (Assert):
    // El sistema debe rechazar el registro indicando que solo se permiten letras.
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('solo deben contener letras');

    console.log('-> Prueba 2 completada con éxito. Nombre con caracteres inválidos rechazado.');
  });

  // =========================================================================
  // PRUEBA 3: Validación de formato de cédula nicaragüense
  // =========================================================================
  it('Debe rechazar cédulas con formato incorrecto', () => {
    console.log('Ejecutando Prueba 3: La cédula debe tener un formato válido');

    // 1. PREPARACIÓN (Arrange):
    // Definimos un empleado con una cédula que no tiene los guiones requeridos por el formato oficial.
    const empleadoCedulaInvalida = {
      nombre: 'Juan',
      apellido: 'Pérez',
      cedula: '0011203950002A' // Formato incorrecto (sin guiones)
    };

    // 2. EJECUCIÓN (Act):
    // Ejecutamos la validación.
    const resultado = registroEmpleado(empleadoCedulaInvalida);

    // 3. VERIFICACIÓN (Assert):
    // El sistema debe rechazar la cédula por no cumplir con el patrón oficial (000-000000-0000A).
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('cédula no tiene un formato válido');

    console.log('-> Prueba 3 completada con éxito. Cédula mal formateada rechazada.');
  });

  // =========================================================================
  // PRUEBA 4: Validación de correo electrónico opcional
  // =========================================================================
  it('Debe rechazar correos inválidos si se proporcionan', () => {
    console.log('Ejecutando Prueba 4: El correo electrónico opcional debe ser válido');

    // 1. PREPARACIÓN (Arrange):
    // Definimos un empleado con un correo electrónico mal estructurado.
    const empleadoCorreoInvalido = {
      nombre: 'Juan',
      apellido: 'Pérez',
      cedula: '001-120395-0002A',
      correo: 'correo_invalido'
    };

    // 2. EJECUCIÓN (Act):
    // Ejecutamos la validación.
    const resultado = registroEmpleado(empleadoCorreoInvalido);

    // 3. VERIFICACIÓN (Assert):
    // Aunque el correo es opcional, si se ingresa debe ser válido. Verificamos que sea rechazado.
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('correo electrónico no tiene un formato válido');

    console.log('-> Prueba 4 completada con éxito. Correo opcional inválido rechazado.');
  });

  // =========================================================================
  // PRUEBA 5: Registro exitoso de empleado
  // =========================================================================
  it('Permite registrar empleado correctamente', () => {
    console.log('Ejecutando Prueba 5: Registro de empleado exitoso con datos correctos');

    // 1. PREPARACIÓN (Arrange):
    // Definimos un empleado con todos sus datos correctos y en el formato esperado.
    const empleadoValido = {
      nombre: 'Magdiel',
      apellido: 'Urbina',
      cedula: '001-120395-0002A',
      correo: 'magdiel@empresa.com',
      telefono: '8888-8888'
    };

    // 2. EJECUCIÓN (Act):
    // Ejecutamos la validación.
    const resultado = registroEmpleado(empleadoValido);

    // 3. VERIFICACIÓN (Assert):
    // El resultado debe ser exitoso (valido: true).
    expect(resultado.valido).toBe(true);

    console.log('-> Prueba 5 completada con éxito. Empleado registrado correctamente.');
  });
});
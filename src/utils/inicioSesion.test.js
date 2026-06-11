const inicioSesion = require('./inicioSesion');

/**
 * HISTORIA DE USUARIO: HU-02 - Inicio de Sesión
 * OBJETIVO: Validar que las credenciales ingresadas por el usuario para acceder al sistema
 * cumplan con los requisitos mínimos de seguridad y formato antes de realizar la consulta al servidor.
 */
describe('Validación de Inicio de Sesión (HU-02)', () => {

  console.log('Iniciando suite de pruebas para HU-02: Inicio de Sesión');

  // =========================================================================
  // PRUEBA 1: Validación de campos vacíos
  // =========================================================================
  it('No permite iniciar sesión con campos vacíos', () => {
    console.log('Ejecutando Prueba 1: El inicio de sesión no permite campos vacíos');

    // 1. PREPARACIÓN (Arrange):
    // Simulamos el envío de credenciales vacías desde el formulario de login.
    const credencialesVacias = {
      correo: '',
      contrasena: ''
    };

    // 2. EJECUCIÓN (Act):
    // Invocamos la función de validación de inicio de sesión.
    const resultado = inicioSesion(credencialesVacias);

    // 3. VERIFICACIÓN (Assert):
    // Verificamos que el sistema rechace la solicitud por falta de campos obligatorios.
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('campos requeridos');

    console.log('-> Prueba 1 completada con éxito. Intento de login vacío bloqueado.');
  });

  // =========================================================================
  // PRUEBA 2: Validación de formato de correo electrónico
  // =========================================================================
  it('Debe rechazar correos con formato inválido', () => {
    console.log('Ejecutando Prueba 2: El correo debe tener un formato válido');

    // 1. PREPARACIÓN (Arrange):
    // Definimos credenciales con un correo electrónico mal estructurado.
    const credencialesCorreoInvalido = {
      correo: 'staling_empresa',
      contrasena: '123456'
    };

    // 2. EJECUCIÓN (Act):
    // Ejecutamos la validación.
    const resultado = inicioSesion(credencialesCorreoInvalido);

    // 3. VERIFICACIÓN (Assert):
    // Comprobamos que el sistema detecte el formato incorrecto del correo.
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('formato válido');

    console.log('-> Prueba 2 completada con éxito. Correo inválido rechazado.');
  });

  // =========================================================================
  // PRUEBA 3: Inicio de sesión exitoso
  // =========================================================================
  it('Permite iniciar sesión correctamente', () => {
    console.log('Ejecutando Prueba 3: Inicio de sesión exitoso con credenciales válidas');

    // 1. PREPARACIÓN (Arrange):
    // Definimos credenciales correctas y bien estructuradas.
    const credencialesValidas = {
      correo: 'staling@empresa.com',
      contrasena: '123456'
    };

    // 2. EJECUCIÓN (Act):
    // Ejecutamos la validación.
    const resultado = inicioSesion(credencialesValidas);

    // 3. VERIFICACIÓN (Assert):
    // El resultado debe ser exitoso, permitiendo continuar con el proceso de autenticación.
    expect(resultado.valido).toBe(true);

    console.log('-> Prueba 3 completada con éxito. Credenciales listas para autenticación.');
  });
});
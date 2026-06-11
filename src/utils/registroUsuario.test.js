const registroUsuario = require('./registroUsuario');

/**
 * HISTORIA DE USUARIO: HU-01 - Registro de Usuario
 * OBJETIVO: Validar que los datos ingresados para registrar un nuevo usuario en el sistema
 * cumplan con las reglas de negocio establecidas (campos obligatorios, formato de correo,
 * longitud de contraseña y roles permitidos).
 */
describe('Validación de Registro de Usuario (HU-01)', () => {

  console.log('Iniciando suite de pruebas para HU-01: Registro de Usuario');

  // =========================================================================
  // PRUEBA 1: Validación de campos obligatorios vacíos
  // =========================================================================
  it('No permite guardar con campos vacíos', () => {
    console.log('Ejecutando Prueba 1: El usuario no se registra con campos vacíos');

    // 1. PREPARACIÓN (Arrange):
    // Creamos un objeto de usuario con valores vacíos para simular que el usuario
    // envió el formulario sin completar los campos obligatorios.
    const usuarioInvalido = {
      correo: '',
      contrasena: '',
      rol: ''
    };

    // 2. EJECUCIÓN (Act):
    // Invocamos la función de validación pasándole el objeto incompleto.
    const resultado = registroUsuario(usuarioInvalido);

    // 3. VERIFICACIÓN (Assert):
    // Comprobamos que el resultado sea inválido (valido: false) y que el mensaje
    // de error indique claramente que faltan campos requeridos.
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('campos requeridos');
    
    console.log('-> Prueba 1 completada con éxito. Resultado esperado obtenido.');
  });

  // =========================================================================
  // PRUEBA 2: Validación del formato de correo electrónico
  // =========================================================================
  it('Debe rechazar correos con formato inválido', () => {
    console.log('Ejecutando Prueba 2: El correo electrónico debe tener un formato válido');

    // 1. PREPARACIÓN (Arrange):
    // Definimos un usuario con un correo que no cumple con la estructura estándar (carece de @ y dominio).
    const usuarioCorreoInvalido = {
      correo: 'correoInvalidoSinArroba',
      contrasena: '123456',
      rol: 'empleado'
    };

    // 2. EJECUCIÓN (Act):
    // Ejecutamos la validación con el correo mal estructurado.
    const resultado = registroUsuario(usuarioCorreoInvalido);

    // 3. VERIFICACIÓN (Assert):
    // Verificamos que la validación falle y retorne el mensaje de formato de correo inválido.
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('formato válido');

    console.log('-> Prueba 2 completada con éxito. El sistema rechazó correctamente el correo mal formado.');
  });

  // =========================================================================
  // PRUEBA 3: Validación de longitud mínima de contraseña
  // =========================================================================
  it('Debe rechazar contraseñas muy cortas', () => {
    console.log('Ejecutando Prueba 3: La contraseña debe tener al menos 6 caracteres');

    // 1. PREPARACIÓN (Arrange):
    // Creamos un usuario con una contraseña de solo 3 caracteres (el mínimo requerido es 6).
    const usuarioContrasenaCorta = {
      correo: 'staling@empresa.com',
      contrasena: '123',
      rol: 'empleado'
    };

    // 2. EJECUCIÓN (Act):
    // Enviamos el objeto a validar.
    const resultado = registroUsuario(usuarioContrasenaCorta);

    // 3. VERIFICACIÓN (Assert):
    // El sistema debe rechazar la solicitud indicando que la contraseña es demasiado corta.
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('al menos 6 caracteres');

    console.log('-> Prueba 3 completada con éxito. Contraseña corta rechazada correctamente.');
  });

  // =========================================================================
  // PRUEBA 4: Validación de roles permitidos
  // =========================================================================
  it('Debe rechazar roles no autorizados', () => {
    console.log('Ejecutando Prueba 4: El rol debe ser administrador o empleado');

    // 1. PREPARACIÓN (Arrange):
    // Definimos un usuario con un rol inexistente o no permitido en el sistema ('invitado').
    const usuarioRolInvalido = {
      correo: 'staling@empresa.com',
      contrasena: '123456',
      rol: 'invitado'
    };

    // 2. EJECUCIÓN (Act):
    // Ejecutamos la validación.
    const resultado = registroUsuario(usuarioRolInvalido);

    // 3. VERIFICACIÓN (Assert):
    // Comprobamos que el sistema no permita roles fuera de la lista blanca ('administrador', 'empleado').
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('rol seleccionado no es válido');

    console.log('-> Prueba 4 completada con éxito. Rol no autorizado bloqueado.');
  });

  // =========================================================================
  // PRUEBA 5: Registro exitoso con datos correctos
  // =========================================================================
  it('Permite registrar usuario correctamente', () => {
    console.log('Ejecutando Prueba 5: Registro exitoso con datos correctos');

    // 1. PREPARACIÓN (Arrange):
    // Creamos un usuario con todos los datos válidos y en el formato correcto.
    const usuarioValido = {
      correo: 'staling@empresa.com',
      contrasena: '123456',
      rol: 'administrador'
    };

    // 2. EJECUCIÓN (Act):
    // Ejecutamos la validación.
    const resultado = registroUsuario(usuarioValido);

    // 3. VERIFICACIÓN (Assert):
    // El resultado debe ser completamente exitoso (valido: true).
    expect(resultado.valido).toBe(true);

    console.log('-> Prueba 5 completada con éxito. El usuario cumple con todas las reglas de negocio.');
  });
});
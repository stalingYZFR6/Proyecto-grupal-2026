const validacionRoles = require('./validacionRoles');

/**
 * HISTORIA DE USUARIO: HU-03 - Validación de Roles y Permisos
 * OBJETIVO: Garantizar la seguridad del sistema controlando el acceso a las rutas
 * según el rol asignado al usuario y su estado de actividad (activo/inactivo).
 */
describe('Validación de Roles y Permisos (HU-03)', () => {

  console.log('Iniciando suite de pruebas para HU-03: Validación de Roles y Permisos');

  // =========================================================================
  // PRUEBA 1: Validación de rol asignado
  // =========================================================================
  it('Rechaza acceso si el usuario no tiene rol', () => {
    console.log('Ejecutando Prueba 1: El usuario debe tener un rol asignado');

    // 1. PREPARACIÓN (Arrange):
    // Creamos un usuario activo pero sin ningún rol asignado.
    const usuarioSinRol = {
      rol: '',
      activo: true
    };

    // 2. EJECUCIÓN (Act):
    // Intentamos acceder a una ruta administrativa restringida ('/empleados').
    const resultado = validacionRoles(usuarioSinRol, '/empleados');

    // 3. VERIFICACIÓN (Assert):
    // El sistema debe denegar el acceso debido a la ausencia de rol.
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('rol asignado');

    console.log('-> Prueba 1 completada con éxito. Acceso denegado por falta de rol.');
  });

  // =========================================================================
  // PRUEBA 2: Validación de usuario inactivo
  // =========================================================================
  it('Rechaza acceso a usuarios inactivos', () => {
    console.log('Ejecutando Prueba 2: Un usuario inactivo no puede acceder a ninguna ruta');

    // 1. PREPARACIÓN (Arrange):
    // Definimos un usuario con rol de administrador pero con estado inactivo (activo: false).
    const usuarioInactivo = {
      rol: 'administrador',
      activo: false
    };

    // 2. EJECUCIÓN (Act):
    // Intentamos acceder a una ruta general ('/dashboard').
    const resultado = validacionRoles(usuarioInactivo, '/dashboard');

    // 3. VERIFICACIÓN (Assert):
    // El sistema debe bloquear el acceso inmediatamente por estar inactivo.
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('inactivo');

    console.log('-> Prueba 2 completada con éxito. Usuario inactivo bloqueado correctamente.');
  });

  // =========================================================================
  // PRUEBA 3: Restricción de acceso a empleados en rutas administrativas
  // =========================================================================
  it('Restringe acceso de empleado a panel administrativo', () => {
    console.log('Ejecutando Prueba 3: Un empleado no puede acceder a rutas administrativas');

    // 1. PREPARACIÓN (Arrange):
    // Definimos un usuario activo con el rol de 'empleado'.
    const usuarioEmpleado = {
      rol: 'empleado',
      activo: true
    };

    // 2. EJECUCIÓN (Act):
    // Intentamos acceder a una ruta restringida para administradores ('/empleados').
    const resultado = validacionRoles(usuarioEmpleado, '/empleados');

    // 3. VERIFICACIÓN (Assert):
    // El sistema debe denegar el acceso indicando que se requieren permisos de administrador.
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('permisos de administrador');

    console.log('-> Prueba 3 completada con éxito. Empleado restringido de zona administrativa.');
  });

  // =========================================================================
  // PRUEBA 4: Acceso permitido a administradores en rutas administrativas
  // =========================================================================
  it('Permite acceso de administrador a panel administrativo', () => {
    console.log('Ejecutando Prueba 4: Un administrador puede acceder a rutas administrativas');

    // 1. PREPARACIÓN (Arrange):
    // Definimos un usuario activo con el rol de 'administrador'.
    const usuarioAdmin = {
      rol: 'administrador',
      activo: true
    };

    // 2. EJECUCIÓN (Act):
    // Intentamos acceder a la ruta restringida ('/empleados').
    const resultado = validacionRoles(usuarioAdmin, '/empleados');

    // 3. VERIFICACIÓN (Assert):
    // El acceso debe ser completamente autorizado (valido: true).
    expect(resultado.valido).toBe(true);

    console.log('-> Prueba 4 completada con éxito. Administrador autorizado correctamente.');
  });

  // =========================================================================
  // PRUEBA 5: Acceso permitido a empleados en rutas generales
  // =========================================================================
  it('Permite acceso de empleado a rutas generales', () => {
    console.log('Ejecutando Prueba 5: Un empleado puede acceder a rutas públicas o generales');

    // 1. PREPARACIÓN (Arrange):
    // Definimos un usuario activo con el rol de 'empleado'.
    const usuarioEmpleado = {
      rol: 'empleado',
      activo: true
    };

    // 2. EJECUCIÓN (Act):
    // Intentamos acceder a una ruta general o pública ('/catalogo').
    const resultado = validacionRoles(usuarioEmpleado, '/catalogo');

    // 3. VERIFICACIÓN (Assert):
    // El acceso debe ser permitido ya que la ruta no es de carácter administrativo restringido.
    expect(resultado.valido).toBe(true);

    console.log('-> Prueba 5 completada con éxito. Empleado autorizado en ruta general.');
  });
});
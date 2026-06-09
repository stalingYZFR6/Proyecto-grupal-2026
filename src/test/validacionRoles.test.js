const validacionRoles = require('./validacionRoles');

console.log('Prueba 1: El usuario debe tener un rol asignado');
describe('Validación de Roles y Permisos (HU-03)', () => {
  it('Rechaza acceso si el usuario no tiene rol', () => {
    const usuario = {
      rol: '',
      activo: true
    };

    const resultado = validacionRoles(usuario, '/empleados');
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('rol asignado');
  });

  console.log('Prueba 2: Un usuario inactivo no puede acceder a ninguna ruta');
  it('Rechaza acceso a usuarios inactivos', () => {
    const usuario = {
      rol: 'administrador',
      activo: false
    };

    const resultado = validacionRoles(usuario, '/dashboard');
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('inactivo');
  });

  console.log('Prueba 3: Un empleado no puede acceder a rutas administrativas');
  it('Restringe acceso de empleado a panel administrativo', () => {
    const usuario = {
      rol: 'empleado',
      activo: true
    };

    const resultado = validacionRoles(usuario, '/empleados');
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('permisos de administrador');
  });

  console.log('Prueba 4: Un administrador puede acceder a rutas administrativas');
  it('Permite acceso de administrador a panel administrativo', () => {
    const usuario = {
      rol: 'administrador',
      activo: true
    };

    const resultado = validacionRoles(usuario, '/empleados');
    expect(resultado.valido).toBe(true);
  });

  console.log('Prueba 5: Un empleado puede acceder a rutas públicas o generales');
  it('Permite acceso de empleado a rutas generales', () => {
    const usuario = {
      rol: 'empleado',
      activo: true
    };

    const resultado = validacionRoles(usuario, '/catalogo');
    expect(resultado.valido).toBe(true);
  });
});
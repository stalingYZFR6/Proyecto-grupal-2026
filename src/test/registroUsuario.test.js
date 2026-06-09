const registroUsuario = require('./registroUsuario');

console.log('Prueba 1: El usuario no se registra con campos vacíos');
describe('Validación de Registro de Usuario (HU-01)', () => {
  it('No permite guardar con campos vacíos', () => {
    const usuario = {
      correo: '',
      contrasena: '',
      rol: ''
    };

    const resultado = registroUsuario(usuario);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('campos requeridos');
  });

  console.log('Prueba 2: El correo electrónico debe tener un formato válido');
  it('Debe rechazar correos con formato inválido', () => {
    const usuario = {
      correo: 'correoInvalido',
      contrasena: '123456',
      rol: 'empleado'
    };

    const resultado = registroUsuario(usuario);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('formato válido');
  });

  console.log('Prueba 3: La contraseña debe tener al menos 6 caracteres');
  it('Debe rechazar contraseñas muy cortas', () => {
    const usuario = {
      correo: 'staling@empresa.com',
      contrasena: '123',
      rol: 'empleado'
    };

    const resultado = registroUsuario(usuario);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('al menos 6 caracteres');
  });

  console.log('Prueba 4: El rol debe ser administrador o empleado');
  it('Debe rechazar roles no autorizados', () => {
    const usuario = {
      correo: 'staling@empresa.com',
      contrasena: '123456',
      rol: 'invitado'
    };

    const resultado = registroUsuario(usuario);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('rol seleccionado no es válido');
  });

  console.log('Prueba 5: Registro exitoso con datos correctos');
  it('Permite registrar usuario correctamente', () => {
    const usuario = {
      correo: 'staling@empresa.com',
      contrasena: '123456',
      rol: 'administrador'
    };

    const resultado = registroUsuario(usuario);
    expect(resultado.valido).toBe(true);
  });
});
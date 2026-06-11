const inicioSesion = require('./inicioSesion');

console.log('Prueba 1: El inicio de sesión no permite campos vacíos');
describe('Validación de Inicio de Sesión (HU-02)', () => {
  it('No permite iniciar sesión con campos vacíos', () => {
    const credenciales = {
      correo: '',
      contrasena: ''
    };

    const resultado = inicioSesion(credenciales);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('campos requeridos');
  });

  console.log('Prueba 2: El correo debe tener un formato válido');
  it('Debe rechazar correos con formato inválido', () => {
    const credenciales = {
      correo: 'staling_empresa',
      contrasena: '123456'
    };

    const resultado = inicioSesion(credenciales);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('formato válido');
  });

  console.log('Prueba 3: Inicio de sesión exitoso con credenciales válidas');
  it('Permite iniciar sesión correctamente', () => {
    const credenciales = {
      correo: 'staling@empresa.com',
      contrasena: '123456'
    };

    const resultado = inicioSesion(credenciales);
    expect(resultado.valido).toBe(true);
  });
});
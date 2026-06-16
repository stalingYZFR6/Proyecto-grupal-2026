const validarUsuario = require('./validarUsuario');

describe('Validación de acceso al sistema (Variaciones)', () => {

  // Escenario 1: Acceso Denegado (Credenciales incorrectas)
  describe('Escenario: Acceso Denegado', () => {
    const credencialesInvalidas = { correo: 'falso@gmail.com', password: '123' };

    console.log('Paso: Intentando iniciar sesión con credenciales incorrectas');
    it('Debe denegar el acceso cuando las credenciales no son reales', () => {
      const resultado = validarUsuario(credencialesInvalidas.correo, credencialesInvalidas.password);
      expect(resultado).toBe(false); // Acceso denegado
    });
  });

  // Escenario 2: Acceso Autorizado (Credenciales reales)
  describe('Escenario: Acceso Autorizado', () => {
    // Ajusta esto según los datos reales que valide tu función en login.js
    const credencialesValidas = { correo: 'admin@empresa.com', password: 'password123' };

    console.log('Paso: Intentando iniciar sesión con credenciales válidas');
    it('Debe autorizar el acceso cuando las credenciales son correctas', () => {
      const resultado = validarUsuario(credencialesValidas.correo, credencialesValidas.password);
      expect(resultado).toBe(true); // Acceso autorizado
    });
  });

});
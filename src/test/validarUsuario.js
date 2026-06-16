function validarUsuario(correo, password) {
  // Supongamos estos datos reales
  const usuarioValido = {
    correo: 'admin@empresa.com',
    password: 'password123'
  };

  // Lógica: Solo devuelve true si ambos coinciden
  if (correo === usuarioValido.correo && password === usuarioValido.password) {
    return true;
  }
  
  return false;
}

module.exports = validarUsuario;
// test/editarEmpleado.js
function validarEdicionEmpleado(empleado, cedulasExistentes = []) {
  const { nombre, apellido, cedula, correo, telefono, inss } = empleado;

  if (!nombre || !apellido || !cedula || !correo || !telefono || !inss) {
    return { valido: false, mensaje: 'Campos incompletos' };
  }

  // Validaciones de formato
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre)) return { valido: false, mensaje: 'Nombre inválido' };
  if (!/\S+@\S+\.\S+/.test(correo)) return { valido: false, mensaje: 'Correo inválido' };
  if (!/^\d{4}\s?\d{4}$/.test(telefono)) return { valido: false, mensaje: 'Teléfono inválido' };

  // Validar "sin duplicar cédula" (Si la cédula ya existe en el sistema en otro registro)
  if (cedulasExistentes.includes(cedula)) {
    return { valido: false, mensaje: 'Cédula duplicada en el sistema' };
  }

  return { valido: true, mensaje: 'Datos actualizados correctamente' };
}

module.exports = validarEdicionEmpleado;
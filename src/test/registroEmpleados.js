function validarRegistroEmpleado(empleado, cedulasRegistradas = []) {

  const {
    nombre,
    apellido,
    cedula,
    correo,
    telefono,
    inss
  } = empleado;

  // Campos obligatorios
  if (
    !nombre ||
    !apellido ||
    !cedula ||
    !correo ||
    !telefono ||
    !inss
  ) {
    return true;
  }

  // Nombre válido
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre)) {
    return true;
  }

  // Apellido válido
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(apellido)) {
    return true;
  }

  // Cédula válida
  if (!/^\d{3}-\d{6}-\d{4}[A-Z]$/.test(cedula)) {
    return true;
  }

  // Cédula duplicada
  if (cedulasRegistradas.includes(cedula)) {
    return true;
  }

  // Correo válido
  if (!/\S+@\S+\.\S+/.test(correo)) {
    return true;
  }

  // Teléfono válido
  if (!/^\d{4}\s?\d{4}$/.test(telefono)) {
    return true;
  }

  return false;
}

module.exports = validarRegistroEmpleado;
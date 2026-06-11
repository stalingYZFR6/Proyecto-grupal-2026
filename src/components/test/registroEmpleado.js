function registroEmpleado(empleado) {
    const { nombre, apellido, cedula, correo, telefono, direccion } = empleado || {};

    // 1. Validación de campos obligatorios
    if (!nombre || !nombre.trim() || !apellido || !apellido.trim() || !cedula || !cedula.trim()) {
        return { valido: false, mensaje: "Todos los campos obligatorios (Nombre, Apellido, Cédula) deben estar llenos." };
    }

    // 2. Validación de formato de Nombre y Apellido (solo letras y espacios)
    const regexLetras = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
    if (!regexLetras.test(nombre)) {
        return { valido: false, mensaje: "El nombre solo debe contener letras." };
    }
    if (!regexLetras.test(apellido)) {
        return { valido: false, mensaje: "El apellido solo debe contener letras." };
    }

    // 3. Validación de formato de Cédula (ej: 001-123456-0001X o similar)
    const regexCedula = /^\d{3}-\d{6}-\d{4}[A-Z]$/i;
    if (!regexCedula.test(cedula)) {
        return { valido: false, mensaje: "La cédula no tiene un formato válido (Ej: 001-123456-0001X)." };
    }

    // 4. Validación de Correo Electrónico (si se proporciona)
    if (correo && correo.trim() !== "") {
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexCorreo.test(correo)) {
            return { valido: false, mensaje: "El correo electrónico no tiene un formato válido." };
        }
    }

    // 5. Validación de Teléfono (si se proporciona, ej: 8 dígitos o con guiones/espacios)
    if (telefono && telefono.trim() !== "") {
        const regexTelefono = /^[0-9\s-+()]{8,15}$/;
        if (!regexTelefono.test(telefono)) {
            return { valido: false, mensaje: "El teléfono no tiene un formato válido." };
        }
    }

    return { valido: true, mensaje: "Empleado validado correctamente." };
}

module.exports = registroEmpleado;
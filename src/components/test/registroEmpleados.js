// Función de validación para el registro de empleados

export function validarRegistroEmpleado(empleado) {
    if (!empleado) {
        return { valido: false, error: "El formulario está vacío" };
    }

    const { nombre, apellido, cedula, telefono, correo, inss } = empleado;

    // Validar campos obligatorios completos
    if (!nombre || !nombre.trim()) {
        return { valido: false, error: "El nombre es obligatorio" };
    }
    if (!apellido || !apellido.trim()) {
        return { valido: false, error: "El apellido es obligatorio" };
    }

    // Validar formato de Cédula (Ej: 001-280590-1001U)
    const cedulaRegex = /^\d{3}-\d{6}-\d{4}[A-Z]$/;
    if (!cedula || !cedulaRegex.test(cedula)) {
        return { valido: false, error: "Cédula no válida" };
    }

    // Validar formato de Teléfono (8 dígitos)
    const telefonoRegex = /^\d{8}$/;
    if (!telefono || !telefonoRegex.test(telefono)) {
        return { valido: false, error: "Teléfono no válido" };
    }

    // Validar formato de Correo Electrónico
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correo || !correoRegex.test(correo)) {
        return { valido: false, error: "Correo no válido" };
    }

    // Validar formato de INSS (9 dígitos)
    const inssRegex = /^\d{9}$/;
    if (!inss || !inssRegex.test(inss)) {
        return { valido: false, error: "INSS no válido" };
    }

    return { valido: true, error: null };
}
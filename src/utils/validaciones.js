/**
 * Valida los datos de registro de un empleado.
 * @param {Object} empleado - Datos del empleado a registrar.
 * @returns {Object} Resultado de la validación { valido: boolean, error: string|null }
 */
export const validarRegistroEmpleado = (empleado) => {
    if (!empleado) {
        return { valido: false, error: "No se proporcionaron datos del empleado" };
    }

    const { nombre, apellido, cedula, correo, telefono, inss } = empleado;

    // 1. Datos completos (Campos obligatorios)
    if (!nombre?.trim() || !apellido?.trim() || !cedula?.trim() || !correo?.trim() || !telefono?.trim() || !inss?.trim()) {
        return { valido: false, error: "Todos los campos son obligatorios" };
    }

    // 2. Validación de Correo Electrónico
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo)) {
        return { valido: false, error: "El formato del correo electrónico no es válido" };
    }

    // 3. Validación de Teléfono (Ej: 8 dígitos numéricos)
    const regexTelefono = /^\d{8}$/;
    if (!regexTelefono.test(telefono.replace(/[-\s]/g, ""))) {
        return { valido: false, error: "El teléfono debe contener exactamente 8 dígitos numéricos" };
    }

    // 4. Validación de Cédula Nicaragüense (Ej: 001-123456-0001X)
    const regexCedula = /^\d{3}-\d{6}-\d{4}[A-Z]$/i;
    if (!regexCedula.test(cedula)) {
        return { valido: false, error: "El formato de la cédula no es válido (Ej: 001-123456-0001A)" };
    }

    // 5. Validación de INSS (Ej: 7 a 9 dígitos numéricos)
    const regexInss = /^\d{7,9}$/;
    if (!regexInss.test(inss)) {
        return { valido: false, error: "El número de INSS debe contener entre 7 y 9 dígitos numéricos" };
    }

    return { valido: true, error: null };
};
export const registrarEmpleado = (nuevoEmpleado, empleadosExistentes = []) => {
    if (!nuevoEmpleado.nombre || !nuevoEmpleado.nombre.trim()) {
        throw new Error("El nombre es obligatorio");
    }
    if (!nuevoEmpleado.apellido || !nuevoEmpleado.apellido.trim()) {
        throw new Error("El apellido es obligatorio");
    }
    if (!nuevoEmpleado.cedula || !nuevoEmpleado.cedula.trim()) {
        throw new Error("La cédula es obligatoria");
    }

    const cedulaDuplicada = empleadosExistentes.some(
        (emp) => emp.cedula === nuevoEmpleado.cedula
    );
    if (cedulaDuplicada) {
        throw new Error("La cédula ya está registrada");
    }

    return [
        ...empleadosExistentes,
        { ...nuevoEmpleado, id_empleado: empleadosExistentes.length + 1 }
    ];
};
/**
 * Valida los campos obligatorios de un empleado.
 * @param {Object} empleado - Datos del empleado a registrar.
 * @returns {Object} Resultado de la validación con estado y posibles errores.
 */
export const validarCamposEmpleado = (empleado) => {
    const errores = {};

    if (!empleado.nombre || empleado.nombre.trim() === "") {
        errores.nombre = "El nombre es obligatorio";
    }
    if (!empleado.apellido || empleado.apellido.trim() === "") {
        errores.apellido = "El apellido es obligatorio";
    }
    if (!empleado.cedula || empleado.cedula.trim() === "") {
        errores.cedula = "La cédula es obligatoria";
    }
    if (!empleado.correo || !empleado.correo.includes("@")) {
        errores.correo = "El correo electrónico no es válido";
    }
    if (!empleado.telefono || empleado.telefono.trim() === "") {
        errores.telefono = "El teléfono es obligatorio";
    }

    return {
        valido: Object.keys(errores).length === 0,
        errores
    };
};

/**
 * Simula el proceso completo de registro de un empleado siguiendo los pasos del caso de prueba.
 * @param {Object} empleado - Datos del empleado.
 * @param {Array} baseDatosSimulada - Lista actual de empleados.
 * @returns {Object} Resultado del proceso con el estado de cada paso.
 */
export const procesarRegistroEmpleado = (empleado, baseDatosSimulada = []) => {
    const pasos = {
        paso1_abrirFormulario: "Proceso completado: Formulario disponible",
        paso2_rellenarCampos: "Proceso completado: Datos ingresados correctamente",
        paso3_validarInformacion: null,
        paso4_guardarRegistro: null,
        empleadoRegistrado: null
    };

    // Paso 3: Validar información ingresada
    const validacion = validarCamposEmpleado(empleado);
    if (!validacion.valido) {
        pasos.paso3_validarInformacion = "Fallo: Errores de validación encontrados";
        pasos.paso4_guardarRegistro = "Fallo: No se puede guardar con datos inválidos";
        return { exito: false, pasos, errores: validacion.errores };
    }

    pasos.paso3_validarInformacion = "Proceso completado: Información validada sin errores";

    // Paso 4: Guardar registro (Simulación de inserción en base de datos)
    const nuevoEmpleado = {
        id_empleado: baseDatosSimulada.length + 1,
        ...empleado,
        fecha_registro: new Date().toISOString().split("T")[0]
    };

    pasos.paso4_guardarRegistro = "Proceso completado: Registro procesado con éxito";
    pasos.empleadoRegistrado = nuevoEmpleado;

    return {
        exito: true,
        pasos,
        baseDatosActualizada: [...baseDatosSimulada, nuevoEmpleado]
    };
};
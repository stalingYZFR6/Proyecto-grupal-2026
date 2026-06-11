import { validarCamposEmpleado, procesarRegistroEmpleado } from "../../utils/registroEmpleadoHelper";

describe("Caso de Prueba: Registro de Empleados", () => {
    
    it("Paso 1 y 2: Debería permitir rellenar los campos obligatorios correctamente", () => {
        const empleadoValido = {
            nombre: "Carlos",
            apellido: "Mendoza",
            cedula: "001-121295-0002A",
            correo: "carlos.mendoza@empresa.com",
            telefono: "8888-8888",
            direccion: "Managua, Nicaragua"
        };

        const validacion = validarCamposEmpleado(empleadoValido);
        expect(validacion.valido).toBe(true);
        expect(Object.keys(validacion.errores).length).toBe(0);
    });

    it("Paso 3: Debería fallar la validación si faltan campos obligatorios o el correo es inválido", () => {
        const empleadoInvalido = {
            nombre: "",
            apellido: "Mendoza",
            cedula: "001-121295-0002A",
            correo: "correo-invalido",
            telefono: "",
            direccion: "Managua"
        };

        const validacion = validarCamposEmpleado(empleadoInvalido);
        expect(validacion.valido).toBe(false);
        expect(validacion.errores.nombre).toBe("El nombre es obligatorio");
        expect(validacion.errores.correo).toBe("El correo electrónico no es válido");
        expect(validacion.errores.telefono).toBe("El teléfono es obligatorio");
    });

    it("Paso 4: Debería procesar y guardar el registro del empleado correctamente (Post-condiciones)", () => {
        const baseDatosSimulada = [
            { id_empleado: 1, nombre: "Ana", apellido: "Gómez", cedula: "001-111111-0001A", correo: "ana@empresa.com", telefono: "7777-7777" }
        ];

        const nuevoEmpleado = {
            nombre: "Juan",
            apellido: "Pérez",
            cedula: "001-222222-0002B",
            correo: "juan.perez@empresa.com",
            telefono: "5555-5555",
            direccion: "Masaya"
        };

        const resultado = procesarRegistroEmpleado(nuevoEmpleado, baseDatosSimulada);

        // Verificar que el proceso fue exitoso
        expect(resultado.exito).toBe(true);

        // Verificar los estados de los pasos según la tabla de pruebas
        expect(resultado.pasos.paso1_abrirFormulario).toBe("Proceso completado: Formulario disponible");
        expect(resultado.pasos.paso2_rellenarCampos).toBe("Proceso completado: Datos ingresados correctamente");
        expect(resultado.pasos.paso3_validarInformacion).toBe("Proceso completado: Información validada sin errores");
        expect(resultado.pasos.paso4_guardarRegistro).toBe("Proceso completado: Registro procesado con éxito");

        // Verificar Post-condiciones (Guardado en base de datos simulada)
        expect(resultado.baseDatosActualizada.length).toBe(2);
        expect(resultado.pasos.empleadoRegistrado.id_empleado).toBe(2);
        expect(resultado.pasos.empleadoRegistrado.nombre).toBe("Juan");
    });
});
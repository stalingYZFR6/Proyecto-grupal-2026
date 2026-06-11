import { validarRegistroEmpleado } from './registroEmpleados';

describe('Caso de Prueba: Registro de Empleados', () => {
    
    it('Debería validar correctamente un empleado con datos válidos y completos', () => {
        const empleadoValido = {
            nombre: "Juan",
            apellido: "Pérez",
            cedula: "001-120595-1002A",
            telefono: "88888888",
            correo: "juan.perez@empresa.com",
            inss: "123456789"
        };

        const resultado = validarRegistroEmpleado(empleadoValido);
        expect(resultado).toEqual({ valido: true, error: null });
    });

    it('Debería fallar si la cédula no cumple con el formato requerido', () => {
        const empleadoCedulaInvalida = {
            nombre: "Juan",
            apellido: "Pérez",
            cedula: "123-INVALIDO",
            telefono: "88888888",
            correo: "juan.perez@empresa.com",
            inss: "123456789"
        };

        const resultado = validarRegistroEmpleado(empleadoCedulaInvalida);
        expect(resultado.valido).toBe(false);
        expect(resultado.error).toBe("Cédula no válida");
    });

    it('Debería fallar si el teléfono no tiene 8 dígitos', () => {
        const empleadoTelefonoInvalido = {
            nombre: "Juan",
            apellido: "Pérez",
            cedula: "001-120595-1002A",
            telefono: "12345",
            correo: "juan.perez@empresa.com",
            inss: "123456789"
        };

        const resultado = validarRegistroEmpleado(empleadoTelefonoInvalido);
        expect(resultado.valido).toBe(false);
        expect(resultado.error).toBe("Teléfono no válido");
    });

    it('Debería fallar si el correo electrónico no tiene un formato válido', () => {
        const empleadoCorreoInvalido = {
            nombre: "Juan",
            apellido: "Pérez",
            cedula: "001-120595-1002A",
            telefono: "88888888",
            correo: "correo-invalido",
            inss: "123456789"
        };

        const resultado = validarRegistroEmpleado(empleadoCorreoInvalido);
        expect(resultado.valido).toBe(false);
        expect(resultado.error).toBe("Correo no válido");
    });

    it('Debería fallar si el INSS no tiene 9 dígitos', () => {
        const empleadoInssInvalido = {
            nombre: "Juan",
            apellido: "Pérez",
            cedula: "001-120595-1002A",
            telefono: "88888888",
            correo: "juan.perez@empresa.com",
            inss: "999"
        };

        const resultado = validarRegistroEmpleado(empleadoInssInvalido);
        expect(resultado.valido).toBe(false);
        expect(resultado.error).toBe("INSS no válido");
    });
});
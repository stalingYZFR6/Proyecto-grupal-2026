import { validarRegistroEmpleado } from '../../utils/validaciones';

describe('Probar el caso de uso: Registro de Empleados', () => {
    
    it('Debería retornar válido cuando todos los datos son correctos y completos', () => {
        const empleadoValido = {
            nombre: 'Juan',
            apellido: 'Pérez',
            cedula: '001-120595-0002A',
            correo: 'juan.perez@empresa.com',
            telefono: '88888888',
            inss: '1234567'
        };

        const resultado = validarRegistroEmpleado(empleadoValido);
        expect(resultado).toEqual({ valido: true, error: null });
    });

    it('Debería fallar si falta algún campo obligatorio (Datos incompletos)', () => {
        const empleadoIncompleto = {
            nombre: 'Juan',
            apellido: '', // Apellido vacío
            cedula: '001-120595-0002A',
            correo: 'juan.perez@empresa.com',
            telefono: '88888888',
            inss: '1234567'
        };

        const resultado = validarRegistroEmpleado(empleadoIncompleto);
        expect(resultado.valido).toBe(false);
        expect(resultado.error).toBe('Todos los campos son obligatorios');
    });

    it('Debería fallar si el formato del correo electrónico es inválido', () => {
        const empleadoCorreoInvalido = {
            nombre: 'Juan',
            apellido: 'Pérez',
            cedula: '001-120595-0002A',
            correo: 'correo-invalido', // Correo sin @ ni dominio
            telefono: '88888888',
            inss: '1234567'
        };

        const resultado = validarRegistroEmpleado(empleadoCorreoInvalido);
        expect(resultado.valido).toBe(false);
        expect(resultado.error).toBe('El formato del correo electrónico no es válido');
    });

    it('Debería fallar si el teléfono no tiene exactamente 8 dígitos', () => {
        const empleadoTelefonoInvalido = {
            nombre: 'Juan',
            apellido: 'Pérez',
            cedula: '001-120595-0002A',
            correo: 'juan.perez@empresa.com',
            telefono: '12345', // Teléfono muy corto
            inss: '1234567'
        };

        const resultado = validarRegistroEmpleado(empleadoTelefonoInvalido);
        expect(resultado.valido).toBe(false);
        expect(resultado.error).toBe('El teléfono debe contener exactamente 8 dígitos numéricos');
    });

    it('Debería fallar si la cédula no cumple con el formato requerido', () => {
        const empleadoCedulaInvalida = {
            nombre: 'Juan',
            apellido: 'Pérez',
            cedula: '0011205950002A', // Cédula sin guiones
            correo: 'juan.perez@empresa.com',
            telefono: '88888888',
            inss: '1234567'
        };

        const resultado = validarRegistroEmpleado(empleadoCedulaInvalida);
        expect(resultado.valido).toBe(false);
        expect(resultado.error).toBe('El formato de la cédula no es válido (Ej: 001-123456-0001A)');
    });

    it('Debería fallar si el INSS no tiene entre 7 y 9 dígitos numéricos', () => {
        const empleadoInssInvalido = {
            nombre: 'Juan',
            apellido: 'Pérez',
            cedula: '001-120595-0002A',
            correo: 'juan.perez@empresa.com',
            telefono: '88888888',
            inss: '1234' // INSS muy corto
        };

        const resultado = validarRegistroEmpleado(empleadoInssInvalido);
        expect(resultado.valido).toBe(false);
        expect(resultado.error).toBe('El número de INSS debe contener entre 7 y 9 dígitos numéricos');
    });
});
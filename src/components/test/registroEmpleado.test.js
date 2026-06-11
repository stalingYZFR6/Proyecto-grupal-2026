import { registrarEmpleado } from '../../utils/registroEmpleado';

describe('Caso de Prueba: Registro de Empleados', () => {
    const empleadosExistentes = [
        { id_empleado: 1, nombre: "Carlos", apellido: "Mendoza", cedula: "001-101090-1001X", correo: "carlos@empresa.com" }
    ];

    it('Debería registrar un empleado correctamente con todos sus datos obligatorios', () => {
        const empleadoValido = {
            nombre: "Juan",
            apellido: "Pérez",
            cedula: "001-120395-1002A",
            correo: "juan.perez@empresa.com",
            telefono: "88888888",
            direccion: "Managua"
        };

        const resultado = registrarEmpleado(empleadoValido, empleadosExistentes);
        expect(resultado).toHaveLength(2);
        expect(resultado[1].nombre).toBe("Juan");
        expect(resultado[1].cedula).toBe("001-120395-1002A");
    });

    it('Debería lanzar un error si falta el nombre o apellido', () => {
        const empleadoInvalidoSinNombre = {
            nombre: "",
            apellido: "Gómez",
            cedula: "001-150892-1005B",
            correo: "gomez@empresa.com"
        };

        expect(() => {
            registrarEmpleado(empleadoInvalidoSinNombre, empleadosExistentes);
        }).toThrow("El nombre es obligatorio");
    });

    it('Debería lanzar un error si la cédula ya existe en el sistema', () => {
        const empleadoDuplicado = {
            nombre: "Pedro",
            apellido: "Pérez",
            cedula: "001-101090-1001X",
            correo: "pedro@empresa.com"
        };

        expect(() => {
            registrarEmpleado(empleadoDuplicado, empleadosExistentes);
        }).toThrow("La cédula ya está registrada");
    });
});
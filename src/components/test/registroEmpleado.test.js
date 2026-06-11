const registroEmpleado = require('./registroEmpleado');

console.log("Iniciando pruebas unitarias para el Registro de Empleados...");

describe("Pruebas de Validación de Registro de Empleado", () => {

    it("Prueba 1: No permite registrar con campos obligatorios vacíos", () => {
        const empleado = {
            nombre: "",
            apellido: "",
            cedula: ""
        };

        const resultado = registroEmpleado(empleado);
        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toContain("campos obligatorios");
    });

    it("Prueba 2: El nombre y apellido solo deben contener letras", () => {
        const empleado = {
            nombre: "Juan123",
            apellido: "Pérez",
            cedula: "001-120599-0002A"
        };

        const resultado = registroEmpleado(empleado);
        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toContain("nombre solo debe contener letras");
    });

    it("Prueba 3: La cédula debe cumplir con el formato correcto", () => {
        const empleado = {
            nombre: "Juan",
            apellido: "Pérez",
            cedula: "cedula-invalida"
        };

        const resultado = registroEmpleado(empleado);
        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toContain("La cédula no tiene un formato válido");
    });

    it("Prueba 4: El correo electrónico debe tener un formato válido si se proporciona", () => {
        const empleado = {
            nombre: "Juan",
            apellido: "Pérez",
            cedula: "001-120599-0002A",
            correo: "correo_invalido"
        };

        const resultado = registroEmpleado(empleado);
        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toContain("correo electrónico no tiene un formato válido");
    });

    it("Prueba 5: El teléfono debe tener un formato válido si se proporciona", () => {
        const empleado = {
            nombre: "Juan",
            apellido: "Pérez",
            cedula: "001-120599-0002A",
            correo: "juan@empresa.com",
            telefono: "abc-123"
        };

        const resultado = registroEmpleado(empleado);
        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toContain("teléfono no tiene un formato válido");
    });

    it("Prueba 6: Registro de empleado exitoso con datos correctos", () => {
        const empleado = {
            nombre: "Juan",
            apellido: "Pérez",
            cedula: "001-120599-0002A",
            correo: "juan@empresa.com",
            telefono: "8888-8888",
            direccion: "Managua, Nicaragua"
        };

        const resultado = registroEmpleado(empleado);
        expect(resultado.valido).toBe(true);
        expect(resultado.mensaje).toContain("Empleado validado correctamente");
    });
});
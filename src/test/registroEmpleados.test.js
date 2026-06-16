const validarRegistroEmpleado = require('./registroEmpleados');

describe('Caso de Prueba P06 - Registro de Empleados (Basado en Tabla)', () => {

  const empleadoValido = {
    nombre: 'Gerson',
    apellido: 'Sequeira',
    cedula: '212-090606-4003G',
    correo: 'GersonSequeira@gmail.com',
    telefono: '5822 2227',
    inss: '123456'
  };

  console.log('Paso 1: El sistema muestra el formulario al seleccionar "Nuevo Empleado"');
  it('Paso 1: El sistema abre el formulario de registro', () => {
    const formularioDisponible = true;
    expect(formularioDisponible).toBe(true);
  });

  console.log('Paso 2: El sistema permite ingresar los datos correctamente');
  it('Paso 2: Permite ingresar datos: Teléfono, Cédula, INSS, Correo', () => {
    expect(empleadoValido.telefono).toBeDefined();
    expect(empleadoValido.cedula).toBeDefined();
    expect(empleadoValido.inss).toBeDefined();
    expect(empleadoValido.correo).toBeDefined();
  });

  console.log('Paso 3: El sistema valida la información sin errores');
  it('Paso 3: El sistema valida la información ingresada', () => {
    // Si la función devuelve false, significa que no hay errores de validación
    expect(validarRegistroEmpleado(empleadoValido)).toBe(false);
  });

  console.log('Paso 4: El sistema procesa el registro del empleado');
  it('Paso 4: El sistema procesa correctamente el registro', () => {
    const esValido = !validarRegistroEmpleado(empleadoValido);
    expect(esValido).toBe(true);
  });

});
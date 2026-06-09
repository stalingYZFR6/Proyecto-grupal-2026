const registroEmpleado = require('./registroEmpleado');

console.log('Prueba 1: El empleado no se registra con campos vacíos');
describe('Validación de Registro de Empleado (HU-04)', () => {
  it('No permite guardar con campos vacíos', () => {
    const empleado = {
      nombre: '',
      apellido: '',
      cedula: ''
    };

    const resultado = registroEmpleado(empleado);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('campos requeridos');
  });

  console.log('Prueba 2: El nombre y apellido solo deben contener letras');
  it('Debe rechazar nombres con números o caracteres especiales', () => {
    const empleado = {
      nombre: 'Juan123',
      apellido: 'Pérez',
      cedula: '001-120395-0002A'
    };

    const resultado = registroEmpleado(empleado);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('solo deben contener letras');
  });

  console.log('Prueba 3: La cédula debe tener un formato válido');
  it('Debe rechazar cédulas con formato incorrecto', () => {
    const empleado = {
      nombre: 'Juan',
      apellido: 'Pérez',
      cedula: '0011203950002A' // Sin guiones
    };

    const resultado = registroEmpleado(empleado);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('cédula no tiene un formato válido');
  });

  console.log('Prueba 4: El correo electrónico opcional debe ser válido');
  it('Debe rechazar correos inválidos si se proporcionan', () => {
    const empleado = {
      nombre: 'Juan',
      apellido: 'Pérez',
      cedula: '001-120395-0002A',
      correo: 'correo_invalido'
    };

    const resultado = registroEmpleado(empleado);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('correo electrónico no tiene un formato válido');
  });

  console.log('Prueba 5: Registro de empleado exitoso con datos correctos');
  it('Permite registrar empleado correctamente', () => {
    const empleado = {
      nombre: 'Magdiel',
      apellido: 'Urbina',
      cedula: '001-120395-0002A',
      correo: 'magdiel@empresa.com',
      telefono: '8888-8888'
    };

    const resultado = registroEmpleado(empleado);
    expect(resultado.valido).toBe(true);
  });
});
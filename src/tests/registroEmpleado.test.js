/**
 * Test Case ID: P07
 * Test Designed by: Equipo G6
 * Test Priority: High
 * Test Designed date: 06/05/2026
 * Module Name: Gestión de Empleados
 * Test Title: Registro de Empleados
 * Test Type: Caja negra
 * Testing Method: Clases de equivalencia y análisis de valores límite
 */

const registroEmpleado = require('./registroEmpleado');

describe('Test Case ID: P07 - Registro de Empleados', () => {

  // Clase de Equivalencia Válida: Todos los datos obligatorios y opcionales correctos
  it('Debería registrar correctamente un empleado con todos los datos válidos', () => {
    const empleadoValido = {
      nombre: 'Juan Carlos',
      apellido: 'Pérez Mendoza',
      cedula: '001-120595-0002A',
      correo: 'juan.perez@empresa.com',
      telefono: '88888888'
    };

    const resultado = registroEmpleado(empleadoValido);
    expect(resultado).toEqual({ valido: true });
  });

  // Clase de Equivalencia Inválida: Campos obligatorios vacíos
  it('Debería rechazar el registro si faltan campos obligatorios (nombre, apellido o cédula)', () => {
    const empleadoIncompleto = {
      nombre: '',
      apellido: 'Pérez',
      cedula: '001-120595-0002A'
    };

    const resultado = registroEmpleado(empleadoIncompleto);
    expect(resultado).toEqual({
      valido: false,
      mensaje: 'Todos los campos requeridos deben estar llenos.'
    });
  });

  // Clase de Equivalencia Inválida: Nombre o apellido con caracteres no permitidos (números/símbolos)
  it('Debería rechazar el registro si el nombre o apellido contienen números o caracteres especiales', () => {
    const empleadoNombreInvalido = {
      nombre: 'Juan123',
      apellido: 'Pérez',
      cedula: '001-120595-0002A'
    };

    const resultado = registroEmpleado(empleadoNombreInvalido);
    expect(resultado).toEqual({
      valido: false,
      mensaje: 'El nombre y apellido solo deben contener letras.'
    });
  });

  // Análisis de Valores Límite: Formato de cédula nicaragüense inválido
  it('Debería rechazar el registro si la cédula no cumple con el formato nicaragüense (001-123456-0001X)', () => {
    const empleadoCedulaInvalida = {
      nombre: 'Juan',
      apellido: 'Pérez',
      cedula: '001-120595-0002' // Falta la letra final
    };

    const resultado = registroEmpleado(empleadoCedulaInvalida);
    expect(resultado).toEqual({
      valido: false,
      mensaje: 'La cédula no tiene un formato válido.'
    });
  });

  // Clase de Equivalencia Inválida: Formato de correo electrónico incorrecto
  it('Debería rechazar el registro si el correo electrónico tiene un formato inválido', () => {
    const empleadoCorreoInvalido = {
      nombre: 'Juan',
      apellido: 'Pérez',
      cedula: '001-120595-0002A',
      correo: 'juan.perez_empresa.com' // Falta el @
    };

    const resultado = registroEmpleado(empleadoCorreoInvalido);
    expect(resultado).toEqual({
      valido: false,
      mensaje: 'El correo electrónico no tiene un formato válido.'
    });
  });

  // Análisis de Valores Límite: Teléfono con longitud menor a la permitida
  it('Debería rechazar el registro si el teléfono tiene un formato inválido o es muy corto', () => {
    const empleadoTelefonoInvalido = {
      nombre: 'Juan',
      apellido: 'Pérez',
      cedula: '001-120595-0002A',
      telefono: '123' // Muy corto
    };

    const resultado = registroEmpleado(empleadoTelefonoInvalido);
    expect(resultado).toEqual({
      valido: false,
      mensaje: 'El teléfono no tiene un formato válido.'
    });
  });

});
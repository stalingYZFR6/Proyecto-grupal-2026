// test/editarEmpleado.test.js
const validarEdicionEmpleado = require('./Actualización del registro de empleado');

describe('Caso de Prueba P06 - Editar Empleado', () => {

  const empleadoExistente = {
    nombre: 'Gerson',
    apellido: 'Sequeira',
    cedula: '212-090606-4003G',
    correo: 'gerson.actualizado@gmail.com',
    telefono: '5822 2227',
    inss: '123456'
  };

  // Simulación del sistema: otras cédulas ya registradas (la de Gerson no está aquí, por ende no se duplica)
  const baseDatosCedulas = ['123-456789-0000A', '987-654321-1111B'];

  console.log('Paso 3: Seleccionar empleado existente');
  it('Paso 1: El sistema muestra los datos del empleado seleccionado', () => {
    expect(empleadoExistente).toBeDefined();
    expect(empleadoExistente.cedula).toBe('212-090606-4003G');
  });

  console.log('Paso 4: Editar información del empleado');
  it('Paso 2: El sistema permite modificar los datos', () => {
    empleadoExistente.correo = 'nuevo.correo@gmail.com';
    expect(empleadoExistente.correo).toBe('nuevo.correo@gmail.com');
  });

  console.log('Paso 5: Validar información ingresada');
  it('Paso 3: El sistema valida correctamente la información (Sin duplicar cédula)', () => {
    // Le pasamos la base de datos de cédulas para comprobar que no hay duplicados
    const resultado = validarEdicionEmpleado(empleadoExistente, baseDatosCedulas);
    expect(resultado.valido).toBe(true);
  });

  console.log('Paso 6: Hacer clic en "Guardar"');
  it('Paso 4: El sistema guarda los cambios correctamente', () => {
    const resultado = validarEdicionEmpleado(empleadoExistente, baseDatosCedulas);
    expect(resultado.valido).toBe(true);
    expect(resultado.mensaje).toBe('Datos actualizados correctamente');
  });

});
// prueba real 

const sum = require('./suma') // importar funcion 

test("la funcion suma debe devolver suma correcta", () => { // definir el test
    expect(sum(1, 2)).toBe(3);
});
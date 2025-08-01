import { describe, it, expect } from 'vitest'
import { userQueryValidation, userBodyValidation } from '../validations/user.validation.js'
import { authValidation, registerValidation } from '../validations/auth.validation.js'
import { contactoEmergenciaBodyValidation } from '../validations/contactoEmergencia.validation.js'
import { vehiculoBodyValidation } from '../validations/vehiculo.validation.js'
import { viajeBodyValidation } from '../validations/viaje.validation.js'
describe('Validación de usuario', () => {
  it('Falla si el email no es institucional', () => {
    const { error } = userQueryValidation.validate({
      email: 'usuario@gmail.com', rut: '12.345.678-9'
    })
    expect(error).toBeTruthy()
  })
  it('Pasa con email institucional válido', () => {
    const { error } = userQueryValidation.validate({
      email: 'usuario@alumnos.ubiobio.cl', rut: '12.345.678-9'
    })
    expect(error).toBeFalsy()
  })
  it('Pasa con rut sin puntos', () => {
    const { error } = userQueryValidation.validate({
      email: 'usuario@alumnos.ubiobio.cl', rut: '12345678-9'
    })
    expect(error).toBeFalsy()
  })
  it('Pasa con rut correctamente formateado', () => {
    const { error } = userQueryValidation.validate({
      email: 'usuario@alumnos.ubiobio.cl', rut: '12.345.678-K'
    })
    expect(error).toBeFalsy()
  })
  it('No pasa con rut sin digito verificador', () => {
    const { error } = userQueryValidation.validate({
      email: 'usuario@alumnos.ubiobio.cl', rut: '12.345.678-'
    })
    expect(error).toBeTruthy()
  })
  it('No pasa con un rut con letras', () => {
    const { error } = userQueryValidation.validate({
      email: 'usuario@alumnos.ubiobio.cl', rut: '12.345.67A-9'
    })
    expect(error).toBeTruthy()
  })
  it('No pasa el nombre con caracteres inválidos', () => {
    const { error } = userBodyValidation.validate({
      email: 'usuario@alumnos.ubiobio.cl', rut: '12.345.678-K', nombreCompleto: 'Usuario132'
    })
    expect(error).toBeTruthy()
  })
  it('Pasa con un nombre completo válido', () => {
    const { error } = userBodyValidation.validate({
      email: 'usuario@alumnos.ubiobio.cl', rut: '12.345.678-K', nombreCompleto: 'Usuario Ejemplo'
    })
    expect(error).toBeFalsy()
  })
  it('No pasa si la fecha de nacimiento es futura', () => {
    const { error } = userBodyValidation.validate({
      email: 'usuario@alumnos.ubiobio.cl', rut: '12.345.678-K', fechaNacimiento: '3000-01-01'
    })
    expect(error).toBeTruthy()
  })
  it('Pasa si la fecha de nacimiento es antigua', () => {
    const { error } = userBodyValidation.validate({
      email: 'usuario@alumnos.ubiobio.cl', rut: '12.345.678-K', fechaNacimiento: '2002-01-01'
    })
    expect(error).toBeFalsy()
  })
  it('No pasa si el genero es inválido', () => {
    const { error } = userBodyValidation.validate({
      email: 'usuario@alumnos.ubiobio.cl', rut: '12.345.678-K', fechaNacimiento: '3000-01-01', genero: 'anima'
    })
    expect(error).toBeTruthy()
  })
  it('Pasa si el genero es válido', () => {
    const { error } = userBodyValidation.validate({
      email: 'usuario@alumnos.ubiobio.cl', rut: '12.345.678-K', fechaNacimiento: '2002-01-01', genero: 'masculino'
    })
    expect(error).toBeFalsy()
  })
  it('No pasa si la tarjeta tiene letras', () => {
    const { error } = userBodyValidation.validate({
      email: 'usuario@alumnos.ubiobio.cl', rut: '12.345.678-K',
      tarjetas: [
      {
        numero: '1234-5678-AAAA-5678', cvv: '123', fechaVencimiento: '12/2026',nombreTitular: 'Juan Pérez', 
        tipo: 'VISA', banco: 'Banco Ejemplo', limiteCredito: 100000
      }]
    })
    expect(error).toBeTruthy()
  })
  it('Pasa si la tarjeta tiene solo numeros', () => {
    const { error } = userBodyValidation.validate({
      email: 'usuario@alumnos.ubiobio.cl', rut: '12.345.678-K',
      tarjetas: [
      {
        numero: '1234-5678-1222-1234', cvv: '123', fechaVencimiento: '12/2027', nombreTitular: 'Juan Pérez',
        tipo: 'VISA', banco: 'Banco Ejemplo', limiteCredito: 100000
      }]
    })
    expect(error).toBeFalsy()
  })
  it('No pasa si la tarjeta tiene cvv con letras', () => {
    const { error } = userBodyValidation.validate({
      email: 'usuario@alumnos.ubiobio.cl', rut: '12.345.678-K',
      tarjetas: [
      {
        numero: '1234-5678-1222-1234', cvv: '1AA',fechaVencimiento: '12/2027', nombreTitular: 'Juan Pérez',
        tipo: 'VISA', banco: 'Banco Ejemplo', limiteCredito: 100000
      }]
    })
    expect(error).toBeTruthy()
  })
  it('No pasa si el limite de credito es negativo', () => {
    const { error } = userBodyValidation.validate({
      email: 'usuario@alumnos.ubiobio.cl', rut: '12.345.678-K',
      tarjetas: [
      {
        numero: '1234-5678-1222-1234', cvv: '123', fechaVencimiento: '12/2027', nombreTitular: 'Juan Pérez',
        tipo: 'VISA', banco: 'Banco Ejemplo', limiteCredito: -1000
      }]
    })
    expect(error).toBeTruthy()
  })
})

describe('Validación de Autenticación', () => {
  it('Se inicia sesión con credenciales válidas', () => {
    const { error } = authValidation.validate({
      email: 'usuario@alumnos.ubiobio.cl',
      password: '123ubb123'
    })
    expect(error).toBeFalsy()
  })
  it('No inicia sesión con correo no institucional', () => {
    const { error } = authValidation.validate({
      email: 'usuario@gmail.com',
      password: '123ubb123'
    })
    expect(error).toBeTruthy()
  })
  it('No inicia sesión con contraseña vacía', () => {
    const { error } = authValidation.validate({
      email: 'usuario@gmail.com',
      password: ''
    })
    expect(error).toBeTruthy()
  })
})

describe('Validación de Registro', () => {
  it('Se registra con datos válidos', () => {
    const datosValidos = {
      nombreCompleto: 'Jose Manriquez Ulloa', rut: '13.456.789-K', email: 'josemanriquez@alumnos.ubiobio.cl', password: 'ubb12345', 
      rol: 'estudiante', carrera: 'Ingeniería Civil Informática', fechaNacimiento: '2002-02-26', genero: 'femenino' };
    const { error } = registerValidation.validate(datosValidos);
    expect(error).toBeFalsy()});
  it('No se registra con correo no institucional', () => {
    const datosValidos = {
      nombreCompleto: 'Jose Manriquez Ulloa', rut: '13.456.789-K', email: 'josemanriquez@gmail.cl', password: 'ubb12345',
      rol: 'estudiante', carrera: 'Ingeniería Civil Informática', fechaNacimiento: '2002-02-26', genero: 'femenino' };
    const { error } = registerValidation.validate(datosValidos);
    expect(error).toBeTruthy()});
  it('No se registra con contraseña vacía', () => {
    const datosValidos = {
      nombreCompleto: 'Jose Manriquez Ulloa', rut: '13.456.789-K', email: 'josemanriquez@alumnos.ubiobio.cl', password: '',
      rol: 'estudiante', carrera: 'Ingeniería Civil Informática', fechaNacimiento: '2002-02-26', genero: 'femenino' };
    const { error } = registerValidation.validate(datosValidos);
    expect(error).toBeTruthy()});
  it('No se registra con un nombre inválido', () => {
    const datosValidos = {
      nombreCompleto: 'Jose Manri132', rut: '13.456.789-K', email: 'josemanriquez@alumnos.ubiobio.cl', password: 'afnafklad',
      rol: 'estudiante', carrera: 'Ingeniería Civil Informática', fechaNacimiento: '2002-02-26', genero: 'femenino' };
    const { error } = registerValidation.validate(datosValidos);
    expect(error).toBeTruthy()});
  it('No se registra con un RUT inválido', () => {
   const datosValidos = {
      nombreCompleto: 'Jose Manriquez', rut: '13.456.789-q', email: 'josemanriquez@alumnos.ubiobio.cl', password: 'afnafklad',
      rol: 'estudiante', carrera: 'Ingeniería Civil Informática', fechaNacimiento: '2002-02-26',genero: 'femenino' };
    const { error } = registerValidation.validate(datosValidos);
    expect(error).toBeTruthy()});
  it('No se registra con un RUT sin dígito verificador', () => {
    const datosValidos = {
      nombreCompleto: 'Jose Manriquez', rut: '13.456.789', email: 'josemanriquez@alumnos.ubiobio.cl', password: 'afnafklad',
      rol: 'estudiante', carrera: 'Ingeniería Civil Informática', fechaNacimiento: '2002-02-26', genero: 'femenino' };
    const { error } = registerValidation.validate(datosValidos);
    expect(error).toBeTruthy()});
  it('No se registra con un RUT con letras', () => {
    const datosValidos = {
      nombreCompleto: 'Jose Manriquez', rut: '13.456.7AB-5', email: 'josemanriquez@alumnos.ubiobio.cl', password: 'afnafklad',
      rol: 'estudiante', carrera: 'Ingeniería Civil Informática', fechaNacimiento: '2002-02-26', genero: 'femenino' };
    const { error } = registerValidation.validate(datosValidos);
    expect(error).toBeTruthy()});
})

describe('Validación de Contactos', () => {
  it('Pasa con un contacto de emergencia válido', () => {
    const { error } = contactoEmergenciaBodyValidation.validate({
      nombre: 'Juan Pérez',
      telefono: '+56912345678',
      email: 'juan.perez@alumnos.ubiobio.cl'
    });
    expect(error).toBeFalsy()
  });
  it('No pasa con un nombre inválido', () => {
    const { error } = contactoEmergenciaBodyValidation.validate({
      nombre: 'Juan123',
      telefono: '+56912345678',
      email: 'juan.perez@alumnos.ubiobio.cl'
    });
    expect(error).toBeTruthy()
  });
  it('No pasa con un teléfono válido con otro código de país', () => {
    const { error } = contactoEmergenciaBodyValidation.validate({
      nombre: 'Juan Pérez',
      telefono: '+51912345678',
      email: 'juan.perez@alumnos.ubiobio.cl'
    });
    expect(error).toBeTruthy()
  });
})

describe('Validación de Vehículos', () => {
  it('Valida correctamente un vehículo válido', () => {
    const vehiculoValido = {
      patente: "AB1234", tipo: "sedan", marca: "Toyota", modelo: "Corolla", año: 2024, color: "Blanco", 
      nro_asientos: 5, tipoCombustible: "bencina",documentacion: "Revisión técnica y permiso de circulación al día."
    };
    const { error } = vehiculoBodyValidation.validate(vehiculoValido);
    expect(error).toBeFalsy();
  });
  it('No valida un vehículo con patente inválida', () => {
    const vehiculoInvalido = {
      patente: "AB1234S", tipo: "sedan", marca: "Toyota", modelo: "Corolla", año: 2024, color: "Blanco", 
      nro_asientos: 5, tipoCombustible: "bencina", documentacion: "Revisión técnica y permiso de circulación al día."
    };
    const { error } = vehiculoBodyValidation.validate(vehiculoInvalido);
    expect(error).toBeTruthy();
  });
  it('No valida un vehículo con tipo inválido', () => {
    const vehiculoInvalido = {
      patente: "AB1234", tipo: "camión", marca: "Toyota", modelo: "Corolla", año: 2024, color: "Blanco", 
      nro_asientos: 5, tipoCombustible: "bencina", documentacion: "Revisión técnica y permiso de circulación al día."
    };
    const { error } = vehiculoBodyValidation.validate(vehiculoInvalido);
    expect(error).toBeTruthy();
  });
  it('No valida un vehículo con año futuro', () => {
    const vehiculoInvalido = {
      patente: "AB1234", tipo: "sedan", marca: "Toyota", modelo: "Corolla", año: 2030, color: "Blanco", 
      nro_asientos: 5, tipoCombustible: "bencina", documentacion: "Revisión técnica y permiso de circulación al día."
    };
    const { error } = vehiculoBodyValidation.validate(vehiculoInvalido);
    expect(error).toBeTruthy();
  });
  it('No valida un vehículo con número de asientos inválido', () => {
    const vehiculoInvalido = {
      patente: "AB1234", tipo: "sedan", marca: "Toyota", modelo: "Corolla", año: 2024, color: "Blanco", 
      nro_asientos: 15, tipoCombustible: "bencina", documentacion: "Revisión técnica y permiso de circulación al día."
    };
    const { error } = vehiculoBodyValidation.validate(vehiculoInvalido);
    expect(error).toBeTruthy();
  });
  it('No valida un vehículo con tipo de combustible inválido', () => {
    const vehiculoInvalido = {
      patente: "AB1234", tipo: "sedan", marca: "Toyota", modelo: "Corolla", año: 2024, color: "Blanco", 
      nro_asientos: 5, tipoCombustible: "agua", documentacion: "Revisión técnica y permiso de circulación al día."
    };
    const { error } = vehiculoBodyValidation.validate(vehiculoInvalido);
    expect(error).toBeTruthy();
  });
});

const ubicacionOrigen = {
  displayName: 'Campus UBB Concepción', lat: -36.826, lon: -73.050, esOrigen: true
};
const ubicacionDestino = {
  displayName: 'Terminal Collao', lat: -36.810, lon: -73.055, esOrigen: false
};
describe('viajeBodyValidation', () => {
  it('debe aceptar un viaje válido solo ida', () => {
    const result = viajeBodyValidation.validate({
      ubicaciones: [ubicacionOrigen, ubicacionDestino], fechaHoraIda: new Date(Date.now() + 3600000), viajeIdaYVuelta: false, maxPasajeros: 4, 
      soloMujeres: false, flexibilidadSalida: '± 5 minutos', precio: 2500, plazasDisponibles: 4, comentarios: '', vehiculoPatente: 'AB1234'
    });
    expect(result.error).toBeUndefined();
  });
  it('Debe rechazar si no se proporciona la fecha de vuelta en viaje ida y vuelta', () => {
    const result = viajeBodyValidation.validate({
      ubicaciones: [ubicacionOrigen, ubicacionDestino], fechaHoraIda: new Date(Date.now() + 3600000), viajeIdaYVuelta: true,
      maxPasajeros: 4, precio: 3000, plazasDisponibles: 4, vehiculoPatente: 'AB1234'
    });
    expect(result.error?.message).toContain('Para viajes de ida y vuelta debe especificar fecha y hora de vuelta');
  });
  it('Debe rechazar si hay menos de 2 ubicaciones', () => {
    const result = viajeBodyValidation.validate({
      ubicaciones: [ubicacionOrigen], fechaHoraIda: new Date(Date.now() + 3600000), viajeIdaYVuelta: false,
      maxPasajeros: 4, precio: 3000, plazasDisponibles: 4, vehiculoPatente: 'AB1234'
    });
    expect(result.error?.message).toContain('Debe proporcionar exactamente 2 ubicaciones');
  });
  it('Debe rechazar si plazasDisponibles supera maxPasajeros', () => {
    const result = viajeBodyValidation.validate({
      ubicaciones: [ubicacionOrigen, ubicacionDestino], fechaHoraIda: new Date(Date.now() + 3600000),
      viajeIdaYVuelta: false, maxPasajeros: 3, precio: 3000, plazasDisponibles: 4, vehiculoPatente: 'AB1234'
    });
    expect(result.error?.message).toContain('"plazasDisponibles" must be less than or equal to ref:maxPasajeros');
  });
  it('Debe rechazar si la fecha de ida es en el pasado', () => {
    const result = viajeBodyValidation.validate({
      ubicaciones: [ubicacionOrigen, ubicacionDestino], fechaHoraIda: new Date(Date.now() - 3600000), viajeIdaYVuelta: false,
      maxPasajeros: 4, precio: 3000, plazasDisponibles: 4, vehiculoPatente: 'AB1234'
    });
    expect(result.error?.message).toContain('La fecha y hora de ida no puede ser anterior al momento actual');
  });
});

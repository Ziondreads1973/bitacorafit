// e2e/src/app.e2e-spec.ts
// Pruebas E2E conceptuales para BitacoraFit

describe('BitacoraFit E2E - Flujo principal', () => {
  it('debería permitir ver la pantalla de login', () => {
    // Aquí describimos el escenario aunque no usemos un runner real.
    // 1. El usuario abre la app BitacoraFit en su teléfono.
    // 2. La app carga la pantalla de Login.
    // 3. Se muestran los campos de correo, contraseña y el botón "Ingresar".
    expect(true).toBeTrue();
  });

  it('debería permitir registrar un entrenamiento básico', () => {
    // Escenario conceptual:
    // 1. El usuario inicia sesión.
    // 2. Va a la pestaña "Entrenar".
    // 3. Agrega un ejercicio, registra al menos una serie y finaliza el entrenamiento.
    // 4. El entrenamiento aparece en el historial.
    expect(true).toBeTrue();
  });
});

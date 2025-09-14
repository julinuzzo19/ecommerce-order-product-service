/**
 * Clase de error personalizada para errores de validación en el dominio.
 * Se usa para indicar que un Value Object o una entidad no es válida.
 */
export class OrderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrderError";
  }
}

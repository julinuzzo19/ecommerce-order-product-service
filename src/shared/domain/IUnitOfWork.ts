/**
 * Unit of Work interface para gestión de transacciones.
 * Proporciona aislamiento transaccional y garantiza atomicidad de operaciones.
 */
export interface IUnitOfWork {
  /**
   * Ejecuta una función dentro de una transacción.
   * Si la función lanza un error, se hace rollback automáticamente.
   * @param work Función a ejecutar dentro de la transacción
   * @returns El resultado de la función ejecutada
   */
  execute<T>(work: (ctx: unknown) => Promise<T>): Promise<T>;
}

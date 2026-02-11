import { PrismaClient } from '../../../generated/prisma/client.js';
import { IUnitOfWork } from '../../domain/IUnitOfWork.js';

/**
 * Implementación de Unit of Work usando Prisma.
 * Gestiona transacciones con Interactive Transactions de Prisma.
 */
export class PrismaUnitOfWork implements IUnitOfWork {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Ejecuta una función dentro de una transacción de Prisma.
   * El contexto transaccional se pasa a la función para que pueda
   * ser utilizado por los repositorios.
   *
   * @param work Función que recibe el cliente transaccional de Prisma
   * @returns Resultado de la función ejecutada
   */
  async execute<T>(
    work: (
      ctx: Omit<
        PrismaClient,
        | '$connect'
        | '$disconnect'
        | '$on'
        | '$transaction'
        | '$use'
        | '$extends'
      >,
    ) => Promise<T>,
  ): Promise<T> {
    return await this.prisma.$transaction(async (tx) => {
      return await work(tx);
    });
  }
}

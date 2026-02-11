import { PrismaClient } from '../../../../generated/prisma/client.js';
import { Customer } from '../../domain/Customer.js';
import { ICustomerRepository } from '../../domain/ICustomerRepository.js';
import { CustomerMapper } from '../mappers/CustomerMapper.js';
import { CustomId } from '../../../../shared/domain/value-objects/CustomId.js';
import { PrismaErrorHandler } from '../../../../shared/infrastructure/database/PrismaErrorHandler.js';

type PrismaTransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export class CustomerPrismaRepository implements ICustomerRepository {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly errorHandler: PrismaErrorHandler = new PrismaErrorHandler(),
  ) {}

  /**
   * Obtiene el cliente a usar (transaccional o normal) para operaciones de escritura
   */
  private getClient(tx?: PrismaTransactionClient): PrismaTransactionClient {
    return tx || this.prisma;
  }

  async save(customer: Customer, tx?: PrismaTransactionClient): Promise<void> {
    try {
      const client = this.getClient(tx);
      await client.customer.create({
        data: CustomerMapper.toPrisma(customer),
      });
    } catch (error) {
      this.errorHandler.handleError(error, 'save customer');
    }
  }

  async findAll(): Promise<Customer[]> {
    try {
      const customers = await this.prisma.customer.findMany({
        include: { address: true },
      });
      return customers.map(CustomerMapper.fromPrisma);
    } catch (error) {
      this.errorHandler.handleError(error, 'find all customers');
    }
  }

  async delete(id: CustomId, tx?: PrismaTransactionClient): Promise<void> {
    try {
      const client = this.getClient(tx);
      await client.customer.delete({
        where: { id: id.value },
      });
    } catch (error) {
      this.errorHandler.handleError(error, 'delete customer');
    }
  }

  async findById(id: CustomId): Promise<Customer | null> {
    try {
      const customer = await this.prisma.customer.findUnique({
        where: { id: id.value },
        include: { address: true },
      });
      return customer ? CustomerMapper.fromPrisma(customer) : null;
    } catch (error) {
      this.errorHandler.handleError(error, 'find customer by ID');
    }
  }
}

import { PrismaClient } from "@prisma/client";
import { Customer } from "../../domain/Customer.js";
import { ICustomerRepository } from "../../domain/ICustomerRepository.js";
import { CustomerMapper } from "../mappers/CustomerMapper.js";
import { CustomerId } from "../../domain/value-objects/CustomerId.js";

export class CustomerPrismaRepository implements ICustomerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(customer: Customer): Promise<void> {
    await this.prisma.customer.create({
      data: CustomerMapper.toPrisma(customer),
    });
  }
  async findAll(): Promise<Customer[]> {
    const customers = await this.prisma.customer.findMany({
      include: { address: true },
    });
    return customers.map(CustomerMapper.fromPrisma);
  }
  async delete(id: CustomerId): Promise<void> {
    await this.prisma.customer.delete({
      where: { id: id.value },
    });
  }
  async findById(id: CustomerId): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { id: id.value },
      include: { address: true },
    });
    return customer ? CustomerMapper.fromPrisma(customer) : null;
  }
}

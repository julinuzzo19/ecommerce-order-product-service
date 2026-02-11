import { PrismaClient } from "../../../../generated/prisma/client.js";
import { IProductRepository } from "../../domain/IProductRepository.js";
import { Product } from "../../domain/Product.js";
import { ProductMapper } from "../mappers/ProductMapper.js";
import { PrismaErrorHandler } from "../../../../shared/infrastructure/database/PrismaErrorHandler.js";
import { CustomId } from "../../../../shared/domain/value-objects/CustomId.js";

type PrismaTransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export class ProductPrismaRepository implements IProductRepository {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly errorHandler: PrismaErrorHandler = new PrismaErrorHandler()
  ) {}

  /**
   * Obtiene el cliente a usar (transaccional o normal) para operaciones de escritura
   */
  private getClient(tx?: PrismaTransactionClient): PrismaTransactionClient {
    return tx || this.prisma;
  }

  async delete(id: CustomId, tx?: PrismaTransactionClient): Promise<void> {
    try {
      const client = this.getClient(tx);
      await client.product.delete({ where: { id: id.value } });
    } catch (error) {
      this.errorHandler.handleError(error, "delete product");
    }
  }

  async save(product: Product, tx?: PrismaTransactionClient): Promise<void> {
    try {
      const client = this.getClient(tx);
      await client.product.create({
        data: ProductMapper.toPrisma(product),
      });
    } catch (error) {
      this.errorHandler.handleError(error, "save product");
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      const products = await this.prisma.product.findMany();
      return products.map(ProductMapper.fromPrisma);
    } catch (error) {
      this.errorHandler.handleError(error, "find all products");
    }
  }

  async findById(id: CustomId): Promise<Product | null> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: id.value },
      });

      if (!product) return null;

      return product ? ProductMapper.fromPrisma(product) : null;
    } catch (error) {
      this.errorHandler.handleError(error, "find product by ID");
    }
  }

  async findBySku(sku: string): Promise<Product | null> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { sku },
      });

      if (!product) return null;

      return product ? ProductMapper.fromPrisma(product) : null;
    } catch (error) {
      this.errorHandler.handleError(error, "find product by SKU");
    }
  }
}

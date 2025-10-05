import { PrismaClient } from "@prisma/client";
import { IProductRepository } from "../../domain/IProductRepository.js";
import { Product } from "../../domain/Product.js";
import { ProductMapper } from "../mappers/ProductMapper.js";
import { ProductId } from "../../../../shared/domain/value-objects/ProductId.js";
import { PrismaErrorHandler } from "../../../../shared/infrastructure/database/PrismaErrorHandler.js";

export class ProductPrismaRepository implements IProductRepository {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly errorHandler: PrismaErrorHandler = new PrismaErrorHandler()
  ) {}

  async delete(id: ProductId): Promise<void> {
    try {
      await this.prisma.product.delete({ where: { id: id.value } });
    } catch (error) {
      this.errorHandler.handleError(error, "delete product");
    }
  }
  async save(product: Product): Promise<void> {
    try {
      await this.prisma.product.create({
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

  async findById(id: ProductId): Promise<Product | null> {
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

  async isProductInStock(
    productId: ProductId,
    quantity: number
  ): Promise<boolean> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId.value },
      });

      if (!product?.id) {
        return false;
      }

      return product.stockQuantity >= quantity;
    } catch (error) {
      this.errorHandler.handleError(error, "check product stock");
    }
  }
}

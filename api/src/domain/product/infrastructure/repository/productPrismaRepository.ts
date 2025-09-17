import { PrismaClient } from "@prisma/client";
import { IProductRepository } from "../../domain/IProductRepository.js";
import { ProductId } from "../../domain/value-objects/ProductId.js";
import { Product } from "../../domain/Product.js";
import { ProductMapper } from "../mappers/ProductMapper.js";

export class ProductPrismaRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async delete(id: ProductId): Promise<void> {
    await this.prisma.product.delete({ where: { id: id.value } });
  }
  async save(product: Product): Promise<void> {
    await this.prisma.product.create({
      data: ProductMapper.toPrisma(product),
    });
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany();
    return products.map(ProductMapper.fromPrisma);
  }

  async findById(id: ProductId): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id: id.value },
    });

    if (!product) return null;

    return product ? ProductMapper.fromPrisma(product) : null;
  }
}

import { PrismaClient } from "@prisma/client";
import { IProductRepository } from "../../domain/IProductRepository.js";
import { ProductId } from "../../domain/value-objects/ProductId.js";
import { Product } from "../../domain/Product.js";
import { ProductCategory } from "../../domain/value-objects/ProductCategory.js";

export class ProductPrismaRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  delete(id: ProductId): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async save(product: Product): Promise<void> {
    // Mapear la entidad de dominio `Product` a un objeto que Prisma entiende.
    const data = {
      id: product.getId().value,
      sku: product.getSku(),
      name: product.getName(),
      description: product.getDescription() || null,
      price: product.getPrice(),
      stockQuantity: product.getStockQuantity(),
      isActive: product.getIsActive(),
      createdAt: product.getCreatedAt(),
      category: product.getCategory().getName(),
    };

    await this.prisma.product.create({ data });
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany();
    return products.map(productData => this.mapToDomainEntity(productData));
  }

  async findById(id: ProductId): Promise<Product | null> {
    const productData = await this.prisma.product.findUnique({
      where: { id: id.value }
    });

    if (!productData) return null;
    
    return this.mapToDomainEntity(productData);
  }

  private mapToDomainEntity(productData: any): Product {
    return new Product(
      new ProductId(productData.id),
      productData.name,
      productData.description || "",
      productData.price,
      new ProductCategory(productData.category || "General"),
      productData.stockQuantity,
      productData.sku,
      productData.isActive,
      productData.createdAt
    );
  }
}

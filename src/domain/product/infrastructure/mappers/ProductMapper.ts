import { Prisma } from "@prisma/client";
import { Product } from "../../domain/Product.js";
import { ProductCategory } from "../../domain/value-objects/ProductCategory.js";
import { CustomId } from "../../../../shared/domain/value-objects/CustomId.js";

export class ProductMapper {
  static toPrisma(product: Product): Prisma.ProductCreateInput {
    return {
      id: product.getId().value,
      name: product.getName(),
      description: product.getDescription(),
      price: product.getPrice(),
      createdAt: product.getCreatedAt(),
      sku: product.getSku(),
      isActive: product.getIsActive(),
      category: product.getCategory().getName(),
    };
  }

  static fromPrisma(data: Prisma.ProductGetPayload<undefined>): Product {
    return new Product({
      id: new CustomId(data.id),
      category: new ProductCategory(data.category),
      name: data.name,
      description: data.description ?? undefined,
      price: data.price.toNumber(),
      createdAt: data.createdAt,
      sku: data.sku,
      isActive: data.isActive,
    });
  }
}

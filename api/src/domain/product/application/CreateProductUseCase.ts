import { ProductError } from "../domain/errors/ProductError.js";
import { IProductRepository } from "../domain/IProductRepository.js";
import { Product } from "../domain/Product.js";
import { ProductCategory } from "../domain/value-objects/ProductCategory.js";
import { ProductId } from "../domain/value-objects/ProductId.js";
import { CreateProductDTO } from "./dtos/CreateProductDTO.js";
import { createProductSchema } from "./createProductSchema.js";
import { ProductResponseDTO } from "./dtos/ProductResponseDTO.js";
import { genericMapToDTO } from "../../../shared/utils/genericMapper.js";

export class CreateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  // Implement the logic to create a product
  public execute = async (data: CreateProductDTO) => {
    // Validate and transform the incoming data
    const validation = createProductSchema.safeParse(data);

    if (!validation.success) {
      throw new ProductError("Invalid product data");
    }

    const product = this.mapToEntity(validation.data);

    await this.productRepository.save(product);

    return this.mapToDTO(product);
  };

  private mapToEntity(product: CreateProductDTO): Product {
    const productId = new ProductId(product.id);
    const productCategory = new ProductCategory(product.category);

    return new Product({
      id: productId,
      name: product.name,
      description: product.description,
      price: product.price,
      category: productCategory,
      sku: product.sku,
      stockQuantity: product.stockQuantity,
    });
  }

  private mapToDTO(product: Product): ProductResponseDTO {
    return genericMapToDTO<Product, ProductResponseDTO>(product, {
      id: (entity) => entity.getId().value,
      sku: (entity) => entity.getSku(),
      name: (entity) => entity.getName(),
      description: (entity) => entity.getDescription(),
      price: (entity) => entity.getPrice(),
      stockQuantity: (entity) => entity.getStockQuantity(),
      isActive: (entity) => entity.getIsActive(),
      createdAt: (entity) => entity.getCreatedAt(),
      category: (entity) => entity.getCategory().getName(),
      isAvailable: (entity) => entity.isAvailable(),
    });
  }
}

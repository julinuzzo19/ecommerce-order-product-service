import { IProductRepository } from "../domain/IProductRepository.js";
import { ProductResponseDTO } from "./dtos/ProductResponseDTO.js";
import { Product } from "../domain/Product.js";

export class GetProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  public execute = async (): Promise<ProductResponseDTO[]> => {
    const products = await this.productRepository.findAll();
    return products.map(product => this.mapToDTO(product));
  };

  private mapToDTO(product: Product): ProductResponseDTO {
    return {
      id: product.getId().value,
      sku: product.getSku(),
      name: product.getName(),
      description: product.getDescription(),
      price: product.getPrice(),
      stockQuantity: product.getStockQuantity(),
      isActive: product.getIsActive(),
      createdAt: product.getCreatedAt(),
      category: product.getCategory().getName(),
      isAvailable: product.isAvailable()
    };
  }
}

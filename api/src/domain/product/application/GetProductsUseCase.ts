import { IProductRepository } from "../domain/IProductRepository.js";
import { ProductResponseDTO } from "./dtos/ProductResponseDTO.js";
import { Product } from "../domain/Product.js";
import { genericMapToDTO } from "../../../shared/utils/genericMapper.js";

export class GetProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  public execute = async (): Promise<ProductResponseDTO[]> => {
    const products = await this.productRepository.findAll();
    return products.map(this.mapToDTO);
  };

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

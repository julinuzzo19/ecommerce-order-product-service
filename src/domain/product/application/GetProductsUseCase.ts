import { IProductRepository } from "../domain/IProductRepository.js";
import { ProductResponseDTO } from "./dtos/ProductResponseDTO.js";
import { Product } from "../domain/Product.js";
import { genericMapToDTO } from "../../../shared/utils/genericMapper.js";
import { ProductDomainException } from "../../../shared/domain/exceptions/ProductDomainException.js";
import { ProductApplicationException } from "../../../shared/application/exceptions/ProductApplicationException.js";
import { NewRelicMonitoring } from "../../../shared/infrastructure/monitoring/NewRelicMonitoring.js";

export class GetProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  public execute = async (): Promise<ProductResponseDTO[]> => {
    try {
      const products = await this.productRepository.findAll();

      // Products retrieved event
      NewRelicMonitoring.recordEvent("ProductsRetrieved", {
        length: products.length,
      });

      return products.map(this.mapToDTO);
    } catch (error) {
      if (
        error instanceof ProductDomainException ||
        error instanceof ProductApplicationException
      ) {
        throw error;
      }

      throw ProductApplicationException.useCaseError(
        "getting products",
        error instanceof Error ? error.message : String(error)
      );
    }
  };

  private mapToDTO(product: Product): ProductResponseDTO {
    return genericMapToDTO<Product, ProductResponseDTO>(product, {
      id: (entity) => entity.getId().value,
      sku: (entity) => entity.getSku(),
      name: (entity) => entity.getName(),
      description: (entity) => entity.getDescription(),
      price: (entity) => entity.getPrice(),
      isActive: (entity) => entity.getIsActive(),
      createdAt: (entity) => entity.getCreatedAt(),
      category: (entity) => entity.getCategory().getName(),
    });
  }
}

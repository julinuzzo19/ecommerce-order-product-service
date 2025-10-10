import { IProductRepository } from "../domain/IProductRepository.js";
import { Product } from "../domain/Product.js";
import { ProductCategory } from "../domain/value-objects/ProductCategory.js";
import { CreateProductDTO } from "./dtos/CreateProductDTO.js";
import { createProductSchema } from "./createProductSchema.js";
import { ProductResponseDTO } from "./dtos/ProductResponseDTO.js";
import { genericMapToDTO } from "../../../shared/utils/genericMapper.js";
import { ProductApplicationException } from "../../../shared/application/exceptions/ProductApplicationException.js";
import { ProductDomainException } from "../../../shared/domain/exceptions/ProductDomainException.js";
import { CustomId } from "../../../shared/domain/value-objects/CustomId.js";

export class CreateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  // Implement the logic to create a product
  public execute = async (data: CreateProductDTO) => {
    try {
      console.log({ data });
      // Validate and transform the incoming data
      const validation = createProductSchema.safeParse(data);

      if (!validation.success) {
        console.log({validation})
        const errorDetails = validation.error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", ");
        throw ProductApplicationException.validationError(errorDetails);
      }

      const product = this.mapToEntity(validation.data);

      await this.productRepository.save(product);

      return this.mapToDTO(product);
    } catch (error) {
      if (
        error instanceof ProductDomainException ||
        error instanceof ProductApplicationException
      ) {
        throw error;
      }

      throw ProductApplicationException.useCaseError(
        "creation",
        error instanceof Error ? error.message : String(error)
      );
    }
  };

  private mapToEntity(product: CreateProductDTO): Product {
    const productId = new CustomId(product.id);
    const productCategory = new ProductCategory(product.category);

    return new Product({
      id: productId,
      name: product.name,
      description: product.description,
      price: product.price,
      category: productCategory,
      sku: product.sku,
    });
  }

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

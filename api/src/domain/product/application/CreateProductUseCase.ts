import { ProductError } from "../domain/errors/ProductError.js";
import { IProductRepository } from "../domain/IProductRepository.js";
import { Product } from "../domain/Product.js";
import { ProductCategory } from "../domain/value-objects/ProductCategory.js";
import { ProductId } from "../domain/value-objects/ProductId.js";
import { CreateProductDTO } from "./dtos/CreateProductDTO.js";
import { createProductSchema } from "./createProductSchema.js";

export class CreateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  // Implement the logic to create a product
  public execute = async (data: CreateProductDTO) => {
    // Validate and transform the incoming data
    const validation = createProductSchema.safeParse(data);

    if (!validation.success) {
      throw new ProductError("Invalid product data");
    }

    const product = this.mapToDTO(validation.data);

    await this.productRepository.save(product);

    return product;
  };

  private mapToDTO(product: CreateProductDTO): Product {
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
}

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

    const { id, name, description, price, category, stockQuantity, sku } =
      validation.data;

    const productId = new ProductId(id);
    const productCategory = new ProductCategory(category);

    const product = new Product(
      productId,
      name,
      description,
      price,
      productCategory,
      stockQuantity,
      sku
    );

    await this.productRepository.save(product);

    return product;
  };
}

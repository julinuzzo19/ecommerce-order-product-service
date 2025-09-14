import { ProductError } from "../domain/errors/ProductError";
import { IProductRepository } from "../domain/IProductRepository";
import { Product } from "../domain/Product";
import { ProductCategory } from "../domain/value-objects/ProductCategory";
import { ProductId } from "../domain/value-objects/ProductId";
import { createProductSchema } from "./createProductSchema";
import { CreateProductDTO } from "./CreateProductDTO";

export class CreateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  // Implement the logic to create a product
  public createProduct = async (data: CreateProductDTO) => {
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

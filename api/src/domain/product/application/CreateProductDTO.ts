import { ProductCategory } from "../domain/value-objects/ProductCategory";
import { ProductId } from "../domain/value-objects/ProductId";

export interface CreateProductDTO {
  id: ProductId;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  stockQuantity: number;
  sku: string;
}

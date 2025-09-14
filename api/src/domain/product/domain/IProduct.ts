import { ProductCategory } from "./value-objects/ProductCategory";
import { ProductId } from "./value-objects/ProductId";

export interface IProduct {
  getId(): ProductId;
  getName(): string;
  getPrice(): number;
  getDescription(): string;
  getCategory(): ProductCategory;
  getSku(): string;
  getIsActive(): boolean;
  getCreatedAt(): Date;
  getStockQuantity(): number;
  isAvailable(): boolean;
  isInStock(quantity: number): boolean;
  reserveStock(quantity: number): void;
  releaseStock(quantity: number): void;
  updatePrice(newPrice: number): void;
  deactivate(): void;
}

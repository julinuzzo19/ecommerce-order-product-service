import { ProductId } from "../../../shared/domain/value-objects/ProductId.js";
import { ProductCategory } from "./value-objects/ProductCategory.js";

export interface IProduct {
  getId(): ProductId;
  getName(): string;
  getPrice(): number;
  getDescription(): string | undefined;
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

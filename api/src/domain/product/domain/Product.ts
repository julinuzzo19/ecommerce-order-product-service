import { ProductId } from "./value-objects/ProductId.js";
import { ProductCategory } from "./value-objects/ProductCategory.js";
import { ProductError } from "./errors/ProductError.js";
import { IProduct } from "./IProduct.js";

export class Product implements IProduct {
  constructor(
    private id: ProductId,
    private name: string,
    private description: string,
    private price: number,
    private category: ProductCategory,
    private stockQuantity: number,
    private sku: string,
    private isActive: boolean = true,
    private createdAt: Date = new Date()
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length < 2) {
      throw new ProductError("Product name must be at least 2 characters");
    }
    if (this.stockQuantity < 0) {
      throw new ProductError("Stock quantity cannot be negative");
    }
    if (!this.sku || this.sku.trim().length === 0) {
      throw new ProductError("SKU is required");
    }
  }

  public isAvailable(): boolean {
    return this.isActive && this.stockQuantity > 0;
  }

  public isInStock(quantity: number): boolean {
    return this.stockQuantity >= quantity;
  }

  public reserveStock(quantity: number): void {
    if (!this.isInStock(quantity)) {
      throw new ProductError(
        `Insufficient stock. Available: ${this.stockQuantity}, Requested: ${quantity}`
      );
    }
    this.stockQuantity -= quantity;
  }

  public releaseStock(quantity: number): void {
    this.stockQuantity += quantity;
  }

  public updatePrice(newPrice: number): void {
    if (newPrice <= 0) {
      throw new ProductError("Price must be a positive number");
    }
    this.price = newPrice;
  }

  public deactivate(): void {
    this.isActive = false;
  }

  // Getters
  public getId(): ProductId {
    return this.id;
  }
  public getName(): string {
    return this.name;
  }
  public getPrice(): number {
    return this.price;
  }
  public getStockQuantity(): number {
    return this.stockQuantity;
  }
  public getDescription(): string {
    return this.description;
  }
  public getCategory(): ProductCategory {
    return this.category;
  }
  public getSku(): string {
    return this.sku;
  }
  public getIsActive(): boolean {
    return this.isActive;
  }
  public getCreatedAt(): Date {
    return this.createdAt;
  }
}

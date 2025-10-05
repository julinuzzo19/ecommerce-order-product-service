import { ProductCategory } from "./value-objects/ProductCategory.js";
import { IProduct } from "./IProduct.js";
import { ProductDomainException } from "../../../shared/domain/exceptions/ProductDomainException.js";
import { ProductId } from "../../../shared/domain/value-objects/ProductId.js";

interface ProductProps {
  id: ProductId;
  name: string;
  description: string | undefined;
  price: number;
  category: ProductCategory;
  stockQuantity: number;
  sku: string;
  isActive?: boolean;
  createdAt?: Date;
}

export class Product implements IProduct {
  private id: ProductId;
  private name: string;
  private description?: string;
  private price: number;
  private category: ProductCategory;
  private stockQuantity: number;
  private sku: string;
  private isActive: boolean;
  private createdAt: Date;

  constructor(props: ProductProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.price = props.price;
    this.category = props.category;
    this.stockQuantity = props.stockQuantity;
    this.sku = props.sku;
    this.createdAt = props.createdAt ?? new Date();
    this.isActive = props.isActive ?? true;

    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length < 2) {
      throw ProductDomainException.validationError(
        `Invalid name for product ${this.id.toString()}. Given: ${this.name}`
      );
    }
    if (this.stockQuantity < 0) {
      throw ProductDomainException.validationError(
        `Stock cannot be negative for product ${this.id.toString()}. Given: ${
          this.stockQuantity
        }`
      );
    }
    if (!this.sku || this.sku.trim().length === 0) {
      throw ProductDomainException.validationError(`Invalid SKU: ${this.sku}`);
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
      throw ProductDomainException.validationError(
        `Insufficient stock for product ${this.id.toString()}. Requested: ${quantity}, Available: ${this.stockQuantity}`
      );
    }
    this.stockQuantity -= quantity;
  }

  public releaseStock(quantity: number): void {
    this.stockQuantity += quantity;
  }

  public updatePrice(newPrice: number): void {
    if (newPrice <= 0) {
      throw ProductDomainException.validationError(
        `Price must be a positive number for product ${this.id.toString()}. Given: ${newPrice}`
      );
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
  public getDescription(): string | undefined {
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

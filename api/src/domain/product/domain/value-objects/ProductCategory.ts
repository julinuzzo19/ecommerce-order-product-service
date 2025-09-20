import { ProductError } from "../../../../shared/errors/ProductError.js";

export class ProductCategory {
  constructor(private name: string) {
    if (!name || name.trim().length < 2) {
      throw new ProductError("Category name must be at least 2 characters");
    }
  }

  public getName(): string {
    return this.name;
  }
}

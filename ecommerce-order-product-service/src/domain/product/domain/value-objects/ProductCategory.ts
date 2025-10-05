import { ProductDomainException } from "../../../../shared/domain/exceptions/ProductDomainException.js";

export class ProductCategory {
  constructor(private name: string) {
    if (!name || name.trim().length < 2) {
      throw ProductDomainException.validationError(
        "Category name must be at least 2 characters"
      );
    }
  }

  public getName(): string {
    return this.name;
  }
}

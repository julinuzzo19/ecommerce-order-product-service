import { ErrorCode } from "./BaseError.js";
import { DomainException } from "./DomainException.js";

export class ProductDomainException extends DomainException {
  static validationError(details: string): ProductDomainException {
    return new ProductDomainException(
      `Product validation failed: ${details}`,
      ErrorCode.VALIDATION_ERROR
    );
  }

  static notFound(id: string): ProductDomainException {
    return new ProductDomainException(
      `Product with ID ${id} not found`,
      ErrorCode.PRODUCT_NOT_FOUND,
      404
    );
  }
}

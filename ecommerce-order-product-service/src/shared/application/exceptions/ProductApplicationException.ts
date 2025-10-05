import { ErrorCode } from "../../domain/exceptions/BaseError.js";
import { ApplicationException } from "./ApplicationException.js";

export class ProductApplicationException extends ApplicationException {
  static validationError(details: string): ProductApplicationException {
    return new ProductApplicationException(
      `Product validation failed: ${details}`,
      ErrorCode.VALIDATION_ERROR
    );
  }

  static useCaseError(
    operation: string,
    details: string
  ): ProductApplicationException {
    return new ProductApplicationException(
      `Product ${operation} failed: ${details}`,
      ErrorCode.USE_CASE_ERROR
    );
  }
}

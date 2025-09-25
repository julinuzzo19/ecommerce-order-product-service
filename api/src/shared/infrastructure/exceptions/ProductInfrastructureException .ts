import { ErrorCode } from "../../domain/exceptions/BaseError.js";
import { DomainException } from "../../domain/exceptions/DomainException.js";

export class ProductInfrastructureException extends DomainException {
  static databaseError(
    operation: string,
    originalError: Error
  ): ProductInfrastructureException {
    return new ProductInfrastructureException(
      `Database operation '${operation}' failed: ${originalError.message}`,
      ErrorCode.DATABASE_ERROR,
      500
    );
  }
}

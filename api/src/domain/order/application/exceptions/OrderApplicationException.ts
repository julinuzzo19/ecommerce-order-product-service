import { ErrorCode } from "../../../../shared/domain/exceptions/BaseError.js";
import { DomainException } from "../../../../shared/domain/exceptions/DomainException.js";

export class OrderApplicationException extends DomainException {
  static validationError(details: string): OrderApplicationException {
    return new OrderApplicationException(
      `Order validation failed: ${details}`,
      ErrorCode.VALIDATION_ERROR
    );
  }

  static useCaseError(
    operation: string,
    details: string
  ): OrderApplicationException {
    return new OrderApplicationException(
      `Order ${operation} failed: ${details}`,
      ErrorCode.USE_CASE_ERROR
    );
  }
}

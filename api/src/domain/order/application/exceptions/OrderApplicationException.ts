import { ApplicationException } from "../../../../shared/application/exceptions/ApplicationException.js";
import { ErrorCode } from "../../../../shared/domain/exceptions/BaseError.js";

export class OrderApplicationException extends ApplicationException {
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

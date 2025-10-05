import { ApplicationException } from "../../../../shared/application/exceptions/ApplicationException.js";
import { ErrorCode } from "../../../../shared/domain/exceptions/BaseError.js";

export class CustomerApplicationExceptions extends ApplicationException {
  static validationError(details: string): CustomerApplicationExceptions {
    return new CustomerApplicationExceptions(
      `Customer validation failed: ${details}`,
      ErrorCode.VALIDATION_ERROR
    );
  }

  static useCaseError(
    operation: string,
    details: string
  ): CustomerApplicationExceptions {
    return new CustomerApplicationExceptions(
      `Customer ${operation} failed: ${details}`,
      ErrorCode.USE_CASE_ERROR
    );
  }
}

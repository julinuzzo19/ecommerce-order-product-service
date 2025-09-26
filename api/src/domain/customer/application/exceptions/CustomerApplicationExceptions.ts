import { ErrorCode } from "../../../../shared/domain/exceptions/BaseError.js";
import { DomainException } from "../../../../shared/domain/exceptions/DomainException.js";
import { CustomerDomainException } from "../../domain/exceptions/CustomerDomainException.js";

export class CustomerApplicationExceptions extends DomainException {
  static validationError(details: string): CustomerApplicationExceptions {
    return new CustomerDomainException(
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

import { ErrorCode } from "../../../../shared/domain/exceptions/BaseError.js";
import { DomainException } from "../../../../shared/domain/exceptions/DomainException.js";

export class CustomerDomainException extends DomainException {
  static validationError(details: string): CustomerDomainException {
    return new CustomerDomainException(
      `Customer validation failed: ${details}`,
      ErrorCode.VALIDATION_ERROR
    );
  }

  static notFound(id: string): CustomerDomainException {
    return new CustomerDomainException(
      `Customer with ID ${id} not found`,
      ErrorCode.CUSTOMER_NOT_FOUND,
      404
    );
  }
}

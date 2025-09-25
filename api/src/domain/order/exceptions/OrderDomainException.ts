import { ErrorCode } from "../../../shared/domain/exceptions/BaseError.js";
import { DomainException } from "../../../shared/domain/exceptions/DomainException.js";

export class OrderDomainException extends DomainException {
  static validationError(details: string): OrderDomainException {
    return new OrderDomainException(
      `Order validation failed: ${details}`,
      ErrorCode.VALIDATION_ERROR
    );
  }

  static notFound(id: string): OrderDomainException {
    return new OrderDomainException(
      `Order with ID ${id} not found`,
      ErrorCode.ORDER_NOT_FOUND,
      404
    );
  }
}

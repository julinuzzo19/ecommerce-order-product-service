import { ErrorCode } from "./BaseError.js";
import { DomainException } from "./DomainException.js";

export class ValueObjectException extends DomainException {
  static validationError(error: string): ValueObjectException {
    return new ValueObjectException(error, ErrorCode.VALIDATION_ERROR, 400);
  }
}

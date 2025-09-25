import { ZodError } from "zod";
import { ErrorCode } from "../../domain/exceptions/BaseError.js";
import { DomainException } from "../../domain/exceptions/DomainException.js";

export class ProductApplicationException extends DomainException {
  static validationError(details: ZodError): ProductApplicationException {
    const issues = details.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");

    return new ProductApplicationException(
      `Product validation failed: ${issues}`,
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

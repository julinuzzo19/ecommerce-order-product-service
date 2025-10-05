import { ErrorCode } from "../../domain/exceptions/BaseError.js"; // Ajusta según tu BaseError

export class ApplicationException extends Error {
  constructor(
    message: string,
    public code?: ErrorCode,
    public statusCode?: number
  ) {
    super(message);
    this.name = "ApplicationException";
  }

  // Métodos estáticos base
  static useCaseError(
    operation: string,
    details: string
  ): ApplicationException {
    return new ApplicationException(
      `Use case error in ${operation}: ${details}`,
      ErrorCode.USE_CASE_ERROR,
      400
    );
  }

  static validationError(details: string): ApplicationException {
    return new ApplicationException(
      `Validation error: ${details}`,
      ErrorCode.VALIDATION_ERROR,
      400
    );
  }
}

import { ErrorCode } from "../../domain/exceptions/BaseError.js";

export class InfrastructureException extends Error {
  constructor(
    message: string,
    public code?: ErrorCode,
    public statusCode?: number
  ) {
    super(message);
    this.name = "InfrastructureException";
  }

  static databaseError(
    operation: string,
    details: string
  ): InfrastructureException {
    return new InfrastructureException(
      `Database error in ${operation}: ${details}`,
      ErrorCode.DATABASE_ERROR,
      500
    );
  }

  static networkError(
    operation: string,
    details: string
  ): InfrastructureException {
    return new InfrastructureException(
      `Network error in ${operation}: ${details}`,
      ErrorCode.NETWORK_ERROR,
      502
    );
  }

  static fileSystemError(
    operation: string,
    details: string
  ): InfrastructureException {
    return new InfrastructureException(
      `File system error in ${operation}: ${details}`,
      ErrorCode.FILE_SYSTEM_ERROR,
      500
    );
  }

  static configError(details: string): InfrastructureException {
    return new InfrastructureException(
      `Configuration error: ${details}`,
      ErrorCode.CONFIG_ERROR,
      500
    );
  }

  static authError(details: string): InfrastructureException {
    return new InfrastructureException(
      `Authentication error: ${details}`,
      ErrorCode.AUTH_ERROR,
      401
    );
  }

  // PRISMA ERROR HANDLERS
  static duplicateRecord(
    operation: string,
    details: string
  ): InfrastructureException {
    return new InfrastructureException(
      `Duplicate record during ${operation}: ${details}`,
      ErrorCode.VALIDATION_ERROR,
      409
    );
  }

  static recordNotFound(
    operation: string,
    details: string
  ): InfrastructureException {
    return new InfrastructureException(
      `Record not found during ${operation}: ${details}`,
      ErrorCode.DATABASE_ERROR,
      404
    );
  }

  static connectionError(
    operation: string,
    details: string
  ): InfrastructureException {
    return new InfrastructureException(
      `Connection error during ${operation}: ${details}`,
      ErrorCode.NETWORK_ERROR,
      503
    );
  }

  static validationError(
    operation: string,
    details: string
  ): InfrastructureException {
    return new InfrastructureException(
      `Validation error during ${operation}: ${details}`,
      ErrorCode.VALIDATION_ERROR,
      400
    );
  }

  static timeoutError(
    operation: string,
    details: string
  ): InfrastructureException {
    return new InfrastructureException(
      `Timeout error during ${operation}: ${details}`,
      ErrorCode.NETWORK_ERROR,
      408
    );
  }

  static mappingError(
    operation: string,
    details: string
  ): InfrastructureException {
    return new InfrastructureException(
      `Mapping error during ${operation}: ${details}`,
      ErrorCode.DATABASE_ERROR,
      500
    );
  }

  static concurrencyError(
    operation: string,
    details: string
  ): InfrastructureException {
    return new InfrastructureException(
      `Concurrency error during ${operation}: ${details}`,
      ErrorCode.DATABASE_ERROR,
      409
    );
  }

  static resourceError(
    operation: string,
    details: string
  ): InfrastructureException {
    return new InfrastructureException(
      `Resource error during ${operation}: ${details}`,
      ErrorCode.DATABASE_ERROR,
      503
    );
  }

  static configurationError(
    operation: string,
    details: string
  ): InfrastructureException {
    return new InfrastructureException(
      `Configuration error during ${operation}: ${details}`,
      ErrorCode.CONFIG_ERROR,
      500
    );
  }

  static foreignKeyConstraint(
    operation: string,
    details: string
  ): InfrastructureException {
    return new InfrastructureException(
      `Foreign key constraint violation during ${operation}: ${details}`,
      ErrorCode.VALIDATION_ERROR,
      400
    );
  }

  static invalidData(
    operation: string,
    details: string
  ): InfrastructureException {
    return new InfrastructureException(
      `Invalid data during ${operation}: ${details}`,
      ErrorCode.VALIDATION_ERROR,
      400
    );
  }

  static invalidInput(
    operation: string,
    details: string
  ): InfrastructureException {
    return new InfrastructureException(
      `Invalid input during ${operation}: ${details}`,
      ErrorCode.VALIDATION_ERROR,
      400
    );
  }

  static unexpectedError(
    operation: string,
    details: string
  ): InfrastructureException {
    return new InfrastructureException(
      `Unexpected error during ${operation}: ${details}`,
      ErrorCode.DATABASE_ERROR,
      500
    );
  }
}

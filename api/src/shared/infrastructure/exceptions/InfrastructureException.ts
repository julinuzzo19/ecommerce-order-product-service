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
}

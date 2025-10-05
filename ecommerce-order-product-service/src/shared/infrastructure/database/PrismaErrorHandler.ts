import { Prisma } from "@prisma/client";
import { InfrastructureException } from "../exceptions/InfrastructureException.js";

export class PrismaErrorHandler {
  handleError(error: unknown, operation: string): never {
    // Log del error para debugging
    // console.error(`Prisma error during ${operation}:`, error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw this.handleKnownRequestError(error, operation);
    }

    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      throw this.handleUnknownRequestError(error, operation);
    }

    if (error instanceof Prisma.PrismaClientRustPanicError) {
      throw this.handleRustPanicError(error, operation);
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw this.handleInitializationError(error, operation);
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      throw this.handleValidationError(error, operation);
    }

    // Si ya es una InfrastructureException, la relanzamos
    if (error instanceof InfrastructureException) {
      throw error;
    }

    // Error genérico
    throw this.handleGenericError(error, operation);
  }

  private handleKnownRequestError(
    error: Prisma.PrismaClientKnownRequestError,
    operation: string
  ): InfrastructureException {
    const errorMappings: Record<
      string,
      (error: Prisma.PrismaClientKnownRequestError) => InfrastructureException
    > = {
      // Unique constraint violation
      P2002: (err) =>
        InfrastructureException.duplicateRecord(
          operation,
          `Duplicate value for field: ${this.getTargetFromMeta(err.meta)}`
        ),
      // Record not found
      P2025: (err) =>
        InfrastructureException.recordNotFound(
          operation,
          "Record not found for the given criteria"
        ),
      // Foreign key constraint violation
      P2003: (err) =>
        InfrastructureException.foreignKeyConstraint(
          operation,
          `Foreign key constraint failed on field: ${this.getTargetFromMeta(
            err.meta
          )}`
        ),
      // Required relation missing
      P2014: (err) =>
        InfrastructureException.invalidData(
          operation,
          "Required relation is missing"
        ),
      // Query interpretation error
      P2016: (err) =>
        InfrastructureException.invalidData(
          operation,
          "Query interpretation error"
        ),
      // Table does not exist
      P2021: (err) =>
        InfrastructureException.configurationError(
          operation,
          "Database table does not exist"
        ),
      // Column does not exist
      P2022: (err) =>
        InfrastructureException.configurationError(
          operation,
          "Database column does not exist"
        ),
      // Inconsistent column data
      P2023: (err) =>
        InfrastructureException.invalidData(
          operation,
          "Inconsistent column data"
        ),
      // Timed out fetching a new connection
      P2024: (err) =>
        InfrastructureException.timeoutError(
          operation,
          "Database connection timeout"
        ),
      // Too many database connections
      P2034: (err) =>
        InfrastructureException.resourceError(
          operation,
          "Too many database connections"
        ),
    };

    const handler = errorMappings[error.code];
    if (handler) {
      return handler(error);
    }

    // Error de Prisma no mapeado específicamente
    return InfrastructureException.databaseError(
      operation,
      `Unhandled Prisma error code ${error.code}: ${error.message}`
    );
  }

  private handleUnknownRequestError(
    error: Prisma.PrismaClientUnknownRequestError,
    operation: string
  ): InfrastructureException {
    return InfrastructureException.databaseError(
      operation,
      "Unknown database error occurred"
    );
  }

  private handleRustPanicError(
    error: Prisma.PrismaClientRustPanicError,
    operation: string
  ): InfrastructureException {
    return InfrastructureException.databaseError(
      operation,
      "Database engine encountered a critical error"
    );
  }

  private handleInitializationError(
    error: Prisma.PrismaClientInitializationError,
    operation: string
  ): InfrastructureException {
    return InfrastructureException.connectionError(
      operation,
      `Database connection failed`
    );
  }

  private handleValidationError(
    error: Prisma.PrismaClientValidationError,
    operation: string
  ): InfrastructureException {
    return InfrastructureException.validationError(
      operation,
      `Invalid query parameters: ${error.message}`
    );
  }

  private handleGenericError(
    error: unknown,
    operation: string
  ): InfrastructureException {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return InfrastructureException.unexpectedError(operation, message);
  }

  private getTargetFromMeta(meta: any): string {
    if (!meta || !meta.target) return "unknown field";
    return Array.isArray(meta.target) ? meta.target.join(", ") : meta.target;
  }
}

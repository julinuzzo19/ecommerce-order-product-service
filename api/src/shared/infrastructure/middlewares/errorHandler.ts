import { Request, Response } from "express";
import { DomainException } from "../../domain/exceptions/DomainException.js";
import { ApplicationException } from "../../application/exceptions/ApplicationException.js";
import { InfrastructureException } from "../exceptions/InfrastructureException.js";
// Opcional: importa un logger si lo tienes, e.g., import { logger } from "../utils/logger.js";

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response
): Response => {
  // Opcional: loggea el error para debugging
  // logger.error("Unhandled error", { error, url: req.url, method: req.method });
  const requestId = req.headers["x-request-id"] || "unknown"; // Agrega ID de solicitud si usas middleware

  // Manejo específico por tipo de excepción
  if (error instanceof DomainException) {
    return res.status(400).json({
      error: "Bad Request",
      message: error.message, // Expone mensaje de dominio, ya que es seguro
      requestId,
    });
  }

  if (error instanceof ApplicationException) {
    return res.status(error.statusCode || 400).json({
      error: "Application Error",
      message: error.message,
      requestId,
    });
  }

  if (error instanceof InfrastructureException) {
    return res.status(error.statusCode || 500).json({
      error: "Internal Server Error",
      message: "Please try again later",
      requestId,
    });
  }

  // Error desconocido o genérico
  return res.status(500).json({
    error: "Internal Server Error",
    message: "An unexpected error occurred",
    requestId,
  });
};

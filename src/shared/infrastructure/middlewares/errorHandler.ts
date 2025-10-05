import { NextFunction, Request, Response } from "express";
import { DomainException } from "../../domain/exceptions/DomainException.js";
import { ApplicationException } from "../../application/exceptions/ApplicationException.js";
import { InfrastructureException } from "../exceptions/InfrastructureException.js";
import { ILogger } from "../../domain/ILogger.js";

export const errorHandler = (logger: ILogger) => {
  return (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
  ): Response => {
    const requestId = (req as any).id || "unknown";

    const requestInfo = {
      requestId,
      method: req.method,
      url: req.url,
      // ip: req.ip,
      // userAgent: req.get("User-Agent"),
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    };

    // Manejo específico por tipo de excepción
    if (error instanceof DomainException) {
      // Log de warning para excepciones de dominio (no son errores críticos)
      logger.warn("Domain exception occurred", {
        ...requestInfo,
        exceptionType: "DomainException",
        message: error.message,
        stack: error.stack,
      });

      return res.status(400).json({
        error: "Bad Request",
        message: error.message,
        requestId,
      });
    }

    if (error instanceof ApplicationException) {
      logger.error("Application exception occurred", error, {
        ...requestInfo,
        exceptionType: "ApplicationException",
        statusCode: error.statusCode || 400,
      });

      return res.status(error.statusCode || 400).json({
        error: "Application Error",
        message: error.message,
        requestId,
      });
    }

    if (error instanceof InfrastructureException) {
      // Log de error crítico para excepciones de infraestructura
      logger.error("Infrastructure exception occurred", error, {
        ...requestInfo,
        exceptionType: "InfrastructureException",
        statusCode: error.statusCode || 500,
        critical: true,
      });

      return res.status(error.statusCode || 500).json({
        error: "Internal Server Error",
        message: "Please try again later",
        requestId,
      });
    }

    // Error desconocido o genérico - MUY CRÍTICO
    logger.error("Unhandled error occurred", error as Error, {
      ...requestInfo,
      exceptionType: "UnknownError",
      critical: true,
      needsInvestigation: true,
    });

    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
      requestId,
    });
  };
};

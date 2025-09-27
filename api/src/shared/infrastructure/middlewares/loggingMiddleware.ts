import { Request, Response, NextFunction } from "express";
import { ILogger } from "../../domain/ILogger.js";

export const loggingMiddleware = (logger: ILogger) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const start = Date.now();
    const { method, url, ip } = req;
    const requestId = (req as any).id || "unknown";

    // Log request entrante
    logger.http("Request received", {
      requestId,
      method,
      url,
      // ip,
      // userAgent: req.get("User-Agent"),
      // contentType: req.get("Content-Type"),
      timestamp: new Date().toISOString(),
    });

    // Capturar response
    const originalSend = res.send;
    res.send = function (body) {
      const duration = Date.now() - start;

      logger.http("Request completed", {
        requestId,
        method,
        url,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        // ip,
        // responseSize: body ? Buffer.byteLength(body) : 0,
      });

      return originalSend.call(this, body);
    };

    next();
  };
};

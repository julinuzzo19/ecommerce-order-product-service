import "newrelic";
import express from "express";
import type { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import { router } from "./routes.js";
import healthRouter  from "../shared/infrastructure/health.routes.js";
import { errorHandler } from "../shared/infrastructure/middlewares/errorHandler.js";
import { requestIdMiddleware } from "../shared/infrastructure/middlewares/requestIdMiddleware.js";
import { ILogger } from "../shared/domain/ILogger.js";
import { loggingMiddleware } from "../shared/infrastructure/middlewares/loggingMiddleware.js";
import { createLogger } from "../shared/infrastructure/logger/logger.js";
import { prisma } from "../shared/infrastructure/db/prisma/prisma.client.js";
import { OrderEventPublisher } from "../domain/order/application/events/OrderEventPublisher.js";
import { PublisherBootstrap } from "../domain/order/infrastructure/bootstrap/PublisherBootstrap.js";

/**
 * Servidor principal de la aplicación.
 * Gestiona el ciclo de vida completo: inicialización, ejecución y cierre limpio.
 */
class Server {
  private app: Application;
  private readonly port: string | number;
  private readonly logger: ILogger;
  private readonly httpLogger: ILogger;
  private readonly errorLogger: ILogger;
  private publisherBootstrap!: PublisherBootstrap;
  private orderPublisher!: OrderEventPublisher;
  private isShuttingDown = false;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    this.logger = createLogger("SERVER");
    this.httpLogger = createLogger("HTTP");
    this.errorLogger = createLogger("ERROR");

    this.middlewares();
    this.setupGracefulShutdown();
  }

  /**
   * Configura middlewares globales de la aplicación.
   */
  private middlewares(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(requestIdMiddleware);
    this.app.use(loggingMiddleware(this.httpLogger));
  }

  /**
   * Configura las rutas de la aplicación.
   */
  private routes(): void {
    this.app.use("/", healthRouter);
    this.app.use("/api/v1", router(this.orderPublisher));
  }

  /**
   * Configura el manejador de errores global.
   */
  private errorHandling(): void {
    this.app.use(errorHandler(this.errorLogger));
  }

  /**
   * Inicializa la conexión a la base de datos.
   */
  private async initializeDatabase(): Promise<void> {
    try {
      await prisma.$connect();
      this.logger.info("Database connected successfully");
    } catch (error) {
      this.logger.error("Database connection failed", error as Error, {
        critical: true,
      });
      throw error;
    }
  }

  /**
   * Inicializa el bus de eventos y los publishers de dominio mediante el bootstrap.
   */
  private async initializeEventPublishers(): Promise<void> {
    try {
      this.publisherBootstrap = new PublisherBootstrap(this.logger);
      this.orderPublisher = await this.publisherBootstrap.initialize();

      this.logger.info("Event publishers initialized successfully");
    } catch (error) {
      this.logger.error(
        "Event publishers initialization failed",
        error as Error,
        {
          critical: true,
        }
      );
      throw error;
    }
  }

  /**
   * Cierra todos los recursos de forma ordenada.
   */
  private async closeResources(): Promise<void> {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;

    this.logger.warn("Closing resources...");

    try {
      if (this.publisherBootstrap) {
        await this.publisherBootstrap.close();
      }
      await prisma.$disconnect();
      this.logger.info("Resources closed successfully");
    } catch (error) {
      this.logger.error("Error closing resources", error as Error, {
        critical: true,
      });
      throw error;
    }
  }

  /**
   * Configura manejadores para cierre limpio de la aplicación.
   */
  private setupGracefulShutdown(): void {
    process.on("uncaughtException", (error) => {
      this.logger.error("Uncaught exception", error, { critical: true });
      process.exit(1);
    });

    process.on("unhandledRejection", (reason, promise) => {
      this.logger.error("Unhandled rejection", reason as Error, {
        promise: promise.toString(),
        critical: true,
      });
      process.exit(1);
    });

    const shutdown = async (signal: string) => {
      this.logger.warn(`${signal} received, shutting down gracefully`);
      try {
        await this.closeResources();
        process.exit(0);
      } catch (error) {
        this.logger.error("Error during shutdown", error as Error, {
          critical: true,
        });
        process.exit(1);
      }
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  }

  /**
   * Inicia el servidor y todas sus dependencias.
   */
  public async listen(): Promise<void> {
    try {
      await this.initializeDatabase();
      await this.initializeEventPublishers();

      this.routes();
      this.errorHandling();

      const server = this.app.listen(this.port, () => {
        this.logger.info("Server started successfully", {
          port: this.port,
          environment: process.env.NODE_ENV || "development",
        });
      });

      server.on("close", async () => {
        await this.closeResources();
      });

      server.on("error", (error) => {
        this.logger.error("Server error", error, { critical: true });
        process.exit(1);
      });
    } catch (error) {
      this.logger.error("Failed to start server", error as Error, {
        critical: true,
      });
      process.exit(1);
    }
  }
}

const server = new Server();
server.listen();

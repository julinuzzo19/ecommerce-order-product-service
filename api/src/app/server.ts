import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import { router } from "./routes.js";
import { errorHandler } from "../shared/infrastructure/middlewares/errorHandler.js";
import { requestIdMiddleware } from "../shared/infrastructure/middlewares/requestIdMiddleware.js";

class Server {
  private app: Application;
  private readonly port: string | number;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.middlewares();
    this.routes();
    // Manejo de errores, luego de routes para capturar errores de toda la app
    this.errorHandling();
  }

  /**
   * Configura los middlewares globales para la aplicación.
   * - helmet: Para seguridad básica.
   * - cors: Para permitir peticiones desde otros orígenes.
   * - express.json: Para parsear el cuerpo de las peticiones JSON.
   */
  private middlewares(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(requestIdMiddleware);
  }

  private routes(): void {
    this.app.use("/api/v1", router);
  }

  private errorHandling(): void {
    this.app.use(errorHandler);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

const server = new Server();
server.listen();

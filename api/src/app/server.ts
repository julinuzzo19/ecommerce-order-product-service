import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import { router } from "./routes";

class Server {
  private app: Application;
  private readonly port: string | number;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.middlewares();
    this.routes();
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
  }

  private routes(): void {
    this.app.use("/api/v1", router);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

const server = new Server();
server.listen();

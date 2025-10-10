import { RabbitMQConnection } from "../../application/events/rabbitmq.js";

/**
 * Bus de eventos centralizado que gestiona la conexión única a RabbitMQ.
 * Implementa el patrón Singleton para garantizar una sola conexión.
 */
export class EventBus {
  private static instance: EventBus;
  private rabbitmq: RabbitMQConnection;
  private initialized = false;

  private constructor(url: string) {
    this.rabbitmq = new RabbitMQConnection(url);
  }

  /**
   * Obtiene la instancia única del EventBus.
   */
  static getInstance(url: string = "amqp://localhost:5672"): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus(url);
    }
    return EventBus.instance;
  }

  /**
   * Inicializa la conexión a RabbitMQ.
   */
  async initialize(): Promise<void> {
    if (!this.initialized) {
      await this.rabbitmq.connect();
      this.initialized = true;
    }
  }

  /**
   * Obtiene la conexión para que los publishers creen canales.
   */
  getConnection(): RabbitMQConnection {
    if (!this.initialized) {
      throw new Error(
        "EventBus no inicializado. Llama a initialize() primero."
      );
    }
    return this.rabbitmq;
  }

  /**
   * Cierra la conexión de forma limpia.
   */
  async close(): Promise<void> {
    await this.rabbitmq.close();
    this.initialized = false;
  }
}

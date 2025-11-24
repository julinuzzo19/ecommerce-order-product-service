import { RabbitMQConnection } from "./RabbitMQConnection.js";
import { EventPublisherException } from "../exceptions/EventPublisherException.js";

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
  static getInstance(url: string): EventBus {
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
      try {
        await this.rabbitmq.connect();
        this.initialized = true;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw EventPublisherException.connectionFailed(message);
      }
    }
  }

  /**
   * Obtiene la conexión para que los publishers creen canales.
   */
  getConnection(): RabbitMQConnection {
    if (!this.initialized) {
      throw EventPublisherException.notInitialized();
    }
    return this.rabbitmq;
  }

  /**
   * Cierra la conexión de forma limpia.
   */
  async close(): Promise<void> {
    try {
      await this.rabbitmq.close();
      this.initialized = false;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw EventPublisherException.closeFailed(message);
    }
  }
}

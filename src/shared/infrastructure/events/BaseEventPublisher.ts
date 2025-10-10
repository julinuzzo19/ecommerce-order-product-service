import { Channel } from "amqplib";
import { IEventPublisher } from "../../domain/IEventPublisher.js";
import { EventBus } from "./EventBus.js";

/**
 * Clase base abstracta para publishers de eventos.
 * Usa un canal sobre la conexión compartida del EventBus.
 */
export abstract class BaseEventPublisher implements IEventPublisher {
  protected channel: Channel | null = null;
  protected abstract exchangeName: string;

  /**
   * Inicializa el canal y declara el exchange del dominio.
   */
  async initialize(): Promise<void> {
    const eventBus = EventBus.getInstance();
    const connection = eventBus.getConnection();
    this.channel = connection.getChannel();

    await this.channel.assertExchange(this.exchangeName, "fanout", {
      durable: true,
    });

    console.log(`✅ Exchange '${this.exchangeName}' declarado correctamente`);
  }

  /**
   * Publica un mensaje al exchange.
   */
  protected async publish(message: unknown, routingKey = ""): Promise<void> {
    if (!this.channel) {
      throw new Error(
        "Publisher no inicializado. Llama a initialize() primero."
      );
    }

    const buffer = Buffer.from(JSON.stringify(message));
    this.channel.publish(this.exchangeName, routingKey, buffer, {
      persistent: true,
      contentType: "application/json",
      timestamp: Date.now(),
    });
  }

  /**
   * Cierra el canal.
   */
  async close(): Promise<void> {
    await this.channel?.close();
  }
}

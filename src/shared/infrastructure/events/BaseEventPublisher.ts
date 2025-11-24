import { Channel } from 'amqplib';
import { IEventPublisher } from '../../domain/IEventPublisher.js';
import { EventBus } from './EventBus.js';
import { EventPublisherException } from '../exceptions/EventPublisherException.js';

/**
 * Clase base abstracta para publishers de eventos.
 * Usa un canal sobre la conexión compartida del EventBus.
 */
export abstract class BaseEventPublisher implements IEventPublisher {
  protected channel: Channel | null = null;
  protected abstract exchangeName: string;
  protected exchangeType: 'fanout' | 'topic' | 'direct' = 'fanout'; // Default fanout por compatibilidad

  /**
   * Inicializa el canal y declara el exchange del dominio.
   */
  async initialize(): Promise<void> {
    try {
      const rabbitmqUrl = process.env.RABBITMQ_URL as string;
      const eventBus = EventBus.getInstance(rabbitmqUrl);
      const connection = eventBus.getConnection();
      this.channel = connection.getChannel();

      await this.channel.assertExchange(this.exchangeName, this.exchangeType, {
        durable: true,
      });

      console.log(`✅ Exchange '${this.exchangeName}' declarado correctamente`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw EventPublisherException.exchangeDeclarationFailed(
        this.exchangeName,
        message
      );
    }
  }

  /**
   * Publica un mensaje al exchange.
   */
  protected async publish(message: unknown, routingKey = ''): Promise<void> {
    if (!this.channel) {
      throw EventPublisherException.notInitialized();
    }

    try {
      const buffer = Buffer.from(JSON.stringify(message));
      this.channel.publish(this.exchangeName, routingKey, buffer, {
        persistent: true,
        contentType: 'application/json',
        timestamp: Date.now(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw EventPublisherException.publishFailed(this.exchangeName, message);
    }
  }

  /**
   * Cierra el canal.
   */
  async close(): Promise<void> {
    try {
      await this.channel?.close();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw EventPublisherException.closeFailed(message);
    }
  }
}

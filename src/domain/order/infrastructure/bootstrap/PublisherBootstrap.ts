import { PublisherException } from '../../../../shared/application/events/exceptions/PublisherException.js';
import { IEventPublisher } from '../../../../shared/domain/IEventPublisher.js';
import { ILogger } from '../../../../shared/domain/ILogger.js';
import { EventBus } from '../../../../shared/infrastructure/events/EventBus.js';
import { OrderEventPublisher } from '../../application/events/OrderEventPublisher.js';

/**
 * Bootstrap de todos los publishers del servicio.
 * Este es el único lugar donde se conoce cómo ensamblar las dependencias de eventos.
 */
export class PublisherBootstrap {
  private publishers: IEventPublisher[] = [];
  private eventBus!: EventBus;
  private orderPublisher!: OrderEventPublisher;

  constructor(private readonly logger: ILogger) {}

  /**
   * Inicializa el bus de eventos y todos los publishers del servicio.
   * Retorna el OrderEventPublisher para inyectarlo en las rutas.
   */
  async initialize(): Promise<OrderEventPublisher> {
    this.logger.info('Bootstrapping event publishers...');

    await this.initializeEventBus();
    await this.initializeOrderPublisher();
    // Aquí puedes agregar más publishers fácilmente
    // await this.initializeProductPublisher();
    // await this.initializeCustomerPublisher();

    this.logger.info('Event publishers bootstrapped successfully', {
      count: this.publishers.length,
    });

    return this.orderPublisher;
  }

  /**
   * Inicializa el EventBus con la conexión a RabbitMQ.
   */
  private async initializeEventBus(): Promise<void> {
    const rabbitmqUrl = process.env.RABBITMQ_URL as string;
    this.eventBus = EventBus.getInstance(rabbitmqUrl);
    await this.eventBus.initialize();
    this.logger.info('EventBus initialized', { url: rabbitmqUrl });
  }

  /**
   * Inicializa el publisher de eventos de órdenes.
   */
  private async initializeOrderPublisher(): Promise<void> {
    this.orderPublisher = new OrderEventPublisher();
    await this.orderPublisher.initialize();
    this.publishers.push(this.orderPublisher);
    this.logger.info('OrderEventPublisher initialized');
  }

  /**
   * Obtiene el OrderEventPublisher para uso en controllers.
   */
  getOrderPublisher(): OrderEventPublisher {
    if (!this.orderPublisher) {
      throw PublisherException.publishError(
        'OrderEventPublisher not initialized',
      );
    }
    return this.orderPublisher;
  }

  /**
   * Cierra todos los publishers y el EventBus de forma ordenada.
   */
  async close(): Promise<void> {
    this.logger.info('Closing event publishers...');

    await Promise.all(this.publishers.map((pub) => pub.close()));
    await this.eventBus.close();

    this.logger.info('Event publishers closed successfully');
  }
}
